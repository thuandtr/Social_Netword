# Quick Start Script for Development
Write-Host "🚀 Starting Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerRunning = docker info 2>&1 | Out-Null; $?
if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green
Write-Host ""

# Stop any existing containers
Write-Host "Cleaning up existing containers..." -ForegroundColor Yellow
docker compose -f docker-compose.dev.yml down 2>&1 | Out-Null
Write-Host "✅ Cleaned up" -ForegroundColor Green
Write-Host ""

# Start services
Write-Host "Starting services with hot reload..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Services starting:" -ForegroundColor White
Write-Host "  - MySQL Database (port 3306)" -ForegroundColor Gray
Write-Host "  - Redis Cache (port 6379)" -ForegroundColor Gray
Write-Host "  - Backend API (port 5000)" -ForegroundColor Gray
Write-Host "  - Frontend App (port 3000)" -ForegroundColor Gray
Write-Host ""
Write-Host "Hot reload enabled - your code changes will auto-update!" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan

docker compose -f docker-compose.dev.yml up
