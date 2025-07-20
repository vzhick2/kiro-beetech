# KIRO-BEETECH Dependency Management Script
# PowerShell script for safe dependency management and lockfile verification
# Usage: .\manage-deps.ps1 [command]

param(
    [Parameter(Position=0)]
    [ValidateSet("verify", "fix", "add", "update", "help")]
    [string]$Command = "help"
)

function Write-Header {
    param([string]$Message)
    Write-Host "`n🔧 $Message" -ForegroundColor Cyan
    Write-Host ("=" * ($Message.Length + 3)) -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Test-PnpmAvailable {
    try {
        $null = Get-Command pnpm -ErrorAction Stop
        return $true
    }
    catch {
        Write-Error "pnpm is not installed or not in PATH"
        Write-Host "Install pnpm: npm install -g pnpm" -ForegroundColor Gray
        return $false
    }
}

function Test-LockfileSync {
    Write-Header "Verifying lockfile synchronization"
    
    if (-not (Test-PnpmAvailable)) { return $false }
    
    try {
        Write-Host "Running pnpm install --frozen-lockfile..."
        pnpm install --frozen-lockfile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Lockfile is synchronized with package.json"
            return $true
        }
        else {
            Write-Error "Lockfile is NOT synchronized with package.json"
            Write-Warning "Run '.\manage-deps.ps1 fix' to regenerate lockfile"
            return $false
        }
    }
    catch {
        Write-Error "Failed to verify lockfile: $($_.Exception.Message)"
        return $false
    }
}

function Repair-Lockfile {
    Write-Header "Regenerating lockfile from package.json"
    
    if (-not (Test-PnpmAvailable)) { return }
    
    Write-Warning "This will delete pnpm-lock.yaml and regenerate it"
    $confirm = Read-Host "Continue? (y/N)"
    
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Operation cancelled"
        return
    }
    
    try {
        # Backup existing lockfile
        if (Test-Path "pnpm-lock.yaml") {
            $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
            $backupName = "pnpm-lock.yaml.backup-$timestamp"
            Copy-Item "pnpm-lock.yaml" $backupName
            Write-Success "Backed up lockfile to $backupName"
        }
        
        # Remove lockfile and node_modules
        Write-Host "Removing pnpm-lock.yaml..."
        Remove-Item "pnpm-lock.yaml" -ErrorAction SilentlyContinue
        
        if (Test-Path "node_modules") {
            Write-Host "Removing node_modules..."
            Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        }
        
        # Regenerate
        Write-Host "Running pnpm install..."
        pnpm install
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Lockfile regenerated successfully"
            
            # Verify the fix
            Write-Host "`nVerifying the fix..."
            Verify-Lockfile
        }
        else {
            Write-Error "Failed to regenerate lockfile"
        }
    }
    catch {
        Write-Error "Failed to fix lockfile: $($_.Exception.Message)"
    }
}

function Show-Help {
    Write-Header "KIRO-BEETECH Dependency Management Tool"
    
    Write-Host @"
Commands:
  verify    - Check if lockfile is synchronized with package.json
  fix       - Regenerate lockfile from package.json (with backup)
  help      - Show this help message

Examples:
  .\manage-deps.ps1 verify
  .\manage-deps.ps1 fix

Best Practices:
  1. Always run 'verify' before committing
  2. Use 'fix' if lockfile gets out of sync
  3. Never manually edit pnpm-lock.yaml
  4. Always commit package.json and pnpm-lock.yaml together

For more info, see docs/development-guide.md
"@
}

# Main script logic
switch ($Command) {
    "verify" { 
        $result = Verify-Lockfile
        exit $(if ($result) { 0 } else { 1 })
    }
    "fix" { Fix-Lockfile }
    "help" { Show-Help }
    default { Show-Help }
}
