import os
import sys
import tempfile
import asyncio
import time
import threading
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.responses import JSONResponse
import traceback
from datetime import datetime

app = FastAPI(title="PaddleOCR Server")


@app.exception_handler(Exception)
async def _exception_handler(request, exc):
    """未捕捉例外を error.log に記録して 500 を返す（オフライン版の診断用）。"""
    try:
        with open("error.log", "a", encoding="utf-8") as f:
            f.write(f"\n[{datetime.now().isoformat()}] {request.method} {request.url.path}\n")
            traceback.print_exc(file=f)
    except Exception:
        pass
    return JSONResponse(status_code=500, content={"detail": str(exc)})

# プロジェクトルート（モデル保存先の既定を <プロジェクト>/models/paddlex にするため）
if getattr(sys, "frozen", False):
    # PyInstaller 単体 exe ビルド時: exe が置かれているフォルダをルートにする
    BASE_DIR = Path(sys.executable).resolve().parent
else:
    BASE_DIR = Path(__file__).resolve().parent

# PaddleOCR 3.x のモデル保存先（PaddleX の CACHE_DIR）をプロジェクト内に固定。
# Dashboard が子プロセス起動時に PADDLE_PDX_CACHE_HOME を注入する。
# 未注入（単独起動・_restart_ocr*.ps1 等）でも <プロジェクト>/models/paddlex を使う。
# ※ paddleocr / paddlex は遅延 import なので、ここで env を立てれば読込時に反映される。
_paddlex_cache = Path(os.environ.get("PADDLE_PDX_CACHE_HOME") or (BASE_DIR / "models" / "paddlex"))
os.environ["PADDLE_PDX_CACHE_HOME"] = str(_paddlex_cache)

# Dashboard 地址（起動制御・設定読込に使用。未起動なら単体でも動作）
DASHBOARD_URL = os.environ.get("DASHBOARD_URL", "http://127.0.0.1:9001")

# 実行デバイスと既定言語（Dashboard が子プロセス起動時に注入）
OCR_DEVICE = os.environ.get("OCR_DEVICE", "cuda").strip().lower()  # cuda / cpu（torch 流儀）
# Paddle は "cuda" ではなく "gpu" を要求（parse_device が SUPPORTED_DEVICE_TYPE で検証）
OCR_DEVICE = "gpu" if OCR_DEVICE.startswith("cuda") else "cpu"
OCR_LANG = os.environ.get("OCR_LANG", "japan").strip()  # japan / en / ch ...

# 推論はスレッドで実行（Paddle はブロッキング）。同時 predict を直列化する
# （同一 pipeline の並列呼び出しは非対応。whisper の asr_semaphore と同じ思想）
ocr_semaphore = asyncio.Semaphore(1)
structure_semaphore = asyncio.Semaphore(1)

# 処理中フラグ（/health で Dashboard へ公開。自動記録の開始トリガーに使用）
# 短い処理（<1s）でも Dashboard のポーリング（既定1s）が遷移を取りこぼさないよう、
# 処理終了後も _BUSY_HOLD 秒間 busy を維持する（クリアはホールド期限後）。
_BUSY_HOLD = 3.0
_busy_lock = threading.Lock()
_busy_count = 0
_busy_until = 0.0


def _set_busy(busy: bool):
    global _busy_count, _busy_until
    with _busy_lock:
        if busy:
            _busy_count += 1
            _busy_until = time.time() + _BUSY_HOLD
        else:
            _busy_count -= 1
            if _busy_count < 0:
                _busy_count = 0
            if _busy_count == 0:
                _busy_until = time.time() + _BUSY_HOLD


def is_busy() -> bool:
    with _busy_lock:
        return _busy_count > 0 or time.time() < _busy_until

