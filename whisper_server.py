import os
import shutil
import tempfile
import asyncio
import base64
import time
import threading
from pathlib import Path
from typing import Optional

import aiohttp
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse, Response, StreamingResponse
from faster_whisper import WhisperModel

app = FastAPI(title="Local Whisper Server")

# Dashboard 上报地址（如果 Dashboard 在运行）
DASHBOARD_URL = os.environ.get("DASHBOARD_URL", "http://127.0.0.1:9001")


async def report_status(state: str, **extra):
    """上报转换状态（converting / idle），让 Dashboard 实时显示转换中动画。
    converting 時に start_ts（リクエスト開始エポック秒）と filename を付与し、
    Dashboard のリアルタイム監視（処理時間・変換時間・AI校正時間）に利用する。
    """
    if not DASHBOARD_URL:
        return
    payload = {"state": state, **extra}
    try:
        async with aiohttp.ClientSession() as session:
            await session.post(
                f"{DASHBOARD_URL}/api/v1/whisper/status_event",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=3),
            )
    except Exception:
        pass


async def report_llm_status(processing: bool, model: Optional[str] = None):
    """AI 校正（LLM）の実行状態を Dashboard へ報告（サイドバーの LLM 活用表示用）。

    ai_correct_text の前後で呼び、処理中かどうかと使用モデル名を伝える。
    """
    if not DASHBOARD_URL:
        return
    try:
        async with aiohttp.ClientSession() as session:
            await session.post(
                f"{DASHBOARD_URL}/api/v1/whisper/llm_status",
                json={"processing": processing, "model": model},
                timeout=aiohttp.ClientTimeout(total=3),
            )
    except Exception:
        pass


# 转换进度（线程间共享：transcribe 线程写入，事件循环后台任务读取上报）
progress_lock = threading.Lock()
progress_percent = 0.0

# #6: 並行 /asr 直列化（WhisperModel は同時 transcribe 非対応・グローバル progress 共有のため）
asr_semaphore = asyncio.Semaphore(1)


async def report_progress(percent: float, phase: str = "transcribe", duration: Optional[float] = None):
    """将转换进度（0-100）上报到 Dashboard。
    phase: transcribe（转换）/ correct（AI 校正）、duration: 音声時間（分节完成后可知）。
    Dashboard はこれらの情報でリアルタイム監視（変換時間・AI校正時間・音声時間）を描画する。
    """
    if not DASHBOARD_URL:
        return
    payload = {"percent": round(percent, 1), "phase": phase}
    if duration is not None:
        payload["duration"] = round(duration, 2)
    try:
        async with aiohttp.ClientSession() as session:
            await session.post(
                f"{DASHBOARD_URL}/api/v1/whisper/progress",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=3),
            )
    except Exception:
        pass


async def report_record(filename: str, duration: float, language: str, output_format: str, result: str, elapsed: float, llm_model: Optional[str] = None, correct_elapsed: float = 0.0, raw_result: Optional[str] = None):
    """将转写记录上报到 Dashboard（raw_result=AI校正前の原文。未校正なら result と同じ）"""
    if not DASHBOARD_URL:
        return
    try:
        payload = {
            "filename": filename,
            "duration": duration,
            "language": language,
            "output_format": output_format,
            "summary": result[:200],
            "result": result,
            "raw_result": raw_result or result,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "elapsed_seconds": elapsed,
            "llm_model": llm_model,
            "correct_elapsed": correct_elapsed,
        }
        async with aiohttp.ClientSession() as session:
            await session.post(f"{DASHBOARD_URL}/api/v1/records", json=payload, timeout=aiohttp.ClientTimeout(total=5))
    except Exception:
        # Dashboard 未启动时静默忽略
        pass


# ---------------------------------------------------------------------------
# AI 校正（Deepseek LLM）
# ---------------------------------------------------------------------------
AI_DEFAULT_MODEL = "deepseek-chat"
AI_DEFAULT_BASE_URL = "https://api.deepseek.com/v1"

AI_SYSTEM_PROMPT = (
    "你是语音转写文本的校对助手。请修正识别错误、错别字、同音字和标点符号，"
    "并根据语义合理分段。必须保持原文语言（日语/中文/英语等），"
    "不要翻译、不要添加或删减内容、不要输出任何解释或前缀，只输出校对后的正文。"
)


async def get_dashboard_config() -> dict:
    """从 Dashboard 读取最新配置（每次请求实时读取，改设置无需重启服务）"""
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{DASHBOARD_URL}/api/v1/config",
                timeout=aiohttp.ClientTimeout(total=3),
            ) as resp:
                if resp.status == 200:
                    return await resp.json()
    except Exception:
        pass
    return {}


