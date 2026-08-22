import os
import re
import sys
import json
import time
import asyncio
import secrets
import sqlite3
import threading
import subprocess
import platform
from pathlib import Path
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any

import psutil
import aiohttp
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request, Form, Query, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# 自启路径：Windows 用启动文件夹快捷方式，Linux 用 ~/.config/autostart desktop 文件
IS_WINDOWS = platform.system() == "Windows"
if IS_WINDOWS:
    STARTUP_DIR = Path(os.environ.get("APPDATA", "")) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Startup"
    AUTOSTART_TARGET = STARTUP_DIR / "MyWhisperServer.lnk"
else:
    STARTUP_DIR = Path.home() / ".config" / "autostart"
    AUTOSTART_TARGET = STARTUP_DIR / "MyWhisperServer.desktop"

# 项目路径
BASE_DIR = Path(__file__).parent.parent.resolve()
DASHBOARD_DIR = BASE_DIR / "dashboard"
DATA_DIR = DASHBOARD_DIR / "data"
LOGS_DIR = DASHBOARD_DIR / "logs"
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "records.db"
WHISPER_LOG = BASE_DIR / "server.log"
DASHBOARD_LOG = LOGS_DIR / "dashboard.log"
WHISPER_SCRIPT = BASE_DIR / "whisper_server.py"
START_ALL_SCRIPT = BASE_DIR / ("start_all.bat" if IS_WINDOWS else "start_all.sh")

# 配置
DASHBOARD_HOST = os.environ.get("DASHBOARD_HOST", "0.0.0.0")
DASHBOARD_PORT = int(os.environ.get("DASHBOARD_PORT", "9001"))
WHISPER_HOST = os.environ.get("WHISPER_HOST", "127.0.0.1")
WHISPER_PORT = int(os.environ.get("WHISPER_PORT", "9000"))
WHISPER_URL = f"http://{WHISPER_HOST}:{WHISPER_PORT}"

# 全局状态
whisper_process: Optional[subprocess.Popen] = None
whisper_start_time: Optional[float] = None
whisper_log_handle = None
is_converting = False  # 是否正在转换（由 whisper_server 上报）
_progress_percent: Optional[float] = None  # 转换进度 0-100，None=非转换中（由 whisper_server 上报）
connected_websockets: List[WebSocket] = []
system_history: Dict[str, List[Any]] = {
    "cpu": [],
    "memory": [],
    "gpu_util": [],
    "gpu_mem": [],
    "gpu_temp": [],
    "timestamps": [],
}
MAX_HISTORY = 480  # 趋势图历史点数上限（2s 间隔 ≈ 16 分钟；配合前端 zoom 档位）
whisper_proc_cache: Optional[dict] = None
whisper_proc_cache_time: float = 0

# --- 认证（写入・制御系のみ） ---
_dashboard_token: Optional[str] = None
_dashboard_token_lock = threading.Lock()
LOOPBACK_HOSTS = {"127.0.0.1", "::1", "localhost"}


def _is_loopback(host: str) -> bool:
    return host in LOOPBACK_HOSTS


async def get_dashboard_token() -> str:
    """环境变量 DASHBOARD_TOKEN > config 存储 > 自动生成・保存（遅延初期化）。"""
    global _dashboard_token
    if _dashboard_token:
        return _dashboard_token
    with _dashboard_token_lock:
        if _dashboard_token:
            return _dashboard_token
        env_token = os.environ.get("DASHBOARD_TOKEN", "").strip()
        if env_token:
            _dashboard_token = env_token
            return _dashboard_token
        stored = await get_config("dashboard_token")
        if stored:
            _dashboard_token = stored
            return _dashboard_token
        generated = secrets.token_urlsafe(24)
        await set_config("dashboard_token", generated)
        _dashboard_token = generated
        print(f"[auth] Dashboard 接続トークンを生成: {generated}")
        return generated


async def require_auth(request: Request):
    """ループバック以外の POST/PUT/DELETE・/ws にトークンを要求する依存関数。"""
    if _is_loopback(request.client.host if request.client else ""):
        return
    token = await get_dashboard_token()
    header = request.headers.get("Authorization", "")
    supplied = header[7:].strip() if header.startswith("Bearer ") else request.headers.get("X-Auth-Token", "").strip()
    if not token or supplied != token:
        raise HTTPException(status_code=401, detail="unauthorized")


def mask_api_key(secret: str) -> Dict[str, Any]:
    """API キーを平文で返さず has_key / 末尾4文字 で返す。"""
    if not secret:
        return {"has_key": False, "key_masked": ""}
    return {"has_key": True, "key_masked": "..." + secret[-4:]}


def validate_base_url(url: str) -> str:
    """#7 SSRF 対策: scheme が http/https のみ許可、userinfo 拒否。不正なら HTTPException(400)。"""
    url = str(url).strip().rstrip("/")
    if not url:
        return url
    from urllib.parse import urlsplit
    parts = urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        raise HTTPException(status_code=400, detail="base_url must be http:// or https://")
    if parts.username is not None or parts.password is not None:
        raise HTTPException(status_code=400, detail="base_url must not contain userinfo")
    return url

# NVML 初始化尝试
nvml_available = False
try:
    from pynvml import (
        nvmlInit, nvmlShutdown, nvmlDeviceGetCount, nvmlDeviceGetHandleByIndex,
        nvmlDeviceGetName, nvmlDeviceGetMemoryInfo, nvmlDeviceGetUtilizationRates,
        nvmlDeviceGetTemperature, NVML_TEMPERATURE_GPU,
        nvmlDeviceGetClockInfo, NVML_CLOCK_GRAPHICS, nvmlDeviceGetPowerUsage
    )
    nvmlInit()
    nvml_available = True
