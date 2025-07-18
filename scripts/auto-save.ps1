# Project-Wide Auto-Save Git Script for Development Sessions
# Run this in background during development to auto-commit periodically
# Usage: .\scripts\auto-save.ps1
# Usage: .\scripts\auto-save.ps1 -IntervalMinutes 30 -Subproject "sheetsapp"

param(
    [int]$IntervalMinutes = 15,  # How often to check for changes
    [switch]$DryRun = $false,    # Show what would be committed without actually committing
    [string]$Subproject = ""     # Focus on specific subproject (e.g., "sheetsapp", "myapp")
)

Write-Host "🤖 Auto-save git monitor starting..." -ForegroundColor Cyan
Write-Host "� Working directory: $(Get-Location)" -ForegroundColor Gray
Write-Host "�📅 Checking for changes every $IntervalMinutes minutes" -ForegroundColor Yellow
if ($Subproject) {
    Write-Host "🎯 Focusing on subproject: $Subproject" -ForegroundColor Cyan
}
Write-Host "🛑 Press Ctrl+C to stop" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "🧪 DRY RUN MODE - No actual commits will be made" -ForegroundColor Magenta
}

$sessionStart = Get-Date
$commitCount = 0

while ($true) {
    try {
        # Check if there are any changes
        $changes = git status --porcelain
        
        # Filter for subproject if specified
        if ($Subproject -and $changes) {
            $changes = $changes | Where-Object { $_ -like "*$Subproject*" }
        }
        
        if ($changes) {
            $changeCount = ($changes | Measure-Object).Count
            $timestamp = Get-Date -Format "HH:mm:ss"
            
            if ($Subproject) {
                Write-Host "[$timestamp] 📝 Found $changeCount changes in ${Subproject}" -ForegroundColor Yellow
            } else {
                Write-Host "[$timestamp] 📝 Found $changeCount changes" -ForegroundColor Yellow
            }
            
            # Create auto-commit message
            $autoMessage = "Auto-save: $(Get-Date -Format 'MMM dd HH:mm')"
            if ($Subproject) {
                $autoMessage = "[$Subproject] $autoMessage"
            }
            $autoMessage = "$autoMessage - $changeCount files changed"
            
            if ($DryRun) {
                Write-Host "🧪 Would commit: '$autoMessage'" -ForegroundColor Magenta
                git status --short
            } else {
                # Auto-commit changes
                git add .
                git commit -m "$autoMessage"
                
                if ($LASTEXITCODE -eq 0) {
                    $commitCount++
                    Write-Host "✅ Auto-committed: '$autoMessage'" -ForegroundColor Green
                } else {
                    Write-Host "❌ Auto-commit failed" -ForegroundColor Red
                }
            }
        } else {
            $timestamp = Get-Date -Format "HH:mm:ss"
            Write-Host "[$timestamp] ✨ No changes detected" -ForegroundColor Gray
        }
        
        # Wait for next check
        Start-Sleep -Seconds ($IntervalMinutes * 60)
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        Start-Sleep -Seconds 30  # Wait 30 seconds before retrying
    }
}

Write-Host "🏁 Auto-save session ended. Total commits: $commitCount" -ForegroundColor Cyan
