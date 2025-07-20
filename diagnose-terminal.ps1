# Terminal Diagnosis Script
# Run this to identify terminal configuration issues

Write-Host "=== TERMINAL DIAGNOSIS ===" -ForegroundColor Green
Write-Host ""

# 1. Check PowerShell Version
Write-Host "1. PowerShell Version:" -ForegroundColor Yellow
$PSVersionTable | Format-Table

# 2. Check available shells
Write-Host "2. Available Shells:" -ForegroundColor Yellow
Write-Host "Current Shell: $($env:SHELL)"
Write-Host "Current ComSpec: $($env:COMSPEC)"

# 3. Check VS Code terminal settings
Write-Host "3. VS Code Related:" -ForegroundColor Yellow
Write-Host "TERM: $($env:TERM)"
Write-Host "TERM_PROGRAM: $($env:TERM_PROGRAM)"
Write-Host "VSCODE_INJECTION: $($env:VSCODE_INJECTION)"

# 4. Check if we're in VS Code terminal
Write-Host "4. Environment Check:" -ForegroundColor Yellow
if ($env:TERM_PROGRAM -eq "vscode") {
    Write-Host "✓ Running in VS Code terminal" -ForegroundColor Green
} else {
    Write-Host "✗ Not detected as VS Code terminal" -ForegroundColor Red
}

# 5. List PowerShell installations
Write-Host "5. PowerShell Installations:" -ForegroundColor Yellow
Get-Command pwsh -ErrorAction SilentlyContinue | Select-Object Name, Version, Source
Get-Command powershell -ErrorAction SilentlyContinue | Select-Object Name, Version, Source

# 6. Check execution policy
Write-Host "6. Execution Policy:" -ForegroundColor Yellow
Get-ExecutionPolicy -List

# 7. Test basic commands
Write-Host "7. Basic Command Test:" -ForegroundColor Yellow
try {
    $testResult = Get-Location
    Write-Host "✓ Get-Location works: $testResult" -ForegroundColor Green
} catch {
    Write-Host "✗ Get-Location failed: $_" -ForegroundColor Red
}

# 8. Check long-running process capability
Write-Host "8. Process Test:" -ForegroundColor Yellow
$job = Start-Job { Start-Sleep 2; "Job completed" }
$result = Wait-Job $job | Receive-Job
Remove-Job $job
Write-Host "✓ Background job test: $result" -ForegroundColor Green

Write-Host ""
Write-Host "=== RECOMMENDATIONS ===" -ForegroundColor Green

# Check for common issues
$issues = @()
$solutions = @()

if ($PSVersionTable.PSVersion.Major -lt 7) {
    $issues += "Using Windows PowerShell instead of PowerShell 7"
    $solutions += "Install PowerShell 7: winget install Microsoft.PowerShell"
}

if (-not $env:VSCODE_INJECTION) {
    $issues += "VS Code environment not detected"
    $solutions += "Restart VS Code or check terminal.integrated.defaultProfile.windows setting"
}

$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    $issues += "Execution policy is too restrictive"
    $solutions += "Run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
}

if ($issues.Count -eq 0) {
    Write-Host "✓ No obvious issues detected" -ForegroundColor Green
} else {
    Write-Host "Issues found:" -ForegroundColor Red
    $issues | ForEach-Object { Write-Host "  • $_" -ForegroundColor Red }
    Write-Host ""
    Write-Host "Suggested solutions:" -ForegroundColor Yellow
    $solutions | ForEach-Object { Write-Host "  • $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "=== NEXT STEPS ===" -ForegroundColor Green
Write-Host "1. Review the output above"
Write-Host "2. Apply suggested solutions if needed"
Write-Host "3. Restart VS Code after making changes"
Write-Host "4. Test with simple commands first"