except Exception as e:
    print(f"[WARN] NVML not available: {e}")


# ---------------------------------------------------------------------------
# 数据库
# ---------------------------------------------------------------------------
def get_db_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_conn() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT,
                duration REAL,
                language TEXT,
                output_format TEXT,
                summary TEXT,
                result TEXT,
                timestamp TEXT,
                elapsed_seconds REAL,
                model TEXT,
                llm_model TEXT,
                correct_elapsed REAL
            )
        """)
        # 兼容旧数据库：如果没有 model/llm_model/correct_elapsed 列则添加
        cols = [row[1] for row in conn.execute("PRAGMA table_info(records)")]
        if "model" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN model TEXT")
        if "llm_model" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN llm_model TEXT")
        if "correct_elapsed" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN correct_elapsed REAL")
        conn.execute("""
            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        # LLM プロファイル（Deepseek / Ollama など OpenAI 互換エンドポイントの登録）
        conn.execute("""
            CREATE TABLE IF NOT EXISTS llm_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                base_url TEXT,
                api_key TEXT,
                model TEXT,
                created_at TEXT
            )
        """)
        # 默认配置
        defaults = {
            "default_language": "zh",
            "default_output": "txt",
            "refresh_interval": "1000",
            "gpu_temp_threshold": "80",
            "theme": "dark",
            "ui_language": "zh",
            "whisper_model": "medium",
            "ai_correct_enabled": "false",
            "deepseek_api_key": "",
            "deepseek_model": "deepseek-chat",
            "deepseek_base_url": "https://api.deepseek.com/v1",
            "active_llm_profile": "",
            "dashboard_token": "",  # 接続トークン（初回アクセス時に自動生成）
            # Whisper 高速化設定
            "whisper_mode": "balanced",
            "whisper_compute_type": "int8_float16",
            "whisper_beam_size": "3",
            "whisper_temperature": "0",
            "whisper_vad_min_silence_ms": "500",
        }
        for k, v in defaults.items():
            conn.execute("INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)", (k, v))

        # シード：旧 deepseek_* 設定から既定 "Deepseek" プロファイルを生成（テーブル空の時のみ）
        prof_count = conn.execute("SELECT COUNT(*) FROM llm_profiles").fetchone()[0]
        if prof_count == 0:
            def cfg_val(key, default):
                row = conn.execute("SELECT value FROM config WHERE key=?", (key,)).fetchone()
                return row[0] if row else default
            cur = conn.execute(
                "INSERT INTO llm_profiles (name, base_url, api_key, model, created_at) VALUES (?,?,?,?,?)",
                (
                    "Deepseek",
                    cfg_val("deepseek_base_url", "https://api.deepseek.com/v1").strip(),
                    cfg_val("deepseek_api_key", "").strip(),
                    cfg_val("deepseek_model", "deepseek-chat").strip(),
                    datetime.now().isoformat(),
                ),
            )
            conn.execute(
                "INSERT OR REPLACE INTO config (key, value) VALUES ('active_llm_profile', ?)",
                (str(cur.lastrowid),),
            )
        conn.commit()


init_db()


async def get_config(key: str, default: str = "") -> str:
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute("SELECT value FROM config WHERE key=?", (key,)) as cursor:
            row = await cursor.fetchone()
            return row[0] if row else default


async def set_config(key: str, value: str):
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", (key, value))
        await db.commit()


async def activate_llm_profile(profile_id: int):
    """プロファイルをアクティブ化し、config の deepseek_* スナップショットを同期する。

    whisper_server は deepseek_* キーだけを読むため、ここで必ず 1 トランザクションで
    3 キー + active_llm_profile を書き換える。存在しない id なら None を返す。
    """
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM llm_profiles WHERE id=?", (profile_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            return None
        await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_api_key', ?)", (row["api_key"] or "",))
        await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_model', ?)", (row["model"] or "deepseek-chat",))
        await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_base_url', ?)", (row["base_url"] or "https://api.deepseek.com/v1",))
        await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('active_llm_profile', ?)", (str(profile_id),))
        await db.commit()
        return dict(row)


def get_config_sync(key: str, default: str = "") -> str:
    """同步读取配置（供启动子进程等非异步场景使用）"""
    import sqlite3
    with sqlite3.connect(str(DB_PATH)) as conn:
        row = conn.execute("SELECT value FROM config WHERE key=?", (key,)).fetchone()
        return row[0] if row else default


