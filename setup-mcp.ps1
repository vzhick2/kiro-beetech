# MCP Setup Script for KIRO-BEETECH
# This script helps set up MCP servers for both VS Code and Cursor

Write-Host "KIRO-BEETECH MCP Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host ".env.local created! Please edit it with your tokens." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ".env.local already exists" -ForegroundColor Green
}

# Check if required environment variables are set
Write-Host "Checking environment variables..." -ForegroundColor Yellow

# Load .env.local if it exists
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value -and $value -ne "your_*_here" -and -not $value.StartsWith("your_")) {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
}

$requiredVars = @(
    "SUPABASE_ACCESS_TOKEN",
    "GITHUB_PERSONAL_ACCESS_TOKEN"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var)
    if (-not $value -or $value.StartsWith("your_")) {
        $missingVars += $var
        Write-Host "$var not configured" -ForegroundColor Red
    } else {
        Write-Host "$var configured" -ForegroundColor Green
    }
}

Write-Host ""

# Test MCP servers
Write-Host "Testing MCP server availability..." -ForegroundColor Yellow

# Test Supabase MCP
try {
    $null = npx -y @supabase/mcp-server-supabase@latest --help 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Supabase MCP server available" -ForegroundColor Green
    } else {
        Write-Host "Supabase MCP server test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "Error testing Supabase MCP server" -ForegroundColor Red
}

# Test GitHub MCP
try {
    $null = npx -y @modelcontextprotocol/server-github@latest --help 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "GitHub MCP server available" -ForegroundColor Green
    } else {
        Write-Host "GitHub MCP server test failed" -ForegroundColor Red
    }
} catch {
    Write-Host "Error testing GitHub MCP server" -ForegroundColor Red
}

Write-Host ""

# Summary and next steps
if ($missingVars.Count -gt 0) {
    Write-Host "Setup incomplete!" -ForegroundColor Yellow
    Write-Host "Please configure the following environment variables in .env.local:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "For token setup instructions, see docs/mcp-setup.md" -ForegroundColor Cyan
} else {
    Write-Host "MCP setup complete!" -ForegroundColor Green
    Write-Host "You can now use MCP servers in both VS Code and Cursor." -ForegroundColor Green
}

Write-Host ""
Write-Host "Quick links:" -ForegroundColor Cyan
Write-Host "   - Supabase tokens: https://supabase.com/dashboard/account/tokens" -ForegroundColor White
Write-Host "   - GitHub tokens: https://github.com/settings/tokens?type=beta" -ForegroundColor White
Write-Host "   - Setup guide: docs/mcp-setup.md" -ForegroundColor White
