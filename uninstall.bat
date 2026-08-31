@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo   MyWhisperServer - Uninstall
echo ============================================================
echo.
echo   This removes the self-contained runtime artifacts
echo   (venv / models / dashboard data / logs) and the desktop
echo   shortcut. The source files under this folder are kept.
goto :confirm

:confirm
set "ANS="
set /p ANS="  Type Y to remove, N to cancel [N]: "
if /i "%ANS%"=="y" goto :remove
echo   Cancelled.
pause
exit /b 0

:remove
if exist "%USERPROFILE%\Desktop\MyWhisperServer.lnk" (
    del /f /q "%USERPROFILE%\Desktop\MyWhisperServer.lnk"
    echo   Removed desktop shortcut.
)
if exist "venv"        ( rmdir /s /q "venv"        & echo   Removed venv\ )
if exist "models"      ( rmdir /s /q "models"      & echo   Removed models\ )
if exist "dashboard\data"    ( rmdir /s /q "dashboard\data"    & echo   Removed dashboard\data\ )
if exist "dashboard\logs"    ( rmdir /s /q "dashboard\logs"    & echo   Removed dashboard\logs\ )
if exist "dashboard\autostart" ( rmdir /s /q "dashboard\autostart" & echo   Removed dashboard\autostart\ )
echo.
echo   Done. Runtime artifacts removed.
echo   (Delete this folder manually to fully remove the source.)
echo.
pause