async def add_record(payload: dict):
    import aiosqlite
    # 记录使用的 Whisper 模型
    whisper_model = await get_config("whisper_model", "medium")
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute("""
            INSERT INTO records (filename, duration, language, output_format, summary, result, timestamp, elapsed_seconds, model, llm_model, correct_elapsed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            payload.get("filename"),
            payload.get("duration"),
            payload.get("language"),
            payload.get("output_format"),
            payload.get("summary"),
            payload.get("result"),
            payload.get("timestamp"),
            payload.get("elapsed_seconds"),
            whisper_model,
            payload.get("llm_model"),
            payload.get("correct_elapsed"),
        ))
        await db.commit()
        async with db.execute("SELECT last_insert_rowid()") as cursor:
            row = await cursor.fetchone()
            return row[0]


async def get_records(limit: int = 50, offset: int = 0, search: str = "") -> List[dict]:
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        if search:
            # #8: LIKE ワイルドカード（% _ \）をエスケープして意図通りの文字列検索にする
            escaped = search.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
            pattern = f"%{escaped}%"
            async with db.execute(
                "SELECT * FROM records WHERE filename LIKE ? ESCAPE '\\' OR result LIKE ? ESCAPE '\\' OR summary LIKE ? ESCAPE '\\' ORDER BY id DESC LIMIT ? OFFSET ?",
                (pattern, pattern, pattern, limit, offset)
            ) as cursor:
                rows = await cursor.fetchall()
        else:
            async with db.execute(
                "SELECT * FROM records ORDER BY id DESC LIMIT ? OFFSET ?",
                (limit, offset)
            ) as cursor:
                rows = await cursor.fetchall()
        return [dict(row) for row in rows]


async def get_stats() -> dict:
    import aiosqlite
    today = datetime.now().strftime("%Y-%m-%d")
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute("SELECT COUNT(*) FROM records") as c:
            total = (await c.fetchone())[0]
        async with db.execute("SELECT COUNT(*) FROM records WHERE timestamp LIKE ?", (f"{today}%",)) as c:
            today_count = (await c.fetchone())[0]
        async with db.execute("SELECT AVG(elapsed_seconds) FROM records") as c:
            avg_elapsed = (await c.fetchone())[0]
        # 平均转换速度 = 转换耗时 / 音频长度（RTF，越小越快）
        async with db.execute(
            "SELECT AVG(elapsed_seconds * 1.0 / duration) FROM records WHERE duration > 0"
        ) as c:
            avg_speed = (await c.fetchone())[0]
        # 最近一次转换速度
        async with db.execute(
            "SELECT elapsed_seconds * 1.0 / duration FROM records WHERE duration > 0 ORDER BY id DESC LIMIT 1"
        ) as c:
            row = await c.fetchone()
            last_speed = row[0] if row else None
        return {
            "total": total,
            "today": today_count,
            "avg_elapsed_seconds": round(avg_elapsed or 0, 2),
            "avg_speed": round(avg_speed or 0, 2),
            "last_speed": round(last_speed, 2) if last_speed is not None else None,
        }


# ---------------------------------------------------------------------------
# 系统监控
# ---------------------------------------------------------------------------
def get_gpu_info() -> Optional[dict]:
    if not nvml_available:
        return None
    try:
        handle = nvmlDeviceGetHandleByIndex(0)
        name = nvmlDeviceGetName(handle)
        if isinstance(name, bytes):
            name = name.decode("utf-8")
        mem = nvmlDeviceGetMemoryInfo(handle)
        util = nvmlDeviceGetUtilizationRates(handle)
        temp = nvmlDeviceGetTemperature(handle, NVML_TEMPERATURE_GPU)
        # 補足情報：GPU クロック / 消費電力（GPU により未サポートの場合は既定値）
        clock_mhz = 0
        try:
            clock_mhz = nvmlDeviceGetClockInfo(handle, NVML_CLOCK_GRAPHICS)
        except Exception:
            pass
        power_w = 0.0
        try:
            power_w = round(nvmlDeviceGetPowerUsage(handle) / 1000.0, 1)
        except Exception:
            pass
        return {
            "name": name,
            "memory_total_mb": mem.total // 1024 // 1024,
            "memory_used_mb": mem.used // 1024 // 1024,
            "memory_free_mb": mem.free // 1024 // 1024,
            "utilization": util.gpu,
            "temperature": temp,
            "clock_mhz": clock_mhz,
            "power_w": power_w,
        }
    except Exception as e:
        return {"error": str(e)}


_cpu_name_cache: Optional[str] = None
def get_cpu_name() -> str:
    """CPU ブランド名を取得（Windows はレジストリ、Linux は /proc/cpuinfo）。失敗時は platform.processor()。"""
    global _cpu_name_cache
    if _cpu_name_cache:
        return _cpu_name_cache
    name = ""
    try:
        if platform.system() == "Windows":
            import winreg
            with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\CentralProcessor\0") as key:
                value, _ = winreg.QueryValueEx(key, "ProcessorNameString")
                name = str(value).strip()
        else:
            with open("/proc/cpuinfo", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    if line.lower().startswith("model name"):
                        name = line.split(":", 1)[1].strip()
                        break
    except Exception:
        pass
    if not name:
        name = platform.processor()
    _cpu_name_cache = name
    return name


def get_system_snapshot() -> dict:
    cpu_percent = psutil.cpu_percent(interval=None)
    cpu_freq = psutil.cpu_freq()
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    disk_device = ""
    try:
        for p in psutil.disk_partitions():
            if os.path.abspath(p.mountpoint) == os.path.abspath("/"):
                disk_device = p.device
                break
    except Exception:
        pass
    return {
        "cpu_percent": cpu_percent,
        "cpu_count": psutil.cpu_count(logical=True),
        "cpu_name": get_cpu_name(),
        "cpu_freq_mhz": cpu_freq.current if cpu_freq else 0,
        "memory_total_gb": round(memory.total / (1024**3), 2),
        "memory_used_gb": round(memory.used / (1024**3), 2),
        "memory_percent": memory.percent,
        "disk_total_gb": round(disk.total / (1024**3), 2),
        "disk_used_gb": round(disk.used / (1024**3), 2),
        "disk_percent": disk.percent,
        "disk_device": disk_device,
        "gpu": get_gpu_info(),
        "timestamp": datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# Whisper 进程管理
# ---------------------------------------------------------------------------
def find_whisper_process() -> Optional[dict]:
    """优先返回 Dashboard 自己启动的 Whisper 进程，避免遍历所有进程导致卡死"""
    global whisper_process, whisper_start_time
    if whisper_process is not None:
        if whisper_process.poll() is None:
            return {
                "pid": whisper_process.pid,
                "cmdline": "python whisper_server.py",
                "start_time": datetime.fromtimestamp(whisper_start_time or time.time()).isoformat(),
            }
        else:
            whisper_process = None
    return None


async def whisper_health() -> Optional[dict]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{WHISPER_URL}/health", timeout=aiohttp.ClientTimeout(total=2)) as resp:
                if resp.status == 200:
                    return await resp.json()
    except Exception:
        pass
    return None


def start_whisper_process() -> subprocess.Popen:
    """启动 Whisper 服务。

    注意：stdout/stderr 必须重定向到日志文件，不能使用 subprocess.PIPE。
    Windows 管道缓冲区只有 64KB，如果没人读取，子进程写满后会永久阻塞
    （表现为端口仍在监听，但 HTTP 请求全部超时）。
    """
    global whisper_process, whisper_start_time, whisper_log_handle
    env = os.environ.copy()
    env["DASHBOARD_URL"] = f"http://127.0.0.1:{DASHBOARD_PORT}"
    env["PYTHONUNBUFFERED"] = "1"  # 让子进程日志实时写入文件
    env["WHISPER_MODEL"] = get_config_sync("whisper_model", "medium")
    # 高速化設定（启动 Whisper 时注入，重启后生效）
    env["WHISPER_COMPUTE_TYPE"] = get_config_sync("whisper_compute_type", "int8_float16")
    env["WHISPER_BEAM_SIZE"] = get_config_sync("whisper_beam_size", "3")
    env["WHISPER_TEMPERATURE"] = get_config_sync("whisper_temperature", "0")
    env["WHISPER_VAD_MIN_SILENCE_MS"] = get_config_sync("whisper_vad_min_silence_ms", "500")
    whisper_start_time = time.time()
    if whisper_log_handle is not None:
        try:
            whisper_log_handle.close()
        except Exception:
            pass
    whisper_log_handle = open(WHISPER_LOG, "a", encoding="utf-8", buffering=1)
    whisper_process = subprocess.Popen(
        [sys.executable, "-u", str(WHISPER_SCRIPT)],
        cwd=str(BASE_DIR),
        env=env,
        stdout=whisper_log_handle,
        stderr=subprocess.STDOUT,
    )
    return whisper_process


def stop_whisper_process():
    global whisper_process, whisper_start_time, whisper_log_handle
    # 优先停止我们启动的进程
    if whisper_process is not None and whisper_process.poll() is None:
        try:
            parent = psutil.Process(whisper_process.pid)
            for child in parent.children(recursive=True):
                child.terminate()
            parent.terminate()
        except Exception:
            pass
        try:
            whisper_process.wait(timeout=3)
        except Exception:
            try:
                whisper_process.kill()
            except Exception:
                pass
    whisper_process = None
    whisper_start_time = None
    if whisper_log_handle is not None:
        try:
            whisper_log_handle.close()
        except Exception:
            pass
        whisper_log_handle = None


# ---------------------------------------------------------------------------
# WebSocket 广播
# ---------------------------------------------------------------------------
async def broadcast(data: dict):
    dead = []
    for ws in connected_websockets:
        try:
            await asyncio.wait_for(ws.send_json(data), timeout=1.0)
        except Exception:
            dead.append(ws)
    for ws in dead:
        if ws in connected_websockets:
            connected_websockets.remove(ws)
    if dead:
        print(f"[broadcast] Removed {len(dead)} dead websocket(s), remaining: {len(connected_websockets)}")


def snapshot_history() -> Dict[str, List[Any]]:
    """system_history のコピー（#11: 送信中に trim されてもレースしないよう値も複製）。"""
    return {k: list(v) for k, v in system_history.items()}


# ---------------------------------------------------------------------------
# 日志跟踪
# ---------------------------------------------------------------------------
async def tail_log(file_path: Path, last_size: int = 0) -> tuple:
    if not file_path.exists():
        return [], 0
    try:
        current_size = file_path.stat().st_size
        if current_size < last_size:
            last_size = 0
        if current_size == last_size:
            return [], last_size
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            f.seek(last_size)
            new_lines = f.read().splitlines()
        return new_lines, current_size
    except Exception as e:
        return [f"[ERROR reading log] {e}"], last_size


# ---------------------------------------------------------------------------
# 后台任务
# ---------------------------------------------------------------------------
async def monitor_loop():
    whisper_log_size = 0
    dashboard_log_size = 0
    while True:
        loop_start = time.time()
        try:
            # 系统监控（在线程中执行避免阻塞事件循环）
            t0 = time.time()
            snapshot = await asyncio.to_thread(get_system_snapshot)
            t1 = time.time()
            system_history["timestamps"].append(datetime.now().strftime("%H:%M:%S"))
            system_history["cpu"].append(snapshot["cpu_percent"])
            system_history["memory"].append(snapshot["memory_percent"])
            gpu = snapshot.get("gpu") or {}
            system_history["gpu_util"].append(gpu.get("utilization", 0) if "error" not in gpu else 0)
            system_history["gpu_mem"].append(round(gpu.get("memory_used_mb", 0) / max(gpu.get("memory_total_mb", 1), 1) * 100, 1) if "error" not in gpu else 0)
            system_history["gpu_temp"].append(gpu.get("temperature", 0) if "error" not in gpu else 0)
            for key in system_history:
                if len(system_history[key]) > MAX_HISTORY:
                    system_history[key] = system_history[key][-MAX_HISTORY:]

            snapshot["converting"] = is_converting
            snapshot["progress"] = _progress_percent
            await broadcast({"type": "system_update", "data": snapshot, "history": snapshot_history()})

            # Whisper 状态
            t2 = time.time()
            health = await whisper_health()
            t3 = time.time()
            proc_info = find_whisper_process()
            t4 = time.time()
            # 转换中但 whisper 已不存在（崩溃/被外部杀掉）→ 清除卡死的转换状态
            if is_converting and health is None and proc_info is None:
                await reset_conversion_state()
            await broadcast({
                "type": "whisper_status",
                "data": {
                    "running": health is not None,
                    "health": health,
                    "process": proc_info,
                }
            })

            # 日志推送
            new_lines, whisper_log_size = await tail_log(WHISPER_LOG, whisper_log_size)
            for line in new_lines:
                if line.strip():
                    await broadcast({"type": "log_line", "source": "whisper", "line": line})

            new_lines, dashboard_log_size = await tail_log(DASHBOARD_LOG, dashboard_log_size)
            for line in new_lines:
                if line.strip():
                    await broadcast({"type": "log_line", "source": "dashboard", "line": line})

            total = time.time() - loop_start
            if total > 1.5:
                print(f"[monitor_loop] slow iteration: total={total:.2f}s, snapshot={t1-t0:.2f}s, health={t3-t2:.2f}s, proc={t4-t3:.2f}s")

        except Exception as e:
            print(f"[monitor_loop error] {e}")
        await asyncio.sleep(2)


# ---------------------------------------------------------------------------
# FastAPI 应用
# ---------------------------------------------------------------------------
async def auto_start_whisper():
    """Dashboard 启动后，如果 Whisper 未运行则自动启动，确保 Dashboard 持有进程句柄。"""
    await asyncio.sleep(3)
    health = await whisper_health()
    if health is None:
        print("[auto_start] Whisper not running, starting now...")
        try:
            await asyncio.to_thread(start_whisper_process)
            # 等待 Whisper 健康检查通过
            for _ in range(30):
                await asyncio.sleep(1)
                health = await whisper_health()
                if health is not None:
                    print(f"[auto_start] Whisper started, health={health}")
                    break
        except Exception as e:
            print(f"[auto_start] failed to start Whisper: {e}")
    else:
        print(f"[auto_start] Whisper already running, health={health}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(monitor_loop())
    auto_start_task = asyncio.create_task(auto_start_whisper())
    yield
    # #10: 起動タスクを明示的にキャンセルし、ログハンドルを閉じる
    task.cancel()
    auto_start_task.cancel()
    for t in (task, auto_start_task):
        try:
            await t
        except asyncio.CancelledError:
            pass
    global whisper_log_handle
    if whisper_log_handle is not None:
        try:
            whisper_log_handle.close()
        except Exception:
            pass
        whisper_log_handle = None
    if nvml_available:
        try:
            nvmlShutdown()
        except Exception:
            pass


app = FastAPI(title="MyWhisperServer Dashboard", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=str(DASHBOARD_DIR / "static")), name="static")


@app.get("/", response_class=HTMLResponse)
async def index():
    html_path = DASHBOARD_DIR / "static" / "index.html"
    return HTMLResponse(content=html_path.read_text(encoding="utf-8"))


@app.get("/api/v1/health")
async def api_health():
    return {"status": "ok", "dashboard_port": DASHBOARD_PORT}


@app.get("/api/v1/system")
async def api_system():
    return await asyncio.to_thread(get_system_snapshot)


@app.get("/api/v1/whisper/status")
async def api_whisper_status():
    health = await whisper_health()
    proc = await asyncio.to_thread(find_whisper_process)
    return {
        "running": health is not None,
        "managed": proc is not None,
        "health": health,
        "process": proc,
    }


@app.post("/api/v1/whisper/status_event", dependencies=[Depends(require_auth)])
async def api_whisper_status_event(data: dict):
    """接收 whisper_server 上报的转换状态（converting/idle）。
    converting 時に start_ts / filename を透過し、フロントでリアルタイム監視に利用する。"""
    global is_converting, _progress_percent
    state = str(data.get("state", ""))
    is_converting = state == "converting"
    # 转换开始：进度归零；转换结束：进度隐藏
    _progress_percent = 0 if is_converting else None
    payload = {"type": "converting", "state": state, "percent": _progress_percent}
    for k in ("start_ts", "filename"):
        if data.get(k) is not None:
            payload[k] = data[k]
    await broadcast(payload)
    return {"success": True}


@app.post("/api/v1/whisper/progress", dependencies=[Depends(require_auth)])
async def api_whisper_progress(data: dict):
    """接收 whisper_server 上报的转换进度（percent: 0-100）。
    phase（transcribe/correct）と duration（音声時間）を透過し、フロントのリアルタイム監視に利用する。"""
    global _progress_percent
    percent = data.get("percent")
    _progress_percent = percent
    payload = {"type": "progress", "percent": percent}
    for k in ("phase", "duration"):
        if data.get(k) is not None:
            payload[k] = data[k]
    await broadcast(payload)
    return {"success": True}


@app.post("/api/v1/ai/test", dependencies=[Depends(require_auth)])
async def api_ai_test(data: dict):
    """LLM 接続テスト（AI 校正設定ページの「LLM 接続テスト」ボタン）。
    OpenAI 互換エンドポイント（Deepseek / Ollama 等）に対応。API キーは任意。
    返回 {"ok": bool, "message": str, "model": str}。
    """
    api_key = str(data.get("api_key", "")).strip() or str(await get_config("deepseek_api_key") or "").strip()
    model = str(data.get("model", "")).strip() or str(await get_config("deepseek_model") or "") or "deepseek-chat"
    base_url = str(data.get("base_url", "")).strip() or str(await get_config("deepseek_base_url") or "") or "https://api.deepseek.com/v1"
    base_url = base_url.rstrip("/")
    if not base_url:
        return {"ok": False, "message": "Base URL が未設定です"}

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": "ping"}],
        "max_tokens": 5,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{base_url}/chat/completions",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=30),
            ) as resp:
                if resp.status == 200:
                    return {"ok": True, "message": "OK", "model": model}
                body = (await resp.text())[:200]
                return {"ok": False, "message": f"HTTP {resp.status}: {body}"}
    except Exception as e:
        return {"ok": False, "message": str(e)}


