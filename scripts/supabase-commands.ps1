# Supabase Commands Script
# This script provides common Supabase commands with password included
# Usage: .\scripts\supabase-commands.ps1

param(
    [string]$Command = "help",
    [string]$Password = ""
)

# Set the project reference
$PROJECT_REF = "jjpklpivpvywagmjjwpu"

# Common commands with password included
switch ($Command.ToLower()) {
    "link" {
        if ($Password) {
            npx supabase link --project-ref $PROJECT_REF -p $Password
        } else {
            Write-Host "Please provide password: -Password 'your_password'"
        }
    }
    "status" {
        npx supabase status
    }
    "api-keys" {
        npx supabase projects api-keys --project-ref $PROJECT_REF
    }
    "db-pull" {
        if ($Password) {
            npx supabase db pull --project-ref $PROJECT_REF -p $Password
        } else {
            Write-Host "Please provide password: -Password 'your_password'"
        }
    }
    "db-push" {
        if ($Password) {
            npx supabase db push --project-ref $PROJECT_REF -p $Password
        } else {
            Write-Host "Please provide password: -Password 'your_password'"
        }
    }
    "types" {
        npx supabase gen types typescript --project-id $PROJECT_REF --schema public > src/types/database.ts
    }
    "help" {
        Write-Host "Available commands:"
        Write-Host "  link     - Link to remote project"
        Write-Host "  status   - Show project status"
        Write-Host "  api-keys - Get API keys"
        Write-Host "  db-pull  - Pull database schema"
        Write-Host "  db-push  - Push migrations"
        Write-Host "  types    - Generate TypeScript types"
        Write-Host ""
        Write-Host "Usage examples:"
        Write-Host "  .\scripts\supabase-commands.ps1 -Command link -Password 'your_password'"
        Write-Host "  .\scripts\supabase-commands.ps1 -Command status"
        Write-Host "  .\scripts\supabase-commands.ps1 -Command types"
    }
    default {
        Write-Host "Unknown command: $Command"
        Write-Host "Use -Command help for available commands"
    }
} 