---
title: 'Developer Guide'
description: 'Complete development setup, architecture, standards, and AI guidelines for internal business application'
purpose: 'Unified reference for developers covering setup, technical decisions, and development philosophy'
last_updated: 'July 23, 2025'
doc_type: 'developer-reference'
related: ['README.md', 'technical-reference.md', 'product-specification.md', 'tasks.md', '.vscode/copilot-instructions.md']
---

# Developer Guide

Complete developer reference covering setup, architecture, standards, and AI-driven development for the internal BTINV inventory management system.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## Table of Contents

1. [Quick Setup](#quick-setup)
2. [Development Philosophy](#development-philosophy)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Environment Setup](#environment-setup)
6. [Coding Standards](#coding-standards)
7. [AI Development Guidelines](#ai-development-guidelines)
8. [Technical Patterns](#technical-patterns)
9. [Dependency Management](#dependency-management)
10. [Troubleshooting](#troubleshooting)

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+ and pnpm
- Git with SSH keys configured
- VS Code or Cursor IDE

### Complete Installation Steps
```bash
# Clone and setup
git clone git@github.com:vzhick2/kiro-beetech.git
cd kiro-beetech
pnpm install

# Setup environment variables
cp .env.example .env.local
# Add your Supabase credentials from:
# https://supabase.com/dashboard/project/[your-project]/settings/api

# Setup symlinks (Windows - run as Administrator)
.\scripts\setup-symlinks.ps1

# Run database migrations (if needed)
pnpm supabase:migrate

# Start development
pnpm dev
```

### Environment Configuration

#### Supabase Configuration
- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `btinv-beetech`
- **Region**: `us-east-2`

#### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

#### Available Scripts
```bash
# Generate types from remote database
pnpm supabase:types
```

## 📋 Development Philosophy

### Business Value First

Balance speed and stability for both human and AI developers:

- **Git Workflow**: Feature branches with PRs to main; self-approved PRs acceptable for solo work
- **Code Quality**: ESLint + Prettier with pre-commit hooks for consistency
- **Testing**: Unit tests with Vitest for critical business logic (WAC calculations, negative inventory alerts, cycle count algorithms)
- **Spec-Driven Development**: Follow product-specification.md → technical-reference.md → tasks.md → implementation

### Small Business Context

- **Forgiving Data Entry**: Allow back-dating, editing, and corrections - small businesses need flexibility
- **Mobile-First UX**: Workshop/warehouse use requires touch-friendly interface (≥44px targets)
- **Direct Edit Workflows**: Enable in-place editing instead of multi-step forms
- **Risk-Appropriate Security**: Small scale = streamlined audit trails, focus on usability

### Technical Approach

- **Modular & Replaceable**: Design components for easy swaps (e.g., use TanStack Query for data fetching)
- **Human-Friendly Outputs**: Use clear, actionable language; structure responses with sections/bullets
- **Self-Validation**: Before finalizing outputs, simulate key scenarios and describe expected behavior
- **Professional Communication**: Keep all communication factual, professional, and focused on business value

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │    │   Supabase      │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend       │◄──►│   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
```

### Frontend Layer

- **Next.js 15.4.1** with App Router and Turbopack
- **React 19.1.0** with Server Components
- **TypeScript 5.5.4** for type safety
- **Tailwind CSS 4.1.11** for styling
- **Radix UI** for accessible components
- **TanStack Table** for data tables

### Backend Layer

- **Supabase** for database and authentication
- **Server Actions** for form handling and mutations
- **PostgreSQL** for data persistence
- **Row Level Security (RLS)** for data protection

### Data Layer

- **TanStack Query** for server state management
- **Zod** for runtime validation
- **Atomic database operations** for data consistency

### Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── actions/           # Server Actions
│   │   ├── csv-import.ts  # CSV import functionality
│   │   ├── items.ts       # Items CRUD operations
│   │   ├── purchases.ts   # Purchase management
│   │   ├── purchases-enhanced.ts # Allocation features
│   │   ├── inventory-deductions.ts # Deduction operations
│   │   └── seed-data.ts   # Sample data generation
│   ├── components/        # Reusable UI components
│   │   ├── import-export/ # Import/Export components
│   │   ├── items/         # Items-specific components
│   │   ├── layout/        # Layout components
│   │   └── ui/            # Base UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase/      # Supabase client setup
│   │   ├── utils/         # Business logic utilities
│   │   └── validations/   # Zod validation schemas
│   └── types/             # TypeScript type definitions
```

## 🚀 Technology Stack

### Core Framework & Runtime

| Package           | Version | Status        | Notes                               |
| ----------------- | ------- | ------------- | ----------------------------------- |
| **Next.js**       | 15.4.1  | ✅ **Current** | Upgraded from 14.2.x with Turbopack |
| **React**         | 19.1.0  | ✅ **Current** | Upgraded from 18.3.x                |
| **TypeScript**    | 5.5.4   | ✅ **Current** | Upgraded from 5.4.x                 |

### UI & Styling

| Package              | Version | Status        | Notes                               |
| -------------------- | ------- | ------------- | ----------------------------------- |
| **Tailwind CSS**     | 4.1.11  | ✅ **Current** | Upgraded to 4.x for latest features |
| **Radix UI**         | Latest  | ✅ **Current** | Headless accessible components       |
| **Lucide React**     | 0.525.0 | ✅ **Current** | Icon library                        |

### Data Management

| Package            | Version | Status        | Notes                               |
| ------------------ | ------- | ------------- | ----------------------------------- |
| **Supabase JS**    | 2.52.0  | ✅ **Current** | Backend and database                |
| **TanStack Query** | 5.83.0  | ✅ **Current** | Server state management             |

### Development Tools

| Package           | Version | Purpose                    |
| ----------------- | ------- | -------------------------- |
| **ESLint**        | 8.57.1  | Code linting               |
| **Prettier**      | 3.0.0   | Code formatting            |
| **Husky**         | 9.1.6   | Git hooks                  |
| **Lint Staged**   | 15.2.10 | Pre-commit linting         |

### Environment Configuration

#### Supabase Configuration
- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `btinv-beetech`
- **Region**: `us-east-2`

#### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

*Note: For quick reference badges, see the README.md Technology Stack section. This comprehensive breakdown serves as the authoritative source for version management and development tooling.*

## 🔧 Environment Setup

### Symbolic Links Configuration

This project uses symbolic links to eliminate duplicate configuration files:

#### Current Symlinks
- **AI Instructions**: `.cursorrules` → `.vscode/copilot-instructions.md`

## 📝 Coding Standards

### Constants & Enums
- Use central `constants.ts` for shared values (e.g., `ITEM_TYPES`, `TRANSACTION_TYPES`)
- Database enforces this with PostgreSQL `ENUM` types as documented in technical-reference.md

### Display ID Pattern
- Apply consistently across entities - use auto-generated displayId for user references
- Maintain UUID primary keys for performance
- Format: 'PO-YYYYMMDD-XXX' for purchases, 'BATCH-YYYYMMDD-XXX' for batches

### Component Naming
- Use `[View/Context][ComponentName]` structure (e.g., `ItemsTable`, `PurchaseForm`)
- Self-documenting codebase with clear naming conventions

### Error & Feedback Handling
- Inline validation for immediate user feedback
- Standardized error types from technical-reference.md
- Translate technical errors into plain, actionable language in UI toasts

## 🎨 Design System Reference

### Colors (from globals.css)
```css
--app-sidebar: 220 46% 13%; /* #1e293b - Dark blue */
--app-header: 220 46% 13%; /* Same as sidebar */
--app-background: 210 20% 98%; /* #f8fafc - Light gray */
--app-hover: 220 46% 16%; /* #34455a - Hover state */
```

### Typography
- **Headers**: text-2xl font-semibold text-gray-800
- **Body**: text-sm text-gray-900
- **Muted**: text-gray-500, text-gray-600
- **Navigation**: text-gray-300 with hover:text-white

### Spacing
- **Cards**: p-6 for padding
- **Sections**: space-y-6, mb-6
- **Buttons**: px-3 py-2 for normal, px-4 py-2 for larger
- **Tables**: px-6 py-4 for cells

### Design Guidelines
- **Colors**: Use the BigCommerce-inspired palette
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 4px/8px/16px/24px system
- **Components**: Mobile-first, accessible, consistent

## 🔒 Privacy & Security

- **No Analytics (MVP)**: Rely on Vercel/Supabase logs for essential monitoring
- **File Security**: CSV imports processed server-side with validation
- **Future**: Any analytics must be privacy-focused, opt-in only, and avoid PII

### AI Development Guidelines

This project uses Model Context Protocol (MCP) servers for AI-driven development. For comprehensive AI development guidelines and behavioral rules, see [.vscode/copilot-instructions.md](../.vscode/copilot-instructions.md).

#### MCP Integration

This project uses Model Context Protocol (MCP) servers for AI-driven development:

- **Supabase MCP**: Live database operations, schema queries, migrations
- **GitHub MCP**: Repository management, codebase search, automated commits
- **Context7 MCP**: Up-to-date library documentation and API references
- **Playwright MCP**: Browser automation and UI testing

### AI Development Workflow

1. **Check Current State**: Use MCP to understand database schema and project structure
2. **Ask Before Changes**: Confirm before implementing new features
3. **Follow Documentation**: Reference product-specification.md for features, technical-reference.md for schema
4. **Test with MCP**: Use Supabase MCP for database queries, Playwright MCP for UI testing
"Search for similar implementations of user authentication"
"Find all files that import the Items component"
"Create a PR for this feature branch"
"Review the changes in the last commit"

#### Iteration Mindset
- Propose evolutions aligned with tasks.md workflows
- When updating/generating docs, ensure:
  - YAML frontmatter (purpose, last_updated, doc_type, related)
  - Vision Support: Embed flexibility (e.g., back-dating support in schemas)

#### Self-Audit Steps
Before finalizing any output for this inventory project:
1. **Approval Check**: Have I asked for explicit approval before making any changes?

### Business Domain Guidelines

- **Terminology**: Use "cycle count alerts" not "inventory nudges", "Action Center" for dashboard notifications
- **Key Workflows**: Procure to Stock, Production Run, Bulk Sales Entry, Cycle Count, Monthly Reconciliation

## 🧮 Technical Patterns

### Core Architecture Patterns
- **Display ID Pattern**: User-facing IDs separate from UUID primary keys
- **WAC Calculation**: On-demand with caching in items table
- **Negative Inventory**: Supported with proper alerting
- **Mutable Transactions**: Allow corrections with audit timestamps

### Component Architecture
- **Server Components**: Default choice for Next.js 15
- **Client Components**: Use when interactivity is needed
- **Error Boundaries**: Comprehensive error handling
- **Form Handling**: Server Actions for mutations

## 📦 Dependency Management

### Package Manager Rules
- **Use pnpm**: Preferred package manager for consistency
- **Lockfile Integrity**: Avoid manually editing package.json dependencies
- **Clean Removal**: Remove unused dependencies when features are removed
- **Version Alignment**: Keep related packages in sync (React, @types/react, etc.)

### WAC Calculation

#### Fixed WAC Architecture

```sql
-- Corrected WAC calculation function
CREATE OR REPLACE FUNCTION calculate_weighted_average_cost(
  p_item_id UUID,
  p_new_quantity DECIMAL,
  p_new_unit_cost DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  v_current_quantity DECIMAL;
  v_current_wac DECIMAL;
  v_new_wac DECIMAL;
BEGIN
  -- Get current inventory state
  SELECT current_quantity, weighted_average_cost
  INTO v_current_quantity, v_current_wac
  FROM items
  WHERE item_id = p_item_id;

  -- Calculate new WAC
  IF (v_current_quantity + p_new_quantity) > 0 THEN
    v_new_wac := (
      (v_current_quantity * v_current_wac) + 
      (p_new_quantity * p_new_unit_cost)
    ) / (v_current_quantity + p_new_quantity);
  ELSE
    v_new_wac := p_new_unit_cost;
  END IF;

  RETURN ROUND(v_new_wac, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

#### WAC Integration with Purchases

```typescript
// Purchase finalization with WAC
export async function finalizePurchaseWithWAC(
  purchaseId: string,
  allocationData: AllocationResult
): Promise<AppResult<void>> {
  try {
    // Implementation details...
    
    // Update WAC for each line item
    for (const lineItem of lineItems) {
      await supabase.rpc('calculate_weighted_average_cost', {
        p_item_id: lineItem.itemId,
        p_new_quantity: lineItem.quantity,
        p_new_unit_cost: lineItem.allocatedUnitCost
      });
    }
    
    return { success: true };
  } catch (error) {
    return handleError(error, 'finalizePurchaseWithWAC');
  }
}
```

### Critical Workflow Rules
⚠️ **Important: Ensure pnpm-lock.yaml is updated when changing package.json**

#### Adding New Dependencies
```bash
# Add runtime dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Ensure BOTH files are committed together
git add package.json pnpm-lock.yaml
git commit -m "Add package-name dependency"
```

#### Dependency Updates
```bash
# Update specific package
pnpm update package-name

# Update all dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

#### Package Management Best Practices
- **Semantic Versioning**: Use exact versions for critical dependencies
- **Security Updates**: Regularly run `pnpm audit` and address vulnerabilities
- **Bundle Analysis**: Monitor bundle size with `pnpm build:analyze`
- **Dependency Cleanup**: Remove unused dependencies regularly

### Available Scripts
```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # Run ESLint
pnpm lint:fix              # Fix ESLint errors
pnpm type-check            # Run TypeScript checks
pnpm format                # Format with Prettier

# Database
pnpm supabase:types        # Generate TypeScript types
pnpm supabase:migrate      # Run migrations
pnpm supabase:reset        # Reset database

# AI Development (Optimized)
pnpm ai:validate           # Fast validation (type-check, lint, format)
pnpm ai:validate:full      # Full type-check for production
pnpm ai:fix               # Auto-fix common issues
pnpm ai:type-check        # Fast type-check only

# Git Sync (Post-MCP)
pnpm sync:after-mcp       # Automated stash/pull/pop after MCP operations
pnpm sync:force           # Quick pull when no local changes

# Version Control & Releases
# Create version tags for releases
git tag -a v1.0.0 -m "Initial production release"
git tag -a v1.1.0 -m "Enhanced documentation and development workflow"
git push origin --tags

# View version history
git tag -l --sort=-version:refname

# Production Analysis
pnpm build:analyze         # Bundle size analysis
```

## 🚀 Deployment & Production

### Vercel Auto-Deployment

The project uses Vercel for automatic deployments:

```bash
# Standard deployment workflow
git add .
git commit -m "descriptive message"
git push origin main
# Vercel automatically deploys and provides preview URL
```

### Pre-Deployment Checklist

Before pushing to production:

- ✅ **Code Quality**: `pnpm ai:validate` passes
- ✅ **Build Success**: `pnpm build` completes without errors
- ✅ **Environment Variables**: Configured in Vercel dashboard
- ✅ **Database**: Connections tested via Supabase MCP
- ✅ **Bundle Size**: Analyzed with `pnpm build:analyze`

### Environment Variables (Vercel Dashboard)

```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

### Post-Deployment Verification

- **Functional**: Homepage, navigation, forms, API endpoints
- **Performance**: Core Web Vitals, mobile responsiveness
- **Monitoring**: Vercel analytics, Supabase logs

### Rollback Strategy

If deployment issues occur:

1. **Vercel Dashboard**: One-click rollback to previous deployment
2. **Git Revert**: Use standard Git workflows for code rollbacks
3. **Database**: Supabase handles data persistence independently
4. **Quick Fix**: Test locally with `pnpm build && pnpm start`

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
- Check TypeScript errors: `pnpm type-check`
- Verify all imports are correct
- Ensure environment variables are available
- Run bundle analysis: `pnpm build:analyze`

#### Runtime Errors
- Check Supabase function logs
- Verify API endpoints are accessible
- Confirm database connections
- Check Vercel function logs for deployment issues

#### Performance Issues
- Run bundle analysis: `pnpm build:analyze`
- Optimize images and assets (use Next.js Image component)
- Review code splitting strategy
- Monitor Core Web Vitals in Vercel dashboard

#### Development Environment
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility
- Verify environment variables in `.env.local`

### Database Troubleshooting

#### Connection Issues
```bash
# Test Supabase connection
pnpm supabase:types

# Re-link to remote project
npx supabase link --project-ref jjpklpivpvywagmjjwpu

# Force pull latest schema
npx supabase db pull --force
```

#### Schema Changes
```bash
# Reset local database
pnpm supabase:reset

# Apply specific migration
pnpm supabase db push
```

#### Type Generation
```bash
# Force regenerate types
pnpm supabase:types --force
```

#### Performance Issues
```bash
# Run bundle analysis
pnpm build:analyze

# Check for console errors
pnpm dev
# Open browser dev tools

# Optimize images and assets
# Review code splitting strategy
```

This developer guide provides comprehensive coverage of setup, architecture, standards, and AI-driven development practices. For database schema details, see [technical-reference.md](./technical-reference.md). For business requirements, see [product-specification.md](./product-specification.md).
