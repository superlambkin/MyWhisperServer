import os
import re
import sys
import json
import time
import asyncio
import shutil
import secrets
import base64
import sqlite3
import threading
import subprocess
import platform
import socket
from pathlib import Path
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import Optional, List, Dict, Any

import psutil
import aiohttp
import edge_tts
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, Request, Form, Query, File, UploadFile, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# ローカル高速 TTS（Kokoro / VibeVoice）。重い import は関数内遅延なので起動コストはほぼゼロ
from tts_local import engine_available, loaded_device, synthesize as tts_synthesize, unload as tts_unload, load as tts_load, busy as tts_busy

# 自启路径：Windows 用启动文件夹快捷方式，Linux 用 ~/.config/autostart desktop 文件
IS_WINDOWS = platform.system() == "Windows"
if IS_WINDOWS:
    STARTUP_DIR = Path(os.environ.get("APPDATA", "")) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Startup"
    AUTOSTART_TARGET = STARTUP_DIR / "MyWhisperServer.lnk"
else:
    STARTUP_DIR = Path.home() / ".config" / "autostart"
    AUTOSTART_TARGET = STARTUP_DIR / "MyWhisperServer.desktop"

# 项目路径
if getattr(sys, "frozen", False):
    # PyInstaller 単体 exe ビルド時: exe が置かれているフォルダをルートにする
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).parent.parent.resolve()
DASHBOARD_DIR = BASE_DIR / "dashboard"
DATA_DIR = DASHBOARD_DIR / "data"
LOGS_DIR = DASHBOARD_DIR / "logs"
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "records.db"
WHISPER_LOG = BASE_DIR / "server.log"
DASHBOARD_LOG = LOGS_DIR / "dashboard.log"
if getattr(sys, "frozen", False):
    WHISPER_SCRIPT = BASE_DIR / "whisper_server.exe"
    OCR_SCRIPT = BASE_DIR / "ocr_server.exe"
    WHISPER_PROC_NAME = "whisper_server.exe"
    OCR_PROC_NAME = "ocr_server.exe"
else:
    WHISPER_SCRIPT = BASE_DIR / "whisper_server.py"
    OCR_SCRIPT = BASE_DIR / "ocr_server.py"
    WHISPER_PROC_NAME = "whisper_server.py"
    OCR_PROC_NAME = "ocr_server.py"
START_ALL_SCRIPT = BASE_DIR / ("start_all.bat" if IS_WINDOWS else "start_all.sh")

# 配置
DASHBOARD_HOST = os.environ.get("DASHBOARD_HOST", "0.0.0.0")
DASHBOARD_PORT = int(os.environ.get("DASHBOARD_PORT", "9001"))
WHISPER_HOST = os.environ.get("WHISPER_HOST", "127.0.0.1")
WHISPER_PORT = int(os.environ.get("WHISPER_PORT", "9000"))
WHISPER_URL = f"http://{WHISPER_HOST}:{WHISPER_PORT}"

# PaddleOCR サービス（ポート 9100・画像OCR + PDF→Markdown）
OCR_HOST = os.environ.get("OCR_HOST", "127.0.0.1")
OCR_PORT = int(os.environ.get("OCR_PORT", "9100"))
OCR_URL = f"http://{OCR_HOST}:{OCR_PORT}"
OCR_LOG = BASE_DIR / "ocr.log"

# 全局状态
whisper_process: Optional[subprocess.Popen] = None
whisper_start_time: Optional[float] = None
whisper_log_handle = None
is_converting = False  # 是否正在转换（由 whisper_server 上报）
_progress_percent: Optional[float] = None  # 转换进度 0-100，None=非转换中（由 whisper_server 上报）
_llm_status: Dict[str, Any] = {"processing": False, "model": None}  # LLM（AI校正）実行状態（サイドバー表示用）
_auto_rtl_prev: Dict[str, bool] = {"whisper": False, "tts": False, "ocr": False, "llm": False}  # 自動記録: 前回の稼働状態（遷移検知用）
connected_websockets: List[WebSocket] = []
system_history: Dict[str, List[Any]] = {
    "cpu": [],
    "memory": [],
    "gpu_util": [],
    "gpu_mem": [],
    "gpu_temp": [],
    "phase": [],  # 各サンプルの変換フェーズ（idle/transcribe/correct）→ チャート帯描画用
    "timestamps": [],
}
MAX_HISTORY = 480  # 趋势图历史点数上限（2s 间隔 ≈ 16 分钟；配合前端 zoom 档位）
whisper_proc_cache: Optional[dict] = None
whisper_proc_cache_time: float = 0

# PaddleOCR 服务状态
ocr_process: Optional[subprocess.Popen] = None
ocr_start_time: Optional[float] = None
ocr_log_handle = None
ocr_proc_cache: Optional[dict] = None
ocr_proc_cache_time: float = 0

# リアルタイムロギング状態（JSONL 記録）
rt_log: Dict[str, Any] = {
    "active": False,
    "file": None,          # 書き込み中のファイルハンドル
    "path": None,          # 書き込み中のファイル Path
    "start_ts": None,      # セッション開始 epoch 秒
    "samples": 0,
    "agg": {"cpu": 0.0, "gpu_util": 0.0, "gpu_mem": 0.0, "gpu_temp": 0.0},
    "whisper_model": "",
    "last_start_ts": None, # 直近の converting_start start_ts（duration 計算用）
    "auto": False,          # 自動開始（rtl_auto_start）で開始されたセッションか
    "session_active": [],   # 自動開始セッション中に活動したサービス（whisper/tts/ocr/llm）
}
RT_LOG_DIR = LOGS_DIR / "realtime"

# --- 认证（写入・制御系のみ） ---
_dashboard_token: Optional[str] = None
_dashboard_token_lock = threading.Lock()
LOOPBACK_HOSTS = {"127.0.0.1", "::1", "localhost"}


def _is_loopback(host: str) -> bool:
    return host in LOOPBACK_HOSTS


async def get_dashboard_token() -> str:
    """环境变量 DASHBOARD_TOKEN > config 存储 > 自动生成・保存（遅延初期化）。

    threading.Lock は await をまたいで保持するとデッドロックするため、
    ロック内では同期 DB アクセスのみ行う（get_config_sync / set_config_sync）。
    """
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
        stored = get_config_sync("dashboard_token")
        if stored:
            _dashboard_token = stored
            return _dashboard_token
        generated = secrets.token_urlsafe(24)
        set_config_sync("dashboard_token", generated)
        _dashboard_token = generated
        print(f"[auth] Dashboard 接続トークンを生成: {generated}")
        return generated


async def auth_enabled() -> bool:
    """接続トークン認証の有効/無効（config auth_enabled: on / off）。"""
    return (await get_config("auth_enabled", "on")) != "off"


async def require_auth(request: Request):
    """ループバック以外の POST/PUT/DELETE・/ws にトークンを要求する依存関数。

    auth_enabled が off の場合は認証自体を行わない（LAN から認証不要で操作可）。
    """
    if _is_loopback(request.client.host if request.client else ""):
        return
    if not await auth_enabled():
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