# ---------------------------------------------------------------------------
# モデルロード（シングルトン・遅延/並行安全）
#   - PP-OCRv5（画像→テキスト）: 軽量なので起動時バックグラウンドでロード
#   - PP-StructureV3（PDF→Markdown）: 重いので /pdf 初回呼び出し時に遅延ロード
# ---------------------------------------------------------------------------
_pipeline = None
_pipeline_cpu = None          # OOM 時の CPU フォールバック用パイプライン（GPU とは独立）
_pipeline_lock = threading.Lock()
_pipeline_ready = False
_pipeline_cpu_fallback = False
_pipeline_device = OCR_DEVICE  # _pipeline の実際のデバイス（フォールバック後は "cpu"）

_structure = None
_structure_cpu = None
_structure_lock = threading.Lock()
_structure_ready = False
_structure_cpu_fallback = False
_structure_device = OCR_DEVICE


def _norm_lang(lang: Optional[str]) -> str:
    """None/空/auto を既定言語に正規化（PaddleOCR は 'auto' を受け付けない）"""
    if not lang or str(lang).strip().lower() in ("auto", ""):
        return OCR_LANG
    return str(lang).strip()


def get_pipeline(force_cpu: bool = False):
    """PP-OCRv5 pipeline（画像 OCR）を取得。スレッドセーフに初回のみ生成。

    force_cpu=True は GPU パイプラインを返さない（OOM リトライが同じ GPU を
    再使用して再発するのを防ぐ。CPU パイプラインを独立キャッシュする）。
    """
    global _pipeline, _pipeline_cpu, _pipeline_ready, _pipeline_cpu_fallback, _pipeline_device
    if force_cpu:
        if _pipeline_cpu is not None:
            return _pipeline_cpu
        # 通常パスで既に CPU フォールバック済みなら同じものを返す
        if _pipeline is not None and _pipeline_cpu_fallback:
            return _pipeline
        with _pipeline_lock:
            if _pipeline_cpu is not None:
                return _pipeline_cpu
            if _pipeline is not None and _pipeline_cpu_fallback:
                return _pipeline
            from paddleocr import PaddleOCR
            print(f"[ocr] loading CPU PP-OCRv5 pipeline (lang={OCR_LANG})...")
            try:
                _pipeline_cpu = PaddleOCR(lang=OCR_LANG, device="cpu")
            except TypeError:
                _pipeline_cpu = PaddleOCR(lang=OCR_LANG, use_gpu=False)
            _pipeline_cpu_fallback = True
            _pipeline_ready = True
            return _pipeline_cpu
    if _pipeline is not None:
        return _pipeline
    with _pipeline_lock:
        if _pipeline is not None:
            return _pipeline
        from paddleocr import PaddleOCR
        device = OCR_DEVICE
        print(f"[ocr] loading PP-OCRv5 pipeline (lang={OCR_LANG}, device={device})...")
        try:
            _pipeline = PaddleOCR(lang=OCR_LANG, device=device)
        except TypeError:
            # 2.x 系 API フォールバック
            _pipeline = PaddleOCR(lang=OCR_LANG, use_gpu=(device == "gpu"))
        except Exception as e:
            if device != "cpu":
                print(f"[ocr] GPU load failed ({e}); falling back to CPU")
                _pipeline = PaddleOCR(lang=OCR_LANG, device="cpu")
                _pipeline_cpu_fallback = True
                _pipeline_device = "cpu"
            else:
                raise
        _pipeline_ready = True
        return _pipeline