# ---------------------------------------------------------------------------
# LLM プロファイル管理（Deepseek / Ollama など OpenAI 互換エンドポイント）
# ---------------------------------------------------------------------------
@app.get("/api/v1/llm/profiles")
async def api_list_llm_profiles():
    import aiosqlite
    active = await get_config("active_llm_profile")
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM llm_profiles ORDER BY id") as cursor:
            rows = await cursor.fetchall()
    profiles = []
    for row in rows:
        p = dict(row)
        # #5: api_key は平文で返さず has_key / key_masked に置換
        p.update(mask_api_key(p.pop("api_key", "")))
        p["active"] = str(p["id"]) == active
        profiles.append(p)
    return {"profiles": profiles}


@app.post("/api/v1/llm/profiles", dependencies=[Depends(require_auth)])
async def api_create_llm_profile(data: dict):
    import aiosqlite
    name = str(data.get("name", "")).strip()
    base_url = validate_base_url(str(data.get("base_url", "")).strip())
    api_key = str(data.get("api_key", "")).strip()
    model = str(data.get("model", "")).strip() or "deepseek-chat"
    if not name or not base_url:
        return {"success": False, "error": "name and base_url are required"}
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute(
            "INSERT INTO llm_profiles (name, base_url, api_key, model, created_at) VALUES (?,?,?,?,?)",
            (name, base_url, api_key, model, datetime.now().isoformat()),
        ) as cur:
            new_id = cur.lastrowid
        await db.commit()
    return {"success": True, "id": new_id}


