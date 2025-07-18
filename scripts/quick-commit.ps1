# Project-Wide Quick Git Commit Script
# Usage: .\scripts\quick-commit.ps1 "Your commit message" [subproject]
# Usage: .\scripts\quick-commit.ps1 "fix: Update WAC formula" sheetsapp
# Usage: .\scripts\quick-commit.ps1 (will prompt for message and show all changes)

param(
    [string]$Message = "",
    [string]$Subproject = ""
)

# If no message provided, prompt for one
if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = Read-Host "Enter commit message"
    if ([string]::IsNullOrWhiteSpace($Message)) {
        Write-Host "❌ Commit message required. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔄 Starting quick commit process..." -ForegroundColor Cyan
Write-Host "📁 Working directory: $(Get-Location)" -ForegroundColor Gray

# Check git status first
Write-Host "📋 Checking git status..." -ForegroundColor Yellow
$statusOutput = git status --porcelain

if ($statusOutput) {
    Write-Host "📝 Found changes:" -ForegroundColor Yellow
    $statusOutput | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "✨ No changes detected." -ForegroundColor Green
    exit 0
}

# If subproject specified, show only those changes
if ($Subproject) {
    Write-Host "🎯 Filtering for subproject: $Subproject" -ForegroundColor Cyan
    $filteredChanges = $statusOutput | Where-Object { $_ -like "*$Subproject*" }
    if ($filteredChanges) {
        Write-Host "📁 Changes in ${Subproject}:" -ForegroundColor Yellow
        $filteredChanges | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
    } else {
        Write-Host "⚠️  No changes found in $Subproject" -ForegroundColor Yellow
    }
}

# Add all changes
Write-Host "➕ Adding all changes..." -ForegroundColor Yellow
git add .

# Show what's staged
Write-Host "📦 Staged changes:" -ForegroundColor Yellow
$stagedFiles = git diff --cached --name-only
$stagedFiles | ForEach-Object { Write-Host "   ✅ $_" -ForegroundColor Green }

# Enhance commit message with context
$enhancedMessage = $Message
if ($Subproject) {
    $enhancedMessage = "[$Subproject] $Message"
}

# Add file count to message
$fileCount = ($stagedFiles | Measure-Object).Count
$enhancedMessage = "$enhancedMessage ($fileCount files)"

# Commit with enhanced message
Write-Host "💾 Committing with message: '$enhancedMessage'" -ForegroundColor Yellow
git commit -m "$enhancedMessage"

# Check if commit was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit successful!" -ForegroundColor Green
    Write-Host "🆔 Commit hash: $(git rev-parse --short HEAD)" -ForegroundColor Gray
    
    # Auto-push by default (beginner-friendly)
    Write-Host "� Auto-pushing to remote..." -ForegroundColor Yellow
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push successful!" -ForegroundColor Green
    } else {
        Write-Host "❌ Push failed!" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Commit failed!" -ForegroundColor Red
}

Write-Host "🏁 Done!" -ForegroundColor Cyan
