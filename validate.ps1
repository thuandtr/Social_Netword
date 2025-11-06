# Pre-Deploy Validation Script
Write-Host "🔍 Validating Application Before Deploy..." -ForegroundColor Cyan
Write-Host ""

$errors = 0

# Validate Backend
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Validating Backend..." -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

Set-Location backend

Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend dependencies installation failed!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
}
Write-Host ""

Write-Host "Building backend..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Backend built successfully" -ForegroundColor Green
}
Write-Host ""

Set-Location ..

# Validate Frontend
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Validating Frontend..." -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

Set-Location frontend

Write-Host "Installing dependencies..." -ForegroundColor Gray
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend dependencies installation failed!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}
Write-Host ""

Write-Host "Building frontend..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    $errors++
} else {
    Write-Host "✅ Frontend built successfully" -ForegroundColor Green
}
Write-Host ""

Set-Location ..

# Summary
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "Validation Complete" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""

if ($errors -eq 0) {
    Write-Host "✅ All validations passed!" -ForegroundColor Green
    Write-Host "Your code is ready to deploy to Docker and GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Test in production mode: npm run prod:build" -ForegroundColor White
    Write-Host "  2. Commit your changes: git add . && git commit -m 'message'" -ForegroundColor White
    Write-Host "  3. Push to GitHub: git push" -ForegroundColor White
    Write-Host ""
    exit 0
} else {
    Write-Host "❌ Validation failed with $errors error(s)!" -ForegroundColor Red
    Write-Host "Fix the errors above before deploying." -ForegroundColor Red
    Write-Host ""
    exit 1
}