@app.put("/api/v1/llm/profiles/{profile_id}", dependencies=[Depends(require_auth)])
async def api_update_llm_profile(profile_id: int, data: dict):
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM llm_profiles WHERE id=?", (profile_id,)) as cur:
            row = await cur.fetchone()
        if not row:
            return {"success": False, "error": "profile not found"}
        name = str(data.get("name", "")).strip() or row["name"]
        base_url = validate_base_url(str(data.get("base_url", "")).strip()) or row["base_url"]
        # api_key はフィールドが明示的に送られた場合のみ上書きする（未送信なら既存キーを維持）
        if "api_key" in data:
            api_key = str(data.get("api_key", "")).strip()  # 明示的な空文字はキー削除として許可
        else:
            api_key = row["api_key"]
        model = str(data.get("model", "")).strip() or row["model"] or "deepseek-chat"
        if not name or not base_url:
            return {"success": False, "error": "name and base_url are required"}
        await db.execute(
            "UPDATE llm_profiles SET name=?, base_url=?, api_key=?, model=? WHERE id=?",
            (name, base_url, api_key, model, profile_id),
        )
        await db.commit()
    # アクティブ中なら config スナップショットを再同期
    if str(profile_id) == await get_config("active_llm_profile"):
        updated = await activate_llm_profile(profile_id)
        if updated:
            updated = {**updated, **mask_api_key(updated.pop("api_key", ""))}
        return {"success": True, "profile": updated}
    return {"success": True}


