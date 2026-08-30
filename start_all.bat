@echo off
rem ------------------------------------------------------------------
rem MyWhisperServer - Start all services (Windows)
rem Launches the Dashboard; Whisper / OCR are auto-started by it.
rem This script runs relative to its own location (no hardcoded paths).
rem ------------------------------------------------------------------
cd /d "%~dp0"
start "" "%~dp0start_dashboard.bat"
