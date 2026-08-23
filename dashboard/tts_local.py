# -*- coding: utf-8 -*-
"""ローカル高速 TTS エンジンの統合モジュール（Kokoro / VibeVoice）。

方針:
- 重い import（torch / kokoro / vibevoice / transformers）は関数内で遅延ロードする。
  本モジュールを app 起動時に import してもコストはほぼゼロ。
- エンジンは初回使用時にロードし、モジュールシングルトンとして保持。
  `unload()` で VRAM を解放できる（app 側がアイドルタイマーで呼ぶ）。
- 全公開関数は同期。イベントループを塞がないよう app 側は `asyncio.to_thread` で呼ぶ。
"""
import gc
import glob
import io
import os
import re
import threading

# ---------------------------------------------------------------------------
# 言語マップ（TTSRequest.lang → エンジン別設定）
# ---------------------------------------------------------------------------
# Kokoro: lang_code（misaki）+ 既定声。未対応言語は日本語にフォールバック
KOKORO_LANG = {
    "ja": "j",
    "zh": "z",
    "en": "a",
    "ko": None,   # kokoro 非対応 → 日本語フォールバック
    "es": "e",
    "fr": "f",
    "it": "i",
    "pt": "p",
    "de": "d",    # kokoro 非対応（現行）→ 日本語フォールバック
    "ru": None,
    "id": None,
    "vi": None,
    "th": None,
    "tr": None,
    "nl": None,
    "pl": None,
}
KOKORO_VOICES = {
    "j": "jf_alpha",      # 日本語: 二葉（女性）
    "a": "af_heart",      # 英語: Heart
    "z": "zf_xiaobei",    # 中国語: 小北
    "e": "ef_dora",       # スペイン語
    "f": "ff_siwis",      # フランス語
    "i": "if_sara",       # イタリア語
    "p": "pf_dora",       # ポルトガル語
}
KOKORO_SAMPLE_RATE = 24000

# VibeVoice（Phase B）: transformers バージョン下限（vibevoice の pyproject が 4.51.3 固定）
VIBEVOICE_MIN_TRANSFORMERS = (4, 51)
VIBEVOICE_MODEL_ID = "microsoft/VibeVoice-Realtime-0.5B"
# VibeVoice 話者（demo/voices/streaming_model の .pt）。英語以外は実験的
VIBEVOICE_LANG_VOICE = {
    "ja": "jp-Spk1_woman",
    "en": "en-Emma_woman",
    "ko": "kr-Spk1_man",
    "de": "de-Spk1_woman",
    "fr": "fr-Spk1_woman",
    "it": "it-Spk0_woman",
    "nl": "nl-Spk1_woman",
    "pl": "pl-Spk1_woman",
    "pt": "pt-Spk1_woman",
    "es": "sp-Spk0_woman",  # 実験的（未取得ならフォールバック）
}
VIBEVOICE_SAMPLE_RATE = 24000

# ---------------------------------------------------------------------------
# エンジンシングルトン状態
# ---------------------------------------------------------------------------
_engines = {}          # engine_name -> context dict（エンジンごとの保持オブジェクト）
_engines_lock = threading.Lock()
# ローカル合成は GPU 推論を共有するため 1 スレッドで直列化する
# （同時合成 → 同一モデルの並行推論で CUDA エラー / 音声破損を防ぐ）
_synth_lock = threading.Lock()
# 合成処理中カウンタ（Dashboard が自動記録の開始トリガーに使用）
_synth_busy_lock = threading.Lock()
_synth_busy_count = 0


def _set_synth_busy(busy: bool):
    global _synth_busy_count
    with _synth_busy_lock:
        _synth_busy_count += 1 if busy else -1
        if _synth_busy_count < 0:
            _synth_busy_count = 0


def busy() -> bool:
    """現在 TTS 合成処理中かどうか。"""
    with _synth_busy_lock:
        return _synth_busy_count > 0


# ---------------------------------------------------------------------------
# 依存検出
# ---------------------------------------------------------------------------
def loaded_device(engine: str):
    """エンジンがロード済みなら実行デバイスを返す（未ロードは None）。"""
    with _engines_lock:
        ctx = _engines.get((engine or "").lower())
        return ctx.get("device") if ctx else None


