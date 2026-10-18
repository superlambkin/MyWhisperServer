#!/usr/bin/env python3
"""MyWhisperServer ポータブルパッケージを組み立てるビルドスクリプト。

リポジトリ直下で実行:  python build_portable.py [--dist DIR] [--skip-dl] [--python PATH]

- サーバ本体（dashboard/・whisper_server.py・ocr_server.py・bat・requirements.txt 等）をコピー
- python-build-standalone の Windows x86_64 3.10.x install_only を同梱（runtime/python）
- BtbN static ffmpeg を同梱（runtime/ffmpeg）
- SHA256SUMS.txt を生成

--skip-dl: ダウンロードをスキップ（任意で --python でローカル Python を指定）
--python PATH: --skip-dl 時にローカルの CPython インストール先を runtime/python へコピー
"""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tarfile
import tempfile
import urllib.request
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parent
DEFAULT_DIST = REPO / "dist" / "MyWhisperServer-portable"
VER = "1.8.13"
PY_MINOR = "3.10"

# パッケージに含めるルートファイル
ROOT_FILES = [
    "whisper_server.py",
    "ocr_server.py",
    "start_all.bat",
    "start_dashboard.bat",
    "start_whisper.bat",
    "stop_all.bat",
    "start_server.bat",
    "install.bat",
    "uninstall.bat",
    "README_install.txt",
    "requirements.txt",
    "install_ubuntu.sh",
]

# dashboard 内で除外するランタイム生成物/秘密情報/中間物
DASHBOARD_IGNORE = shutil.ignore_patterns(
    "data", "logs", "autostart", "__pycache__",
    "*.pyc", "*.log", "cdp_probe*",
)

FFMPEG_URL = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"


def log(msg: str) -> None:
    print(f"[build] {msg}", flush=True)


def download(url: str, dest: Path, timeout: int = 600) -> Path:
    log(f"download {url}")
    req = urllib.request.Request(url, headers={"User-Agent": "MyWhisperServer-build"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        with open(dest, "wb") as f:
            shutil.copyfileobj(r, f)
    log(f"saved {dest.stat().st_size} bytes -> {dest}")
    return dest


def find_python_asset() -> tuple[str, str]:
    """python-build-standalone の最新リリースから 3.10.x install_only(Win) を見つける。"""
    api = "https://api.github.com/repos/astral-sh/python-build-standalone/releases/latest"
    req = urllib.request.Request(api, headers={"User-Agent": "MyWhisperServer-build"})
    with urllib.request.urlopen(req, timeout=60) as r:
        release = json.load(r)
    for a in release["assets"]:
        name = a["name"]
        if (
            name.startswith(f"cpython-{PY_MINOR}.")
            and "x86_64-pc-windows-msvc-install_only.tar.gz" in name
        ):
            return name, a["browser_download_url"]
    raise RuntimeError("python-build-standalone 3.10.x install_only (Windows) asset not found")


def copy_dashboard(src: Path, dst: Path) -> None:
    shutil.copytree(src, dst, ignore=DASHBOARD_IGNORE)


def extract_python(archive: Path, runtime_python: Path) -> None:
    with tarfile.open(archive) as tf:
        root = "python"
        members = [m for m in tf.getmembers() if m.name == root or m.name.startswith(root + "/")]
        with tempfile.TemporaryDirectory() as td:
            tf.extractall(td, members=members)
            src = Path(td) / "python"
            shutil.copytree(src, runtime_python)


def extract_ffmpeg(archive: Path, runtime_ffmpeg: Path) -> None:
    with zipfile.ZipFile(archive) as zf:
        bin_members = [m for m in zf.namelist() if m.endswith("/bin/")]
        top = bin_members[0].split("/")[0] if bin_members else None
        with tempfile.TemporaryDirectory() as td:
            zf.extractall(td)
            src_bin = Path(td) / top / "bin"
            shutil.copytree(src_bin, runtime_ffmpeg / "bin")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dist", type=Path, default=DEFAULT_DIST)
    ap.add_argument("--skip-dl", action="store_true", help="python/ffmpeg のダウンロードをスキップ")
    ap.add_argument("--python", type=Path, default=None, help="--skip-dl 時にローカルCPythonをruntime/pythonへコピー")
    args = ap.parse_args()

    dist: Path = args.dist
    if dist.exists():
        log(f"removing existing {dist}")
        shutil.rmtree(dist)
    dist.mkdir(parents=True)

    # --- アプリ本体コピー ---
    log("copying app source")
    for f in ROOT_FILES:
        src = REPO / f
        if src.exists():
            shutil.copy2(src, dist / src.name)
        else:
            log(f"  WARN: missing {f}")
    copy_dashboard(REPO / "dashboard", dist / "dashboard")

    # --- Python 同梱 ---
    runtime_python = dist / "runtime" / "python"
    if args.skip_dl:
        if args.python and args.python.exists():
            log(f"copying local python from {args.python}")
            shutil.copytree(args.python, runtime_python)
        else:
            log("WARN: --skip-dl but no --python given; runtime/python left empty")
    else:
        name, url = find_python_asset()
        log(f"python asset: {name}")
        with tempfile.TemporaryDirectory() as td:
            dl = Path(td) / name
            download(url, dl)
            extract_python(dl, runtime_python)

    # --- ffmpeg 同梱 ---
    runtime_ffmpeg = dist / "runtime" / "ffmpeg"
    if args.skip_dl:
        log("WARN: skipping ffmpeg download (runtime/ffmpeg left empty)")
    else:
        with tempfile.TemporaryDirectory() as td:
            dl = Path(td) / "ffmpeg.zip"
            download(FFMPEG_URL, dl)
            extract_ffmpeg(dl, runtime_ffmpeg)

    # --- チェックサム ---
    log("writing SHA256SUMS.txt")
    entries = []
    for p in sorted(dist.rglob("*")):
        if p.is_file():
            entries.append(f"{sha256_file(p)}  {p.relative_to(dist).as_posix()}")
    (dist / "SHA256SUMS.txt").write_text("\n".join(entries) + "\n", encoding="utf-8")

    log(f"DONE: {dist}")
    log(f"  runtime/python: {runtime_python.exists()}  runtime/ffmpeg: {runtime_ffmpeg.exists()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