async def ai_correct_text(text: str):
    """使用 LLM（OpenAI 互換：Deepseek / Ollama 等）对转写文本进行错字修正和段落校正。

    返回 (修正后的文本, 使用的LLM模型或None)。
    未启用/请求失败时返回原文和 None。API キーは任意（Ollama 等は不要）。
    """
    if not text or not text.strip():
        return text, None
    cfg = await get_dashboard_config()
    enabled = str(cfg.get("ai_correct_enabled", "")).strip().lower() in ("1", "true", "yes", "on")
    if not enabled:
        return text, None

    api_key = str(cfg.get("deepseek_api_key", "")).strip()
    model_name = str(cfg.get("deepseek_model", "")).strip() or AI_DEFAULT_MODEL
    base_url = str(cfg.get("deepseek_base_url", "")).strip() or AI_DEFAULT_BASE_URL
    base_url = base_url.rstrip("/")
    # #7 多層防御: scheme が http/https でなければ校正をスキップ（SSRF 防止）
    from urllib.parse import urlsplit
    if not base_url or urlsplit(base_url).scheme not in ("http", "https") or not urlsplit(base_url).netloc:
        return text, None

    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": AI_SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        "temperature": 0.2,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    try:
        print(f"[AI correct] start, model={model_name}, chars={len(text)}")
        await report_llm_status(True, model_name)
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{base_url}/chat/completions",
                json=payload,
                headers=headers,
                timeout=aiohttp.ClientTimeout(total=300),
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    corrected = data["choices"][0]["message"]["content"].strip()
                    if corrected:
                        print(f"[AI correct] done, model={model_name}, chars={len(corrected)}")
                        return corrected, model_name
                else:
                    body = (await resp.text())[:200]
                    print(f"[AI correct] HTTP {resp.status}: {body}")
    except Exception as e:
        print(f"[AI correct] failed: {e}")
    finally:
        await report_llm_status(False, model_name)
    return text, None


# 模型配置：针对 GTX 1660 Ti 6GB，优先保证稳定
MODEL_SIZE = os.environ.get("WHISPER_MODEL", "medium")
COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE_TYPE", "float16")
# モデル保存先（Dashboard が設定画面で指定）。設定されていれば download_root として使用
MODEL_DIR = os.environ.get("WHISPER_MODEL_DIR", "").strip()

# 高速化参数（由 Dashboard 启动时注入）
BEAM_SIZE = int(os.environ.get("WHISPER_BEAM_SIZE", "5"))
TEMPERATURE_VAL = float(os.environ.get("WHISPER_TEMPERATURE", "0"))
VAD_MIN_SILENCE_MS = int(os.environ.get("WHISPER_VAD_MIN_SILENCE_MS", "500"))

# temperature 列表：
#   0    → 仅贪婪解码（最快）
#   >=1  → 默认回退列表 [0,0.2,0.4,0.6,0.8,1.0]（精度优先）
#   其他 → 先贪婪，失败再回退到指定值
if TEMPERATURE_VAL <= 0:
    TEMPERATURE_LIST = [0]
elif TEMPERATURE_VAL >= 1:
    TEMPERATURE_LIST = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]
else:
    TEMPERATURE_LIST = [0.0, TEMPERATURE_VAL]

print(
    f"Loading Whisper model: {MODEL_SIZE} (compute_type={COMPUTE_TYPE}, "
    f"beam_size={BEAM_SIZE}, temperature={TEMPERATURE_LIST}, vad_ms={VAD_MIN_SILENCE_MS})..."
)
_model_kwargs = {}
if MODEL_DIR:
    _model_kwargs["download_root"] = MODEL_DIR
    print(f"Model download_root: {MODEL_DIR}")
# デバイス（Dashboard が WHISPER_DEVICE で指定。未指定なら cuda で試し、失敗時 CPU へフォールバック）
WHISPER_DEVICE = os.environ.get("WHISPER_DEVICE", "").strip().lower() or "cuda"
try:
    model = WhisperModel(MODEL_SIZE, device=WHISPER_DEVICE, compute_type=COMPUTE_TYPE, **_model_kwargs)
except Exception as e:
    if WHISPER_DEVICE == "cuda":
        print(f"[whisper] CUDA モデル読込失敗 → CPU(int8) で再試行: {e}")
        model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8", **_model_kwargs)
    else:
        raise
print("Model loaded successfully.")


def format_srt_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