def engine_available(engine: str) -> tuple:
    """エンジンが使えるかを (ok, reason) で返す。reason が空文字なら使える。"""
    engine = (engine or "").lower()
    if engine == "edge":
        return True, ""
    if engine == "kokoro":
        try:
            import kokoro  # noqa: F401
            import soundfile  # noqa: F401
            return True, ""
        except ImportError as e:
            return False, f"kokoro が未インストールです（pip install kokoro soundfile misaki[ja]）: {e}"
        except Exception as e:
            return False, f"kokoro の読込に失敗: {e}"
    if engine == "vibevoice":
        try:
            import transformers
            ver = tuple(int(x) for x in transformers.__version__.split(".")[:2])
            if ver < VIBEVOICE_MIN_TRANSFORMERS:
                return False, (
                    f"VibeVoice には transformers {VIBEVOICE_MIN_TRANSFORMERS[0]}.{VIBEVOICE_MIN_TRANSFORMERS[1]} 以上が必要です"
                    f"（現在 {transformers.__version__}）。README の VibeVoice 導入手順を参照してください。"
                )
        except ImportError:
            return False, "transformers が未インストールです（VibeVoice の前提）。"
        try:
            import vibevoice  # noqa: F401
            return True, ""
        except ImportError:
            return False, "VibeVoice が未インストールです。README の VibeVoice 導入手順（git clone + pip install -e '.[streamingtts]'）を参照してください。"
        except Exception as e:
            return False, f"VibeVoice の読込に失敗: {e}"
    return False, f"不明な TTS エンジン: {engine}"


# ---------------------------------------------------------------------------
# 音声合成エントリ
# ---------------------------------------------------------------------------
def synthesize(engine: str, text: str, lang: str, device: str = "auto", model_path: str | None = None, voice: str | None = None) -> dict:
    """エンジンで音声合成し、WAV バイト＋文境界を返す。

    Args:
        model_path: ローカルモデルのディレクトリ（kokoro / vibevoice で使用）。
                    未指定なら HF から repo id でロード（通常はモデル管理の DL を利用）。
        voice: kokoro 用に設定で選ばれた音声名（日本語時のみ優先）。

    Returns:
        {
            "wav_bytes": bytes,          # PCM_16 WAV @ 24000Hz
            "mime": "audio/wav",
            "duration": float,           # 秒
            "boundaries": [{"t": float, "d": float}, ...],
            "boundaries_approx": bool,   # True: 文字数比例の推定境界
        }
    """
    engine = (engine or "").lower()
    if engine == "edge":
        raise ValueError("edge はクラウド TTS のため synthesize 不要")
    _set_synth_busy(True)
    try:
        with _synth_lock:
            if engine == "kokoro":
                return _sync_kokoro(text, lang, device, model_path=model_path, voice=voice)
            if engine == "vibevoice":
                return _sync_vibevoice(text, lang, device, model_path=model_path)
        raise ValueError(f"未対応の TTS エンジン: {engine}")
    finally:
        _set_synth_busy(False)


def load(engine: str, device: str = "auto", model_path: str | None = None) -> None:
    """エンジンを合成なしで強制ロードし、VRAM/メモリに常駐させる（起動時プリロード用）。"""
    engine = (engine or "").lower()
    if engine == "kokoro":
        # 既定言語（日本語）のパイプラインを作るだけでモデル＋音声が VRAM に載る。
        # 戻り値を ctx["pipelines"] に保存しないと破棄されて常駐しない（#137 レビュー指摘）
        _get_kokoro_ctx()["pipelines"]["j"] = _make_kokoro_pipeline("j", device, model_path=model_path)
        print(f"[tts] Kokoro preloaded on {device}")
    elif engine == "vibevoice":
        _vibevoice_load_model(model_path, device)
    else:
        # edge はクラウドのためロード不要（no-op）
        pass


# ---------------------------------------------------------------------------
# Kokoro
# ---------------------------------------------------------------------------
def _get_kokoro_ctx() -> dict:
    with _engines_lock:
        ctx = _engines.get("kokoro")
        if ctx is None:
            ctx = {"pipelines": {}}   # lang_code -> KPipeline
            _engines["kokoro"] = ctx
        return ctx


