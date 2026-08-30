@echo off
rem ------------------------------------------------------------------
rem MyWhisperServer - Start Whisper server (Windows)
rem This script runs relative to its own location (no hardcoded paths).
rem Whisper runs on the Python that has faster-whisper installed
rem (Python 3.14 on this machine) - NOT necessarily the Dashboard's Python.
rem ------------------------------------------------------------------
cd /d "%~dp0"

rem Resolve Python: venv -> .venv -> Python314 (faster-whisper) -> py -3.14 -> py -3.10 -> PATH python
set "PYEXE="
if exist "venv\Scripts\python.exe" set "PYEXE=venv\Scripts\python.exe"
if not defined PYEXE if exist ".venv\Scripts\python.exe" set "PYEXE=.venv\Scripts\python.exe"
if not defined PYEXE if exist "C:\Users\superlambkin\AppData\Local\Programs\Python\Python314\python.exe" set "PYEXE=C:\Users\superlambkin\AppData\Local\Programs\Python\Python314\python.exe"
if not defined PYEXE (
    py -3.14 --version >nul 2>&1 && set "PYEXE=py -3.14"
)
if not defined PYEXE (
    py -3.10 --version >nul 2>&1 && set "PYEXE=py -3.10"
)
if not defined PYEXE set "PYEXE=python"

echo [start_whisper] Dir: %CD%
echo [start_whisper] Python: %PYEXE%
%PYEXE% whisper_server.py
