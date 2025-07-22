---
title: 'Development Guide'
description: 'Complete development setup, standards, and workflow for internal business application'
purpose: 'Reference for development process, technical standards, and project dependencies'
last_updated: 'July 22, 2025'
doc_type: 'development-reference'
related: ['README.md', 'technical-design.md', 'tasks.md']
---

# Development Guide

Complete development setup, standards, and workflow for the internal BTINV inventory management system.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 🚀 **Quick Setup**

### Prerequisites
- Node.js 18+ and pnpm
- Git with SSH keys configured
- VS Code or Cursor IDE

### Initial Setup
```bash
# Clone and setup
git clone git@github.com:vzhick2/kiro-beetech.git
cd kiro-beetech
pnpm install

# Setup symlinks (Windows - run as Administrator)
.\scripts\setup-symlinks.ps1

# Start development
pnpm dev
```

## 📋 **Development Philosophy**

Balance speed and stability for both human and AI developers:

- **Git Workflow**: Feature branches with PRs to main; self-approved PRs acceptable for solo work
- **Code Quality**: ESLint + Prettier with pre-commit hooks for consistency
- **Testing**: Unit tests with Vitest for critical business logic (WAC calculations, negative inventory alerts, cycle count algorithms)
- **Spec-Driven Development**: Follow requirements.md → data-model.md → tasks.md → implementation

## 🛠️ **Technology Stack**

### **Core Framework & Runtime**

| Package           | Version | Status        | Notes                               |
| ----------------- | ------- | ------------- | ----------------------------------- |
| **Next.js**       | 15.4.1  | ✅ **Latest** | Upgraded from 14.2.x with Turbopack |
| **React**         | 19.1.0  | ✅ **Latest** | Upgraded from 18.3.x                |
| **TypeScript**    | 5.8.3   | ✅ **Latest** | Upgraded from 5.4.x                 |

### **UI & Styling**

| Package              | Version | Status        | Notes                               |
| -------------------- | ------- | ------------- | ----------------------------------- |
| **Tailwind CSS**     | 4.1.11  | ✅ **Latest** | Upgraded to 4.x for latest features |
| **Radix UI**         | Latest  | ✅ **Latest** | Headless accessible components       |
| **Lucide React**     | 0.525.0 | ✅ **Latest** | Icon library                        |

### **Data Management**

| Package            | Version | Status        | Notes                               |
| ------------------ | ------- | ------------- | ----------------------------------- |
| **Supabase JS**    | 2.52.0  | ✅ **Latest** | Backend and database                |
| **TanStack Query** | 5.83.0  | ✅ **Latest** | Server state management             |

### **Development Tools**

| Package           | Version | Purpose                    |
| ----------------- | ------- | -------------------------- |
| **ESLint**        | Latest  | Code linting               |
| **Prettier**      | Latest  | Code formatting            |
| **Husky**         | Latest  | Git hooks                  |
| **Lint Staged**   | Latest  | Pre-commit linting         |

## 🔧 **Environment Setup**

### **Symbolic Links Configuration**

This project uses symbolic links to eliminate duplicate configuration files:

#### **Current Symlinks**
- **AI Instructions**: `.cursorrules` → `.vscode/copilot-instructions.md`
- **MCP Configuration**: `.cursor/mcp.json` → `../mcp.json`

#### **Creating Symlinks (Windows)**
Run as Administrator in PowerShell:
```powershell
# Navigate to project root
cd "C:\BeeTech VSCODE PROJECTS\KIRO-BEETECH"

# Create AI instructions symlink
Remove-Item ".cursorrules" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path ".cursorrules" -Target ".vscode\copilot-instructions.md"

# Create MCP configuration symlink
Remove-Item ".cursor\mcp.json" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path ".cursor\mcp.json" -Target "..\mcp.json"
```

### **Supabase Configuration**

#### **Remote Development** (Current)
- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `btinv-beetech`
- **Region**: `us-east-2`

#### **Available Scripts**
```bash
# Generate types from remote database
pnpm supabase:types
```

#### **Environment Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

## 📝 **Coding Standards & Best Practices**

### **Constants & Enums**
- Use central `constants.ts` for shared values (e.g., `ITEM_TYPES`, `TRANSACTION_TYPES`)
- Database enforces this with PostgreSQL `ENUM` types as documented in data-model.md

### **Display ID Pattern**
- Apply consistently across entities - use auto-generated displayId for user references
- Maintain UUID primary keys for performance
- Format: 'PO-YYYYMMDD-XXX' for purchases, 'BATCH-YYYYMMDD-XXX' for batches

