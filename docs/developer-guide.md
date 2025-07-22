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
- **MCP Configuration**: `.cursor/mcp.json` → `../mcp.json`

#### Creating Symlinks (Windows)
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

## 🤖 AI Development Guidelines

### Multi-IDE AI Currency Solution

This project uses a sophisticated AI setup designed to provide current, repository-aware assistance across multiple editors:

#### Core Architecture

- **Primary**: `.cursorrules` - Comprehensive AI behavior rules (works in Cursor + fallback for VS Code)
- **VS Code Specific**: `.vscode/copilot-instructions.md` - References `.cursorrules` for consistency
- **Real-time Context**: MCP (Model Context Protocol) servers for live repository/database awareness

#### MCP Integration - The Currency Solution

- **Supabase MCP Server**: Live database schema, real-time queries, current dependency awareness
- **GitHub MCP Server**: Repository structure analysis, current branch context, file relationships
- **Result**: AI always sees current tech stack (React 19, Next.js 15, etc.) rather than outdated patterns

#### Why This Approach Works

1. **Real-time Context**: MCP provides live data vs. static instruction files that become outdated
2. **Multi-Editor Support**: Same rules work in Cursor and VS Code without conflicts
3. **Repository Awareness**: AI reads actual `package.json`, project structure, and database schema
4. **Current Best Practices**: Automatically suggests 2025 patterns, not legacy approaches

#### Contextual Prompting Strategy

```bash
# Force current tech stack awareness
"@workspace check my package.json and suggest React 19 patterns"

# Repository structure awareness
"#file:package.json verify my Next.js version and suggest compatible patterns"

# Real-time validation
"Use my current Supabase schema for this feature"
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
```

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
- Check TypeScript errors: `pnpm type-check`
- Verify all imports are correct
- Ensure environment variables are available

#### Runtime Errors
- Check Supabase function logs
- Verify API endpoints are accessible
- Confirm database connections

#### Performance Issues
- Run bundle analysis: `pnpm build:analyze`
- Optimize images and assets
- Review code splitting strategy

#### Development Environment
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`
- Check Node.js version compatibility

### Database Troubleshooting

#### Connection Issues
```bash
# Test Supabase connection
pnpm supabase:types
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

---

This developer guide provides comprehensive coverage of setup, architecture, standards, and AI-driven development practices. For database schema details, see [technical-reference.md](./technical-reference.md). For business requirements, see [product-specification.md](./product-specification.md).