def _assert_private_host(url: str):
    """SSRF 対策: URL のホストがループバック / プライベート IPv4 / リンクローカル のみ許可。

    ローカル LLM（Ollama 等）へのプロキシ用途のため、公開 IP・外部ホストへの
    サーバー発のリクエストを禁止する。
    """
    import ipaddress
    from urllib.parse import urlsplit
    parts = urlsplit(str(url).strip().rstrip("/"))
    if not parts.hostname:
        raise HTTPException(status_code=400, detail="base_url must have a host")
    host = parts.hostname.rstrip(".")
    try:
        ips = [ipaddress.ip_address(host)]
    except ValueError:
        # ホスト名 → 解決して全候補がプライベートか確認
        try:
            infos = socket.getaddrinfo(host, parts.port or 80, type=socket.SOCK_STREAM)
            ips = [ipaddress.ip_address(i[4][0].split("%")[0]) for i in infos]
        except Exception:
            raise HTTPException(status_code=400, detail="base_url host を解決できません")
    for ip in ips:
        if not (ip.is_private or ip.is_loopback or ip.is_link_local):
            raise HTTPException(status_code=400, detail="base_url はプライベートホストのみ許可されます")

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
                correct_elapsed REAL,
                raw_result TEXT
            )
        """)
        # 兼容旧数据库：如果没有 model/llm_model/correct_elapsed/raw_result 列则添加
        cols = [row[1] for row in conn.execute("PRAGMA table_info(records)")]
        if "model" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN model TEXT")
        if "llm_model" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN llm_model TEXT")
        if "correct_elapsed" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN correct_elapsed REAL")
        if "raw_result" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN raw_result TEXT")
        if "source" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN source TEXT DEFAULT 'whisper'")
        if "pages" not in cols:
            conn.execute("ALTER TABLE records ADD COLUMN pages INTEGER")
        conn.execute("""
            CREATE TABLE IF NOT EXISTS config (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        # LLM プロファイル（Deepseek / MiniMax / Ollama など OpenAI 互換エンドポイントの登録）
        conn.execute("""
            CREATE TABLE IF NOT EXISTS llm_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                base_url TEXT,
                api_key TEXT,
                model TEXT,
                provider TEXT,
                created_at TEXT
            )
        """)
        # provider カラム追加（旧 DB からの移行）
        llm_cols = [r[1] for r in conn.execute("PRAGMA table_info(llm_profiles)").fetchall()]
        if "provider" not in llm_cols:
            conn.execute("ALTER TABLE llm_profiles ADD COLUMN provider TEXT")
        # provider 未設定の既存プロファイルを base_url から補完（冪等）
        conn.execute("""
            UPDATE llm_profiles SET provider='deepseek'
            WHERE (provider IS NULL OR provider='') AND base_url LIKE '%api.deepseek.com%'
        """)
        conn.execute("""
            UPDATE llm_profiles SET provider='minimax'
            WHERE (provider IS NULL OR provider='') AND base_url LIKE '%minimax%'
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
            # Whisper モデル保存先（空なら <プロジェクト>/models）
            "whisper_model_dir": "",
            # Whisper 高速化設定
            "whisper_mode": "balanced",
            "whisper_compute_type": "int8_float16",
            "whisper_beam_size": "3",
            "whisper_temperature": "0",
            "whisper_vad_min_silence_ms": "500",
            # 音読み TTS エンジン（edge | kokoro | vibevoice）。edge は既定・フォールバック
            "tts_engine": "edge",
            # ローカル TTS の実行デバイス（auto | cuda | cpu）。auto は空き VRAM で判断
            "tts_device": "auto",
            # VibeVoice モデル（realtime | tts）。tts は英語/中国語のみ・合成非対応 → realtime 使用
            "tts_vibevoice_model": "realtime",
            # Kokoro の日本語音声（オフラインでローカル voices から選択）
            "tts_kokoro_voice": "jf_alpha",
            # 起動時にローカルTTSをVRAMに読込、以後常駐（on | off）
            "tts_preload": "on",
            # PaddleOCR サービス（cuda | cpu / japan | en | ch / autostart on | off）
            "ocr_device": "cuda",
            "ocr_lang": "japan",
            "ocr_autostart": "off",
            # リアルタイムログ自動開始（on | off）。サービス/LLM の稼働に合わせて自動記録
            "rtl_auto_start": "off",
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
                "INSERT INTO llm_profiles (name, base_url, api_key, model, provider, created_at) VALUES (?,?,?,?,?,?)",
                (
                    "Deepseek",
                    cfg_val("deepseek_base_url", "https://api.deepseek.com/v1").strip(),
                    cfg_val("deepseek_api_key", "").strip(),
                    cfg_val("deepseek_model", "deepseek-chat").strip(),
                    "deepseek",
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


def set_config_sync(key: str, value: str):
    """同步写入配置（ロック保持中の await を避けるためトークン初期化で使用）"""
    import sqlite3
    with sqlite3.connect(str(DB_PATH)) as conn:
        conn.execute("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)", (key, value))
        conn.commit()


async def add_record(payload: dict):
    import aiosqlite
    # 记录使用的 Whisper 模型（OCR 等は payload の model を優先）
    whisper_model = await get_config("whisper_model", "medium")
    model = payload.get("model") or whisper_model
    async with aiosqlite.connect(str(DB_PATH)) as db:
        await db.execute("""
            INSERT INTO records (filename, duration, language, output_format, summary, result, raw_result, timestamp, elapsed_seconds, model, llm_model, correct_elapsed, source, pages)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            payload.get("filename"),
            payload.get("duration"),
            payload.get("language"),
            payload.get("output_format"),
            payload.get("summary"),
            payload.get("result"),
            payload.get("raw_result") or payload.get("result"),
            payload.get("timestamp"),
            payload.get("elapsed_seconds"),
            model,
            payload.get("llm_model"),
            payload.get("correct_elapsed"),
            payload.get("source") or "whisper",
            payload.get("pages"),
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
# ---------------------------------------------------------------------------
# GPU 使用率の PID 別内訳（Windows GPU Engine カウンタ）
# ---------------------------------------------------------------------------
# nvidia-smi / pynvml は per-process 利用率を提供しないため、Windows の
# 「GPU Engine」パフォーマンスカウンタから PID 別利用率を取得する。
# 取得コスト（PowerShell 起動 ~0.3-1s）が高いので 4 秒間キャッシュする。
_GPU_ENGINE_UTIL_CACHE: dict = {}
_GPU_ENGINE_UTIL_TS: float = 0.0
_GPU_ENGINE_SAMPLER_STOP = threading.Event()


def _run_gpu_engine_counter() -> dict:
    """GPU Engine カウンタを 1 回サンプリングし、PID 別 GPU 使用率（全エンジン合計）を返す。

    Get-Counter は 1 回で ~5 秒かかるため、スナップショット（monitor_loop）からは
    直接呼ばず、専用サンプラースレッドからのみ実行する。
    非 Windows / カウンタなし / タイムアウトなど失敗時は空 dict（呼び出し側は
    「その他」に丸め込み、表示はグレースフルに劣化する）。
    """
    ps_cmd = (
        "powershell -NoProfile -Command \"Get-Counter '\\GPU Engine(*)\\Utilization Percentage' "
        "-ErrorAction SilentlyContinue | Select-Object -ExpandProperty CounterSamples | "
        "ForEach-Object { $_.InstanceName + '|' + $_.CookedValue }\""
    )
    out = subprocess.run(ps_cmd, capture_output=True, text=True, timeout=8, shell=True).stdout
    res: dict = {}
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            name, val = line.rsplit("|", 1)
            v = float(val)
        except Exception:
            continue
        m = re.match(r"pid_(\d+)_", name)
        if m:
            pid = int(m.group(1))
            res[pid] = res.get(pid, 0.0) + v
    return res


def _gpu_engine_sampler_loop():
    """GPU Engine カウンタをバックグラウンドで継続的にサンプリングする daemon スレッド。

    Get-Counter は ~5 秒かかるため、monitor_loop から同期的に呼ぶとスナップショット
    全体が 5 秒以上ブロックされ、更新周期（refresh_interval）と乖離してしまう。
    ここでキャッシュを常時更新し続けることで、_gpu_engine_util_by_pid は即時返す。
    """
    if platform.system() != "Windows":
        return  # 非 Windows ではカウンタ自体が存在しないため何もしない
    global _GPU_ENGINE_UTIL_TS
    while not _GPU_ENGINE_SAMPLER_STOP.is_set():
        try:
            res = _run_gpu_engine_counter()
        except Exception:
            res = {}
        if not _GPU_ENGINE_SAMPLER_STOP.is_set():
            _GPU_ENGINE_UTIL_CACHE.clear()
            _GPU_ENGINE_UTIL_CACHE.update(res)
            _GPU_ENGINE_UTIL_TS = time.monotonic()
        time.sleep(0.5)


def _gpu_engine_util_by_pid() -> dict:
    """最新のキャッシュ済み PID 別 GPU 使用率を即座に返す（ブロックしない）。

    サンプラースレッドが ~5 秒毎に更新するため、monitor_loop のスナップショットを
    遅延させない。未更新（起動直後）は空 dict を返す。
    """
    if platform.system() != "Windows":
        return {}
    return dict(_GPU_ENGINE_UTIL_CACHE)


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

        # 使用率の PID 別内訳: whisper=whisper_process / tts=ダッシュボード自身（TTS 合成を内蔵）/ ocr=ocr_process
        pids = _gpu_engine_util_by_pid()
        w_pid = whisper_process.pid if whisper_process is not None and whisper_process.poll() is None else None
        o_pid = ocr_process.pid if ocr_process is not None and ocr_process.poll() is None else None
        t_pid = os.getpid()
        w_util = round(pids.get(w_pid, 0.0), 1) if w_pid else 0.0
        t_util = round(pids.get(t_pid, 0.0), 1) if t_pid else 0.0
        o_util = round(pids.get(o_pid, 0.0), 1) if o_pid else 0.0
        other_util = round(max(0.0, util.gpu - (w_util + t_util + o_util)), 1)
        util_breakdown = {"whisper": w_util, "tts": t_util, "ocr": o_util, "other": other_util}

        return {
            "name": name,
            "memory_total_mb": mem.total // 1024 // 1024,
            "memory_used_mb": mem.used // 1024 // 1024,
            "memory_free_mb": mem.free // 1024 // 1024,
            "utilization": util.gpu,
            "util_breakdown": util_breakdown,
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
    """Dashboard 自身が起動した Whisper プロセスを優先。無ければポート 9000 の LISTEN PID を検出する。

    注意: psutil.process_iter で cmdline を全走査すると Windows では 1 秒以上ブロックして
    イベントループを詰まらせるため、必ず net_connections（数 ms）で特定する。
    """
    global whisper_process, whisper_start_time
    if whisper_process is not None:
        if whisper_process.poll() is None:
            return {
                "pid": whisper_process.pid,
                "cmdline": WHISPER_PROC_NAME,
                "start_time": datetime.fromtimestamp(whisper_start_time or time.time()).isoformat(),
                "managed": True,
            }
        whisper_process = None
    try:
        for conn in psutil.net_connections(kind="tcp"):
            if conn.status == psutil.CONN_LISTEN and conn.laddr.port == WHISPER_PORT and conn.pid is not None:
                try:
                    start = datetime.fromtimestamp(psutil.Process(conn.pid).create_time()).isoformat()
                except Exception:
                    start = datetime.now().isoformat()
                return {
                    "pid": conn.pid,
                    "cmdline": WHISPER_PROC_NAME,
                    "start_time": start,
                    "managed": False,  # 外部起動（Dashboard 管理外）
                }
    except (psutil.AccessDenied, OSError, ValueError):
        pass
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
    env["WHISPER_PORT"] = str(WHISPER_PORT)
    env["WHISPER_DEVICE"] = os.environ.get("WHISPER_DEVICE", "")
    env["WHISPER_MODEL"] = get_config_sync("whisper_model", "medium")
    # モデル保存先（download_root）を注入：切替時・起動時にここから読み込み/保存
    env["WHISPER_MODEL_DIR"] = str(get_model_dir_sync())
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
    if getattr(sys, "frozen", False):
        proc_cmd = [str(WHISPER_SCRIPT)]
    else:
        proc_cmd = [sys.executable, "-u", str(WHISPER_SCRIPT)]
    whisper_process = subprocess.Popen(
        proc_cmd,
        cwd=str(BASE_DIR),
        env=env,
        stdout=whisper_log_handle,
        stderr=subprocess.STDOUT,
    )
    return whisper_process


def _is_port_listening(port: int) -> bool:
    """指定ポートを LISTEN している接続があるか（孤児 whisper の検出用）。"""
    try:
        for conn in psutil.net_connections(kind="tcp"):
            if conn.status == psutil.CONN_LISTEN and conn.laddr.port == port:
                return True
    except Exception:
        pass
    return False


def _kill_port_owner(port: int):
    """指定ポートを LISTEN しているプロセスを強制終了（未追跡の孤児 whisper 対策）。"""
    try:
        for conn in psutil.net_connections(kind="tcp"):
            if conn.status == psutil.CONN_LISTEN and conn.laddr.port == port:
                try:
                    p = psutil.Process(conn.pid)
                    for child in p.children(recursive=True):
                        child.kill()
                    p.kill()
                except Exception:
                    pass
    except Exception:
        pass


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
    # 孤児プロセス対策: dashboard 再起動で追跡を失った場合も port 占有者を強制終了
    _kill_port_owner(WHISPER_PORT)
    # 次の start が bind 失敗しないよう、ポート解放を待つ（最大 5 秒）
    for _ in range(50):
        if not _is_port_listening(WHISPER_PORT):
            break
        time.sleep(0.1)
    if whisper_log_handle is not None:
        try:
            whisper_log_handle.close()
        except Exception:
            pass
        whisper_log_handle = None


# ---------------------------------------------------------------------------
# PaddleOCR 进程管理
# ---------------------------------------------------------------------------
def find_ocr_process() -> Optional[dict]:
    """Dashboard 自身が起動した OCR プロセスを優先。無ければポート 9100 の LISTEN PID を検出する。

    注意: psutil.process_iter で cmdline を全走査すると Windows では 1 秒以上ブロックして
    イベントループを詰まらせるため、必ず net_connections（数 ms）で特定する。
    """
    global ocr_process, ocr_start_time
    if ocr_process is not None:
        if ocr_process.poll() is None:
            return {
                "pid": ocr_process.pid,
                "cmdline": OCR_PROC_NAME,
                "start_time": datetime.fromtimestamp(ocr_start_time or time.time()).isoformat(),
            }
        ocr_process = None
    try:
        for conn in psutil.net_connections(kind="tcp"):
            if conn.status == psutil.CONN_LISTEN and conn.laddr.port == OCR_PORT and conn.pid is not None:
                try:
                    start = datetime.fromtimestamp(psutil.Process(conn.pid).create_time()).isoformat()
                except Exception:
                    start = datetime.now().isoformat()
                return {
                    "pid": conn.pid,
                    "cmdline": OCR_PROC_NAME,
                    "start_time": start,
                }
    except (psutil.AccessDenied, OSError, ValueError):
        pass
    return None


async def ocr_health() -> Optional[dict]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{OCR_URL}/health", timeout=aiohttp.ClientTimeout(total=2)) as resp:
                if resp.status == 200:
                    return await resp.json()
    except Exception:
        pass
    return None


def start_ocr_process() -> subprocess.Popen:
    """启动 PaddleOCR 服务（whisper と同様、stdout はログファイルへ。PIPE 禁止）。"""
    global ocr_process, ocr_start_time, ocr_log_handle
    env = os.environ.copy()
    env["DASHBOARD_URL"] = f"http://127.0.0.1:{DASHBOARD_PORT}"
    env["PYTHONUNBUFFERED"] = "1"
    env["OCR_DEVICE"] = get_config_sync("ocr_device", "cuda")
    env["OCR_LANG"] = get_config_sync("ocr_lang", "japan")
    env["OCR_PORT"] = str(OCR_PORT)
    # PaddleOCR モデル保存先をプロジェクト内（models/paddlex）に固定
    env["PADDLE_PDX_CACHE_HOME"] = str(get_model_dir_sync() / "paddlex")
    ocr_start_time = time.time()
    if ocr_log_handle is not None:
        try:
            ocr_log_handle.close()
        except Exception:
            pass
    ocr_log_handle = open(OCR_LOG, "a", encoding="utf-8", buffering=1)
    if getattr(sys, "frozen", False):
        proc_cmd = [str(OCR_SCRIPT)]
    else:
        proc_cmd = [sys.executable, "-u", str(OCR_SCRIPT)]
    ocr_process = subprocess.Popen(
        proc_cmd,
        cwd=str(BASE_DIR),
        env=env,
        stdout=ocr_log_handle,
        stderr=subprocess.STDOUT,
    )
    return ocr_process


def stop_ocr_process():
    global ocr_process, ocr_start_time, ocr_log_handle
    if ocr_process is not None and ocr_process.poll() is None:
        try:
            parent = psutil.Process(ocr_process.pid)
            for child in parent.children(recursive=True):
                child.terminate()
            parent.terminate()
        except Exception:
            pass
        try:
            ocr_process.wait(timeout=3)
        except Exception:
            try:
                ocr_process.kill()
            except Exception:
                pass
    ocr_process = None
    ocr_start_time = None
    # 孤児プロセス対策（dashboard 再起動で追跡を失った場合も port 占有者を強制終了）
    _kill_port_owner(OCR_PORT)
    for _ in range(50):
        if not _is_port_listening(OCR_PORT):
            break
        time.sleep(0.1)
    if ocr_log_handle is not None:
        try:
            ocr_log_handle.close()
        except Exception:
            pass
        ocr_log_handle = None


async def _proxy_ocr(path: str, file: UploadFile, lang: Optional[str]):
    """OCR サービスへ multipart をフォワード（ループバック制御）。未起動なら 503。"""
    health = await ocr_health()
    if health is None:
        raise HTTPException(status_code=503, detail="OCR service is not running")
    data = aiohttp.FormData()
    # UploadFile.file は SpooledTemporaryFile で aiohttp が直接シリアライズ不可
    # → バイト列に読み替えて (filename, content, content_type) 形式で送る
    content = await file.read()
    data.add_field(
        "file", content, filename=file.filename or "upload",
        content_type=file.content_type or "application/octet-stream",
    )
    if lang:
        data.add_field("lang", lang)
    # 初回はモデルDL・構造解析で数分かかるため long timeout
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{OCR_URL}{path}", data=data, timeout=aiohttp.ClientTimeout(total=600)) as resp:
            body = await resp.text()
            if resp.status != 200:
                raise HTTPException(status_code=resp.status, detail=body[:500])
            try:
                return JSONResponse(status_code=200, content=json.loads(body) if body else {})
            except json.JSONDecodeError:
                return PlainTextResponse(body)


async def _proxy_ocr_json(path: str, file: UploadFile, lang: Optional[str]) -> dict:
    """OCR サービスへ multipart をフォワードし、JSON 結果を dict で返す（/ocr/convert 用）。"""
    health = await ocr_health()
    if health is None:
        raise HTTPException(status_code=503, detail="OCR service is not running")
    data = aiohttp.FormData()
    content = await file.read()
    data.add_field(
        "file", content, filename=file.filename or "upload",
        content_type=file.content_type or "application/octet-stream",
    )
    if lang:
        data.add_field("lang", lang)
    async with aiohttp.ClientSession() as session:
        async with session.post(f"{OCR_URL}{path}", data=data, timeout=aiohttp.ClientTimeout(total=600)) as resp:
            body = await resp.text()
            if resp.status != 200:
                raise HTTPException(status_code=resp.status, detail=body[:500])
            try:
                return json.loads(body) if body else {}
            except json.JSONDecodeError:
                raise HTTPException(status_code=502, detail="OCR returned non-JSON response")


def _markdown_to_text(md: str) -> str:
    """Markdown 記法を簡易除去してプレーンテキスト化（TXT 出力用）。"""
    import re as _re
    lines = []
    for ln in md.splitlines():
        s = ln.rstrip()
        s = _re.sub(r"^#{1,6}\s*", "", s)                      # 見出し
        s = _re.sub(r"^\s*[-*+]\s+", "", s)                   # 箇条書き
        s = _re.sub(r"^\s*\d+\.\s+", "", s)                   # 番号付き
        s = _re.sub(r"```", "", s)                            # コードフェンス
        s = _re.sub(r"\*\*(.+?)\*\*", r"\1", s)               # 太字
        s = _re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"\1", s)  # 斜体
        s = _re.sub(r"`(.+?)`", r"\1", s)                     # インラインコード
        s = _re.sub(r"\[(.+?)\]\(.+?\)", r"\1", s)            # リンク
        s = _re.sub(r"^>\s*", "", s)                          # 引用
        if s.strip():
            lines.append(s)
    return "\n".join(lines)


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
# リアルタイムロギング（JSONL / AI 解析可能）
# ---------------------------------------------------------------------------
def _rt_current_phase() -> str:
    """現在の変換フェーズ。AI 校正中は progress が -1 で通知される。"""
    if _progress_percent == -1:
        return "correct"
    if is_converting:
        return "transcribe"
    return "idle"


def _rt_write(data: dict) -> bool:
    """ロギング有効時のみ JSONL 1 行を追記。書込んだら True。"""
    global rt_log
    if not rt_log["active"] or rt_log["file"] is None:
        return False
    try:
        rt_log["file"].write(json.dumps(data, ensure_ascii=False) + "\n")
        rt_log["file"].flush()
        return True
    except Exception as e:
        print(f"[realtime-log] write error: {e}")
        return False


def _rt_log_event(event: str, **fields) -> None:
    """変換/校正の境界イベント行（converting_start / correct_start / correct_end / converting_end）。"""
    if not rt_log["active"]:
        return
    row = {"type": "event", "event": event, "ts": datetime.now().isoformat()}
    row.update(fields)
    _rt_write(row)


# ---------------------------------------------------------------------------
# 后台任务
# ---------------------------------------------------------------------------
async def monitor_loop():
    whisper_log_size = 0
    dashboard_log_size = 0
    interval = 1.0
    while True:
        loop_start = time.time()
        # 更新間隔（refresh_interval, ms）に合わせてブロードキャスト（300ms〜10s にクランプ）
        try:
            raw = await get_config("refresh_interval", "1000")
            interval = max(0.3, min(10.0, int(raw) / 1000.0))
        except Exception:
            interval = 1.0
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
            system_history["phase"].append(_rt_current_phase())
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
                    "llm_status": _llm_status,
                }
            })

            # PaddleOCR 状态
            ocr_health_d = await ocr_health()
            ocr_proc_info = find_ocr_process()
            await broadcast({
                "type": "ocr_status",
                "data": {
                    "running": ocr_health_d is not None,
                    "health": ocr_health_d,
                    "process": ocr_proc_info,
                }
            })

            # リアルタイムログ自動開始/停止（rtl_auto_start が on の時のみ動作）
            await _auto_rtl_control(health, ocr_health_d)

            # TTS 状态（ダッシュボード内蔵。モデル読込/常駐状態のみ）
            await broadcast({"type": "tts_status", "data": await _tts_status_dict()})

            # リアルタイムロギング：アクティブ時のみ 2 秒毎のサンプル行を追記
            if rt_log["active"]:
                phase = _rt_current_phase()
                g = gpu if "error" not in gpu else {}
                gpu_mem_pct = round(g.get("memory_used_mb", 0) / max(g.get("memory_total_mb", 1), 1) * 100, 1) if g else 0
                rt_log["samples"] += 1
                rt_log["agg"]["cpu"] += snapshot["cpu_percent"]
                rt_log["agg"]["gpu_util"] += g.get("utilization", 0)
                rt_log["agg"]["gpu_mem"] += gpu_mem_pct
                rt_log["agg"]["gpu_temp"] += g.get("temperature", 0)
                _rt_write({
                    "type": "sample",
                    "ts": datetime.now().isoformat(),
                    "cpu_percent": snapshot["cpu_percent"],
                    "cpu_freq_mhz": snapshot.get("cpu_freq_mhz"),
                    "memory_percent": snapshot["memory_percent"],
                    "memory_used_gb": snapshot.get("memory_used_gb"),
                    "disk_percent": snapshot.get("disk_percent"),
                    "gpu_util": g.get("utilization", 0),
                    "gpu_mem_percent": gpu_mem_pct,
                    "gpu_mem_used_mb": g.get("memory_used_mb", 0),
                    "gpu_temp": g.get("temperature", 0),
                    "gpu_clock_mhz": g.get("clock_mhz", 0),
                    "gpu_power_w": g.get("power_w", 0),
                    "whisper_running": health is not None,
                    "whisper_model": (health or {}).get("model") if health else None,
                    "converting": is_converting,
                    "phase": phase,
                    "progress": _progress_percent,
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
            if total > max(1.5, interval * 1.5):
                print(f"[monitor_loop] slow iteration: total={total:.2f}s, snapshot={t1-t0:.2f}s, health={t3-t2:.2f}s, proc={t4-t3:.2f}s")

        except Exception as e:
            print(f"[monitor_loop error] {e}")
        await asyncio.sleep(interval)


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


async def auto_start_ocr():
    """ocr_autostart=on の時のみ Dashboard 起動後に OCR サービスを自動起動。"""
    await asyncio.sleep(4)
    if get_config_sync("ocr_autostart", "off") != "on":
        print("[auto_start] OCR autostart disabled (ocr_autostart=off)")
        return
    health = await ocr_health()
    if health is None:
        print("[auto_start] OCR not running, starting now...")
        try:
            await asyncio.to_thread(start_ocr_process)
            for _ in range(30):
                await asyncio.sleep(1)
                health = await ocr_health()
                if health is not None:
                    print(f"[auto_start] OCR started, health={health}")
                    break
        except Exception as e:
            print(f"[auto_start] failed to start OCR: {e}")
    else:
        print(f"[auto_start] OCR already running, health={health}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # GPU Engine カウンタは 1 回 ~5 秒かかるため、専用スレッドで継続サンプリングし
    # monitor_loop のスナップショットをブロックしないようにする
    _GPU_ENGINE_SAMPLER_STOP.clear()
    gpu_sampler_thread = threading.Thread(target=_gpu_engine_sampler_loop, daemon=True)
    gpu_sampler_thread.start()
    task = asyncio.create_task(monitor_loop())
    auto_start_task = asyncio.create_task(auto_start_whisper())
    auto_start_ocr_task = asyncio.create_task(auto_start_ocr())
    preload_tts_task = asyncio.create_task(preload_local_tts())
    yield
    # #10: 起動タスクを明示的にキャンセルし、ログハンドルを閉じる
    _GPU_ENGINE_SAMPLER_STOP.set()
    task.cancel()
    auto_start_task.cancel()
    auto_start_ocr_task.cancel()
    preload_tts_task.cancel()
    for t in (task, auto_start_task, auto_start_ocr_task, preload_tts_task):
        try:
            await t
        except asyncio.CancelledError:
            pass
    global whisper_log_handle, ocr_log_handle
    if whisper_log_handle is not None:
        try:
            whisper_log_handle.close()
        except Exception:
            pass
        whisper_log_handle = None
    if ocr_log_handle is not None:
        try:
            ocr_log_handle.close()
        except Exception:
            pass
        ocr_log_handle = None
    if nvml_available:
        try:
            nvmlShutdown()
        except Exception:
            pass
    # ローカル TTS エンジンのアンロードタスクを停止し VRAM を解放
    for t in list(_tts_unload_tasks.values()):
        t.cancel()
    _tts_unload_tasks.clear()
    try:
        await asyncio.to_thread(tts_unload)
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
        "managed": bool(proc and proc.get("managed", True)),
        "health": health,
        "process": proc,
    }


@app.post("/api/v1/whisper/status_event", dependencies=[Depends(require_auth)])
async def api_whisper_status_event(data: dict):
    """接收 whisper_server 上报的转换状态（converting/idle）。
    converting 時に start_ts / filename を透過し、フロントでリアルタイム監視に利用する。"""
    global is_converting, _progress_percent
    state = str(data.get("state", ""))
    was_converting = is_converting
    was_correcting = _progress_percent == -1  # 校正中（progress=-1）に変換終了した場合 correct_end を補完
    is_converting = state == "converting"
    # 转换开始：进度归零；转换结束：进度隐藏
    _progress_percent = 0 if is_converting else None
    # リアルタイムロギング：変換開始/終了イベント
    if is_converting and not was_converting:
        rt_log["last_start_ts"] = data.get("start_ts")
        _rt_log_event("converting_start", filename=data.get("filename"), start_ts=data.get("start_ts"))
    elif not is_converting and was_converting:
        if was_correcting:
            _rt_log_event("correct_end", reason="converting_end")
        _rt_log_event("converting_end",
                      duration_sec=round(time.time() - rt_log["last_start_ts"], 2) if rt_log["last_start_ts"] else None)
        rt_log["last_start_ts"] = None
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
    was_correcting = _progress_percent == -1
    _progress_percent = percent
    # リアルタイムロギング：AI 校正の開始/終了イベント（校正中は progress=-1 で通知）
    now_correcting = percent == -1
    if now_correcting and not was_correcting:
        _rt_log_event("correct_start")
    elif was_correcting and not now_correcting:
        _rt_log_event("correct_end")
    payload = {"type": "progress", "percent": percent}
    for k in ("phase", "duration"):
        if data.get(k) is not None:
            payload[k] = data[k]
    await broadcast(payload)
    return {"success": True}


@app.post("/api/v1/whisper/llm_status", dependencies=[Depends(require_auth)])
async def api_whisper_llm_status(data: dict):
    """whisper_server から LLM（AI 校正）実行状態を受信し、フロントへブロードキャスト。

    サイドバーの「LLM 活用」表示用。処理開始/終了のたびに whisper_server が報告する。
    """
    global _llm_status
    _llm_status = {
        "processing": bool(data.get("processing", False)),
        # model は前回の値を保持（処理中→待機中の切り替えでモデル名を消さない）
        "model": data.get("model") or _llm_status.get("model"),
    }
    await broadcast({"type": "llm_status", "data": _llm_status})
    return {"success": True}


# ---------------------------------------------------------------------------
# リアルタイムロギング（JSONL / AI 解析可能）
# ---------------------------------------------------------------------------
_RTLOG_NAME_RE = re.compile(r"^realtime_\d{8}_\d{6}\.jsonl$")


def _rt_parse_meta(path: Path) -> dict:
    """JSONL の先頭（session_start）と末尾（session_end）から要約情報を抽出。"""
    info: Dict[str, Any] = {"name": path.name, "size": path.stat().st_size, "mtime": path.stat().st_mtime}
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            lines = [ln for ln in f if ln.strip()]
        if lines:
            first = json.loads(lines[0])
            if first.get("type") == "meta" and first.get("event") == "session_start":
                info["started_at"] = first.get("ts")
                if first.get("whisper_model"):
                    info["whisper_model"] = first.get("whisper_model")
        if len(lines) >= 2:
            last = json.loads(lines[-1])
            if last.get("type") == "meta" and last.get("event") == "session_end":
                for k in ("samples", "duration_sec", "avg_cpu", "avg_gpu_util", "avg_gpu_mem", "avg_gpu_temp", "ended_at"):
                    if last.get(k) is not None:
                        info[k] = last.get(k)
    except Exception:
        pass
    return info


@app.post("/api/v1/realtime-log/start", dependencies=[Depends(require_auth)])
async def api_rtlog_start():
    """ロギング開始。新規 JSONL ファイルを作成し meta session_start を書く。"""
    global rt_log
    if rt_log["active"]:
        return JSONResponse({"success": False, "message": "already active"}, status_code=409)
    return await _rtl_start(auto=False)


async def _rtl_start(auto: bool = False) -> dict:
    """ロギング開始の共通処理。auto=True は自動開始（rtl_auto_start）セッション。

    新規 JSONL ファイルを作成し meta session_start を書き、状態をフロントへ通知する。
    """
    global rt_log
    RT_LOG_DIR.mkdir(parents=True, exist_ok=True)
    name = f"realtime_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jsonl"
    path = RT_LOG_DIR / name
    health = await whisper_health()
    model = (health or {}).get("model")
    rt_log.update({
        "active": True,
        "file": None,
        "path": path,
        "start_ts": time.time(),
        "samples": 0,
        "agg": {"cpu": 0.0, "gpu_util": 0.0, "gpu_mem": 0.0, "gpu_temp": 0.0},
        "whisper_model": model or "",
        "last_start_ts": None,
        "auto": auto,
        "session_active": [],
    })
    rt_log["file"] = open(path, "w", encoding="utf-8")
    _rt_write({
        "type": "meta", "event": "session_start",
        "ts": datetime.now().isoformat(),
        "whisper_model": model,
        "whisper_running": health is not None,
        "auto": auto,
    })
    await broadcast({"type": "realtime_log", "data": {"active": True, "auto": auto}})
    return {"success": True, "filename": name, "auto": auto}


@app.post("/api/v1/realtime-log/stop", dependencies=[Depends(require_auth)])
async def api_rtlog_stop():
    """ロギング終了。meta session_end（要約統計）を書き込み active を解除。"""
    global rt_log
    if not rt_log["active"]:
        return JSONResponse({"success": False, "message": "not active"}, status_code=409)
    return await _rtl_stop(reason="manual")


async def _rtl_stop(reason: str = "manual") -> dict:
    """ロギング終了の共通処理。reason: manual / auto_idle / auto_stopped:<svc> / auto_disabled。"""
    global rt_log
    samples = rt_log["samples"]
    duration_sec = round(time.time() - rt_log["start_ts"], 2) if rt_log["start_ts"] else 0
    agg = rt_log["agg"]
    n = max(samples, 1)
    _rt_write({
        "type": "meta", "event": "session_end",
        "ts": datetime.now().isoformat(),
        "samples": samples,
        "duration_sec": duration_sec,
        "avg_cpu": round(agg["cpu"] / n, 1),
        "avg_gpu_util": round(agg["gpu_util"] / n, 1),
        "avg_gpu_mem": round(agg["gpu_mem"] / n, 1),
        "avg_gpu_temp": round(agg["gpu_temp"] / n, 1),
        "stop_reason": reason,
        "auto": rt_log.get("auto", False),
    })
    name = rt_log["path"].name if rt_log["path"] else None
    try:
        rt_log["file"].close()
    except Exception:
        pass
    rt_log.update({
        "active": False, "file": None, "path": None, "start_ts": None,
        "samples": 0, "agg": {"cpu": 0.0, "gpu_util": 0.0, "gpu_mem": 0.0, "gpu_temp": 0.0},
        "whisper_model": "", "last_start_ts": None,
        "auto": False, "session_active": [],
    })
    await broadcast({"type": "realtime_log", "data": {"active": False, "auto": False}})
    return {"success": True, "filename": name, "samples": samples, "duration_sec": duration_sec}


async def _auto_rtl_control(health: Optional[dict], ocr_health_d: Optional[dict]) -> None:
    """リアルタイムログの自動開始/停止を制御する（monitor_loop から毎ループ呼ぶ）。

    仕様（ユーザー確定）:
      - 開始: 各サービス（Whisper/TTS/OCR）・LLM活用 のいずれかが「待機 → 稼働」に
        遷移した瞬間に自動記録を開始（edge-triggered）。
      - 終了: ①全サービス・LLMが待機（自然完了） ②今回のセッション中に活動した
        サービスが停止（異常終了） ③トグルOFF（auto_disabled）。
    """
    global _auto_rtl_prev
    auto_on = get_config_sync("rtl_auto_start", "off") == "on"

    w_active = is_converting or _progress_percent == -1   # 変換中 or 校正中
    w_stopped = health is None                            # whisper プロセス稼働なし
    l_active = bool(_llm_status.get("processing"))        # AI 校正（LLM）処理中
    o_active = bool((ocr_health_d or {}).get("busy"))     # OCR 処理中（/health busy）
    o_stopped = ocr_health_d is None                      # OCR 未起動/応答なし
    t_active = tts_busy()                                 # TTS 合成処理中（tts_local.busy）
    t_engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    t_stopped = loaded_device(t_engine) is None           # TTS エンジン未読込

    states = {"whisper": w_active, "tts": t_active, "ocr": o_active, "llm": l_active}

    if not auto_on:
        # トグルOFF → 自動開始セッションは即終了（手動セッションは触らない）
        if rt_log["active"] and rt_log.get("auto"):
            await _rtl_stop(reason="auto_disabled")
        for k in states:
            _auto_rtl_prev[k] = False
        return

    if not rt_log["active"]:
        # 自動開始: いずれかが「待機 → 稼働」へ遷移した瞬間
        if any(states[k] and not _auto_rtl_prev.get(k) for k in states):
            await _rtl_start(auto=True)
    else:
        if not rt_log.get("auto"):
            return  # 手動開始セッションは自動制御しない
        # セッション中に活動したサービスを追跡
        sess = set(rt_log.get("session_active") or [])
        for k, active in states.items():
            if active:
                sess.add(k)
        rt_log["session_active"] = list(sess)
        # 終了条件 ①: 全サービス・LLM が待機
        if not any(states.values()):
            await _rtl_stop(reason="auto_idle")
            return
        # 終了条件 ②: セッション中に活動したサービスが停止（異常終了）
        stopped_map = {"whisper": w_stopped, "tts": t_stopped, "ocr": o_stopped, "llm": False}
        for k in sess:
            if stopped_map[k]:
                await _rtl_stop(reason=f"auto_stopped:{k}")
                break
    # 状態遷移を記録（次の遷移検知用）
    for k in states:
        _auto_rtl_prev[k] = states[k]


@app.get("/api/v1/realtime-log")
async def api_rtlog_list():
    """ログ一覧（各ファイルの要約 + 現在の active 状態）。認証なしで閲覧可。"""
    files: List[dict] = []
    if RT_LOG_DIR.exists():
        for path in sorted(RT_LOG_DIR.glob("realtime_*.jsonl"), reverse=True):
            files.append(_rt_parse_meta(path))
    active = None
    if rt_log["active"]:
        active = {
            "filename": rt_log["path"].name if rt_log["path"] else None,
            "started_at": datetime.fromtimestamp(rt_log["start_ts"]).isoformat() if rt_log["start_ts"] else None,
            "samples": rt_log["samples"],
            "whisper_model": rt_log["whisper_model"],
            "auto": rt_log.get("auto", False),
        }
    return {"active": active, "files": files}


@app.get("/api/v1/realtime-log/{filename}")
async def api_rtlog_content(filename: str):
    """JSONL 内容をそのまま返す（PlainText）。AI が json.loads で 1 行ずつ解析可能。"""
    if not _RTLOG_NAME_RE.match(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    path = RT_LOG_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="not found")
    return PlainTextResponse(path.read_text(encoding="utf-8", errors="ignore"))


@app.delete("/api/v1/realtime-log/{filename}", dependencies=[Depends(require_auth)])
async def api_rtlog_delete(filename: str):
    """ログファイル削除。記録中のファイルは削除不可。"""
    if not _RTLOG_NAME_RE.match(filename):
        raise HTTPException(status_code=400, detail="invalid filename")
    if rt_log["active"] and rt_log["path"] and rt_log["path"].name == filename:
        raise HTTPException(status_code=409, detail="active log cannot be deleted")
    path = RT_LOG_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="not found")
    path.unlink()
    return {"success": True}


class RtLogBatchDeletePayload(BaseModel):
    files: List[str]


@app.post("/api/v1/realtime-log/batch-delete", dependencies=[Depends(require_auth)])
async def api_rtlog_batch_delete(payload: RtLogBatchDeletePayload):
    """選択したログファイルを一括削除。記録中・存在しない・不正な名前は skipped に集約。"""
    deleted: List[str] = []
    skipped: List[str] = []
    for filename in dict.fromkeys(payload.files):   # 重複除去・順序維持
        if not _RTLOG_NAME_RE.match(filename):
            skipped.append(filename)
            continue
        if rt_log["active"] and rt_log["path"] and rt_log["path"].name == filename:
            skipped.append(filename)
            continue
        path = RT_LOG_DIR / filename
        if not path.exists():
            skipped.append(filename)
            continue
        try:
            path.unlink()
            deleted.append(filename)
        except OSError:
            skipped.append(filename)
    return {"success": True, "deleted": deleted, "skipped": skipped}


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
# チャット API（リアルタイム音声出力対応）
# ---------------------------------------------------------------------------
CHAT_SYSTEM_PROMPT = "あなたは親切で簡潔な日本語アシスタントです。会話は短く分かりやすく答えてください。"
_SENT_STREAM_RE = re.compile(r"[^。！？.!?]*[。！？.!?]")

_chat_sessions: Dict[str, dict] = {}
_chat_sessions_lock = threading.Lock()
_CHAT_SESSION_MAX = 20       # 1 セッションあたり保持するターン数（上限）
_CHAT_SESSION_TTL = 1800     # 未使用 30 分でセッション破棄


def _chat_session_get(session_id: str) -> list:
    """セッション履歴を返す（返り値は編集用のコピー）。期限切れは掃除する。"""
    now = time.time()
    with _chat_sessions_lock:
        expired = [k for k, v in _chat_sessions.items() if now - v["updated"] > _CHAT_SESSION_TTL]
        for k in expired:
            _chat_sessions.pop(k, None)
        s = _chat_sessions.setdefault(session_id, {"history": [], "updated": now})
        s["updated"] = now
        return list(s["history"])


def _chat_session_save(session_id: str, history: list):
    """セッション履歴を保存（メッセージ数を上限に抑える）。"""
    with _chat_sessions_lock:
        _chat_sessions[session_id]["history"] = history[-_CHAT_SESSION_MAX * 2:]
        _chat_sessions[session_id]["updated"] = time.time()


async def _chat_llm_config() -> dict:
    """アクティブな LLM 設定を返す（プロファイル同期済みの deepseek_* config を読む）。"""
    api_key = (await get_config("deepseek_api_key") or "").strip()
    model = (await get_config("deepseek_model") or "").strip() or "deepseek-chat"
    base_url = (await get_config("deepseek_base_url") or "").strip() or "https://api.deepseek.com/v1"
    base_url = base_url.rstrip("/")
    from urllib.parse import urlsplit
    if not base_url or urlsplit(base_url).scheme not in ("http", "https") or not urlsplit(base_url).netloc:
        raise HTTPException(400, "LLM base_url が未設定です（設定→AI校正で設定してください）")
    return {"api_key": api_key, "model": model, "base_url": base_url}


async def _chat_llm_stream(cfg: dict, messages: list):
    """OpenAI 互換エンドポイントへストリーミング問い合わせし、テキスト断片を逐次 yield する。"""
    payload = {"model": cfg["model"], "messages": messages, "stream": True, "temperature": 0.7}
    headers = {"Content-Type": "application/json"}
    if cfg["api_key"]:
        headers["Authorization"] = f"Bearer {cfg['api_key']}"
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{cfg['base_url']}/chat/completions", json=payload, headers=headers,
            timeout=aiohttp.ClientTimeout(total=300),
        ) as resp:
            if resp.status != 200:
                body = (await resp.text())[:300]
                raise RuntimeError(f"LLM HTTP {resp.status}: {body}")
            async for line in resp.content:
                line = line.decode("utf-8", errors="replace").strip()
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                try:
                    obj = json.loads(data)
                except Exception:
                    continue
                choices = obj.get("choices") or []
                if choices:
                    delta = choices[0].get("delta") or {}
                    c = delta.get("content")
                    if c:
                        yield c


