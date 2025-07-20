# Quick Terminal Fix Script
# Run this to apply common terminal fixes

Write-Host "=== TERMINAL QUICK FIX ===" -ForegroundColor Green
Write-Host ""

# 1. Check if PowerShell 7 is installed
Write-Host "1. Checking PowerShell 7..." -ForegroundColor Yellow
$pwsh7 = Get-Command pwsh -ErrorAction SilentlyContinue
if ($pwsh7) {
    Write-Host "✓ PowerShell 7 found: $($pwsh7.Version)" -ForegroundColor Green
} else {
    Write-Host "✗ PowerShell 7 not found. Installing..." -ForegroundColor Red
    try {
        winget install Microsoft.PowerShell
        Write-Host "✓ PowerShell 7 installation started" -ForegroundColor Green
    } catch {
        Write-Host "✗ Could not install PowerShell 7 automatically" -ForegroundColor Red
        Write-Host "Please install manually from: https://github.com/PowerShell/PowerShell/releases" -ForegroundColor Yellow
    }
}

# 2. Fix execution policy
Write-Host ""
Write-Host "2. Checking execution policy..." -ForegroundColor Yellow
$currentPolicy = Get-ExecutionPolicy
Write-Host "Current policy: $currentPolicy"

if ($currentPolicy -eq "Restricted") {
    Write-Host "✗ Execution policy is too restrictive" -ForegroundColor Red
    try {
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Write-Host "✓ Execution policy set to RemoteSigned" -ForegroundColor Green
    } catch {
        Write-Host "✗ Could not change execution policy: $_" -ForegroundColor Red
    }
} else {
    Write-Host "✓ Execution policy is OK" -ForegroundColor Green
}

# 3. Check VS Code environment
Write-Host ""
Write-Host "3. VS Code environment..." -ForegroundColor Yellow
if ($env:TERM_PROGRAM -eq "vscode") {
    Write-Host "✓ Running in VS Code" -ForegroundColor Green
} else {
    Write-Host "⚠ Not detected as VS Code terminal" -ForegroundColor Yellow
    Write-Host "This is normal if running from PowerShell directly" -ForegroundColor Gray
}

# 4. Test basic functionality
Write-Host ""
Write-Host "4. Testing basic functionality..." -ForegroundColor Yellow
try {
    $location = Get-Location
    Write-Host "✓ Get-Location: $location" -ForegroundColor Green
    
    $date = Get-Date
    Write-Host "✓ Get-Date: $date" -ForegroundColor Green
    
    $version = $PSVersionTable.PSVersion
    Write-Host "✓ PowerShell Version: $version" -ForegroundColor Green
    
} catch {
    Write-Host "✗ Basic commands failed: $_" -ForegroundColor Red
}

# 5. Environment variables test
Write-Host ""
Write-Host "5. Environment test..." -ForegroundColor Yellow
$envFile = ".env.local"
if (Test-Path $envFile) {
    Write-Host "✓ Found $envFile" -ForegroundColor Green
} else {
    Write-Host "⚠ No $envFile found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== INSTRUCTIONS ===" -ForegroundColor Green
Write-Host "1. If PowerShell 7 was installed, restart VS Code"
Write-Host "2. In VS Code, press Ctrl+Shift+P and run 'Terminal: Select Default Profile'"
Write-Host "3. Choose 'PowerShell 7' or 'PowerShell'"
Write-Host "4. Open a new terminal with Ctrl+` (backtick)"
Write-Host "5. Test with: .\diagnose-terminal.ps1"

Write-Host ""
Write-Host "If issues persist:" -ForegroundColor Yellow
Write-Host "• Restart VS Code completely"
Write-Host "• Check Windows Terminal app settings"
Write-Host "• Try running as Administrator"
Write-Host "• Check antivirus software blocking terminal"
