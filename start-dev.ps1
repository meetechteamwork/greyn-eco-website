# Development Server Startup Script
# This script ensures you're in the correct directory before starting the dev server

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Development Server" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Red
    Write-Host "Project root: $scriptPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ package.json found" -ForegroundColor Green
Write-Host "Starting Next.js dev server..." -ForegroundColor Green
Write-Host ""

npm run dev