@app.delete("/api/v1/llm/profiles/{profile_id}", dependencies=[Depends(require_auth)])
async def api_delete_llm_profile(profile_id: int):
    import aiosqlite
    active = await get_config("active_llm_profile")
    cleared_active = False
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute("DELETE FROM llm_profiles WHERE id=?", (profile_id,))
        if str(profile_id) == active:
            cleared_active = True
            # アクティブ削除時は config スナップショットを既定値にリセット（stale URL で校正が走らないよう）
            await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('active_llm_profile', '')")
            await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_api_key', '')")
            await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_model', 'deepseek-chat')")
            await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('deepseek_base_url', 'https://api.deepseek.com/v1')")
            await db.execute("INSERT OR REPLACE INTO config (key, value) VALUES ('ai_correct_enabled', 'false')")
        await db.commit()
        async with db.execute("SELECT changes()") as cursor:
            row = await cursor.fetchone()
            deleted = row[0] if row else 0
    return {"success": True, "deleted": deleted, "cleared_active": cleared_active}


@app.post("/api/v1/llm/profiles/{profile_id}/activate", dependencies=[Depends(require_auth)])
async def api_activate_llm_profile(profile_id: int):
    profile = await activate_llm_profile(profile_id)
    if profile is None:
        return {"success": False, "error": "profile not found"}
    profile = {**profile, **mask_api_key(profile.pop("api_key", ""))}
    return {"success": True, "profile": profile}


async def reset_conversion_state():
    """清除卡死的转换状态（重启/停止 Whisper 时会中断进行中的转换，
    被中断的进程无法上报 idle，导致 UI 一直显示"转换中"）。"""
    global is_converting, _progress_percent
    if is_converting or _progress_percent is not None:
        is_converting = False
        _progress_percent = None
        await broadcast({"type": "converting", "state": "idle", "percent": None})


@app.post("/api/v1/whisper/start", dependencies=[Depends(require_auth)])
async def api_whisper_start():
    await reset_conversion_state()
    proc = await asyncio.to_thread(find_whisper_process)
    if proc:
        return {"success": True, "message": "Whisper already running", "pid": proc["pid"]}
    p = start_whisper_process()
    return {"success": True, "message": "Whisper started", "pid": p.pid}