def get_structure(force_cpu: bool = False):
    """PP-StructureV3 pipeline（PDF→Markdown）を取得。初回のみ生成（遅延）。

    force_cpu=True は GPU パイプラインを返さない（OOM リトライ対策）。
    """
    global _structure, _structure_cpu, _structure_ready, _structure_cpu_fallback, _structure_device
    if force_cpu:
        if _structure_cpu is not None:
            return _structure_cpu
        if _structure is not None and _structure_cpu_fallback:
            return _structure
        with _structure_lock:
            if _structure_cpu is not None:
                return _structure_cpu
            if _structure is not None and _structure_cpu_fallback:
                return _structure
            from paddleocr import PPStructureV3
            print(f"[ocr] loading CPU PP-StructureV3 pipeline (lang={OCR_LANG})...")
            try:
                _structure_cpu = PPStructureV3(
                    use_doc_orientation_classify=False,
                    use_doc_unwarping=False,
                    device="cpu",
                    lang=OCR_LANG,
                )
            except TypeError:
                _structure_cpu = PPStructureV3(
                    use_doc_orientation_classify=False,
                    use_doc_unwarping=False,
                    use_gpu=False,
                    lang=OCR_LANG,
                )
            _structure_cpu_fallback = True
            _structure_ready = True
            return _structure_cpu
    if _structure is not None:
        return _structure
    with _structure_lock:
        if _structure is not None:
            return _structure
        from paddleocr import PPStructureV3
        device = OCR_DEVICE
        print(f"[ocr] loading PP-StructureV3 pipeline (lang={OCR_LANG}, device={device})...")
        try:
            _structure = PPStructureV3(
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                device=device,
                lang=OCR_LANG,
            )
        except TypeError:
            _structure = PPStructureV3(
                use_doc_orientation_classify=False,
                use_doc_unwarping=False,
                use_gpu=(device == "gpu"),
                lang=OCR_LANG,
            )
        except Exception as e:
            if device != "cpu":
                print(f"[ocr] Structure GPU load failed ({e}); falling back to CPU")
                _structure = PPStructureV3(
                    use_doc_orientation_classify=False,
                    use_doc_unwarping=False,
                    device="cpu",
                    lang=OCR_LANG,
                )
                _structure_cpu_fallback = True
                _structure_device = "cpu"
            else:
                raise
        _structure_ready = True
        return _structure


def _get(res, key, default=None):
    """PaddleOCR の結果オブジェクトから dict 風 / 属性アクセスの両方で値を取得"""
    try:
        return res[key]
    except Exception:
        return getattr(res, key, default)


def _call(res, method, *args, **kwargs):
    try:
        fn = getattr(res, method)
        return fn(*args, **kwargs)
    except Exception:
        return None


def _is_oom(exc: Exception) -> bool:
    msg = str(exc).lower()
    return "out of memory" in msg or "oom" in msg or "cuda error" in msg


async def _save_upload(file: UploadFile, max_bytes: int) -> str:
    """アップロードを一時ファイルへ保存。上限超過・失敗時は 413 / 例外。"""
    suffix = Path(file.filename or "").suffix or ".tmp"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        total = 0
        while True:
            chunk = file.file.read(1024 * 1024)
            if not chunk:
                break
            total += len(chunk)
            if total > max_bytes:
                raise HTTPException(status_code=413, detail=f"File too large (max {max_bytes // (1024*1024)}MB)")
            tmp.write(chunk)
        tmp_path = tmp.name
    except Exception:
        # Windows では開いたままのファイルは削除できないため、unlink 前に必ず閉じる
        try:
            tmp.close()
        except Exception:
            pass
        try:
            os.unlink(tmp.name)
        except OSError:
            pass
        raise
    finally:
        tmp.close()
    return tmp_path