def _sse(obj: dict) -> str:
    return f"data: {json.dumps(obj, ensure_ascii=False)}\n\n"


_B64_CHUNK = 200_000          # SSE 1 行あたりの base64 文字数（クライアントの行長上限 512KB を回避）
_AUDIO_MAX_CHARS = 80         # 1 回の音声合成あたりの最大文字数


def _split_utterance(sent: str, max_chars: int = _AUDIO_MAX_CHARS) -> list:
    """読み上げ用に文を分割する。読点・区切りを優先し、足りなければ文字数で分割。"""
    pieces = []
    cur = ""
    for ch in sent:
        cur += ch
        if (len(cur) >= 16 and ch in "、，,;：") or len(cur) >= max_chars:
            pieces.append(cur)
            cur = ""
    if cur.strip():
        pieces.append(cur)
    return [p.strip() for p in pieces if p.strip()]


async def _chat_emit_audio_lines(engine: str, lang: str, device: str, model_path, voice: str, piece: str) -> list:
    """読み上げ片を音声合成し SSE イベント行のリストを返す。

    大きな音声は base64 を複数チャンク（audio_chunk）に分割して送る:
      audio_start → audio_chunk × N → audio_end
    失敗時は audio_skip を 1 行返す（テキストのみ再生）。
    """
    try:
        if engine == "edge":
            r = await _tts_edge(piece, lang)
            b64, mime, dur = r["audio_base64"], r["mime"], r.get("duration", 0)
        else:
            result = await asyncio.to_thread(
                tts_synthesize, engine, piece, lang, device, model_path=model_path, voice=voice)
            b64 = base64.b64encode(result["wav_bytes"]).decode("ascii")
            mime, dur = result["mime"], result["duration"]
    except Exception as e:
        print(f"[chat] tts failed for sentence: {e}")
        return [_sse({"type": "audio_skip", "text": piece})]
    lines = [_sse({"type": "audio_start", "text": piece, "mime": mime, "duration": dur})]
    for i in range(0, len(b64), _B64_CHUNK):
        lines.append(_sse({"type": "audio_chunk", "data": b64[i:i + _B64_CHUNK]}))
    lines.append(_sse({"type": "audio_end"}))
    return lines


