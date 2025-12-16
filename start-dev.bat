@echo off
REM Development Server Startup Script
REM This script ensures you're in the correct directory before starting the dev server

cd /d "%~dp0"

echo ========================================
echo Starting Development Server
echo ========================================
echo Current Directory: %CD%
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Please run this script from the project root directory.
    echo Project root: %CD%
    pause
    exit /b 1
)

echo [OK] package.json found
echo Starting Next.js dev server...
echo.

npm run dev

