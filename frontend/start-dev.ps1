# Development Server Startup Script
# This script starts the Next.js development server from the frontend directory

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Frontend Development Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Frontend Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the frontend directory." -ForegroundColor Red
    Write-Host "Frontend directory: $scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ package.json found" -ForegroundColor Green
Write-Host "Starting Next.js dev server..." -ForegroundColor Green
Write-Host ""

npm run dev

