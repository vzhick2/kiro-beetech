---
title: 'Developer Guide'
description: 'Complete development setup, architecture, standards, and AI guidelines for internal business application'
purpose: 'Unified reference for developers covering setup, technical decisions, and development philosophy'
last_updated: 'July 29, 2025'
doc_type: 'developer-reference'
related:
  [
    'README.md',
    'technical-reference.md',
    'product-specification.md',
    'tasks.md',
    '.vscode/copilot-instructions.md',
  ]
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
│   ├── config/            # Application configuration
│   │   └── app-config.ts  # Single source of truth for all app settings
│   └── types/             # TypeScript type definitions
```

## 🚀 Technology Stack

### Core Framework & Runtime

| Package        | Version | Status         | Notes                               |
| -------------- | ------- | -------------- | ----------------------------------- |
| **Next.js**    | 15.4.1  | ✅ **Current** | Upgraded from 14.2.x with Turbopack |
| **React**      | 19.1.0  | ✅ **Current** | Upgraded from 18.3.x                |
| **TypeScript** | 5.5.4   | ✅ **Current** | Upgraded from 5.4.x                 |

### UI & Styling

| Package          | Version | Status         | Notes                               |
| ---------------- | ------- | -------------- | ----------------------------------- |
| **Tailwind CSS** | 4.1.11  | ✅ **Current** | Upgraded to 4.x for latest features |
| **Radix UI**     | Latest  | ✅ **Current** | Headless accessible components      |
| **Lucide React** | 0.525.0 | ✅ **Current** | Icon library                        |

### Data Management

| Package            | Version | Status         | Notes                   |
| ------------------ | ------- | -------------- | ----------------------- |
| **Supabase JS**    | 2.52.0  | ✅ **Current** | Backend and database    |
| **TanStack Query** | 5.83.0  | ✅ **Current** | Server state management |

### Development Tools

| Package         | Version | Purpose            |
| --------------- | ------- | ------------------ |
| **ESLint**      | 8.57.1  | Code linting       |
| **Prettier**    | 3.0.0   | Code formatting    |
| **Husky**       | 9.1.6   | Git hooks          |
| **Lint Staged** | 15.2.10 | Pre-commit linting |

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

_Note: For quick reference badges, see the README.md Technology Stack section. This comprehensive breakdown serves as the authoritative source for version management and development tooling._

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
- **Smart Delete Strategy**: Archive-first approach with conditional delete for clean records
- **Single Config File**: Centralized configuration for all app settings

### Component Architecture

- **Server Components**: Default choice for Next.js 15
- **Client Components**: Use when interactivity is needed
- **Error Boundaries**: Comprehensive error handling
- **Form Handling**: Server Actions for mutations

### Smart Delete Pattern

The application uses an "Archive-First with Smart Delete" strategy to balance data safety with cleanup needs:

#### Business Rules
- **Primary Action**: Archive (soft delete) - always available and safe
- **Secondary Action**: Delete (hard delete) - only for records with no business activity
- **Validation**: Check for any business relationships before allowing deletion
- **User Guidance**: Clear messaging when delete is blocked with archive suggestion

#### Implementation Example

```typescript
/**
 * Check if a supplier can be safely deleted (no business activity)
 */
export async function canDeleteSupplier(supplierId: string) {
  try {
    // Check for any purchases from this supplier
    const { data: purchases } = await supabaseAdmin
      .from('purchases')
      .select('purchaseid')
      .eq('supplierid', supplierId)
      .limit(1);

    if (purchases && purchases.length > 0) {
      return { canDelete: false, reason: 'Supplier has purchase history' };
    }

    // Check for items using this as primary supplier
    const { data: items } = await supabaseAdmin
      .from('items')
      .select('itemid')
      .eq('primarysupplierid', supplierId)
      .limit(1);

    if (items && items.length > 0) {
      return { canDelete: false, reason: 'Supplier is set as primary supplier for items' };
    }

    return { canDelete: true };
  } catch (error) {
    return { canDelete: false, reason: 'Failed to validate supplier deletion' };
  }
}

