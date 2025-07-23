---
title: 'Developer Guide'
description: 'Complete development setup, architecture, standards, and AI guidelines for internal business application'
purpose: 'Unified reference for developers covering setup, technical decisions, and development philosophy'
last_updated: 'July 22, 2025'
doc_type: 'developer-reference'
related: ['README.md', 'technical-reference.md', 'product-specification.md', 'tasks.md']
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
- **Direct Edit Workflows**: Enable in-place editing rather than complex forms
- **Risk-Appropriate Security**: Small scale = no complex audit trails needed, focus on usability

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
- **TypeScript 5.8.3** for type safety
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

## 🛠️ Technology Stack

### Core Framework & Runtime

| Package           | Version | Status        | Notes                               |
| ----------------- | ------- | ------------- | ----------------------------------- |
| **Next.js**       | 15.4.1  | ✅ **Latest** | Upgraded from 14.2.x with Turbopack |
| **React**         | 19.1.0  | ✅ **Latest** | Upgraded from 18.3.x                |
| **TypeScript**    | 5.8.3   | ✅ **Latest** | Upgraded from 5.4.x                 |

### UI & Styling

| Package              | Version | Status        | Notes                               |
| -------------------- | ------- | ------------- | ----------------------------------- |
| **Tailwind CSS**     | 4.1.11  | ✅ **Latest** | Upgraded to 4.x for latest features |
| **Radix UI**         | Latest  | ✅ **Latest** | Headless accessible components       |
| **Lucide React**     | 0.525.0 | ✅ **Latest** | Icon library                        |

### Data Management

| Package            | Version | Status        | Notes                               |
| ------------------ | ------- | ------------- | ----------------------------------- |
| **Supabase JS**    | 2.52.0  | ✅ **Latest** | Backend and database                |
| **TanStack Query** | 5.83.0  | ✅ **Latest** | Server state management             |

### Development Tools

| Package           | Version | Purpose                    |
| ----------------- | ------- | -------------------------- |
| **ESLint**        | Latest  | Code linting               |
| **Prettier**      | Latest  | Code formatting            |
| **Husky**         | Latest  | Git hooks                  |
| **Lint Staged**   | Latest  | Pre-commit linting         |

## 🔧 Environment Setup

### Symbolic Links Configuration

This project uses symbolic links to eliminate duplicate configuration files:

#### Current Symlinks
- **AI Instructions**: `.cursorrules` → `.vscode/copilot-instructions.md`

#### Creating Symlinks (Windows)
Run as Administrator in PowerShell:
```powershell
# Navigate to project root
cd "C:\BeeTech VSCODE PROJECTS\KIRO-BEETECH"

# Create AI instructions symlink
Remove-Item ".cursorrules" -Force -ErrorAction SilentlyContinue
New-Item -ItemType SymbolicLink -Path ".cursorrules" -Target ".vscode\copilot-instructions.md"
```

> **Note**: MCP servers are configured globally in your development environment, not through project-specific configuration files.

### Supabase Configuration

#### Remote Development (Current)
- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `btinv-beetech`
- **Region**: `us-east-2`

#### Available Scripts
```bash
# Generate types from remote database
pnpm supabase:types
```

#### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

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

## 🤖 AI Development Guidelines

### Multi-IDE AI Currency Solution

This project uses a sophisticated AI setup designed to provide current, repository-aware assistance across multiple editors:

#### Core Architecture

- **Primary**: `.cursorrules` - Comprehensive AI behavior rules (works in Cursor + fallback for VS Code)
- **VS Code Specific**: `.vscode/copilot-instructions.md` - References `.cursorrules` for consistency
- **Real-time Context**: MCP (Model Context Protocol) servers for live repository/database awareness

#### MCP Integration - The Currency Solution

