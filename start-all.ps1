Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Sri Balaji Computers (SBC) CCTV Website Launcher   " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

if (-not (Test-Path ".\backend\node_modules")) {
    Write-Host "`n[1/4] Installing Backend Dependencies..." -ForegroundColor Yellow
    Push-Location .\backend
    npm install
    Pop-Location
}

if (-not (Test-Path ".\frontend\node_modules")) {
    Write-Host "`n[2/4] Installing Frontend Dependencies..." -ForegroundColor Yellow
    Push-Location .\frontend
    npm install
    Pop-Location
}

Write-Host "`n[3/4] Starting Backend API Server on http://localhost:5000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

Write-Host "[4/4] Starting Frontend Vite Server on http://localhost:5173 ..." -ForegroundColor Green
Set-Location "$PSScriptRoot\frontend"
npm run dev

