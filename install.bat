@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ============================================================
echo   MyWhisperServer - Portable Installer
echo   Select GPU (CUDA) or CPU
echo ============================================================
echo.

rem --- 1. Detect GPU --------------------------------------------------------
set "GPU_DEFAULT=CPU"
where nvidia-smi >nul 2>&1 && set "GPU_DEFAULT=GPU"
echo   Detected environment : %GPU_DEFAULT%
set /p CHOICE="  GPU (CUDA) = G / CPU = C [default: %GPU_DEFAULT%] : "
set "MODE="
if /i "%CHOICE%"=="g" set "MODE=GPU"
if /i "%CHOICE%"=="c" set "MODE=CPU"
if not defined MODE set "MODE=%GPU_DEFAULT%"
echo   Selected            : %MODE%
echo.

rem --- 2. Create virtual environment -----------------------------------------
if not exist "runtime\python\python.exe" goto :NO_PYTHON
echo [1/5] Creating Python virtual environment...
if exist "venv\Scripts\python.exe" goto :REUSE_VENV
"runtime\python\python.exe" -m venv venv
if errorlevel 1 goto :VENV_FAIL
goto :VENV_DONE

:REUSE_VENV
echo        Reusing existing venv.
goto :VENV_DONE

:VENV_FAIL
echo [ERROR] venv creation failed.
pause
exit /b 1

:NO_PYTHON
echo [ERROR] runtime\python not found. Package is incomplete.
pause
exit /b 1

:VENV_DONE
set "VPY=venv\Scripts\python.exe"

echo [2/5] Upgrading pip...
"%VPY%" -m pip install --upgrade pip

rem --- 3. Install dependencies based on GPU/CPU choice ------------------------
echo [3/5] Installing dependencies ^(%MODE%^)...
if /i "%MODE%"=="GPU" goto :GPU_INSTALL

:CPU_INSTALL
echo        Installing torch / torchaudio (CPU)...
"%VPY%" -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
if errorlevel 1 goto :DEP_FAIL
echo        Installing paddlepaddle (CPU)...
"%VPY%" -m pip install paddlepaddle
if errorlevel 1 goto :DEP_FAIL
goto :REQ_INSTALL

:GPU_INSTALL
echo        Installing torch / torchaudio (CUDA 12.1)...
"%VPY%" -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu121
if errorlevel 1 goto :DEP_FAIL
echo        Installing paddlepaddle-gpu 3.3.1 (CUDA 11.8 index)...
"%VPY%" -m pip install paddlepaddle-gpu==3.3.1 -i https://www.paddlepaddle.org.cn/packages/stable/cu118/
if errorlevel 1 goto :DEP_FAIL

:REQ_INSTALL
echo        Installing remaining requirements...
"%VPY%" -m pip install -r requirements.txt
if errorlevel 1 goto :DEP_FAIL

rem --- 4. Create desktop shortcut --------------------------------------------
echo [4/5] Creating desktop shortcut...
if exist "start_server.bat" goto :MKSHORTCUT_SERVER
if exist "start_all.bat" goto :MKSHORTCUT_ALL
goto :NOSHORTCUT

:MKSHORTCUT_SERVER
powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\MyWhisperServer.lnk'); $s.TargetPath='%~dp0start_server.bat'; $s.WorkingDirectory='%~dp0'; $s.Save()"
echo        Shortcut created on the desktop.
goto :INSTALL_DONE

:MKSHORTCUT_ALL
powershell -NoProfile -Command "$s=(New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Desktop')+'\MyWhisperServer.lnk'); $s.TargetPath='%~dp0start_all.bat'; $s.WorkingDirectory='%~dp0'; $s.Save()"
echo        Shortcut created on the desktop.
goto :INSTALL_DONE

:NOSHORTCUT
echo        WARNING: start_server.bat / start_all.bat not found; shortcut skipped.

:INSTALL_DONE
echo [5/5] Done!
echo.
echo   ============================================================
echo     Install complete.
echo     Launch "MyWhisperServer" on the desktop.
echo     First time: open http://localhost:9001 and download
echo     Whisper / PaddleOCR models from the Model Management page.
echo   ============================================================
echo.
pause
exit /b 0

:DEP_FAIL
echo [ERROR] Dependency installation failed.
echo        This may be caused by network issues or a wrong GPU/CPU choice.
pause
exit /b 1