@app.post("/asr")
async def asr(
    audio_file: UploadFile = File(...),
    language: Optional[str] = Form("auto"),
    task: Optional[str] = Form("transcribe"),
    output: Optional[str] = Form("txt"),
):
    start_time = time.time()
    # filename 未指定（None）でもクラッシュしないよう空文字へフォールバック
    suffix = Path(audio_file.filename or "").suffix or ".wav"
    # アップロード上限（無制限のディスク使用を防止）
    MAX_UPLOAD_BYTES = 1024 * 1024 * 1024  # 1GB
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            total = 0
            while True:
                chunk = audio_file.file.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > MAX_UPLOAD_BYTES:
                    raise HTTPException(status_code=413, detail="File too large (max 1GB)")
                tmp.write(chunk)
            tmp_path = tmp.name
    except Exception:
        # アップロード途中で失敗しても一時ファイルを確実に削除
        try:
            os.unlink(tmp.name)
        except OSError:
            pass
        raise

    await asr_semaphore.acquire()
    try:
        await report_status("converting", start_ts=start_time, filename=audio_file.filename)
        lang = None if language in (None, "auto", "") else language

        # 转写是 CPU/GPU 密集型同步操作，必须放到线程池执行，
        # 否则会阻塞 uvicorn 事件循环，导致转写期间 /health 无响应
        stop_progress = threading.Event()

        async def progress_reporter():
            """后台任务：定期读取共享进度并上报（避免阻塞转写线程）"""
            last = -1.0
            while not stop_progress.is_set():
                with progress_lock:
                    pct = progress_percent
                if pct >= 0 and abs(pct - last) >= 1.0:
                    last = pct
                    await report_progress(pct)
                await asyncio.sleep(0.5)

        def do_transcribe():
            """在线程中执行：迭代分段生成器，按已识别进度更新共享进度"""
            global progress_percent
            with progress_lock:
                progress_percent = 0.0
            segs, info = model.transcribe(
                tmp_path,
                language=lang,
                task=task,
                beam_size=BEAM_SIZE,
                temperature=TEMPERATURE_LIST,
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=VAD_MIN_SILENCE_MS),
            )
            audio_duration = info.duration or 0.0
            out = []
            for seg in segs:
                out.append(seg)
                if audio_duration > 0:
                    with progress_lock:
                        progress_percent = min(99.0, (seg.end / audio_duration) * 100)
            with progress_lock:
                progress_percent = 100.0
            return out, info

        reporter_task = asyncio.create_task(progress_reporter())
        try:
            segments, info = await asyncio.to_thread(do_transcribe)
        finally:
            stop_progress.set()
            try:
                await reporter_task
            except Exception:
                pass

        duration = segments[-1].end if segments else 0.0
        # 补报一次最终进度（携带音声時間，供 Dashboard 实时监控），
        # 避免与 0.5s 上报周期竞态漏掉 100%
        with progress_lock:
            final_pct = progress_percent
        await report_progress(final_pct, phase="transcribe", duration=duration)
        correct_elapsed = 0.0

        if output == "srt":
            lines = []
            for i, seg in enumerate(segments, 1):
                start = format_srt_time(seg.start)
                end = format_srt_time(seg.end)
                lines.append(f"{i}\n{start} --> {end}\n{seg.text.strip()}\n")
            result_text = "\n".join(lines)
            raw_result_text = result_text
        else:
            result_text = " ".join(seg.text.strip() for seg in segments)
            raw_result_text = result_text
            # AI 校正（仅对纯文本结果生效，SRT 含时间轴不做校正）
            # 用 -1 作为"校正中"信号，让 Dashboard 显示"校正中..."而非卡在 100%
            await report_progress(-1, phase="correct")
            correct_t0 = time.time()
            result_text, llm_model = await ai_correct_text(result_text)
            correct_elapsed = round(time.time() - correct_t0, 2)

        elapsed = time.time() - start_time

        # 异步上报到 Dashboard（raw_result に AI 校正前の原文を記録）
        await report_record(
            filename=audio_file.filename,
            duration=duration,
            language=language,
            output_format=output,
            result=result_text,
            elapsed=elapsed,
            llm_model=llm_model if output == "txt" else None,
            correct_elapsed=correct_elapsed,
            raw_result=raw_result_text,
        )

        return PlainTextResponse(result_text)

    finally:
        os.unlink(tmp_path)
        await report_status("idle")
        # #6: 並行 /asr 直列化のセマフォを解放
        asr_semaphore.release()


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL_SIZE}