# ---------------------------------------------------------------------------
# エンドポイント
# ---------------------------------------------------------------------------
@app.post("/ocr")
async def ocr_image(
    file: UploadFile = File(...),
    lang: Optional[str] = Form(None),
):
    """画像（PNG/JPG 等）の文字を認識しテキストを返す。PP-OCRv5。"""
    lang = _norm_lang(lang)
    start = time.time()
    tmp_path = await _save_upload(file, 50 * 1024 * 1024)
    try:
        pipeline = get_pipeline()
        _set_busy(True)
        try:
            await ocr_semaphore.acquire()
            try:
                try:
                    results = await asyncio.to_thread(pipeline.predict, tmp_path)
                except Exception as e:
                    if OCR_DEVICE != "cpu" and _is_oom(e):
                        print(f"[ocr] GPU OOM ({e}); retrying on CPU")
                        pipeline = get_pipeline(force_cpu=True)
                        results = await asyncio.to_thread(pipeline.predict, tmp_path)
                    else:
                        raise
            finally:
                ocr_semaphore.release()
        finally:
            _set_busy(False)

        if not results:
            return {"text": "", "lines": [], "elapsed": round(time.time() - start, 2), "device": _device_name()}

        res = results[0]
        rec_texts = _get(res, "rec_texts", []) or []
        rec_scores = _get(res, "rec_scores", []) or []
        polys = _get(res, "dt_polys", _get(res, "rec_polys", [])) or []
        lines = []
        for i, text in enumerate(rec_texts):
            score = rec_scores[i] if i < len(rec_scores) else 0.0
            box = polys[i].tolist() if i < len(polys) and hasattr(polys[i], "tolist") else (polys[i] if i < len(polys) else [])
            lines.append({"text": str(text), "score": round(float(score), 4), "box": box})
        text = "\n".join(rec_texts)
        return {
            "text": text,
            "lines": lines,
            "elapsed": round(time.time() - start, 2),
            "device": _device_name(),
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


@app.post("/pdf")
async def pdf_to_markdown(
    file: UploadFile = File(...),
    lang: Optional[str] = Form(None),
):
    """PDF（または画像）を PP-StructureV3 で Markdown 化する。"""
    lang = _norm_lang(lang)
    start = time.time()
    tmp_path = await _save_upload(file, 100 * 1024 * 1024)
    try:
        structure = get_structure()
        _set_busy(True)
        try:
            await structure_semaphore.acquire()
            try:
                try:
                    results = await asyncio.to_thread(structure.predict, tmp_path)
                except Exception as e:
                    if OCR_DEVICE != "cpu" and _is_oom(e):
                        print(f"[ocr] Structure GPU OOM ({e}); retrying on CPU")
                        structure = get_structure(force_cpu=True)
                        results = await asyncio.to_thread(structure.predict, tmp_path)
                    else:
                        raise
            finally:
                structure_semaphore.release()
        finally:
            _set_busy(False)

        pages = []
        for res in (results or []):
            # 3.7 では to_markdown() は存在せず res.markdown プロパティ（dict）を返す
            md = _call(res, "to_markdown")
            if not md:
                m = _get(res, "markdown")
                if isinstance(m, dict):
                    md = m.get("markdown_texts")
                else:
                    md = m
            if isinstance(md, (list, tuple)):
                for t in md:
                    if t:
                        pages.append(str(t))
            elif md:
                pages.append(str(md))
        markdown = "\n\n".join(pages)
        return {
            "markdown": markdown,
            "pages": len(pages),
            "elapsed": round(time.time() - start, 2),
            "device": _device_name("structure"),
        }
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def _device_name(which: str = "ocr") -> str:
    """パイプライン別の実際のデバイス（フォールバック後は cpu）。"""
    if which == "structure":
        return _structure_device
    return _pipeline_device


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "engine": "paddleocr",
        "device": _device_name(),
        "lang": OCR_LANG,
        "ocr_ready": _pipeline_ready,
        "structure_ready": _structure_ready,
        "busy": is_busy(),  # 処理中かどうか（自動記録の開始トリガー用）
        "model_dir": str(_paddlex_cache),
    }


if __name__ == "__main__":
    import uvicorn
    import logging

    # uvicorn の例外ログ（traceback）をファイルにも記録（オフライン版の診断用）
    try:
        _fh = logging.FileHandler("uvicorn.log", encoding="utf-8")
        _fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s"))
        logging.getLogger("uvicorn").addHandler(_fh)
        logging.getLogger("uvicorn.error").addHandler(_fh)
        logging.getLogger("uvicorn.access").addHandler(_fh)
    except Exception:
        pass

    PORT = int(os.environ.get("OCR_PORT", "9100"))
    print(f"Starting PaddleOCR API server on http://0.0.0.0:{PORT} (device={OCR_DEVICE}, lang={OCR_LANG})")
    # PP-OCRv5（軽量）を起動時バックグラウンドでロード。PP-StructureV3 は遅延。
    import threading as _t

    def _warm():
        try:
            get_pipeline()
            print("[ocr] PP-OCRv5 pipeline ready")
        except Exception as e:
            print(f"[ocr] PP-OCRv5 preload failed (続行): {e}")

    _t.Thread(target=_warm, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=PORT)
