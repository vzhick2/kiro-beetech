# MCP Server Startup Script
# This script starts the MCP servers with proper environment variables

Write-Host "🚀 Starting MCP Servers..." -ForegroundColor Green

# Set environment variables (use existing env vars or prompt user)
if (-not $env:SUPABASE_ACCESS_TOKEN) {
    $env:SUPABASE_ACCESS_TOKEN = Read-Host "Enter your Supabase access token"
}
if (-not $env:GITHUB_PERSONAL_ACCESS_TOKEN) {
    $env:GITHUB_PERSONAL_ACCESS_TOKEN = Read-Host "Enter your GitHub personal access token"
}

Write-Host "✅ Environment variables set" -ForegroundColor Green

# Test Supabase MCP Server
Write-Host "🔧 Testing Supabase MCP Server..." -ForegroundColor Yellow
try {
    $supabaseVersion = npx -y @supabase/mcp-server-supabase@0.4.5 --version 2>$null
    Write-Host "✅ Supabase MCP Server: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase MCP Server test failed" -ForegroundColor Red
}

# Test GitHub MCP Server
Write-Host "🔧 Testing GitHub MCP Server..." -ForegroundColor Yellow
try {
    npx -y @modelcontextprotocol/server-github --help 2>$null | Out-Null
    Write-Host "✅ GitHub MCP Server: Ready" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub MCP Server test failed" -ForegroundColor Red
}

Write-Host "🎉 MCP Servers are ready!" -ForegroundColor Green
Write-Host "💡 You can now use MCP functions for:" -ForegroundColor Cyan
Write-Host "   - Database operations (Supabase)" -ForegroundColor White
Write-Host "   - Repository operations (GitHub)" -ForegroundColor White 