### **Component Naming**
- Use `[View/Context][ComponentName]` structure (e.g., `ItemsTable`, `PurchaseForm`)
- Self-documenting codebase with clear naming conventions

### **Error & Feedback Handling**
- Inline validation for immediate user feedback
- Standardized error types from data-model.md
- Translate technical errors into plain, actionable language in UI toasts

## 🔧 **Dependency Management**

### **Critical Workflow Rules**
⚠️ **NEVER commit package.json changes without updating pnpm-lock.yaml**

#### **Adding New Dependencies**
```bash
# Add runtime dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Always commit BOTH files together
git add package.json pnpm-lock.yaml
git commit -m "Add package-name dependency"
```

#### **Dependency Updates**
```bash
# Update specific package
pnpm update package-name

# Update all dependencies
pnpm update

# Verify lockfile is synchronized
pnpm install --frozen-lockfile
```

#### **CI/CD Verification**
```bash
# Use in CI pipelines to ensure lockfile sync
pnpm install --frozen-lockfile

# For local verification before committing
pnpm install --frozen-lockfile && pnpm build
```

#### **Troubleshooting Lockfile Issues**
```bash
# If lockfile gets out of sync, regenerate it
rm pnpm-lock.yaml
pnpm install

# Verify everything works
pnpm install --frozen-lockfile
pnpm build
```

## 🎨 **Design System Reference**

### **Colors (from globals.css)**
```css
--app-sidebar: 220 46% 13%; /* #1e293b - Dark blue */
--app-header: 220 46% 13%; /* Same as sidebar */
--app-background: 210 20% 98%; /* #f8fafc - Light gray */
--app-hover: 220 46% 16%; /* #34455a - Hover state */
```

### **Typography**
- **Headers**: text-2xl font-semibold text-gray-800
- **Body**: text-sm text-gray-900
- **Muted**: text-gray-500, text-gray-600
- **Navigation**: text-gray-300 with hover:text-white

### **Spacing**
- **Cards**: p-6 for padding
- **Sections**: space-y-6, mb-6
- **Buttons**: px-3 py-2 for normal, px-4 py-2 for larger
- **Tables**: px-6 py-4 for cells

## 🔧 **Development Commands**

### **Quick Commands**
```bash
pnpm dev         # Runs on port 3000
pnpm build       # Build for production
pnpm lint        # Run ESLint
pnpm type-check  # TypeScript checking
```

### **Version Control & Releases**
```bash
# Create version tags for releases
git tag -a v1.0.0 -m "Initial production release"
git tag -a v1.1.0 -m "Added Google Sheets alternative"
git push origin --tags

# View version history
git tag -l --sort=-version:refname
```

## 🚀 **Development Workflow**

### **Step 1: Reference the Specs**
Before implementing any feature:
1. Read the relevant requirement in `requirements.md`
2. Check the design specifications in `technical-design.md`
3. Find the corresponding task in `tasks.md`
4. Update progress tracking in `tasks.md` when complete

### **Step 2: Follow the Architecture**
- **Components**: Located in `src/components/`
- **Pages**: Located in `src/app/`
- **Types**: Located in `src/types/`
- **Utilities**: Located in `src/lib/`

### **Step 3: Match the Design**
- **Colors**: Use the BigCommerce-inspired palette
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 4px/8px/16px/24px system
- **Components**: Mobile-first, accessible, consistent

## 🔒 **Privacy & Security**

- **No Analytics (MVP)**: Rely on Vercel/Supabase logs for essential monitoring
- **File Security**: CSV imports processed server-side with validation
- **Future**: Any analytics must be privacy-focused, opt-in only, and avoid PII

## 📊 **Project Progress**

For detailed task breakdown and progress tracking, see [tasks.md](./tasks.md).

### **Version History**
- **v1.0.0** - Initial production release with core inventory features
- **v1.1.0** - Added Google Sheets alternative implementation
- **Current** - Enhanced documentation and development workflow

## 🛠️ **Troubleshooting**

### **Common Development Issues**

#### **Supabase Connection Issues**
```bash
# Re-link to remote project
npx supabase link --project-ref jjpklpivpvywagmjjwpu

# Force pull latest schema
npx supabase db pull --force
```

#### **Build Failures**
```bash
# Check TypeScript errors
pnpm type-check

# Verify all imports are correct
pnpm lint

# Ensure environment variables are available
cat .env.local
```

#### **Performance Issues**
```bash
# Run bundle analysis
pnpm build:analyze

# Check for console errors
pnpm dev
# Open browser dev tools
```

---

_For detailed task breakdown, see `tasks.md`_
_For technical architecture, see `technical-design.md`_
