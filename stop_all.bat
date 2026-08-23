@echo off
cd /d C:\Users\superlambkin\whisper_server
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9000"') do (
    echo Stopping process %%a on port 9000
    taskkill /PID %%a /F 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9001"') do (
    echo Stopping process %%a on port 9001
    taskkill /PID %%a /F 2>nul
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":9100"') do (
    echo Stopping process %%a on port 9100 (OCR)
    taskkill /PID %%a /F 2>nul
)
echo Done
pause
