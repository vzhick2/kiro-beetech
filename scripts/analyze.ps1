# Project Analysis Tool - Understand codebase structure and metrics
# Usage: .\analyze.ps1

function Write-Info {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-FilePreview {
    param([string]$FilePath, [int]$Lines = 5)
    
    if (Test-Path $FilePath) {
        Write-Host "📄 $FilePath" -ForegroundColor Cyan
        $content = Get-Content $FilePath -TotalCount $Lines
        $content | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkGray }
        
        $totalLines = (Get-Content $FilePath | Measure-Object -Line).Lines
        if ($totalLines -gt $Lines) {
            Write-Host "   ... and $($totalLines - $Lines) more lines" -ForegroundColor DarkGray
        }
        Write-Host ""
    }
}

Clear-Host
Write-Host "🗺️ CODEBASE EXPLORER 🗺️" -ForegroundColor Yellow
Write-Host ""

$currentDir = Get-Location
Write-Discover "Starting exploration from: $currentDir"
Write-Host ""

# Project overview
Write-Host "📊 PROJECT OVERVIEW" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta

$allFiles = Get-ChildItem -Recurse -File | Where-Object { $_.Name -notlike ".*" -and $_.Directory.Name -ne "node_modules" }
$totalFiles = $allFiles.Count
$totalSize = ($allFiles | Measure-Object -Property Length -Sum).Sum / 1KB

Write-Host "📁 Total files: $totalFiles" -ForegroundColor Green
Write-Host "💾 Total size: $([math]::Round($totalSize, 2)) KB" -ForegroundColor Green

# File type breakdown
Write-Host ""
Write-Host "📋 FILE TYPES" -ForegroundColor Magenta
Write-Host "==============" -ForegroundColor Magenta

$extensions = $allFiles | Group-Object Extension | Sort-Object Count -Descending
$extensions | Select-Object -First 10 | ForEach-Object {
    $ext = if ($_.Name) { $_.Name } else { "(no extension)" }
    Write-Host "  $ext : $($_.Count) files" -ForegroundColor Yellow
}

# Recent activity
if (Test-Path ".git") {
    Write-Host ""
    Write-Host "⏰ RECENT ACTIVITY" -ForegroundColor Magenta
    Write-Host "==================" -ForegroundColor Magenta
    
    try {
        $recentCommits = git log --oneline -5 2>$null
        if ($recentCommits) {
            $recentCommits | ForEach-Object { Write-Host "  🔸 $_" -ForegroundColor Cyan }
        } else {
            Write-Host "  📝 No commits yet - this is a fresh start!" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  📝 Git history not available" -ForegroundColor Yellow
    }
}

# Interesting files to explore
Write-Host ""
Write-Host "🎯 INTERESTING FILES" -ForegroundColor Magenta
Write-Host "=====================" -ForegroundColor Magenta

# Look for main files
$mainFiles = @("README.md", "package.json", "Code.gs", "main.py", "index.js", "app.js", "index.html")
$foundMain = @()

foreach ($file in $mainFiles) {
    $found = Get-ChildItem -Recurse -Name $file -ErrorAction SilentlyContinue
    if ($found) {
        $foundMain += $found
        Write-Host "  🌟 $file - Project main file" -ForegroundColor Green
    }
}

# Look for config files
$configFiles = Get-ChildItem -Recurse -File | Where-Object { 
    $_.Name -match "\.(json|yml|yaml|toml|ini|config)$" -and 
    $_.Directory.Name -ne "node_modules" 
} | Select-Object -First 5

if ($configFiles) {
    Write-Host ""
    foreach ($file in $configFiles) {
        Write-Host "  ⚙️ $($file.Name) - Configuration" -ForegroundColor Yellow
    }
}

# Interactive exploration
Write-Host ""
Write-Host "🎮 EXPLORE INTERACTIVELY" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Magenta
Write-Host "What would you like to explore?"
Write-Host "  1. 📄 Preview main files"
Write-Host "  2. 🔍 Search for specific file"
Write-Host "  3. 📊 Analyze project structure"
Write-Host "  4. 🎲 Random file discovery"
Write-Host "  5. 🚪 Exit explorer"
Write-Host ""

$choice = Read-Host "Pick your adventure (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Discover "Previewing main project files..."
        Write-Host ""
        
        foreach ($file in $foundMain) {
            Show-FilePreview $file
        }
    }
    
    "2" {
        $searchTerm = Read-Host "🔍 Enter filename or pattern to search for"
        Write-Host ""
        
        $results = Get-ChildItem -Recurse -Name "*$searchTerm*" -ErrorAction SilentlyContinue
        if ($results) {
            Write-Discover "Found $($results.Count) matching files:"
            $results | Select-Object -First 10 | ForEach-Object {
                Write-Host "  📄 $_" -ForegroundColor Cyan
            }
        } else {
            Write-Host "🤷‍♀️ No files found matching '$searchTerm'" -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Discover "Analyzing project structure..."
        Write-Host ""
        
        Get-ChildItem -Directory | ForEach-Object {
            $fileCount = (Get-ChildItem $_.FullName -Recurse -File | Measure-Object).Count
            Write-Host "📁 $($_.Name) - $fileCount files" -ForegroundColor Cyan
        }
    }
    
    "4" {
        Write-Host ""
        Write-Discover "Random file discovery - here's something interesting..."
        Write-Host ""
        
        $randomFile = $allFiles | Get-Random
        Show-FilePreview $randomFile.FullName 10
        
        Write-Host "🎲 Want to see another? Run the explorer again!" -ForegroundColor Yellow
    }
    
    default {
        Write-Discover "Happy exploring! 🗺️"
    }
}

Write-Host ""
Write-Host "🧭 Explorer tip: Use VS Code's file search (Ctrl+P) for quick navigation!" -ForegroundColor Blue
