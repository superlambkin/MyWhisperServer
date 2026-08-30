@echo off
rem ------------------------------------------------------------------
rem MyWhisperServer - Stop all services (Windows)
rem Kills processes LISTENING on 9000 (Whisper) / 9001 (Dashboard) / 9100 (OCR).
rem No working-directory dependency: netstat/taskkill are global.
rem LISTENING filter + PID 0 skip avoid TIME_WAIT noise from netstat.
rem S-3: tasklist で PID のプロセス名が python 系かを確認してから kill する
rem      （他ソフトが同ポートを一時的に使う場合の誤爆防止）。
rem ------------------------------------------------------------------
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":9000"') do (
    if not "%%a"=="0" (
        for /f "tokens=1" %%p in ('tasklist /FI "PID eq %%a" /FO CSV /NH 2^>nul') do (
            echo %%p | findstr /i "python" >nul && (
                echo Stopping process %%a on port 9000
                taskkill /PID %%a /F 2>nul
            )
        )
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":9001"') do (
    if not "%%a"=="0" (
        for /f "tokens=1" %%p in ('tasklist /FI "PID eq %%a" /FO CSV /NH 2^>nul') do (
            echo %%p | findstr /i "python" >nul && (
                echo Stopping process %%a on port 9001
                taskkill /PID %%a /F 2>nul
            )
        )
    )
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":9100"') do (
    if not "%%a"=="0" (
        for /f "tokens=1" %%p in ('tasklist /FI "PID eq %%a" /FO CSV /NH 2^>nul') do (
            echo %%p | findstr /i "python" >nul && (
                echo Stopping process %%a on port 9100 (OCR)
                taskkill /PID %%a /F 2>nul
            )
        )
    )
)
echo Done
pause