def _make_kokoro_pipeline(lang_code: str, device: str, model_path: str | None = None):
    """KPipeline を作成。device 引数はバージョンにより無い場合があるためフォールバック付き。

    model_path がローカルディレクトリの場合、config.json / kokoro-v1_0.pth / voices/ を
    直接ロードする（hf_hub_download を呼ばないためオフラインで動作する）。
    """
    from kokoro import KPipeline
    # loaded_device() が読めるよう、パイプライン作成時に実行デバイスを ctx に記録
    _get_kokoro_ctx()["device"] = device
    kwargs = {"lang_code": lang_code, "repo_id": "hexgrad/Kokoro-82M"}
    if device in ("cuda", "cpu"):
        kwargs["device"] = device
    if model_path:
        import os
        import torch
        from kokoro import KModel
        config = os.path.join(model_path, "config.json")
        pth = os.path.join(model_path, "kokoro-v1_0.pth")
        # KModel(config=..., model=...) を渡すと hf_hub_download をスキップ → 完全ローカル
        kmodel = KModel(repo_id="hexgrad/Kokoro-82M", config=config, model=pth)
        kmodel = kmodel.to(device if device in ("cuda", "cpu") else "cpu").eval()
        kwargs["model"] = kmodel
    try:
        pipeline = KPipeline(**kwargs)
    except TypeError:
        print(f"[tts-local] kokoro KPipeline(device=...) 非対応のため既定デバイスで作成")
        pipeline = KPipeline(lang_code=lang_code)
    if model_path:
        # ローカル voices を事前ロード（オフライン時に hf_hub_download を呼ばせない）
        import os
        import torch
        voices_dir = os.path.join(model_path, "voices")
        if os.path.isdir(voices_dir):
            for fname in os.listdir(voices_dir):
                if fname.endswith(".pt"):
                    name = fname[:-3]
                    if name not in pipeline.voices:
                        try:
                            pipeline.voices[name] = torch.load(os.path.join(voices_dir, fname), weights_only=True)
                        except Exception as e:
                            print(f"[tts-local] voice load skipped {name}: {e}")
    return pipeline


def _sync_kokoro(text: str, lang: str, device: str, model_path: str | None = None, voice: str | None = None) -> dict:
    import numpy as np

    lang_code = KOKORO_LANG.get((lang or "").split("-")[0].lower())
    if not lang_code:
        lang_code = "j"   # 未対応言語 → 日本語フォールバック
    # 日本語の場合は設定で選ばれた音声（ローカル voices に存在）を優先。他言語は既定音声。
    if lang_code == "j" and voice:
        voice = voice
    else:
        voice = KOKORO_VOICES.get(lang_code, "jf_alpha")

    ctx = _get_kokoro_ctx()
    pipelines = ctx["pipelines"]
    pipeline = pipelines.get(lang_code)
    if pipeline is None:
        pipeline = _make_kokoro_pipeline(lang_code, device, model_path=model_path)
        pipelines[lang_code] = pipeline

    # 文末区切り（。！？.!?）の直後で分割し、句点を除去せずに文ごとのセグメント＋境界を得る。
    # フロントの splitSentences（/[^。！？.!?]*[。！？.!?]|[^。！？.!?]+$/g）と同数・同順になる。
    # 注: kokoro は split_pattern=None だと分割せず 1 セグメントになるため、lookbehind で明示分割する。
    gen = pipeline(text, voice=voice, speed=1, split_pattern=r'(?<=[。！？.!?])')

    audio_parts = []
    boundaries = []
    cum = 0.0
    for _, _, audio in gen:
        seg_dur = len(audio) / KOKORO_SAMPLE_RATE
        boundaries.append({"t": round(cum, 3), "d": round(seg_dur, 3)})
        cum += seg_dur
        audio_parts.append(audio)

    if not audio_parts:
        raise RuntimeError("Kokoro が音声を生成しませんでした")

    full = np.concatenate(audio_parts) if len(audio_parts) > 1 else audio_parts[0]
    wav_bytes = _ndarray_to_wav(full, KOKORO_SAMPLE_RATE)
    return {
        "wav_bytes": wav_bytes,
        "mime": "audio/wav",
        "duration": round(cum, 3),
        "boundaries": boundaries,
        "boundaries_approx": False,
    }


# ---------------------------------------------------------------------------
# VibeVoice（Phase B）
# ---------------------------------------------------------------------------
def _get_vibevoice_ctx() -> dict:
    """vibevoice のシングルトンコンテキスト。

    device は初回ロード時に確定し、以後は使い続ける。VRAM 残量で CPU/CUDA を
    行き来してモデルを二重ロードするのを防ぐ（6GB 機では VRAM 圧迫で判定が
    揺れやすい）。
    """
    with _engines_lock:
        ctx = _engines.get("vibevoice")
        if ctx is None:
            ctx = {"model": None, "processor": None, "device": None, "dtype": None}
            _engines["vibevoice"] = ctx
        return ctx


