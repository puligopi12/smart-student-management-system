@echo off
echo ===================================================
echo Starting SmartEdu React Frontend (Port 5173)
echo ===================================================
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo Starting Vite development server...
call npm run dev
pause