- **Supabase MCP Server**: Live database schema, real-time queries, migrations, edge functions, security advisors
- **GitHub MCP Server**: Repository operations, issues, PRs, file management, codebase search
- **Context7 MCP Server**: Library documentation, package resolution, up-to-date API references
- **Playwright MCP Server**: Browser automation, testing, web interaction capabilities
- **Result**: AI always sees current tech stack (React 19, Next.js 15, etc.) rather than outdated patterns

#### Why This Approach Works

1. **Real-time Context**: MCP provides live data vs. static instruction files that become outdated
2. **Multi-Editor Support**: Same rules work in Cursor and VS Code without conflicts
3. **Repository Awareness**: AI reads actual `package.json`, project structure, and database schema
4. **Current Best Practices**: Automatically suggests 2025 patterns, not legacy approaches
5. **Comprehensive Tooling**: Browser automation, documentation lookup, and database operations all integrated

#### Contextual Prompting Strategy

```bash
# Force current tech stack awareness
"@workspace check my package.json and suggest React 19 patterns"

# Repository structure awareness
"#file:package.json verify my Next.js version and suggest compatible patterns"

# Real-time validation
"Use my current Supabase schema for this feature"

# Documentation lookup
"Get the latest documentation for TanStack Query v5"

# Browser testing
"Test this component in Chrome with mobile viewport"
```

### AI Behavioral Rules

#### Response Structure
- Always format clearly (summaries first, details after)
- For tools/code, explain reasoning before/after
- If uncertain, ask for clarification
- Suggest mitigations for risks

#### Development Workflow Rules
- **ALWAYS** ask "Should I implement this?" before making file changes
- Provide options first, then wait for explicit approval
- Follow product-specification.md for feature specifications
- Use technical-reference.md for database schema (verify with Supabase MCP when uncertain)
- Reference this developer guide for architecture decisions

#### MCP Usage Guidelines

**Supabase MCP** - Database Operations
```bash
# Database exploration
"Check my current database schema for items table"
"Generate TypeScript types for my Supabase tables"
"Apply this migration to add a new column"
"Run security advisors on my database"

# Query testing
"Test this SQL query on my database"
"Check performance of this query"
```

**GitHub MCP** - Repository Management
```bash
# Code search and analysis
"Search for similar implementations of user authentication"
"Find all files that import the Items component"
"Create a PR for this feature branch"
"Review the changes in the last commit"

# Issue management
"Create an issue for the navigation bug"
"List all open issues with 'bug' label"
```

**Context7 MCP** - Documentation Lookup
```bash
# Library documentation
"Get the latest Next.js 15 documentation for Server Actions"
"Show me TanStack Query v5 mutation patterns"
"Find React 19 best practices for useActionState"
"Get Tailwind CSS 4.x documentation for container queries"
```

**Playwright MCP** - Browser Testing
```bash
# UI testing
"Test the login form in Chrome"
"Take a screenshot of the dashboard on mobile"
"Automate clicking through the purchase workflow"
"Check accessibility of the items table"
```

#### Iteration Mindset
- Propose evolutions aligned with tasks.md workflows
- When updating/generating docs, ensure:
  - YAML frontmatter (purpose, last_updated, doc_type, related)
  - Vision Support: Embed flexibility (e.g., back-dating support in schemas)

#### Self-Audit Steps
Before finalizing any output for this inventory project:
1. **Approval Check**: Have I asked for explicit approval before making any changes?

### Business Domain Guidelines

#### Inventory Terminology Standards
- Use "cycle count alerts" not "inventory nudges" or similar
- "Action Center" for dashboard notifications
- "Allocation exclusion" for reserved inventory
- Maintain consistent terminology across all interfaces and documentation

#### Key Business Workflows
1. **Procure to Stock**: Traditional entry or bank CSV import → review drafts → complete line items → save with WAC
2. **Production Run**: Select recipe → log batch → analyze yield with stock checks and negative inventory warnings
3. **Bulk Sales Entry**: CSV import with date ranges → decrement stock with positive validation
4. **Cycle Count**: Dashboard alerts → adjust quantity → algorithm reduces over-reliance
5. **Monthly Reconciliation**: Review dashboard → edit missed data → cycle count alerts for corrections
6. **Recipe Development**: Create/edit → test batch → version on edit → tied to batch validation