def _cast_cache_dtype(cache, dtype):
    """プリフィル済みキャッシュの浮動小数点テンソルを dtype に再帰的に揃える。

    音声 .pt は bf16 保存だが、Turing 機ではモデルを fp16 でロードするため、
    クエリ（fp16）とキー/バリュー（bf16）の不整合で落ちるのを防ぐ。
    コンテナ（BaseModelOutputWithPast などの ModelOutput / DynamicCache）は
    「その場で値を差し替え」してクラスを保持する（再構築すると attribute アクセス
    `.past_key_values` が使えなくなる）。
    """
    # 遅延ロード方針のためモジュール冒頭では torch を import しない（キャッシュ済みで即戻る）
    import torch  # noqa: F401
    if torch.is_tensor(cache):
        if cache.is_floating_point() and cache.dtype != dtype:
            return cache.to(dtype=dtype)
        return cache
    if hasattr(cache, "key_cache") and hasattr(cache, "value_cache"):
        cache.key_cache = [_cast_cache_dtype(t, dtype) for t in cache.key_cache]
        cache.value_cache = [_cast_cache_dtype(t, dtype) for t in cache.value_cache]
        return cache
    if isinstance(cache, dict):
        for k in list(cache.keys()):
            cache[k] = _cast_cache_dtype(cache[k], dtype)
        return cache
    if isinstance(cache, tuple):
        return tuple(_cast_cache_dtype(v, dtype) for v in cache)
    if isinstance(cache, list):
        return [_cast_cache_dtype(v, dtype) for v in cache]
    return cache


def _vibevoice_voice_path(lang: str) -> str:
    """VibeVoice 話者 .pt をリポジトリの demo/voices/streaming_model から解決する。"""
    import vibevoice
    voices_dir = os.path.join(os.path.dirname(vibevoice.__file__), "..", "demo", "voices", "streaming_model")
    key = VIBEVOICE_LANG_VOICE.get((lang or "").split("-")[0].lower())
    if key:
        p = os.path.join(voices_dir, key + ".pt")
        if os.path.exists(p):
            return p
    pts = glob.glob(os.path.join(voices_dir, "*.pt"))
    if pts:
        return pts[0]
    raise RuntimeError(f"VibeVoice 話者ファイルが見つかりません（{voices_dir}）。"
                       "VibeVoice リポジトリの demo/voices が存在することを確認してください。")


def _vibevoice_load_model(model_path: str | None, device: str) -> None:
    """VibeVoice モデルを強制ロードし、ctx に保持する（合成はしない）。既にロード済みなら何もしない。

    - 初回ロード：デバイスはその時点の判定（pick_device）で確定し以後使い続ける。
      VRAM 残量が揺れても CPU/CUDA を往復して二重ロードしない。
    - Turing（SM75）以下は bf16 カーネルが一部未対応（生成時に
      "Got unsupported ScalarType BFloat16" で落ちる）→ fp16 を優先。
      bf16 は Ampere（SM80）以降のみ。
    """
    import torch
    from vibevoice.modular.modeling_vibevoice_streaming_inference import VibeVoiceStreamingForConditionalGenerationInference
    from vibevoice.processor.vibevoice_streaming_processor import VibeVoiceStreamingProcessor

    model_id = model_path or VIBEVOICE_MODEL_ID
    ctx = _get_vibevoice_ctx()
    if ctx["model"] is not None:
        return

    ctx["device"] = device if device in ("cuda", "cpu") else "cpu"
    if device == "cuda":
        cap = torch.cuda.get_device_capability(0)
        torch_dtype = torch.bfloat16 if cap[0] >= 8 else torch.float16
    else:
        torch_dtype = torch.float32
    load_device = ctx["device"]
    processor = VibeVoiceStreamingProcessor.from_pretrained(model_id)
    try:
        model = VibeVoiceStreamingForConditionalGenerationInference.from_pretrained(
            model_id,
            torch_dtype=torch_dtype,
            device_map=load_device,
            attn_implementation="sdpa",
        )
    except Exception:
        if load_device == "cuda":
            # 読込自体が bf16 等で失敗する場合の保険 → fp16 で再試行
            model = VibeVoiceStreamingForConditionalGenerationInference.from_pretrained(
                model_id,
                torch_dtype=torch.float16,
                device_map="cuda",
                attn_implementation="sdpa",
            )
            torch_dtype = torch.float16
        else:
            raise
    model.eval()
    model.set_ddpm_inference_steps(num_steps=5)
    ctx["model"] = model
    ctx["processor"] = processor
    ctx["dtype"] = str(torch_dtype)
    print(f"[tts] VibeVoice loaded on {load_device} ({torch_dtype})")


