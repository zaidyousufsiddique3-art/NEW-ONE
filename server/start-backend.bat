@echo off
echo ========================================
echo ICT Study Copilot - Backend Setup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your Node.js installation
    pause
    exit /b 1
)

echo.
echo [2/3] Checking environment variables...
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create server/.env with your OpenAI API key
    echo See SETUP.md for instructions
    pause
    exit /b 1
)

echo.
echo [3/3] Starting backend server...
echo.
echo ========================================
echo Backend will start on http://localhost:3001
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Open upload-tool.html in your browser
echo 2. Click "Upload PDF to OpenAI"
echo 3. Start the frontend in a new terminal
echo.

call npm run dev
