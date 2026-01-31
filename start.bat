@echo off
title Greyn Eco - Development Server
echo ============================================
echo   Greyn Eco - Starting Development Servers
echo ============================================
echo.

:: Start Backend Server
echo [1/2] Starting Backend Server...
cd backend
start "Greyn Backend" cmd /k "npm run dev"
cd ..

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

:: Start Frontend Server
echo [2/2] Starting Frontend Server...
cd frontend
start "Greyn Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ============================================
echo   Servers Started Successfully!
echo ============================================
echo.
echo   Backend:  http://localhost:5000/api
echo   Frontend: http://localhost:3000
echo.
echo   Press any key to exit this window...
pause > nul