def _sync_vibevoice(text: str, lang: str, device: str, model_path: str | None = None) -> dict:
    """VibeVoice-Realtime-0.5B でチャンク全体を合成。文境界は文字数比例で推定（近似）。

    Args:
        model_path: ローカル snapshot ディレクトリ。未指定は HF repo id（VIBEVOICE_MODEL_ID）。

    - 未インストール時はインストール案内付き RuntimeError（app 側が 503 で返す）
    - VRAM が大きいため、6GB 機では Whisper と同居できない → app 側の pick_device が CPU へ落とす
    """
    ok, reason = engine_available("vibevoice")
    if not ok:
        raise RuntimeError(reason)

    import copy
    import numpy as np
    import torch
    from transformers.cache_utils import DynamicCache
    from transformers.modeling_outputs import BaseModelOutputWithPast

    _vibevoice_load_model(model_path, device)
    ctx = _get_vibevoice_ctx()
    # ロード済みデバイス・dtype を引き継ぐ（VRAM 判定の揺れで reload しない）
    device = ctx["device"]
    torch_dtype = torch.bfloat16 if ctx["dtype"] == "torch.bfloat16" else \
        torch.float16 if ctx["dtype"] == "torch.float16" else torch.float32

    processor = ctx["processor"]
    model = ctx["model"]

    voice_path = _vibevoice_voice_path(lang)
    target_device = device
    with torch.serialization.safe_globals([BaseModelOutputWithPast, DynamicCache]):
        all_prefilled = torch.load(voice_path, map_location=target_device, weights_only=True)
    # 音声 .pt は bf16 保存 → モデルの dtype に揃える（fp16 ロード時は必須）
    all_prefilled = _cast_cache_dtype(all_prefilled, torch_dtype)

    inputs = processor.process_input_with_cached_prompt(
        text=text, cached_prompt=all_prefilled, padding=True,
        return_tensors="pt", return_attention_mask=True)
    for k, v in inputs.items():
        if torch.is_tensor(v):
            inputs[k] = v.to(target_device)

    outputs = model.generate(
        **inputs, max_new_tokens=None, cfg_scale=1.5,
        tokenizer=processor.tokenizer, generation_config={"do_sample": False},
        verbose=False, show_progress_bar=False,
        all_prefilled_outputs=copy.deepcopy(all_prefilled),
    )
    audio = outputs.speech_outputs[0].detach().to("cpu").numpy()
    if audio.ndim > 1:
        audio = audio[0]
    if audio.dtype != np.float32:
        audio = audio.astype(np.float32)

    total = len(audio) / VIBEVOICE_SAMPLE_RATE
    # 文字数比例の推定境界（フロント splitSentences と同規則）
    sentences = _split_sentences(text)
    total_chars = sum(len(s) for s in sentences) or 1
    boundaries = []
    cum = 0.0
    for s in sentences:
        d = total * len(s) / total_chars
        boundaries.append({"t": round(cum, 3), "d": round(d, 3)})
        cum += d
    wav_bytes = _ndarray_to_wav(audio, VIBEVOICE_SAMPLE_RATE)
    return {
        "wav_bytes": wav_bytes,
        "mime": "audio/wav",
        "duration": round(total, 3),
        "boundaries": boundaries,
        "boundaries_approx": True,
    }


# ---------------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------------
_SENT_RE = re.compile(r"[^。！？.!?]*[。！？.!?]|[^。！？.!?]+")

def _split_sentences(text: str):
    """フロント splitSentences と同一規則で文を切り出す（比例境界推定用）。"""
    parts = [m.group(0) for m in _SENT_RE.finditer(text)]
    return parts or [text]


def _ndarray_to_wav(arr, sample_rate: int) -> bytes:
    """float32 numpy 配列を PCM_16 WAV バイト（in-memory）へ変換。"""
    import soundfile as sf
    buf = io.BytesIO()
    sf.write(buf, arr, sample_rate, format="WAV", subtype="PCM_16")
    return buf.getvalue()


def unload(engine: str | None = None) -> None:
    """指定エンジン（省略時は全て）をアンロードし VRAM を解放する。"""
    with _engines_lock:
        names = [engine] if engine else list(_engines.keys())
        for name in names:
            _engines.pop(name, None)
    gc.collect()
    try:
        import torch
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    except Exception:
        pass
