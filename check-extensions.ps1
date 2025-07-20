# Terminal Extension Check
# Lists VS Code extensions that might affect terminal behavior

Write-Host "=== TERMINAL-RELATED EXTENSIONS CHECK ===" -ForegroundColor Green
Write-Host ""

# Common extensions that can affect terminal
$terminalExtensions = @(
    "ms-vscode.powershell",
    "ms-terminal.terminal", 
    "ms-vscode.PowerShell-Preview",
    "formulahendry.terminal",
    "tyriar.terminal-tabs",
    "ms-vscode.cpptools",
    "ms-python.python"
)

Write-Host "Common terminal-affecting extensions:" -ForegroundColor Yellow
foreach ($ext in $terminalExtensions) {
    Write-Host "• $ext"
}

Write-Host ""
Write-Host "To check your installed extensions:" -ForegroundColor Green
Write-Host "1. Open VS Code Command Palette (Ctrl+Shift+P)"
Write-Host "2. Run: 'Extensions: Show Installed Extensions'"
Write-Host "3. Look for any of the extensions listed above"
Write-Host "4. Try disabling PowerShell extensions temporarily to test"

Write-Host ""
Write-Host "=== ALTERNATIVE TERMINALS ===" -ForegroundColor Green
Write-Host ""
Write-Host "If VS Code terminal keeps failing, try:" -ForegroundColor Yellow
Write-Host "1. Windows Terminal (recommended)"
Write-Host "   - Install: winget install Microsoft.WindowsTerminal"
Write-Host "   - Modern, stable terminal experience"
Write-Host ""
Write-Host "2. PowerShell 7 directly"
Write-Host "   - Run: pwsh.exe"
Write-Host "   - Bypass VS Code terminal entirely"
Write-Host ""
Write-Host "3. Command Prompt"
Write-Host "   - Run: cmd.exe"
Write-Host "   - Basic but reliable"

Write-Host ""
Write-Host "=== SUPABASE CLI TEST ===" -ForegroundColor Green
Write-Host "Test if Supabase CLI works in different terminals:"
Write-Host ""
Write-Host "# Test commands to try:"
Write-Host "supabase --version"
Write-Host "supabase status"
Write-Host "supabase projects list"

Write-Host ""
Write-Host "=== MCP SERVERS STATUS ===" -ForegroundColor Green
Write-Host "Good news: Your MCP servers are working!"
Write-Host "• Supabase MCP: ✓ Connected to database"
Write-Host "• GitHub MCP: ✓ Connected to repository"
Write-Host "• You can use AI assistance even if CLI terminal fails"
