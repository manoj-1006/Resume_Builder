@echo off
title Resume Creator - Starting App...
echo ============================================================
echo   Starting Resume Creator (Backend + Frontend)
echo ============================================================
echo.

:: Launch Backend in background window
start "Resume Creator API (Port 5097)" /min cmd /c "cd /d "%~dp0server" && dotnet run --launch-profile "ResumeAI (Console Only)""

:: Launch Frontend in background window
start "Resume Creator Client (Port 5173)" /min cmd /c "cd /d "%~dp0client" && npm run dev"

:: Wait 3 seconds for servers to initialize, then open browser
timeout /t 3 /nobreak >nul
start http://localhost:5173/

echo.
echo ============================================================
echo   Application is now running at:
echo   http://localhost:5173/
echo ============================================================
timeout /t 5 >nul
