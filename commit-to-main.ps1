# PowerShell script to commit and push to main branch
# Run this from the project root directory

Set-Location "c:\BeeTech VSCODE PROJECTS\KIRO-BEETECH"

Write-Host "🔍 Checking git status..." -ForegroundColor Cyan
git status

Write-Host "`n📦 Staging all changes..." -ForegroundColor Cyan
git add -A

Write-Host "`n💾 Committing changes..." -ForegroundColor Cyan
git commit -m "feat: Complete Phase 1 implementation with navigation, dashboard, and items management

- ✅ Next.js 15.4.1 project foundation with TypeScript
- ✅ Complete navigation system with mobile-responsive sidebar
- ✅ Dashboard with business metrics and sample data
- ✅ Items management page with search, filtering, and sample inventory
- ✅ Core business logic utilities (WAC, cycle count alerts, recipe scaling)
- ✅ Deployment scripts and enhanced copilot instructions
- ✅ Complete .kiro specifications for formal project management
- ✅ Log cleanup utilities and improved .gitignore

Architecture:
- App Router with shadcn/ui components
- TanStack Query for state management
- Supabase client setup ready for database integration
- Mobile-first responsive design with BigCommerce-inspired UI
- Complete TypeScript interfaces and utility functions

Next: Phase 2 database schema implementation"

Write-Host "`n🚀 Pushing to main branch..." -ForegroundColor Cyan
git push origin main

Write-Host "`n✅ Successfully committed and pushed to main!" -ForegroundColor Green