## 🧮 Technical Patterns

### Cost Allocation Architecture

#### Allocation Engine Design

```
Purchase Entry → Base Cost Calculation → Overhead Distribution → WAC Update
      │                    │                       │              │
      └── Mixed Invoice Handling
```

#### Core Allocation Functions

```typescript
// Allocation service
export interface AllocationPreview {
  lineItemId: string;
  allocationPercentage: number;
}

export interface AllocationResult {
  preview: AllocationPreview[];
  warnings: string[];
}

// Allocation action
export async function previewAllocation(
  purchaseId: string,
): Promise<AppResult<AllocationResult>> {
  try {
    // Implementation details...
  } catch (error) {
    return handleError(error, 'previewAllocation');
  }
}
```

#### Variance Detection System

```typescript
// Allocation variance checking
interface VarianceCheck {
  type: 'shipping' | 'tax' | 'fees';
  warningLevel: 'info' | 'warning' | 'error';
}

export function calculateVariance(
  expected: number,
  allocated: number,
  tolerance = 0.05 // 5% tolerance
): VarianceCheck {
  const variance = Math.abs(expected - allocated) / expected;
  
  if (variance > tolerance * 2) {
    return { type: 'shipping', warningLevel: 'error' };
  } else if (variance > tolerance) {
    return { type: 'shipping', warningLevel: 'warning' };
  }
  
  return { type: 'shipping', warningLevel: 'info' };
}
```

### Two-Mode Tracking Architecture

#### Tracking Mode Design

```
Item Setup → Mode Selection → Alert Configuration → Operational Workflow
     │            │               │                      │
     └── Business Categorization
```

#### Mode-Specific Components

```typescript
// Tracking mode component
interface TrackingModeIndicatorProps {
  mode: 'fully_tracked' | 'cost_added';
  className?: string;
}

export function TrackingModeIndicator({
  mode,
  className
}: TrackingModeIndicatorProps) {
  const modeConfig = {
    fully_tracked: {
      label: 'Full',
      color: 'bg-green-100 text-green-800',
      icon: '🟢'
    },
    cost_added: {
      label: 'Cost Only',
      color: 'bg-orange-100 text-orange-800',
      icon: '🟠'
    }
  };

  const config = modeConfig[mode];
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.icon} {config.label}
    </span>
  );
}

// Mode-specific action buttons
export function ModeSpecificActions({ item }: { item: Item }) {
  switch (item.tracking_mode) {
    case 'fully_tracked':
      return <QuantityAdjustmentButton item={item} />;
    case 'cost_added':
      return <SupplyCheckButton item={item} />;
    default:
      return null;
  }
}
```

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

## 🔧 Dependency Management

### Critical Workflow Rules
⚠️ **NEVER commit package.json changes without updating pnpm-lock.yaml**

#### Adding New Dependencies
```bash
# Add runtime dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Always commit BOTH files together
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

### Production Troubleshooting

#### Deployment Failures
1. Check Vercel dashboard for error details
2. Review deployment logs in Vercel
3. Test locally with `pnpm build && pnpm start`
4. Verify environment variables are set in Vercel
5. Check for TypeScript or build errors

#### Post-Deployment Issues
1. **Performance**: Use Vercel analytics and Core Web Vitals
2. **Errors**: Check Vercel function logs and Supabase logs
3. **Database**: Use Supabase dashboard for query performance
4. **Rollback**: Use Vercel dashboard for one-click rollback

---

This developer guide provides comprehensive coverage of setup, architecture, standards, and AI-driven development practices. For database schema details, see [technical-reference.md](./technical-reference.md). For business requirements, see [product-specification.md](./product-specification.md).