@app.post("/api/v1/chat", dependencies=[Depends(require_auth)])
async def api_chat(data: dict):
    """チャット（非ストリーミング）。`{"message":"...","session_id":"..."}` → `{"reply":"...","session_id":"..."}`。

    session_id を省略すると新しいセッションが作られる。LLM はアクティブプロファイル（Deepseek / Ollama 等）。
    """
    message = str(data.get("message", "")).strip()
    if not message:
        raise HTTPException(400, "message is required")
    sid = str(data.get("session_id", "")).strip() or secrets.token_urlsafe(12)
    history = _chat_session_get(sid)
    messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}] + history + [{"role": "user", "content": message}]
    cfg = await _chat_llm_config()
    payload = {"model": cfg["model"], "messages": messages, "stream": False, "temperature": 0.7}
    headers = {"Content-Type": "application/json"}
    if cfg["api_key"]:
        headers["Authorization"] = f"Bearer {cfg['api_key']}"
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{cfg['base_url']}/chat/completions", json=payload, headers=headers,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as resp:
                if resp.status != 200:
                    raise RuntimeError(f"LLM HTTP {resp.status}: {(await resp.text())[:300]}")
                data = await resp.json()
        reply = (data["choices"][0]["message"]["content"] or "").strip()
    except Exception as e:
        raise HTTPException(502, f"chat failed: {e}")
    _chat_session_save(sid, history + [
        {"role": "user", "content": message},
        {"role": "assistant", "content": reply},
    ])
    return {"reply": reply, "session_id": sid}