export async function deleteSupplier(supplierId: string) {
  const deleteCheck = await canDeleteSupplier(supplierId);
  if (!deleteCheck.canDelete) {
    return { 
      success: false, 
      error: deleteCheck.reason,
      suggestArchive: true 
    };
  }
  // Proceed with deletion...
}
```

#### UI Implementation
- Show Archive button prominently (primary action)
- Show Delete button conditionally (secondary action)
- Provide clear feedback when delete is blocked
- Suggest Archive as alternative for records with business activity

#### Benefits
- **Data Safety**: Business history always preserved through archive
- **Test Cleanup**: Unused test records can be permanently removed
- **User Clarity**: Clear guidance on when to use each action
- **Consistency**: Same pattern works across all entity types

### Application Configuration System

The application uses a single configuration file (`src/config/app-config.ts`) as the **centralized source of truth** for all hardcoded values, business rules, and UI settings. This eliminates scattered magic numbers and provides consistent configuration across all components.

#### Configuration Categories

**1. Table Configurations**
```typescript
export const tableConfigs = {
  suppliers: {
    tableName: 'suppliers',
    displayName: 'Suppliers',
    columns: {
      supplierid: { label: 'ID', visible: false, required: false, type: 'uuid' },
      name: { label: 'Name', visible: true, required: true, type: 'text' },
      contactphone: { label: 'Phone', visible: true, required: false, type: 'phone' },
      // ... other columns
    }
  }
} as const;
```

**2. Display Settings**
```typescript
export const displaySettings = {
  densityModes: {
    compact: {
      rowHeight: '32px',
      headerHeight: '40px', 
      lineHeight: '1.3',
      maxLines: 1,
      characterLimits: { short: 25, long: 30 }
    },
    normal: {
      rowHeight: '40px',
      headerHeight: '48px',
      lineHeight: '1.4', 
      maxLines: 2,
      characterLimits: { short: 40, long: 60 }
    },
    comfortable: {
      rowHeight: '48px',
      headerHeight: '56px',
      lineHeight: '1.5',
      maxLines: 3,
      characterLimits: { short: 80, long: 120 }
    }
  },
  defaults: {
    densityMode: 'normal' as const,
    leadTimeDays: 7
  }
}
```

**3. Business Logic Rules**
```typescript
export const businessRules = {
  inventory: {
    defaultLeadTimeDays: 7,
    defaultTrackingMode: 'fully_tracked' as const,
    reorderThresholds: {
      low: 10,    // Standard reorder point
      critical: 5  // Critical stock level
    },
    negativeInventoryAlert: true,
    cycleCountDaysThreshold: 30
  },
  purchases: {
    draftRetentionDays: 30,
    maxLineItemsPerPurchase: 100,
    allowBackdating: true
  }
}
```

**4. Pagination & Performance**
```typescript
export const paginationSettings = {
  pageSizes: {
    tables: {
      default: 25,
      options: [10, 25, 50, 100]
    },
    dashboard: {
      recentActivity: 10,
      cycleCountAlerts: 5
    },
    modals: {
      itemSelection: 15
    }
  },
  apiLimits: {
    maxBulkOperations: 50,
    searchResults: 100
  }
}
```

**5. Feature Flags**
```typescript
export const featureFlags = {
  enableAdvancedFiltering: true,
  enableBulkOperations: true,
  enableExportFeatures: true,
  enablePrintLabels: false // Future feature
}
```

#### Helper Functions

```typescript
// Type-safe table configuration access
export function getTableConfig<T extends TableName>(tableName: T) {
  return tableConfigs[tableName];
}

// Default column visibility from config
export function getDefaultColumnVisibility<T extends TableName>(tableName: T) {
  const config = getTableConfig(tableName);
  return Object.fromEntries(
    Object.entries(config.columns).map(([key, columnConfig]) => [
      key,
      columnConfig.visible
    ])
  );
}

// User-friendly column labels
export function getColumnLabel<T extends TableName>(
  tableName: T, 
  columnKey: ColumnKeys<T>
) {
  return (tableConfigs[tableName].columns as any)[columnKey]?.label || columnKey;
}

// Currency formatting
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displaySettings.currency.code,
    minimumFractionDigits: displaySettings.currency.decimalPlaces,
    maximumFractionDigits: displaySettings.currency.decimalPlaces,
  }).format(amount);
}
```

#### Integration Examples

**Component Usage:**
```typescript
// Table components
import { getTableConfig, getDefaultColumnVisibility } from '@/config/app-config';

const suppliersConfig = getTableConfig('suppliers'); 
const defaultVisibility = getDefaultColumnVisibility('suppliers');

// Validation schemas
import { businessRules } from '@/config/app-config';

const ItemSchema = z.object({
  leadtimedays: z.number().min(1).default(businessRules.inventory.defaultLeadTimeDays),
  trackingmode: z.enum(['fully_tracked', 'cost_added']).default(businessRules.inventory.defaultTrackingMode)
});

