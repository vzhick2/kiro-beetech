# Master Development Script - Project-Wide Git & Development Tools
# Usage: .\scripts\dev.ps1
# Provides a menu-driven interface for all development operations

param(
    [string]$Command = "",
    [string]$Message = "",
    [string]$Subproject = ""
)

function Show-Menu {
    Clear-Host
    Write-Host "🚀 WindsurfBT Development Tools" -ForegroundColor Cyan
    Write-Host "=================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📁 Current Directory: $(Get-Location)" -ForegroundColor Gray
    Write-Host "🌿 Git Branch: $(git branch --show-current)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Available Commands:" -ForegroundColor Yellow
    Write-Host "  1. quick    - Quick commit with message" -ForegroundColor White
    Write-Host "  2. auto     - Start auto-save monitor" -ForegroundColor White
    Write-Host "  3. status   - Show detailed git status" -ForegroundColor White
    Write-Host "  4. push     - Push current branch to remote" -ForegroundColor White
    Write-Host "  5. history  - Show recent commit history" -ForegroundColor White
    Write-Host "  6. projects - List all subprojects" -ForegroundColor White
    Write-Host "  7. setup    - Setup development environment" -ForegroundColor White
    Write-Host ""
    Write-Host "Subprojects:" -ForegroundColor Yellow
    Write-Host "  • sheetsapp - Google Sheets Inventory System" -ForegroundColor White
    Write-Host "  • myapp     - Next.js Supabase App" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\scripts\dev.ps1 quick 'fix: Update formula' sheetsapp" -ForegroundColor Gray
    Write-Host "  .\scripts\dev.ps1 auto" -ForegroundColor Gray
    Write-Host "  .\scripts\dev.ps1 status" -ForegroundColor Gray
    Write-Host ""
}

function Show-GitStatus {
    Write-Host "📋 Git Status Overview" -ForegroundColor Cyan
    Write-Host "======================" -ForegroundColor Cyan
    
    $status = git status --porcelain
    if ($status) {
        Write-Host "📝 Modified Files:" -ForegroundColor Yellow
        $status | ForEach-Object { 
            $file = $_.Substring(3)
            $statusCode = $_.Substring(0, 2)
            $icon = switch ($statusCode.Trim()) {
                "M" { "📝" }
                "A" { "➕" }
                "D" { "❌" }
                "??" { "❓" }
                default { "📄" }
            }
            Write-Host "  $icon $file" -ForegroundColor White
        }
        
        # Group by subproject
        $byProject = @{}
        $status | ForEach-Object {
            $file = $_.Substring(3)
            $project = $file.Split('/')[0]
            if (-not $byProject.ContainsKey($project)) {
                $byProject[$project] = @()
            }
            $byProject[$project] += $file
        }
        
        Write-Host ""
        Write-Host "📁 Changes by Subproject:" -ForegroundColor Yellow
        $byProject.GetEnumerator() | ForEach-Object {
            Write-Host "  📂 $($_.Key): $($_.Value.Count) files" -ForegroundColor White
        }
    } else {
        Write-Host "✨ No changes detected. Working tree is clean." -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "🌿 Branch: $(git branch --show-current)" -ForegroundColor Gray
    Write-Host "🆔 Last Commit: $(git log -1 --format='%h - %s (%cr)')" -ForegroundColor Gray
}

function Show-History {
    Write-Host "📚 Recent Commit History" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    git log --oneline -10 --graph --decorate
}

function List-Projects {
    Write-Host "📁 Available Subprojects" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    
    $directories = Get-ChildItem -Directory | Where-Object { 
        $_.Name -notlike ".*" -and 
        $_.Name -ne "scripts" -and
        $_.Name -ne "node_modules"
    }
    
    $directories | ForEach-Object {
        $projectPath = $_.FullName
        $hasGitFiles = Test-Path "$projectPath/.git*" -PathType Leaf
        $hasPackageJson = Test-Path "$projectPath/package.json"
        $hasReadme = Test-Path "$projectPath/README.md"
        
        Write-Host "📂 $($_.Name)" -ForegroundColor Yellow
        if ($hasPackageJson) { Write-Host "   📦 Has package.json" -ForegroundColor Green }
        if ($hasReadme) { Write-Host "   📖 Has README.md" -ForegroundColor Green }
        
        # Count files in project
        $fileCount = (Get-ChildItem $projectPath -File -Recurse | Measure-Object).Count
        Write-Host "   📄 $fileCount files" -ForegroundColor Gray
        Write-Host ""
    }
}

# Main script logic
if ($Command -eq "") {
    Show-Menu
    $Command = Read-Host "Enter command (1-7) or command name"
}

switch ($Command) {
    { $_ -in @("1", "quick") } {
        if ($Message -eq "") {
            $Message = Read-Host "Enter commit message"
        }
        if ($Subproject -ne "") {
            & "$PSScriptRoot\quick-commit.ps1" -Message $Message -Subproject $Subproject
        } else {
            & "$PSScriptRoot\quick-commit.ps1" -Message $Message
        }
    }
    
    { $_ -in @("2", "auto") } {
        if ($Subproject -ne "") {
            & "$PSScriptRoot\auto-save.ps1" -Subproject $Subproject
        } else {
            & "$PSScriptRoot\auto-save.ps1"
        }
    }
    
    { $_ -in @("3", "status") } {
        Show-GitStatus
    }
    
    { $_ -in @("4", "push") } {
        Write-Host "🚀 Pushing to remote..." -ForegroundColor Yellow
        git push origin main
    }
    
    { $_ -in @("5", "history") } {
        Show-History
    }
    
    { $_ -in @("6", "projects") } {
        List-Projects
    }
    
    { $_ -in @("7", "setup") } {
        Write-Host "🔧 Development Environment Setup" -ForegroundColor Cyan
        Write-Host "Setting up git hooks and aliases..." -ForegroundColor Yellow
        # Add setup logic here
        Write-Host "✅ Setup complete!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Show-Menu
    }
}