@app.post("/api/v1/chat/stream", dependencies=[Depends(require_auth)])
async def api_chat_stream(data: dict):
    """チャット（SSE ストリーミング＋文単位リアルタイム音声）。

    イベント（`data: {json}`）:
      - `{"type":"text","text":...}`     現在までのテキスト（表示用・蓄積更新）
      - `{"type":"audio_start","text":...,"mime":...,"duration":...}` 読み上げ片の開始
      - `{"type":"audio_chunk","data":...}` base64 音声チャンク（audio_end まで連結）
      - `{"type":"audio_end"}` 読み上げ片の終わり（ここまでで WAV が完成）
      - `{"type":"audio_skip","text":...}` 音声合成失敗（テキストのみ再生）
      - `{"type":"done","full":...,"session_id":...}` 完了
      - `{"type":"error","message":...}` エラー
    """
    message = str(data.get("message", "")).strip()
    if not message:
        raise HTTPException(400, "message is required")
    sid = str(data.get("session_id", "")).strip() or secrets.token_urlsafe(12)
    lang = str(data.get("lang", "") or "").split("-")[0].lower()
    voice = str(data.get("voice", "") or "").strip()
    history = _chat_session_get(sid)
    messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}] + history + [{"role": "user", "content": message}]
    cfg = await _chat_llm_config()

    # 音声出力設定
    engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    model_path = None
    if engine == "kokoro":
        model_path = _kokoro_model_dir()
    elif engine == "vibevoice":
        model_path = _vibevoice_snapshot_path(VIBEVOICE_MODEL_CATALOG["realtime"]["repo"])
    if not voice:
        voice = (await get_config("tts_kokoro_voice", "jf_alpha") or "jf_alpha").strip()
    pref = (await get_config("tts_device", "auto") or "auto").strip().lower()
    device = _pick_tts_device(engine, pref)
    if engine not in ("edge",):
        _touch_engine(engine)

    async def gen():
        full = []
        buf = ""
        try:
            async for token in _chat_llm_stream(cfg, messages):
                full.append(token)
                buf += token
                yield _sse({"type": "text", "text": buf})
                # 文末（。！？.!?）で区切って逐次音声合成
                while True:
                    m = _SENT_STREAM_RE.search(buf)
                    if not m:
                        break
                    sent = m.group(0).strip()
                    buf = buf[m.end():]
                    if not sent:
                        continue
                    for piece in _split_utterance(sent):
                        for line in await _chat_emit_audio_lines(engine, lang, device, model_path, voice, piece):
                            yield line
            # 文末記号なしで終わった残りを読み上げ
            tail = buf.strip()
            if tail:
                for piece in _split_utterance(tail):
                    for line in await _chat_emit_audio_lines(engine, lang, device, model_path, voice, piece):
                        yield line
            reply = "".join(full).strip()
            _chat_session_save(sid, history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": reply},
            ])
            yield _sse({"type": "done", "full": reply, "session_id": sid})
        except Exception as e:
            print(f"[chat] stream error: {e}")
            yield _sse({"type": "error", "message": str(e)})

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.delete("/api/v1/chat/{session_id}", dependencies=[Depends(require_auth)])
async def api_chat_clear(session_id: str):
    """指定セッションの履歴をクリアする。"""
    with _chat_sessions_lock:
        _chat_sessions.pop(session_id, None)
    return {"success": True}


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
    provider = str(data.get("provider", "")).strip()
    if not name or not base_url:
        return {"success": False, "error": "name and base_url are required"}
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute(
            "INSERT INTO llm_profiles (name, base_url, api_key, model, provider, created_at) VALUES (?,?,?,?,?,?)",
            (name, base_url, api_key, model, provider, datetime.now().isoformat()),
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
        provider = str(data.get("provider", "")).strip() or row["provider"]
        if not name or not base_url:
            return {"success": False, "error": "name and base_url are required"}
        await db.execute(
            "UPDATE llm_profiles SET name=?, base_url=?, api_key=?, model=?, provider=? WHERE id=?",
            (name, base_url, api_key, model, provider, profile_id),
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


@app.get("/api/v1/llm/ollama/models", dependencies=[Depends(require_auth)])
async def api_ollama_models(base_url: str = "http://localhost:11434/v1"):
    """Ollama のモデル一覧を取得（/api/tags をバックエンド経由でプロキシ）。

    ブラウザ（LAN 側）から NAS 上の localhost:11434 へは届かないため、
    Dashboard バックエンドが Ollama へ直接問い合わせてモデル名のリストを返す。
    """
    import aiohttp
    try:
        base_url = validate_base_url(base_url)
    except HTTPException:
        base_url = ""
    if not base_url:
        return {"success": False, "error": "invalid base_url"}
    try:
        _assert_private_host(base_url)
    except HTTPException as e:
        return {"success": False, "error": e.detail}
    root = base_url.rstrip("/")
    if root.endswith("/v1"):
        root = root[:-3]
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{root}/api/tags",
                timeout=aiohttp.ClientTimeout(total=8),
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    models = sorted(m.get("name", "") for m in data.get("models", []) if m.get("name"))
                    return {"success": True, "models": models}
                return {"success": False, "error": f"Ollama HTTP {resp.status}"}
    except Exception as e:
        return {"success": False, "error": str(e)[:120]}


# ---------------------------------------------------------------------------
# 詳細結果の読み上げ（Microsoft Edge TTS / 女性ニューラル音声）
# ---------------------------------------------------------------------------
# 言語（ISO 639-1）→ Edge TTS 女性音声。未対応言語は日本語女性音声にフォールバック
TTS_VOICES = {
    "ja": "ja-JP-NanamiNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
    "en": "en-US-JennyNeural",
    "ko": "ko-KR-SunHiNeural",
    "es": "es-ES-ElviraNeural",
    "fr": "fr-FR-DeniseNeural",
    "de": "de-DE-KatjaNeural",
    "ru": "ru-RU-SvetlanaNeural",
    "it": "it-IT-ElsaNeural",
    "pt": "pt-BR-FranciscaNeural",
    "id": "id-ID-GadisNeural",
    "vi": "vi-VN-HoaiMyNeural",
    "th": "th-TH-PremwadeeNeural",
    "tr": "tr-TR-EmelNeural",
    "nl": "nl-NL-FennaNeural",
    "pl": "pl-PL-ZofiaNeural",
}
TTS_MAX_CHARS = 5000  # 1 リクエストあたりの最大文字数（クライアント側で分割して連続再生）

# VibeVoice 用の空き VRAM しきい値。VibeVoice-Realtime-0.5B はロード時に ~4-5GB を使うため、
# 6GB 機で空きが少ない（Whisper 稼働中など）場合は CPU へ落とす。
VIBEVOICE_MIN_FREE_MB = 3000


def _pick_tts_device(engine: str, pref: str) -> str:
    """tts_device 設定（auto/cuda/cpu）に応じてローカル TTS の実行デバイスを決める。"""
    if pref == "cuda":
        return "cuda"
    if pref == "cpu":
        return "cpu"
    # ロード済みエンジンはそのデバイスを使い続ける（VRAM 残量の揺れで CPU/CUDA を
    # 往復してモデルを二重ロードしない。tts_local 側でも同様に維持する）
    loaded = loaded_device(engine)
    if loaded:
        return loaded
    # auto: 空き VRAM で判断。NVML が無い/空き不明なら CPU（安全側）
    info = get_gpu_info()
    if not info or "memory_free_mb" not in info:
        return "cpu"
    free_mb = info.get("memory_free_mb")
    if engine == "vibevoice" and free_mb < VIBEVOICE_MIN_FREE_MB:
        print(f"[tts] VibeVoice: 空きVRAM {free_mb}MB < {VIBEVOICE_MIN_FREE_MB}MB のため CPU で実行")
        return "cpu"
    return "cuda"


# ローカル TTS エンジンのアイドルアンロード（VRAM を Whisper に返す）。
# 300→1800 秒に延長: 音読みの初回レスポンスが遅い（VibeVoice は冷間ロードで ~40秒）原因だった。
# 30 分で自動解放するため長時間放置時の VRAM は常駐しない（VRAM 余裕は Whisper に戻る）。
TTS_IDLE_TTL = 1800
_tts_unload_tasks: Dict[str, asyncio.Task] = {}
# 起動時プリロードで常駐させたエンジン（アイドルアンロード対象外）
_resident_engines: set = set()


def _touch_engine(engine: str):
    """エンジン使用を記録し、アイドル TTL 後のアンロードを再スケジュール。

    起動時プリロードした常駐エンジンはアンロードしない（以後 VRAM に載せ続ける）。
    """
    if engine in _resident_engines:
        return
    t = _tts_unload_tasks.pop(engine, None)
    if t:
        t.cancel()
    _tts_unload_tasks[engine] = asyncio.create_task(_delayed_unload(engine))


async def _delayed_unload(engine: str):
    try:
        await asyncio.sleep(TTS_IDLE_TTL)
    except asyncio.CancelledError:
        return
    await asyncio.to_thread(tts_unload, engine)
    _tts_unload_tasks.pop(engine, None)
    print(f"[tts] {engine} をアンロード（VRAM 解放）")


async def preload_local_tts():
    """起動時プリロード: tts_preload=on かつローカルエンジンなら合成なしでモデルを VRAM に読込・常駐。

    バックグラウンドタスクとして実行するため、ダッシュボードの起動はブロックしない。
    edge はクラウドのため対象外。失敗しても起動は継続する。
    """
    try:
        preload = (await get_config("tts_preload", "on") or "on").strip().lower()
        if preload != "on":
            return
        engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
        if engine == "edge":
            print("[tts] 起動時プリロード: edge はクラウドのため対象外")
            return
        pref = (await get_config("tts_device", "auto") or "auto").strip().lower()
        device = _pick_tts_device(engine, pref)
        model_path = None
        if engine == "kokoro":
            model_path = _kokoro_model_dir()
        elif engine == "vibevoice":
            model_path = _vibevoice_snapshot_path(VIBEVOICE_MODEL_CATALOG["realtime"]["repo"])
        await asyncio.to_thread(tts_load, engine, device, model_path=model_path)
        _resident_engines.add(engine)
        print(f"[tts] 起動時プリロード完了: {engine} を常駐（device={device}, model={model_path or 'HF'}）")
    except Exception as e:
        print(f"[tts] 起動時プリロード失敗（続行）: {e}")


class TTSRequest(BaseModel):
    text: str
    lang: str = ""


@app.post("/api/v1/tts", dependencies=[Depends(require_auth)])
async def api_tts(req: TTSRequest):
    """テキストを音声合成し、音声（base64）＋文境界情報を返却。

    TTS エンジンは config の `tts_engine` で切替（edge / kokoro / vibevoice）。
    edge は Microsoft Edge TTS（SentenceBoundary 付き）、
    ローカルエンジンは 24kHz WAV + `boundaries`（kokoro=実測 / vibevoice=比例推定）。
    フロントは再生位置に応じて該当文を下線ハイライトする。
    """
    text = (req.text or "").strip()
    if not text:
        raise HTTPException(400, "text is required")
    if len(text) > TTS_MAX_CHARS:
        raise HTTPException(400, f"text too long (max {TTS_MAX_CHARS} chars)")
    key = (req.lang or "").split("-")[0].lower()

    engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    if engine == "edge":
        return await _tts_edge(text, key)

    # ローカルエンジン
    ok, reason = engine_available(engine)
    if not ok:
        raise HTTPException(503, f"TTS engine '{engine}' が利用できません: {reason}")
    pref = (await get_config("tts_device", "auto") or "auto").strip().lower()
    device = _pick_tts_device(engine, pref)
    try:
        model_path = None
        voice = None
        if engine == "kokoro":
            # ローカルモデルがあれば完全オフラインで使用（無ければ HF から）
            model_path = _kokoro_model_dir()
            voice = (await get_config("tts_kokoro_voice", "jf_alpha") or "jf_alpha").strip()
        elif engine == "vibevoice":
            # VibeVoice-TTS(1.5B) は英語/中国語のみ・CPUのみ・合成未対応のため、
            # 選択されていても合成は常に Realtime-0.5B を使う（DL 管理・選択UIのみ対応）
            vv = (await get_config("tts_vibevoice_model", "realtime") or "realtime").strip().lower()
            if vv != "realtime":
                print(f"[tts] VibeVoice-TTS は合成未対応（英語/中国語・CPUのみ）のため Realtime-0.5B を使用")
            model_path = _vibevoice_snapshot_path(VIBEVOICE_MODEL_CATALOG["realtime"]["repo"])
        result = await asyncio.to_thread(tts_synthesize, engine, text, key, device, model_path=model_path, voice=voice)
        return {
            "audio_base64": base64.b64encode(result["wav_bytes"]).decode("ascii"),
            "mime": result["mime"],
            "duration": result["duration"],
            "boundaries": result["boundaries"],
            "boundaries_approx": result["boundaries_approx"],
        }
    except Exception as e:
        print(f"[tts] {engine} error: {e}")
        raise HTTPException(502, f"{engine} synthesis failed: {e}")
    finally:
        # 失敗時も読込済みモデルを TTL アンロード対象に載せる（VRAM 常駐リーク防止）
        _touch_engine(engine)


async def _tts_status_dict() -> dict:
    """TTS 状態（ダッシュボード内蔵のため、常駐/読込状態のみが管理対象）。"""
    engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    device = (await get_config("tts_device", "auto") or "auto").strip().lower()
    active = loaded_device(engine)  # 読込済みなら device、未読込なら None
    ok, reason = engine_available(engine)
    return {
        "engine": engine,
        "device": device,
        "active_device": active,
        "loaded": active is not None,
        "resident": engine in _resident_engines,
        "available": ok,
        "reason": reason if not ok else None,
    }


@app.get("/api/v1/tts/status")
async def api_tts_status():
    """TTS サービス状態（ダッシュボード内蔵のため開始/停止はモデルの読込/解放に対応）。"""
    return await _tts_status_dict()


@app.post("/api/v1/tts/preload", dependencies=[Depends(require_auth)])
async def api_tts_preload():
    """ローカル TTS モデル（kokoro / vibevoice）を VRAM に読込・常駐させる。edge はクラウドのため対象外。"""
    engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    if engine == "edge":
        return {"success": False, "message": "edge はクラウド TTS のため読込対象外"}
    ok, reason = engine_available(engine)
    if not ok:
        return {"success": False, "message": f"TTS engine '{engine}' が利用できません: {reason}"}
    pref = (await get_config("tts_device", "auto") or "auto").strip().lower()
    device = _pick_tts_device(engine, pref)
    model_path = None
    if engine == "kokoro":
        model_path = _kokoro_model_dir()
    elif engine == "vibevoice":
        model_path = _vibevoice_snapshot_path(VIBEVOICE_MODEL_CATALOG["realtime"]["repo"])
    try:
        await asyncio.to_thread(tts_load, engine, device, model_path=model_path)
        _resident_engines.add(engine)
        print(f"[tts] 手動プリロード: {engine} を常駐（device={device}）")
        return {"success": True, "engine": engine, "device": device}
    except Exception as e:
        print(f"[tts] プリロード失敗: {e}")
        return {"success": False, "message": f"preload failed: {e}"}


@app.post("/api/v1/tts/unload", dependencies=[Depends(require_auth)])
async def api_tts_unload():
    """ローカル TTS モデルを解放し VRAM を返す（常駐解除 + アイドル解放タスクのキャンセル）。"""
    engine = (await get_config("tts_engine", "edge") or "edge").strip().lower()
    _resident_engines.discard(engine)
    t = _tts_unload_tasks.pop(engine, None)
    if t:
        t.cancel()
    try:
        await asyncio.to_thread(tts_unload, engine)
    except Exception as e:
        print(f"[tts] アンロード失敗: {e}")
        return {"success": False, "message": f"unload failed: {e}"}
    print(f"[tts] 手動アンロード: {engine} を解放")
    return {"success": True, "engine": engine}


@app.post("/api/v1/tts/reload", dependencies=[Depends(require_auth)])
async def api_tts_reload():
    """TTS エンジンを再初期化（アンロード → プリロード）。"""
    await api_tts_unload()
    return await api_tts_preload()


async def _tts_edge(text: str, key: str) -> dict:
    """Edge TTS（既定・フォールバック）で音声合成。MP3 base64 + SentenceBoundary を返す。"""
    voice = TTS_VOICES.get(key, TTS_VOICES["ja"])
    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_parts = []
        boundaries = []  # {t: 開始秒, d: 継続秒}
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_parts.append(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                boundaries.append({
                    "t": round(chunk.get("offset", 0) / 1e7, 3),
                    "d": round(chunk.get("duration", 0) / 1e7, 3),
                })
        audio_b64 = base64.b64encode(b"".join(audio_parts)).decode("ascii")
        duration = round((boundaries[-1]["t"] + boundaries[-1]["d"]), 3) if boundaries else 0.0
        return {
            "audio_base64": audio_b64,
            "mime": "audio/mpeg",
            "duration": duration,
            "boundaries": boundaries,
        }
    except Exception as e:
        print(f"[tts] Edge TTS error: {e}")
        raise HTTPException(502, f"Edge TTS synthesis failed: {e}")


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
    p = await asyncio.to_thread(start_whisper_process)
    return {"success": True, "message": "Whisper started", "pid": p.pid}


@app.post("/api/v1/whisper/stop", dependencies=[Depends(require_auth)])
async def api_whisper_stop():
    await reset_conversion_state()
    # stop_whisper_process は最大 ~8 秒ブロックするためイベントループを塞がない
    await asyncio.to_thread(stop_whisper_process)
    return {"success": True, "message": "Whisper stop requested"}


@app.post("/api/v1/whisper/restart", dependencies=[Depends(require_auth)])
async def api_whisper_restart():
    # 重启会中断当前转换：先清除卡死的"转换中"状态，避免 UI 一直显示转换中
    await reset_conversion_state()
    await asyncio.to_thread(stop_whisper_process)
    await asyncio.sleep(1)
    p = await asyncio.to_thread(start_whisper_process)
    return {"success": True, "message": "Whisper restarted", "pid": p.pid}


# ---------------------------------------------------------------------------
# PaddleOCR 控制
# ---------------------------------------------------------------------------
@app.post("/api/v1/ocr/start", dependencies=[Depends(require_auth)])
async def api_ocr_start():
    proc = await asyncio.to_thread(find_ocr_process)
    if proc:
        return {"success": True, "message": "OCR already running", "pid": proc["pid"]}
    p = await asyncio.to_thread(start_ocr_process)
    return {"success": True, "message": "OCR started", "pid": p.pid}


@app.post("/api/v1/ocr/stop", dependencies=[Depends(require_auth)])
async def api_ocr_stop():
    # stop_ocr_process は最大 ~8 秒ブロックするためイベントループを塞がない
    await asyncio.to_thread(stop_ocr_process)
    return {"success": True, "message": "OCR stop requested"}


@app.post("/api/v1/ocr/restart", dependencies=[Depends(require_auth)])
async def api_ocr_restart():
    await asyncio.to_thread(stop_ocr_process)
    await asyncio.sleep(1)
    p = await asyncio.to_thread(start_ocr_process)
    return {"success": True, "message": "OCR restarted", "pid": p.pid}


@app.get("/api/v1/ocr/status", dependencies=[Depends(require_auth)])
async def api_ocr_status():
    health = await ocr_health()
    proc_info = find_ocr_process()
    return {
        "running": health is not None,
        "managed": True,  # Dashboard が管理するサービス（autostart は個別設定）
        "health": health,
        "process": proc_info,
    }


@app.post("/api/v1/ocr/run", dependencies=[Depends(require_auth)])
async def api_ocr_run(file: UploadFile = File(...), lang: Optional[str] = Form(None)):
    """画像 OCR（PP-OCRv5）を OCR サービスへフォワード。"""
    return await _proxy_ocr("/ocr", file, lang)


@app.post("/api/v1/ocr/pdf", dependencies=[Depends(require_auth)])
async def api_ocr_pdf(file: UploadFile = File(...), lang: Optional[str] = Form(None)):
    """PDF/画像 → Markdown（PP-StructureV3）を OCR サービスへフォワード。"""
    return await _proxy_ocr("/pdf", file, lang)


@app.post("/api/v1/ocr/convert", dependencies=[Depends(require_auth)])
async def api_ocr_convert(
    file: UploadFile = File(...),
    lang: Optional[str] = Form(None),
    format: str = Form("md"),       # md | txt
    ai_correct: str = Form("off"),  # on | off
):
    """OCR 実行（自動判定・出力形式・AI校正・履歴記録）。

    ファイル拡張子で画像/PDF を自動判定し、MD/TXT 出力、AI 校正（whisper_server /correct）
    に対応。完了後は変換履歴（records）へ記録する。音声時間=0（UI で「-」表示）、
    変換速度=変換時間/ページ数の平均値を返す。
    """
    filename = (file.filename or "upload").lower()
    is_pdf = filename.endswith(".pdf")
    t0 = time.time()
    if is_pdf:
        data = await _proxy_ocr_json("/pdf", file, lang)
        raw_text = data.get("markdown") or ""
        pages = int(data.get("pages") or 1)
    else:
        data = await _proxy_ocr_json("/ocr", file, lang)
        raw_text = data.get("text") or ""
        pages = 1

    fmt = (format or "md").strip().lower()
    result_text = raw_text if fmt != "txt" else _markdown_to_text(raw_text)

    # AI 校正（whisper_server /correct。未設定時は原文のまま・エラー時も続行）
    correct_elapsed = 0.0
    llm_model = None
    if ai_correct == "on":
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{WHISPER_URL}/correct",
                    json={"text": result_text},
                    timeout=aiohttp.ClientTimeout(total=180),
                ) as resp:
                    if resp.status == 200:
                        cdata = await resp.json()
                        corrected = cdata.get("result")
                        if corrected and corrected != result_text:
                            result_text = corrected
                        llm_model = cdata.get("llm_model")
                        correct_elapsed = round(float(cdata.get("correct_elapsed") or 0), 2)
        except Exception as e:
            print(f"[ocr] AI correction failed: {e}")

    elapsed = round(time.time() - t0, 2)
    speed = round(elapsed / pages, 2) if pages > 0 else None

    try:
        await add_record({
            "filename": file.filename or filename,
            "duration": 0.0,
            "language": lang or "auto",
            "output_format": fmt,
            "summary": " ".join(result_text.split())[:200],
            "result": result_text,
            "raw_result": raw_text,
            "timestamp": datetime.now().isoformat(),
            "elapsed_seconds": elapsed,
            "model": "paddleocr",
            "source": "ocr",
            "pages": pages,
            "llm_model": llm_model,
            "correct_elapsed": correct_elapsed,
        })
        await broadcast({"type": "record_added"})
    except Exception as e:
        print(f"[ocr] record save failed: {e}")

    return {
        "success": True,
        "text": result_text,
        "format": fmt,
        "pages": pages,
        "elapsed": elapsed,
        "speed": speed,
        "corrected": correct_elapsed > 0,
        "llm_model": llm_model,
    }


# faster-whisper 1.2.1 対応モデルカタログ（Qiita: https://qiita.com/taiki_i/items/3d2d0d0b2dd79059f30e を参考）
# vram_fp16 / vram_int8: CTranslate2 推論時の VRAM 目安（GB、CUDA コンテキスト等は除く）
# disk_gb: HuggingFace からのダウンロードサイズ目安。lang: multi=多言語 / en=英語専用
MODEL_CATALOG = {
    "tiny":             {"vram_fp16": 0.4, "vram_int8": 0.2, "disk_gb": 0.1,  "lang": "multi", "desc": "最速・最低精度"},
    "tiny.en":          {"vram_fp16": 0.4, "vram_int8": 0.2, "disk_gb": 0.1,  "lang": "en",    "desc": "英語専用・最速"},
    "base":             {"vram_fp16": 0.7, "vram_int8": 0.4, "disk_gb": 0.1,  "lang": "multi", "desc": "高速・軽量"},
    "base.en":          {"vram_fp16": 0.7, "vram_int8": 0.4, "disk_gb": 0.1,  "lang": "en",    "desc": "英語専用・軽量"},
    "small":            {"vram_fp16": 1.5, "vram_int8": 0.8, "disk_gb": 0.5,  "lang": "multi", "desc": "バランス型"},
    "small.en":         {"vram_fp16": 1.5, "vram_int8": 0.8, "disk_gb": 0.5,  "lang": "en",    "desc": "英語専用・バランス"},
    "distil-small.en":  {"vram_fp16": 0.9, "vram_int8": 0.5, "disk_gb": 0.3,  "lang": "en",    "desc": "蒸留・高速（英語）"},
    "medium":           {"vram_fp16": 5.0, "vram_int8": 2.5, "disk_gb": 1.5,  "lang": "multi", "desc": "高精度（標準）"},
    "medium.en":        {"vram_fp16": 5.0, "vram_int8": 2.5, "disk_gb": 1.5,  "lang": "en",    "desc": "英語専用・高精度"},
    "distil-medium.en": {"vram_fp16": 2.5, "vram_int8": 1.3, "disk_gb": 0.8,  "lang": "en",    "desc": "蒸留・高速（英語）"},
    "large-v1":         {"vram_fp16": 9.5, "vram_int8": 5.0, "disk_gb": 3.0,  "lang": "multi", "desc": "旧世代・最大規模"},
    "large-v2":         {"vram_fp16": 9.5, "vram_int8": 5.0, "disk_gb": 3.0,  "lang": "multi", "desc": "高精度（記事掲載の定番）"},
    "large-v3":         {"vram_fp16": 9.5, "vram_int8": 5.0, "disk_gb": 3.0,  "lang": "multi", "desc": "最新・最高精度（Qiita 推奨）"},
    "large":            {"vram_fp16": 9.5, "vram_int8": 5.0, "disk_gb": 3.0,  "lang": "multi", "desc": "large-v3 へのエイリアス"},
    "distil-large-v2":  {"vram_fp16": 4.9, "vram_int8": 2.5, "disk_gb": 1.5,  "lang": "multi", "desc": "蒸留・高速（精度-1%）"},
    "distil-large-v3":  {"vram_fp16": 4.9, "vram_int8": 2.5, "disk_gb": 1.5,  "lang": "multi", "desc": "蒸留・高速（精度-1%）"},
    "large-v3-turbo":   {"vram_fp16": 5.2, "vram_int8": 2.8, "disk_gb": 1.6,  "lang": "multi", "desc": "turbo 高速・高精度"},
    "turbo":            {"vram_fp16": 5.2, "vram_int8": 2.8, "disk_gb": 1.6,  "lang": "multi", "desc": "large-v3-turbo のエイリアス"},
}
ALLOWED_MODELS = list(MODEL_CATALOG)

# Whisper モデルDL時の対象ファイル（HF リポジトリ内）
_WHISPER_ALLOW_PATTERNS = ["config.json", "preprocessor_config.json", "model.bin", "tokenizer.json", "vocabulary.*"]

# VibeVoice モデルカタログ（モデル管理・DL 対象）。合成は realtime のみ対応
# （tts は英語/中国語のみ・CPUのみ・合成未対応 → 常に realtime にフォールバック）
VIBEVOICE_MODEL_CATALOG = {
    "realtime": {
        "repo": "microsoft/VibeVoice-Realtime-0.5B",
        "disk_gb": 1.9,
        "lang": "ja・en・zh・ko・de・fr・it・nl・pl・pt・es",
        "desc": "高速ストリーミング（0.5B・日本語含む）",
        "marker": "model.safetensors",
    },
    "tts": {
        "repo": "microsoft/VibeVoice-1.5B",
        "disk_gb": 5.0,
        "lang": "en・zh",
        "desc": "長文TTS（1.5B・英語/中国語のみ・CPUのみ・合成非対応）",
        "marker": "model.safetensors.index.json",
    },
}
# VibeVoice モデルDL時の対象ファイル（figures 等を除外）
_VIBEVOICE_ALLOW_PATTERNS = ["model*", "config.json", "preprocessor_config.json", "README.md", ".gitattributes"]

# Kokoro モデル（オフライン TTS）の DL 情報
KOKORO_MODEL_REPO = "hexgrad/Kokoro-82M"
# モデル管理で DL 対象とする日本語音声（女声4 + 男声1）
KOKORO_VOICES = ["jf_alpha", "jf_gongitsune", "jf_nezumi", "jf_tebukuro", "jm_kumo"]

# PaddleOCR モデル（PaddleX 経由・HF リポジトリ PaddlePaddle/<name>）。
# 保存先は models/paddlex/official_models/<name>/（PADDLE_PDX_CACHE_HOME で制御）。
# disk_gb は現環境の実測値（~/.paddlex/official_models を移行した際の容量）。
PADDLEOCR_MODEL_CATALOG = {
    "PP-OCRv5_server_det": {"disk_gb": 0.08, "desc": "文字検出（OCR）"},
    "PP-OCRv5_server_rec": {"disk_gb": 0.08, "desc": "文字認識（OCR）"},
    "PP-OCRv6_medium_det": {"disk_gb": 0.06, "desc": "文字検出（構造解析用）"},
    "PP-OCRv6_medium_rec": {"disk_gb": 0.07, "desc": "文字認識（構造解析用）"},
    "PP-DocLayout_plus-L": {"disk_gb": 0.12, "desc": "文書レイアウト解析"},
    "PP-DocBlockLayout": {"disk_gb": 0.12, "desc": "文書ブロックレイアウト"},
    "PP-LCNet_x1_0_doc_ori": {"disk_gb": 0.01, "desc": "文書向き判定"},
    "PP-LCNet_x1_0_textline_ori": {"disk_gb": 0.01, "desc": "行向き判定"},
    "PP-LCNet_x1_0_table_cls": {"disk_gb": 0.01, "desc": "表分類"},
    "RT-DETR-L_wired_table_cell_det": {"disk_gb": 0.12, "desc": "表セル検出（罫線あり）"},
    "RT-DETR-L_wireless_table_cell_det": {"disk_gb": 0.12, "desc": "表セル検出（罫線なし）"},
    "SLANeXt_wired": {"disk_gb": 0.34, "desc": "表構造解析（罫線あり）"},
    "SLANet_plus": {"disk_gb": 0.01, "desc": "表構造解析"},
    "PP-FormulaNet_plus-L": {"disk_gb": 0.68, "desc": "数式認識"},
    "UVDoc": {"disk_gb": 0.03, "desc": "UV 文書補正"},
}
PADDLEOCR_MODEL_MARKER = "inference.pdiparams"


def _resolve_model_dir(raw: str) -> Path:
    """設定値（空なら既定）からモデル保存先を解決して作成する。"""
    p = Path(raw.strip()).expanduser() if raw and raw.strip() else (BASE_DIR / "models")
    try:
        p.mkdir(parents=True, exist_ok=True)
    except Exception:
        pass
    return p


def get_model_dir_sync() -> Path:
    return _resolve_model_dir(get_config_sync("whisper_model_dir"))


async def get_model_dir() -> Path:
    return _resolve_model_dir(await get_config("whisper_model_dir"))


def _model_repo_dir(name: str, repo: str | None = None) -> str:
    """HuggingFace キャッシュ形式のリポジトリディレクトリ名。
    repo 指定なしは faster_whisper._MODELS から導出（whisper 用）。"""
    if not repo:
        try:
            from faster_whisper.utils import _MODELS
            repo = _MODELS.get(name, f"Systran/faster-whisper-{name}")
        except Exception:
            repo = f"Systran/faster-whisper-{name}"
    return f"models--{repo.replace('/', '--')}"


def _hf_cache_root() -> Path:
    """既定 HF キャッシュルート（HF_HOME 未設定時は ~/.cache/huggingface/hub）。"""
    env = os.environ.get("HF_HOME", "").strip()
    if env:
        return Path(env) / "hub"
    return Path.home() / ".cache" / "huggingface" / "hub"


def _model_snapshot_path(name: str, repo: str | None = None, marker: str = "model.bin", check_hf_cache: bool = False):
    """モデルのローカル snapshot ディレクトリを返す（未DL は None）。

    モデル保存先（whisper_server/models）→ 既定 HF キャッシュ（check_hf_cache=True 時）の順に探す。
    戻り値は from_pretrained に渡せるディレクトリパス（snapshots/<hash>/）。
    """
    roots = [get_model_dir_sync() / _model_repo_dir(name, repo)]
    if check_hf_cache:
        roots.append(_hf_cache_root() / _model_repo_dir(name, repo))
    for root in roots:
        snap = root / "snapshots"
        if not snap.is_dir():
            continue
        try:
            for s in snap.iterdir():
                if (s / marker).is_file() or any(s.glob("model*.safetensors")):
                    return str(s)
        except Exception:
            pass
    return None


def _vibevoice_snapshot_path(repo: str):
    """VibeVoice モデルのローカル snapshot パスを返す（未DL は None）。

    ① モデル管理の保存先（whisper_server/models）→ ② 既定 HF キャッシュ の順に探す。
    戻り値は from_pretrained に渡せるディレクトリパス（snapshots/<hash>/）。
    """
    return _model_snapshot_path("", repo=repo, marker="model.safetensors", check_hf_cache=True)


def _kokoro_model_dir() -> str | None:
    """Kokoro のローカルモデルディレクトリを返す（未配置は None）。

    models/kokoro/config.json + kokoro-v1_0.pth（＋ voices/）が存在すれば返す。
    これがあると hf_hub_download を呼ばず完全オフラインで動作する。
    """
    d = get_model_dir_sync() / "kokoro"
    if (d / "config.json").is_file() and (d / "kokoro-v1_0.pth").is_file():
        return str(d)
    return None


def _is_model_downloaded(name: str, repo: str | None = None, marker: str = "model.bin", check_hf_cache: bool = False) -> bool:
    """モデルがダウンロード済みか（snapshots/<hash>/<marker> の存在で判定）。
    check_hf_cache=True ならモデル保存先に加え既定 HF キャッシュも確認する。"""
    roots = [get_model_dir_sync() / _model_repo_dir(name, repo)]
    if check_hf_cache:
        roots.append(_hf_cache_root() / _model_repo_dir(name, repo))
    for root in roots:
        snap = root / "snapshots"
        if not snap.is_dir():
            continue
        try:
            for s in snap.iterdir():
                if (s / marker).is_file():
                    return True
        except Exception:
            pass
    return False


# ダウンロード状態（プロセス内保持）: name -> "none" / "downloading" / "done" / "error"
_download_state: Dict[str, str] = {}
# ダウンロード進捗（%）: name -> 0.0-100.0
_download_progress: Dict[str, float] = {}


def _download_model_sync(name: str, model_dir: Path, repo: str | None = None, allow_patterns: str | list | None = None):
    """モデルを保存先へダウンロード（HF キャッシュ形式）し、バイト進捗を記録する。

    huggingface_hub のファイルDL進捗バー（.utils.tqdm.tqdm）を一時パッチして
    `_download_progress[name]` に 0-100% を書き込む。ファイルは逐次 DL し、
    「完了済みファイルの合計バイト + 進行中ファイルの現在バイト」÷ 全体バイト
    で全体 % を計算する（snapshot_download のバーはファイル数のみでバイト精度が無いため）。

    repo / allow_patterns を省略すると whisper 用の既定値を使う（VibeVoice は
    モデル管理から repo / パターンを指定して呼ぶ）。
    """
    from huggingface_hub import HfApi, hf_hub_download
    import importlib
    # huggingface_hub.utils は同名クラスを再バインドするため importlib で実モジュールを取得
    _tqdm_mod = importlib.import_module("huggingface_hub.utils.tqdm")
    import fnmatch

    if not repo:
        try:
            from faster_whisper.utils import _MODELS
            repo = _MODELS.get(name, f"Systran/faster-whisper-{name}")
        except Exception:
            repo = f"Systran/faster-whisper-{name}"
    allow_patterns = allow_patterns or _WHISPER_ALLOW_PATTERNS

    # リポジトリの対象ファイル一覧と合計サイズを取得
    files = []
    for f in HfApi().list_repo_tree(repo, recursive=True):
        sz = getattr(f, "size", None)
        if sz is None:  # ディレクトリ等は除外
            continue
        if any(fnmatch.fnmatch(getattr(f, "path", ""), p) for p in allow_patterns):
            files.append((getattr(f, "path", ""), sz))
    grand_total = sum(sz for _, sz in files) or 1

    real_tqdm = _tqdm_mod.tqdm
    done = [0.0]  # 完了済みバイト（クロージャで共有）

    class _ByteBar(real_tqdm):
        def __init__(self, *args, **kwargs):
            # ヘッドレス実行では tqdm が自動無効化され self.n が進まないため強制有効化
            kwargs["disable"] = False
            super().__init__(*args, **kwargs)

        def display(self, *a, **k):
            pass  # レンダリングは行わず進捗捕捉のみ（ログを汚さない）

        def update(self, n=1):
            super().update(n)
            total = self.total or 0
            if total and grand_total:
                pct = min(99.0, (done[0] + self.n) / grand_total * 100)
                _download_progress[name] = round(pct, 1)

    _tqdm_mod.tqdm = _ByteBar
    try:
        _download_progress[name] = 0.0
        for path, _sz in files:
            hf_hub_download(repo, filename=path, cache_dir=str(model_dir))
            done[0] += _sz
    finally:
        _tqdm_mod.tqdm = real_tqdm
    _download_progress[name] = 100.0


async def download_model_task(name: str, repo: str | None = None, allow_patterns: str | list | None = None):
    """バックグラウンドでモデルを保存先へダウンロード（HF キャッシュ形式）。"""
    if _download_state.get(name) == "downloading":
        return
    _download_state[name] = "downloading"
    _download_progress[name] = 0.0
    try:
        print(f"[model] ダウンロード開始: {name} ({repo or 'whisper-default'})")
        await asyncio.to_thread(_download_model_sync, name, get_model_dir_sync(), repo, allow_patterns)
        _download_progress[name] = 100.0
        _download_state[name] = "done"
        print(f"[model] ダウンロード完了: {name}")
    except Exception as e:
        _download_state[name] = "error"
        print(f"[model] ダウンロード失敗 {name}: {e}")
        import traceback
        traceback.print_exc()


def _delete_model_repo(repo_dir_name: str) -> bool:
    """モデルのリポジトリフォルダを保存先と既定 HF キャッシュの両方から削除する。"""
    removed = False
    for root in (get_model_dir_sync(), _hf_cache_root()):
        target = root / repo_dir_name
        if target.is_dir():
            try:
                shutil.rmtree(target, ignore_errors=True)
                removed = True
            except Exception as e:
                print(f"[model] delete failed {target}: {e}")
    return removed


def _download_kokoro_sync(model_dir: Path, voices: list):
    """Kokoro モデル（config.json + kokoro-v1_0.pth + 日本語音声5種）を models/kokoro へ DL する。

    フラット配置（config.json / kokoro-v1_0.pth / voices/<name>.pt）で保存するので、
    `_kokoro_model_dir()` / tts_local がそのまま完全オフラインで使える。
    hf_hub_download の local_dir 指定でリポジトリ相対パスをそのまま保存する。
    """
    from huggingface_hub import HfApi, hf_hub_download
    import importlib
    _tqdm_mod = importlib.import_module("huggingface_hub.utils.tqdm")
    name = "kokoro"
    kokoro_dir = model_dir / "kokoro"
    kokoro_dir.mkdir(parents=True, exist_ok=True)
    (kokoro_dir / "voices").mkdir(parents=True, exist_ok=True)

    files = ["config.json", "kokoro-v1_0.pth"] + [f"voices/{v}.pt" for v in voices]
    # 対象ファイルの合計サイズを取得（進捗計算用）
    sizes = {}
    for f in HfApi().list_repo_tree(KOKORO_MODEL_REPO, recursive=True):
        if getattr(f, "size", None) is not None:
            sizes[getattr(f, "path", "")] = f.size
    grand_total = sum(sizes.get(f, 0) for f in files) or 1

    real_tqdm = _tqdm_mod.tqdm
    done = [0.0]

    class _ByteBar(real_tqdm):
        def __init__(self, *args, **kwargs):
            kwargs["disable"] = False
            super().__init__(*args, **kwargs)

        def display(self, *a, **k):
            pass  # 進捗捕捉のみ（ログを汚さない）

        def update(self, n=1):
            super().update(n)
            total = self.total or 0
            if total and grand_total:
                pct = min(99.0, (done[0] + self.n) / grand_total * 100)
                _download_progress[name] = round(pct, 1)

    _tqdm_mod.tqdm = _ByteBar
    try:
        _download_progress[name] = 0.0
        for f in files:
            hf_hub_download(KOKORO_MODEL_REPO, filename=f, local_dir=str(kokoro_dir))
            done[0] += sizes.get(f, 0)
    finally:
        _tqdm_mod.tqdm = real_tqdm
    _download_progress[name] = 100.0


async def _kokoro_download_task():
    """Kokoro モデルをバックグラウンドで保存先へダウンロードする。"""
    _download_state["kokoro"] = "downloading"
    _download_progress["kokoro"] = 0.0
    try:
        print(f"[model] ダウンロード開始: kokoro ({KOKORO_MODEL_REPO})")
        await asyncio.to_thread(_download_kokoro_sync, get_model_dir_sync(), KOKORO_VOICES)
        _download_state["kokoro"] = "done"
        print("[model] ダウンロード完了: kokoro")
    except Exception as e:
        _download_state["kokoro"] = "error"
        print(f"[model] ダウンロード失敗 kokoro: {e}")
        import traceback
        traceback.print_exc()


# ---------------------------------------------------------------------------
# PaddleOCR モデル管理（DL・状態・削除。保存先は <model_dir>/paddlex/official_models）
# ---------------------------------------------------------------------------
def _paddleocr_cache_dir() -> Path:
    """PaddleOCR モデルの PaddleX キャッシュディレクトリ（models/paddlex）。"""
    return get_model_dir_sync() / "paddlex"


def _paddleocr_model_dir(name: str) -> Path:
    """PaddleOCR モデルの official_models 内ディレクトリ。"""
    return _paddleocr_cache_dir() / "official_models" / name


def _paddleocr_model_downloaded(name: str) -> bool:
    """official_models/<name>/inference.pdiparams の存在で DL 済み判定。"""
    return (_paddleocr_model_dir(name) / PADDLEOCR_MODEL_MARKER).is_file()


def _download_paddleocr_sync(name: str):
    """PaddlePaddle/<name> を PaddleX と同じ保存先（official_models/<name>）へ DL。

    PaddleX は HF の snapshot_download(local_dir=...) で平置きするため、同じファイル
    群を hf_hub_download(filename=..., local_dir=...) で順に DL すれば同じ配置になる。
    進捗は huggingface_hub の tqdm をパッチし、ファイル毎の完了分を累積して
    単調増加で _download_progress へ書き込む（_download_kokoro_sync と同手法）。
    """
    import importlib
    from huggingface_hub import HfApi, hf_hub_download
    _tqdm_mod = importlib.import_module("huggingface_hub.utils.tqdm")
    key = f"paddleocr/{name}"
    repo = f"PaddlePaddle/{name}"
    out_dir = _paddleocr_model_dir(name)
    out_dir.mkdir(parents=True, exist_ok=True)

    # 対象ファイルの一覧と合計サイズを取得（進捗計算用）
    sizes = {}
    try:
        for f in HfApi().list_repo_tree(repo, recursive=True):
            if getattr(f, "size", None) is not None:
                sizes[getattr(f, "path", "")] = f.size
    except Exception:
        pass
    files = list(sizes.keys())
    if not files:
        # サイズ取得に失敗した場合のフォールバック（snapshot_download 相当）
        from huggingface_hub import snapshot_download
        snapshot_download(repo_id=repo, local_dir=str(out_dir))
        _download_progress[key] = 100.0
        return
    grand_total = sum(sizes.values()) or 1

    real_tqdm = _tqdm_mod.tqdm
    done = [0.0]

    class _ByteBar(real_tqdm):
        def __init__(self, *args, **kwargs):
            kwargs["disable"] = False
            super().__init__(*args, **kwargs)

        def display(self, *a, **k):
            pass  # 進捗捕捉のみ（ログを汚さない）

        def update(self, n=1):
            super().update(n)
            total = self.total or 0
            if total and grand_total:
                pct = min(99.0, (done[0] + self.n) / grand_total * 100)
                _download_progress[key] = round(pct, 1)

    _tqdm_mod.tqdm = _ByteBar
    try:
        _download_progress[key] = 0.0
        for f in files:
            hf_hub_download(repo, filename=f, local_dir=str(out_dir))
            done[0] += sizes.get(f, 0)
    finally:
        _tqdm_mod.tqdm = real_tqdm
    _download_progress[key] = 100.0


async def _paddleocr_download_task(name: str):
    """PaddleOCR モデルをバックグラウンドで official_models へダウンロードする。"""
    key = f"paddleocr/{name}"
    _download_state[key] = "downloading"
    _download_progress[key] = 0.0
    try:
        print(f"[model] ダウンロード開始: paddleocr {name} (PaddlePaddle/{name})")
        await asyncio.to_thread(_download_paddleocr_sync, name)
        _download_state[key] = "done"
        print(f"[model] ダウンロード完了: paddleocr {name}")
    except Exception as e:
        _download_state[key] = "error"
        print(f"[model] ダウンロード失敗 paddleocr {name}: {e}")
        import traceback
        traceback.print_exc()


@app.get("/api/v1/paddleocr/models")
async def api_paddleocr_models():
    """PaddleOCR 対応モデル一覧（DL サイズ・説明・DL状態）を返す。"""
    cache_dir = _paddleocr_cache_dir()
    catalog = {}
    for name, info in PADDLEOCR_MODEL_CATALOG.items():
        downloaded = _paddleocr_model_downloaded(name)
        state = _download_state.get(f"paddleocr/{name}")
        if state in (None, "none") and downloaded:
            state = "done"
        if state in (None, "none"):
            state = "none"
        catalog[name] = {
            **info,
            "downloaded": downloaded,
            "download_state": state,
            "download_progress": round(_download_progress.get(f"paddleocr/{name}", 0.0), 1),
            "path": str(_paddleocr_model_dir(name)) if downloaded else "",
        }
    # 合計サイズ（DL 済みモデルの実測）
    total = 0.0
    if (cache_dir / "official_models").is_dir():
        for d in (cache_dir / "official_models").iterdir():
            if d.is_dir():
                for f in d.rglob("*"):
                    try:
                        if f.is_file():
                            total += f.stat().st_size
                    except OSError:
                        pass
    return {
        "models": catalog,
        "cache_dir": str(cache_dir),
        "total_mb": round(total / 1048576, 1),
    }


@app.post("/api/v1/paddleocr/models/{name}/download", dependencies=[Depends(require_auth)])
async def api_paddleocr_download(name: str):
    """PaddleOCR モデルをバックグラウンドで official_models へダウンロードする。"""
    if name not in PADDLEOCR_MODEL_CATALOG:
        return {"success": False, "message": f"unknown paddleocr model: {name}"}
    if _paddleocr_model_downloaded(name):
        return {"success": False, "message": f"already downloaded: {name}"}
    if _download_state.get(f"paddleocr/{name}") == "downloading":
        return {"success": False, "message": f"already downloading: {name}"}
    asyncio.create_task(_paddleocr_download_task(name))
    return {"success": True, "message": f"downloading {name} (PaddlePaddle/{name})"}


@app.delete("/api/v1/paddleocr/models/{name}", dependencies=[Depends(require_auth)])
async def api_paddleocr_delete(name: str):
    """PaddleOCR モデルディレクトリ（official_models/<name>）を削除する。"""
    if name not in PADDLEOCR_MODEL_CATALOG:
        return {"success": False, "message": f"unknown paddleocr model: {name}"}
    if _download_state.get(f"paddleocr/{name}") == "downloading":
        return {"success": False, "message": "ダウンロード中のため削除できません"}
    d = _paddleocr_model_dir(name)
    if d.is_dir():
        shutil.rmtree(d, ignore_errors=True)
        _download_state[f"paddleocr/{name}"] = "none"
        _download_progress[f"paddleocr/{name}"] = 0.0
        return {"success": True, "message": f"deleted: {name}"}
    return {"success": False, "message": "not found"}


@app.get("/api/v1/whisper/models")
async def api_whisper_models():
    """FasterWhisper 対応モデル一覧（VRAM 目安・DL サイズ・説明・DL状態）を返す。"""
    catalog = {}
    for name, info in MODEL_CATALOG.items():
        downloaded = _is_model_downloaded(name)
        state = _download_state.get(name)
        if state in (None, "none") and downloaded:
            state = "done"
        if state in (None, "none"):
            state = "none"
        catalog[name] = {
            **info,
            "downloaded": downloaded,
            "download_state": state,
            "download_progress": round(_download_progress.get(name, 0.0), 1),
            "path": _model_snapshot_path(name) or "",
        }
    return {"models": catalog}


@app.post("/api/v1/whisper/models/{model_name}/download", dependencies=[Depends(require_auth)])
async def api_download_model(model_name: str):
    """指定モデルをバックグラウンドで保存先へダウンロードする。"""
    if model_name not in MODEL_CATALOG:
        return {"success": False, "message": f"unknown model: {model_name}"}
    if _is_model_downloaded(model_name):
        return {"success": False, "message": f"already downloaded: {model_name}"}
    asyncio.create_task(download_model_task(model_name))
    return {"success": True, "message": f"downloading {model_name}"}


# ---------------------------------------------------------------------------
# VibeVoice モデル管理（DL・状態。合成は realtime のみ対応）
# ---------------------------------------------------------------------------
@app.get("/api/v1/vibevoice/models")
async def api_vibevoice_models():
    """VibeVoice 対応モデル一覧（DL サイズ・言語・説明・DL状態）を返す。"""
    catalog = {}
    for name, info in VIBEVOICE_MODEL_CATALOG.items():
        downloaded = _is_model_downloaded(name, repo=info["repo"], marker=info["marker"], check_hf_cache=True)
        state = _download_state.get(name)
        if state in (None, "none") and downloaded:
            state = "done"
        if state in (None, "none"):
            state = "none"
        catalog[name] = {
            **info,
            "downloaded": downloaded,
            "download_state": state,
            "download_progress": round(_download_progress.get(name, 0.0), 1),
            "path": _model_snapshot_path(name, repo=info["repo"], marker=info["marker"], check_hf_cache=True) or "",
        }
    return {"models": catalog}


@app.post("/api/v1/vibevoice/models/{name}/download", dependencies=[Depends(require_auth)])
async def api_vibevoice_download(name: str):
    """VibeVoice モデルをバックグラウンドで保存先へダウンロードする。"""
    if name not in VIBEVOICE_MODEL_CATALOG:
        return {"success": False, "message": f"unknown vibevoice model: {name}"}
    info = VIBEVOICE_MODEL_CATALOG[name]
    if _is_model_downloaded(name, repo=info["repo"], marker=info["marker"], check_hf_cache=True):
        return {"success": False, "message": f"already downloaded: {name}"}
    asyncio.create_task(download_model_task(name, repo=info["repo"], allow_patterns=_VIBEVOICE_ALLOW_PATTERNS))
    return {"success": True, "message": f"downloading {name} ({info['repo']})"}


@app.delete("/api/v1/whisper/models/{model_name}", dependencies=[Depends(require_auth)])
async def api_delete_whisper_model(model_name: str):
    """Whisper モデルを保存先・HF キャッシュから削除する（使用中・DL中は拒否）。"""
    if model_name not in MODEL_CATALOG:
        return {"success": False, "message": f"unknown model: {model_name}"}
    active = str(await get_config("whisper_model") or "medium").strip().lower()
    if model_name.lower() == active:
        return {"success": False, "message": "現在使用中のモデルは削除できません（先に別モデルへ切替）"}
    if _download_state.get(model_name) == "downloading":
        return {"success": False, "message": "ダウンロード中のため削除できません"}
    removed = _delete_model_repo(_model_repo_dir(model_name))
    _download_state[model_name] = "none"
    _download_progress[model_name] = 0.0
    return {"success": removed, "message": "deleted" if removed else "not found"}


@app.delete("/api/v1/vibevoice/models/{name}", dependencies=[Depends(require_auth)])
async def api_delete_vibevoice_model(name: str):
    """VibeVoice モデルを保存先・HF キャッシュから削除する（DL中は拒否）。"""
    if name not in VIBEVOICE_MODEL_CATALOG:
        return {"success": False, "message": f"unknown vibevoice model: {name}"}
    if _download_state.get(name) == "downloading":
        return {"success": False, "message": "ダウンロード中のため削除できません"}
    info = VIBEVOICE_MODEL_CATALOG[name]
    removed = _delete_model_repo(_model_repo_dir(name, repo=info["repo"]))
    _download_state[name] = "none"
    _download_progress[name] = 0.0
    return {"success": removed, "message": "deleted" if removed else "not found"}


# ---------------------------------------------------------------------------
# Kokoro モデル管理（DL・状態・削除。オフライン TTS 用）
# ---------------------------------------------------------------------------
@app.get("/api/v1/kokoro/model")
async def api_kokoro_model():
    """Kokoro モデルの DL 状態と保存内容（音声一覧・容量）を返す。"""
    d = get_model_dir_sync() / "kokoro"
    downloaded = _kokoro_model_dir() is not None
    state = _download_state.get("kokoro")
    if state in (None, "none") and downloaded:
        state = "done"
    if state in (None, "none"):
        state = "none"
    voices = []
    total = 0
    if d.is_dir():
        vd = d / "voices"
        if vd.is_dir():
            for f in sorted(vd.glob("*.pt")):
                try:
                    voices.append({"name": f.stem, "size_mb": round(f.stat().st_size / 1048576, 1)})
                except OSError:
                    pass
        for f in ("config.json", "kokoro-v1_0.pth"):
            p = d / f
            if p.is_file():
                try:
                    total += p.stat().st_size
                except OSError:
                    pass
    return {
        "downloaded": downloaded,
        "download_state": state,
        "download_progress": round(_download_progress.get("kokoro", 0.0), 1),
        "path": str(d) if downloaded else "",
        "voices": voices,
        "size_mb": round(total / 1048576, 1) if total else 0.0,
    }


@app.post("/api/v1/kokoro/model/download", dependencies=[Depends(require_auth)])
async def api_kokoro_download():
    """Kokoro モデルをバックグラウンドで models/kokoro へダウンロードする。"""
    if _kokoro_model_dir():
        return {"success": False, "message": "already downloaded: kokoro"}
    if _download_state.get("kokoro") == "downloading":
        return {"success": False, "message": "already downloading: kokoro"}
    asyncio.create_task(_kokoro_download_task())
    return {"success": True, "message": "downloading kokoro"}


@app.delete("/api/v1/kokoro/model", dependencies=[Depends(require_auth)])
async def api_kokoro_delete():
    """Kokoro モデルフォルダ（models/kokoro）を削除する。"""
    if _download_state.get("kokoro") == "downloading":
        return {"success": False, "message": "ダウンロード中のため削除できません"}
    d = get_model_dir_sync() / "kokoro"
    if d.is_dir():
        shutil.rmtree(d, ignore_errors=True)
        _download_state["kokoro"] = "none"
        _download_progress["kokoro"] = 0.0
        return {"success": True, "message": "kokoro deleted"}
    return {"success": False, "message": "not found"}


@app.post("/api/v1/whisper/model", dependencies=[Depends(require_auth)])
async def api_whisper_model(data: dict):
    """切换 Whisper 模型：保存配置并重启服务。

    モデル読込（large-v3 は 20〜30秒超）が完了して /health が応答するまで
    ポーリングし、実際の成否を返す。読込失敗時は旧モデルに復元して再起動する
    （VRAM 不足・モデル破損で whisper が落ちたままにならないよう自動復旧）。
    """
    model = str(data.get("model", "")).strip()
    if model not in ALLOWED_MODELS:
        return {"success": False, "message": f"unsupported model: {model}"}
    prev_model = str(await get_config("whisper_model") or "medium")
    await set_config("whisper_model", model)
    await asyncio.to_thread(stop_whisper_process)
    await asyncio.sleep(1)
    p = await asyncio.to_thread(start_whisper_process)
    # モデル読込完了（uvicorn 起動）まで 1 秒間隔でヘルスチェック
    for _ in range(40):
        await asyncio.sleep(1)
        health = await whisper_health()
        if health is not None:
            return {"success": True, "message": f"ready ({model})", "model": model, "pid": p.pid, "health": health}
    # 読込失敗：旧モデルへ復元して再起動（whisper を止めたままにしない）
    print(f"[model-switch] {model} failed to load, reverting to {prev_model}")
    await set_config("whisper_model", prev_model)
    await asyncio.to_thread(stop_whisper_process)
    await asyncio.sleep(1)
    p2 = await asyncio.to_thread(start_whisper_process)
    return {
        "success": False,
        "message": f"{model} の読込に失敗しました。{prev_model} に復元して再起動しています（VRAM 不足・モデル破損の可能性）",
        "model": prev_model,
        "pid": p2.pid,
        "reverted": True,
    }


class RecordPayload(BaseModel):
    filename: Optional[str] = None
    duration: Optional[float] = None
    language: Optional[str] = None
    output_format: Optional[str] = None
    summary: Optional[str] = None
    result: Optional[str] = None
    raw_result: Optional[str] = None
    timestamp: Optional[str] = None
    elapsed_seconds: Optional[float] = None
    llm_model: Optional[str] = None
    correct_elapsed: Optional[float] = None


class BatchDeletePayload(BaseModel):
    ids: List[int]


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


@app.post("/api/v1/records/batch-delete", dependencies=[Depends(require_auth)])
async def api_batch_delete_records(payload: BatchDeletePayload):
    """複数レコードを一括削除（{ids: [...]}）。id の重複は除去してから削除する。"""
    import aiosqlite
    ids = list(dict.fromkeys(payload.ids))
    if not ids:
        return {"success": True, "deleted": 0}
    placeholders = ",".join("?" * len(ids))
    async with aiosqlite.connect(str(DB_PATH)) as db:
        async with db.execute(f"DELETE FROM records WHERE id IN ({placeholders})", ids) as cursor:
            deleted = cursor.rowcount
        await db.commit()
    for rid in ids:
        await broadcast({"type": "record_deleted", "id": rid})
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
    text = row["raw_result"] or row["result"] or ""
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
async def api_get_config(request: Request):
    keys = [
        "default_language", "default_output", "refresh_interval", "gpu_temp_threshold",
        "theme", "ui_language", "whisper_model",
        "ai_correct_enabled", "deepseek_model", "deepseek_base_url",
        "active_llm_profile",
        "whisper_mode", "whisper_compute_type", "whisper_beam_size",
        "whisper_temperature", "whisper_vad_min_silence_ms",
        "tts_engine", "tts_device", "tts_vibevoice_model",
        "tts_kokoro_voice", "tts_preload",
        "ocr_device", "ocr_lang", "ocr_autostart", "ocr_format", "ocr_ai_correct",
        "auth_enabled",
        "rtl_auto_start",
    ]
    result = {}
    for k in keys:
        result[k] = await get_config(k)
    # モデル保存先（空なら既定の <プロジェクト>/models を解決して返す）
    result["whisper_model_dir"] = (await get_config("whisper_model_dir")) or str(BASE_DIR / "models")
    # #5: API キーは平文で返さず has_key / 末尾4文字 のみ返す
    key_val = await get_config("deepseek_api_key")
    # whisper_server はループバック経由で校正のためキーを読む → ループバック限定で平文を返す
    if _is_loopback(request.client.host if request.client else ""):
        result["deepseek_api_key"] = key_val
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
        set_config_sync("dashboard_token", generated)
        _dashboard_token = generated
    print(f"[auth] Dashboard 接続トークンを再生成: {generated}")
    return {"success": True, "token": generated}


@app.post("/api/v1/auth/token", dependencies=[Depends(require_auth)])
async def api_set_auth_token(data: dict):
    """接続トークンの手動設定（設定画面から入力）。"""
    global _dashboard_token
    env_token = os.environ.get("DASHBOARD_TOKEN", "").strip()
    if env_token:
        return {"success": False, "error": "DASHBOARD_TOKEN 環境変数が設定されているため変更できません（env 優先）"}
    token = str(data.get("token") or "").strip()
    if len(token) < 8:
        return {"success": False, "error": "トークンは 8 文字以上で入力してください"}
    if len(token) > 128:
        return {"success": False, "error": "トークンは 128 文字以内で入力してください"}
    with _dashboard_token_lock:
        set_config_sync("dashboard_token", token)
        _dashboard_token = token
    print("[auth] Dashboard 接続トークンを手動設定")
    return {"success": True, "token": token}


@app.post("/api/v1/config", dependencies=[Depends(require_auth)])
async def api_set_config(data: dict):
    for k, v in data.items():
        if k == "dashboard_token":
            continue  # トークンは env / 自動生成 / 専用エンドポイントでのみ管理
        if k == "deepseek_base_url":
            v = validate_base_url(v)
        if k == "whisper_model_dir":
            v = str(v).strip()
            if v:
                try:
                    _resolve_model_dir(v)  # 作成可能なパスかを検証
                except Exception as e:
                    return {"success": False, "error": f"invalid model dir: {e}"}
        if k == "tts_engine" and v not in ("edge", "kokoro", "vibevoice"):
            return {"success": False, "error": f"invalid tts_engine: {v}"}
        if k == "tts_device" and v not in ("auto", "cuda", "cpu"):
            return {"success": False, "error": f"invalid tts_device: {v}"}
        if k == "tts_vibevoice_model" and v not in ("realtime", "tts"):
            return {"success": False, "error": f"invalid tts_vibevoice_model: {v}"}
        if k == "tts_kokoro_voice" and v not in ("jf_alpha", "jf_gongitsune", "jf_nezumi", "jf_tebukuro", "jm_kumo"):
            return {"success": False, "error": f"invalid tts_kokoro_voice: {v}"}
        if k == "tts_preload" and v not in ("on", "off"):
            return {"success": False, "error": f"invalid tts_preload: {v}"}
        if k == "ocr_device" and v not in ("cuda", "cpu"):
            return {"success": False, "error": f"invalid ocr_device: {v}"}
        if k == "ocr_lang" and v not in ("japan", "en", "ch", "ko"):
            return {"success": False, "error": f"invalid ocr_lang: {v}"}
        if k == "ocr_autostart" and v not in ("on", "off"):
            return {"success": False, "error": f"invalid ocr_autostart: {v}"}
        if k == "whisper_model" and v not in ALLOWED_MODELS:
            return {"success": False, "error": f"invalid whisper_model: {v}"}
        if k == "whisper_compute_type" and v not in ("default", "int8", "int8_float16", "float16"):
            return {"success": False, "error": f"invalid whisper_compute_type: {v}"}
        if k == "auth_enabled" and v not in ("on", "off"):
            return {"success": False, "error": f"invalid auth_enabled: {v}"}
        if k == "rtl_auto_start" and v not in ("on", "off"):
            return {"success": False, "error": f"invalid rtl_auto_start: {v}"}
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
    # 认证：ループバック以外は ?token= を要求（不一致なら 4401 で切断）。
    # auth_enabled が off の場合はトークン不要で接続可
    if not _is_loopback(websocket.client.host if websocket.client else ""):
        if await auth_enabled():
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
