@echo off
rem ------------------------------------------------------------------
rem MyWhisperServer - Start Dashboard (Windows)
rem This script runs relative to its own location (no hardcoded paths).
rem ------------------------------------------------------------------
cd /d "%~dp0"

rem Resolve Python: venv -> .venv -> py -3.10 -> known install path -> PATH python
set "PYEXE="
if exist "venv\Scripts\python.exe" set "PYEXE=venv\Scripts\python.exe"
if not defined PYEXE if exist ".venv\Scripts\python.exe" set "PYEXE=.venv\Scripts\python.exe"
if not defined PYEXE (
    py -3.10 --version >nul 2>&1 && set "PYEXE=py -3.10"
)
if not defined PYEXE if exist "C:\Users\superlambkin\AppData\Local\Programs\Python\Python310\python.exe" set "PYEXE=C:\Users\superlambkin\AppData\Local\Programs\Python\Python310\python.exe"
if not defined PYEXE set "PYEXE=python"

rem Whisper runs on a separate Python that has faster-whisper (3.14 here).
rem Dashboard passes it to whisper_server.py launch via WHISPER_PYTHON.
set "WHISPER_PYTHON="
if exist "C:\Users\superlambkin\AppData\Local\Programs\Python\Python314\python.exe" set "WHISPER_PYTHON=C:\Users\superlambkin\AppData\Local\Programs\Python\Python314\python.exe"

echo [start_dashboard] Dir: %CD%
echo [start_dashboard] Python: %PYEXE%
if defined WHISPER_PYTHON echo [start_dashboard] WHISPER_PYTHON: %WHISPER_PYTHON%
%PYEXE% dashboard\app.py