@app.post("/api/v1/whisper/stop", dependencies=[Depends(require_auth)])
async def api_whisper_stop():
    await reset_conversion_state()
    stop_whisper_process()
    return {"success": True, "message": "Whisper stop requested"}


@app.post("/api/v1/whisper/restart", dependencies=[Depends(require_auth)])
async def api_whisper_restart():
    # 重启会中断当前转换：先清除卡死的"转换中"状态，避免 UI 一直显示转换中
    await reset_conversion_state()
    stop_whisper_process()
    await asyncio.sleep(1)
    p = start_whisper_process()
    return {"success": True, "message": "Whisper restarted", "pid": p.pid}


ALLOWED_MODELS = ["tiny", "base", "small", "medium", "large-v2", "large-v3"]


@app.post("/api/v1/whisper/model", dependencies=[Depends(require_auth)])
async def api_whisper_model(data: dict):
    """切换 Whisper 模型：保存配置并重启服务"""
    model = str(data.get("model", "")).strip()
    if model not in ALLOWED_MODELS:
        return {"success": False, "message": f"unsupported model: {model}"}
    await set_config("whisper_model", model)
    stop_whisper_process()
    await asyncio.sleep(1)
    p = start_whisper_process()
    return {"success": True, "message": f"switching to {model}", "model": model, "pid": p.pid}


class RecordPayload(BaseModel):
    filename: Optional[str] = None
    duration: Optional[float] = None
    language: Optional[str] = None
    output_format: Optional[str] = None
    summary: Optional[str] = None
    result: Optional[str] = None
    timestamp: Optional[str] = None
    elapsed_seconds: Optional[float] = None
    llm_model: Optional[str] = None
    correct_elapsed: Optional[float] = None


@app.post("/api/v1/records", dependencies=[Depends(require_auth)])
async def api_create_record(payload: RecordPayload):
    data = payload.dict()
    if not data.get("timestamp"):
        data["timestamp"] = datetime.now().isoformat()
    record_id = await add_record(data)
    record = {"id": record_id, **data}
    await broadcast({"type": "new_record", "data": record})
    return {"success": True, "id": record_id}


@app.get("/api/v1/records")
async def api_get_records(limit: int = Query(50, ge=1), offset: int = Query(0, ge=0), search: str = Query("")):
    records = await get_records(limit, offset, search)
    return {"records": records}


@app.delete("/api/v1/records/{record_id}", dependencies=[Depends(require_auth)])
async def api_delete_record(record_id: int):
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute("DELETE FROM records WHERE id=?", (record_id,))
        await db.commit()
        async with db.execute("SELECT changes()") as cursor:
            row = await cursor.fetchone()
            deleted = row[0] if row else 0
    if deleted:
        await broadcast({"type": "record_deleted", "id": record_id})
    return {"success": True, "deleted": deleted}


@app.delete("/api/v1/records", dependencies=[Depends(require_auth)])
async def api_clear_records():
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute("SELECT COUNT(*) FROM records") as cursor:
            row = await cursor.fetchone()
            count = row[0] if row else 0
        await db.execute("DELETE FROM records")
        await db.commit()
    await broadcast({"type": "records_cleared"})
    return {"success": True, "deleted": count}


@app.post("/api/v1/records/{record_id}/correct", dependencies=[Depends(require_auth)])
async def api_correct_record(record_id: int):
    """对已保存的转换结果重新执行 AI 校正并覆盖保存（通过 whisper_server /correct）"""
    import aiosqlite
    async with aiosqlite.connect(str(DB_PATH)) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM records WHERE id=?", (record_id,)) as cursor:
            row = await cursor.fetchone()
    if not row:
        return {"success": False, "error": "record not found"}
    text = row["result"] or ""
    if not text.strip():
        return {"success": False, "error": "empty result"}
    try:
        correct_t0 = time.time()
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{WHISPER_URL}/correct",
                json={"text": text},
                timeout=aiohttp.ClientTimeout(total=180),
            ) as resp:
                if resp.status != 200:
                    body = (await resp.text())[:200]
                    return {"success": False, "error": f"correction failed (HTTP {resp.status}): {body}"}
                data = await resp.json()
        correct_elapsed = round(time.time() - correct_t0, 2)
    except Exception as e:
        return {"success": False, "error": str(e)}
    corrected = data.get("result") or text
    llm_model = data.get("llm_model")
    if corrected == text:
        return {"success": False, "error": "correction disabled or failed"}
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute(
            "UPDATE records SET result=?, summary=?, llm_model=?, correct_elapsed=? WHERE id=?",
            (corrected, corrected[:200], llm_model, correct_elapsed, record_id),
        )
        await db.commit()
    await broadcast({"type": "record_updated", "id": record_id, "llm_model": llm_model})
    return {"success": True, "result": corrected, "llm_model": llm_model, "correct_elapsed": correct_elapsed}


@app.get("/api/v1/stats")
async def api_stats():
    return await get_stats()


@app.get("/api/v1/logs")
async def api_logs(lines: int = Query(100, ge=1, le=1000), source: str = Query("all")):
    result = []
    if source in ("all", "whisper") and WHISPER_LOG.exists():
        with open(WHISPER_LOG, "r", encoding="utf-8", errors="ignore") as f:
            result.extend([{"source": "whisper", "line": l} for l in f.read().splitlines()[-lines:]])
    if source in ("all", "dashboard") and DASHBOARD_LOG.exists():
        with open(DASHBOARD_LOG, "r", encoding="utf-8", errors="ignore") as f:
            result.extend([{"source": "dashboard", "line": l} for l in f.read().splitlines()[-lines:]])
    # #9: 先頭の ISO タイムスタンプがあれば時系列で、無ければ挿入順（安定ソート）で整列
    _TS_RE = re.compile(r"^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(?::\d{2})?")
    for item in result:
        m = _TS_RE.match(item["line"])
        item["_ts"] = m.group(0) if m else ""
    result.sort(key=lambda x: x["_ts"])
    return {"logs": result[-lines:]}