@app.post("/tts")
async def tts_speech(data: dict, format: str = "raw"):
    """テキスト読み上げ（LAN から認証なしで利用可）。ダッシュボードの /api/v1/tts へ内部プロキシ。

    - 既定（format=raw）: 音声バイトを直接返す（Content-Type はエンジンの mime）。curl -o out.wav で保存可能。
    - format=json: {audio_base64, mime, duration, boundaries, ...} を JSON で返す。
    エンジン・音声・プリロードはダッシュボードの設定（tts_engine / tts_kokoro_voice / tts_preload）に従う。
    ループバック（127.0.0.1）からダッシュボードを呼ぶため認証トークンは不要。
    """
    text = str(data.get("text", "")).strip()
    if not text:
        raise HTTPException(400, "text is required")
    lang = str(data.get("lang", "") or "")
    payload = {"text": text, "lang": lang}
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{DASHBOARD_URL}/api/v1/tts", json=payload,
                timeout=aiohttp.ClientTimeout(total=600),
            ) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    raise HTTPException(resp.status, f"dashboard TTS failed: {body[:300]}")
                result = await resp.json()
    except aiohttp.ClientError as e:
        raise HTTPException(502, f"dashboard unreachable: {e}")
    if format == "json":
        return result
    audio = base64.b64decode(result.get("audio_base64", "") or "")
    if not audio:
        raise HTTPException(502, "dashboard returned empty audio")
    return Response(content=audio, media_type=result.get("mime", "audio/wav"))


@app.post("/chat")
async def chat_completion(data: dict):
    """チャット（LAN から認証なしで利用可）。ダッシュボードの /api/v1/chat へ内部プロキシ。

    body: {"message": "...", "session_id": "..."} → {"reply": "...", "session_id": "..."}
    会話履歴はダッシュボード内の session_id 単位で保持される（省略時は新規セッション）。
    LLM はダッシュボードのアクティブプロファイル（Deepseek / Ollama 等）に従う。
    """
    message = str(data.get("message", "")).strip()
    if not message:
        raise HTTPException(400, "message is required")
    payload = {"message": message}
    if data.get("session_id"):
        payload["session_id"] = str(data["session_id"])
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{DASHBOARD_URL}/api/v1/chat", json=payload,
                timeout=aiohttp.ClientTimeout(total=600),
            ) as resp:
                if resp.status != 200:
                    body = await resp.text()
                    raise HTTPException(resp.status, f"dashboard chat failed: {body[:300]}")
                return await resp.json()
    except aiohttp.ClientError as e:
        raise HTTPException(502, f"dashboard unreachable: {e}")


@app.post("/chat/stream")
async def chat_completion_stream(data: dict):
    """チャット（SSE ストリーミング・LAN から認証なしで利用可）。ダッシュボードの /api/v1/chat/stream を中継。

    body: {"message": "...", "session_id": "..."} — SSE イベントはそのまま透過（
      {"type":"text"}/{"type":"audio"}/{"type":"audio_skip"}/{"type":"done"}/{"type":"error"}）。
    リアルタイム音声出力は、受信側で audio_base64 を base64 デコードして再生する。
    """
    message = str(data.get("message", "")).strip()
    if not message:
        raise HTTPException(400, "message is required")
    payload = {"message": message}
    for k in ("session_id", "lang", "voice"):
        if data.get(k):
            payload[k] = str(data[k])

    async def relay():
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{DASHBOARD_URL}/api/v1/chat/stream", json=payload,
                    timeout=aiohttp.ClientTimeout(total=600, connect=30),
                ) as resp:
                    if resp.status != 200:
                        body = (await resp.text())[:300]
                        yield f"data: {{\"type\":\"error\",\"message\":\"dashboard chat failed: {body}\"}}\n\n"
                        return
                    async for line in resp.content:
                        line = line.decode("utf-8", errors="replace")
                        if line.startswith("data:"):
                            yield line
        except aiohttp.ClientError as e:
            yield f"data: {{\"type\":\"error\",\"message\":\"dashboard unreachable: {e}\"}}\n\n"

    return StreamingResponse(relay(), media_type="text/event-stream")


@app.post("/correct")
async def correct_text(data: dict):
    """对给定文本执行 AI 校正（供 Dashboard 的履历再校正功能使用）。

    返回 {"result": 校正后文本, "llm_model": 使用的模型 或 None, "correct_elapsed": 校正耗时(秒)}。
    未启用/无 Key 时 result 与原文一致、llm_model 为 None。
    """
    text = str(data.get("text", ""))
    correct_t0 = time.time()
    corrected, llm_model = await ai_correct_text(text)
    return {"result": corrected, "llm_model": llm_model, "correct_elapsed": round(time.time() - correct_t0, 2)}


if __name__ == "__main__":
    import uvicorn

    # WHISPER_PORT 設定時は Dashboard のポート管理と一致させる（既定 9000）
    WHISPER_PORT = int(os.environ.get("WHISPER_PORT", "9000"))
    print(f"Starting Whisper API server on http://0.0.0.0:{WHISPER_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=WHISPER_PORT)
