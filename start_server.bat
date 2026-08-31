@echo off
setlocal EnableExtensions
cd /d "%~dp0"
rem ============================================================
rem  MyWhisperServer - Portable launcher
rem  Adds the bundled venv / ffmpeg to PATH and starts the Dashboard.
rem  This file sits in the install directory, matching the layout
rem  produced by install.bat.
rem
rem  Note: start_dashboard.bat overrides WHISPER_PYTHON with its own
rem  resolution (machine-specific Python paths). To guarantee that the
rem  bundled venv Python is used, this launcher runs dashboard/app.py
rem  directly with the venv Python instead of calling start_dashboard.bat.
rem ============================================================

rem --- Prefer the bundled venv Python ------------------------------------
set "PYEXE=%~dp0venv\Scripts\python.exe"
if not exist "%PYEXE%" (
    echo [ERROR] %PYEXE% not found.
    echo         Run install.bat first to create the Python environment.
    pause
    exit /b 1
)

rem --- Add ffmpeg (for faster-whisper) and the venv to PATH --------------
set "PATH=%~dp0runtime\ffmpeg\bin;%~dp0venv\Scripts;%PATH%"

rem --- Run every process with the bundled venv Python ---------------------
set "WHISPER_PYTHON=%~dp0venv\Scripts\python.exe"

echo [start_server] Dir: %CD%
echo [start_server] Python: %PYEXE%
echo [start_server] WHISPER_PYTHON: %WHISPER_PYTHON%

rem --- Start the Dashboard (directly with the venv Python) ---------------
"%PYEXE%" "%~dp0dashboard\app.py"
