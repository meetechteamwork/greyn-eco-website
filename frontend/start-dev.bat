@echo off
REM Development Server Startup Script
REM This script starts the Next.js development server from the frontend directory

cd /d "%~dp0"

echo ========================================
echo Starting Frontend Development Server
echo ========================================
echo Frontend Directory: %CD%
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the frontend directory.
    echo Frontend directory: %CD%
    pause
    exit /b 1
)

echo [OK] package.json found
echo Starting Next.js dev server...
echo.

npm run dev