// UI Components
import { displaySettings, paginationSettings } from '@/config/app-config';

const [densityMode, setDensityMode] = useState(displaySettings.defaults.densityMode);
const pageSize = paginationSettings.pageSizes.tables.default;
```

#### Components Updated with Config

- ✅ **SuppliersTable** - Column visibility, pagination, density modes
- ✅ **ViewOptionsPanel** - Config-driven columns and labels  
- ✅ **ModernDataTable** - Density modes and character limits
- ✅ **SmartCell** - Dynamic truncation and line limits
- ✅ **ItemsTable** - Business rule defaults
- ✅ **Dashboard Components** - Pagination limits
- ✅ **Validation Schemas** - Default values from config

#### Benefits

- **Single Source of Truth**: All configuration in one place
- **Type Safety**: Full TypeScript support with proper inference
- **Consistency**: Same values used across all components
- **Maintainability**: Easy to update business rules and UI settings
- **Environment Flexibility**: Easy to customize for different deployments
- **Developer Experience**: Clear documentation of all configurable values

#### Best Practices

1. **Always use config**: Never hardcode values that could be configurable
2. **Type safety**: Use helper functions for type-safe access
3. **Documentation**: Document config changes in component usage
4. **Testing**: Verify config changes work across all affected components
5. **Validation**: Use config values in Zod schemas for consistency

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
        p_new_unit_cost: lineItem.allocatedUnitCost,
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

### 🎯 Critical UI Issue Fixes

#### Radix UI Dropdown Positioning Issues

**⚠️ MAJOR ISSUE RESOLVED (July 27, 2025)** - *Documented after 7-hour debugging session*

**Problem**: Radix UI DropdownMenu components may position incorrectly in complex layouts with fixed headers and sidebars, appearing as overlays on the wrong side of the screen instead of positioned relative to their trigger button.

**Root Cause**: Radix UI's portal-based positioning system conflicts with CSS layouts using:
- Fixed positioning for headers/sidebars
- Complex z-index stacking
- Nested relative/absolute positioning containers
- CSS transforms that create new stacking contexts

**Symptoms**:
- Dropdown appears as overlay on left side of screen
- Dropdown ignores trigger button position
- Portal attempts (`Portal.Root`) don't resolve the issue
- Position adjustments via CSS don't work consistently

**Solution**: Replace Radix UI DropdownMenu with custom implementation

```typescript
// ❌ PROBLEMATIC: Radix UI DropdownMenu
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'

// ✅ SOLUTION: Custom dropdown with absolute positioning
import { useState, useRef, useEffect } from 'react'

export function CustomDropdown({ trigger, children }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click-outside detection
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="..."
      >
        {trigger}
      </button>

      {/* Custom Positioned Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-lg z-50">
          {children}
        </div>
      )}
    </div>
  )
}
```

**Key Implementation Details**:

1. **Positioning Strategy**:
   - Parent container: `relative` positioning
   - Dropdown: `absolute` with `right-0 top-full mt-2`
   - Proper z-index: `z-50` for overlay behavior

2. **State Management**:
   - `useState` for open/close state
   - `useRef` for DOM element references
   - `useEffect` for click-outside detection

3. **Event Handling**:
   - Manual click-outside detection with document listeners
   - Proper cleanup in useEffect dependencies

**Files Modified in Fix**:
- `src/components/suppliers/ViewOptionsPanel.tsx` - Complete rewrite
- `src/app/suppliers/page.tsx` - Added relative positioning wrapper

**Testing Verification**:
- ✅ Dropdown appears under trigger button (not on left side)
- ✅ Click-outside closes dropdown properly
- ✅ Button shows expanded/active states correctly
- ✅ All column visibility checkboxes functional

**When to Use This Pattern**:
- Complex layout with fixed headers/sidebars
- Multiple stacking contexts from CSS transforms
- Portal-based solutions fail to position correctly
- Need full control over dropdown positioning

**Prevention Strategy**:
- Test dropdown components early in complex layouts
- Use Playwright MCP for visual regression testing
- Document positioning requirements for future components
- Consider custom implementations for critical UI elements

**Alternative Solutions Attempted**:
1. ❌ Portal containers (`Portal.Root`)
2. ❌ CSS positioning adjustments
3. ❌ Z-index manipulation
4. ✅ **Custom implementation with absolute positioning**

This fix saves significant debugging time for similar issues. Always test dropdown components in the target layout context, not in isolation.

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