@app.get("/api/v1/config")
async def api_get_config():
    keys = [
        "default_language", "default_output", "refresh_interval", "gpu_temp_threshold",
        "theme", "ui_language", "whisper_model",
        "ai_correct_enabled", "deepseek_model", "deepseek_base_url",
        "active_llm_profile",
        "whisper_mode", "whisper_compute_type", "whisper_beam_size",
        "whisper_temperature", "whisper_vad_min_silence_ms",
    ]
    result = {}
    for k in keys:
        result[k] = await get_config(k)
    # #5: API キーは平文で返さず has_key / 末尾4文字 のみ返す
    key_val = await get_config("deepseek_api_key")
    result["deepseek_has_key"] = bool(key_val)
    result["deepseek_key_masked"] = "..." + key_val[-4:] if key_val else ""
    return result


@app.get("/api/v1/auth/token", dependencies=[Depends(require_auth)])
async def api_get_auth_token():
    """接続トークンの取得（ループバックはトークン不要で取得可 → フロントが自動保存）。"""
    return {"token": await get_dashboard_token()}


@app.post("/api/v1/auth/token/regenerate", dependencies=[Depends(require_auth)])
async def api_regenerate_auth_token():
    """接続トークンの再生成（ループバック以外の全クライアントに即時反映）。"""
    global _dashboard_token
    env_token = os.environ.get("DASHBOARD_TOKEN", "").strip()
    if env_token:
        return {"success": False, "error": "DASHBOARD_TOKEN 環境変数が設定されているため再生成できません（env 優先）"}
    generated = secrets.token_urlsafe(24)
    with _dashboard_token_lock:
        await set_config("dashboard_token", generated)
        _dashboard_token = generated
    print(f"[auth] Dashboard 接続トークンを再生成: {generated}")
    return {"success": True, "token": generated}


@app.post("/api/v1/config", dependencies=[Depends(require_auth)])
async def api_set_config(data: dict):
    for k, v in data.items():
        if k == "dashboard_token":
            continue  # トークンは env / 自動生成 / 専用エンドポイントでのみ管理
        if k == "deepseek_base_url":
            v = validate_base_url(v)
        await set_config(k, str(v))
    return {"success": True}


@app.get("/api/v1/autostart")
async def api_get_autostart():
    return {"enabled": AUTOSTART_TARGET.exists(), "path": str(AUTOSTART_TARGET)}


@app.post("/api/v1/autostart", dependencies=[Depends(require_auth)])
async def api_set_autostart(data: dict):
    enabled = bool(data.get("enabled"))
    if enabled:
        try:
            STARTUP_DIR.mkdir(parents=True, exist_ok=True)
            if IS_WINDOWS:
                # Windows：启动文件夹创建快捷方式
                ps_script = f"""
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut('{AUTOSTART_TARGET}')
$Shortcut.TargetPath = '{START_ALL_SCRIPT}'
$Shortcut.WorkingDirectory = '{BASE_DIR}'
$Shortcut.IconLocation = '{sys.executable},0'
$Shortcut.Save()
"""
                subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", ps_script], check=True)
            else:
                # Linux：~/.config/autostart 桌面自启文件（无需 sudo）
                desktop = f"""[Desktop Entry]
Type=Application
Name=MyWhisperServer
Comment=Whisper Server + Dashboard auto-start
Exec={START_ALL_SCRIPT}
Path={BASE_DIR}
Terminal=false
X-GNOME-Autostart-enabled=true
"""
                AUTOSTART_TARGET.write_text(desktop, encoding="utf-8")
                os.chmod(START_ALL_SCRIPT, 0o755)
        except Exception as e:
            return {"success": False, "error": str(e)}
    else:
        try:
            if AUTOSTART_TARGET.exists():
                AUTOSTART_TARGET.unlink()
        except Exception as e:
            return {"success": False, "error": str(e)}
    return {"success": True, "enabled": enabled}


# ---------------------------------------------------------------------------
# WebSocket
# ---------------------------------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # 认证：ループバック以外は ?token= を要求（不一致なら 4401 で切断）
    if not _is_loopback(websocket.client.host if websocket.client else ""):
        token = await get_dashboard_token()
        if websocket.query_params.get("token", "") != token:
            await websocket.close(code=4401)
            return
    await websocket.accept()
    connected_websockets.append(websocket)
    try:
        # 发送初始历史数据（#11: system_history はコピーを送信）
        snapshot = await asyncio.to_thread(get_system_snapshot)
        snapshot["converting"] = is_converting
        snapshot["progress"] = _progress_percent
        await websocket.send_json({"type": "system_update", "data": snapshot, "history": snapshot_history()})
        health = await whisper_health()
        proc = await asyncio.to_thread(find_whisper_process)
        status = {
            "running": health is not None,
            "health": health,
            "process": proc,
        }
        await websocket.send_json({"type": "whisper_status", "data": status})
        while True:
            msg = await websocket.receive_text()
            try:
                data = json.loads(msg)
                action = data.get("action")
                if action == "ping":
                    await websocket.send_json({"type": "pong"})
            except Exception:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)


if __name__ == "__main__":
    import uvicorn
    print(f"Starting MyWhisperServer Dashboard on http://{DASHBOARD_HOST}:{DASHBOARD_PORT}")
    uvicorn.run(app, host=DASHBOARD_HOST, port=DASHBOARD_PORT)
