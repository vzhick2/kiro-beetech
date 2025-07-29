# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BTINV is a **private internal inventory management system** for small businesses focused on COGS (Cost of Goods Sold) tracking. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

**Key Business Focus**: Small business operations with statement-based bookkeeping, flexible data entry, and a two-mode inventory tracking system.

## Essential Commands

### Development
```bash
pnpm dev                    # Start development server (port 3000)
pnpm build                  # Build for production
pnpm lint                   # Run ESLint
pnpm type-check             # Run TypeScript checks
pnpm format                 # Format with Prettier
```

### Database & Types
```bash
pnpm db:generate            # Generate TypeScript types from Supabase
pnpm db:start               # Start local Supabase (if using local)
pnpm db:stop                # Stop local Supabase
```

### Testing
```bash
pnpm test                   # Run Playwright tests
pnpm test:ui                # Run Playwright with UI mode
```

### Single Test Execution
```bash
# Run specific test file
npx playwright test tests/specific-test.spec.ts

# Run specific test with UI
npx playwright test tests/specific-test.spec.ts --ui

# Run test in specific browser
npx playwright test --project=chromium
```

## Core Architecture Concepts

### Two-Mode Inventory Tracking System
The **central business logic** of BTINV is the two-mode tracking system:

- **Fully Tracked Mode** 🟢: Traditional quantity tracking with low-stock alerts (core ingredients)
- **Cost Added Mode** 🟡: Purchase history alerts only, quantities hidden in UI (packaging materials)

This system allows businesses to focus detailed tracking on high-impact items while still managing lower-priority inventory.

### Database Architecture (Supabase)
**Core Tables**:
- `items` - Central inventory items with tracking_mode field
- `suppliers` - Vendor management with email field
- `purchases` - Purchase orders with draft/finalized workflow
- `purchase_line_items` - Individual items within purchases
- `transactions` - All inventory movements (mutable for corrections)
- `recipes` & `batches` - Production management
- `sales_periods` - Sales data import

**Key Database Functions**:
- `calculate_wac()` - Weighted Average Cost calculation
- `finalize_draft_purchase()` - Purchase completion with cost allocation
- `change_item_tracking_mode()` - Mode switching with audit trail
- `get_cycle_count_alerts()` - Intelligent inventory checking
- `get_two_mode_alerts()` - Mode-specific alert system

### State Management Pattern
- **TanStack Query** for server state with optimistic updates
- **Custom hooks** (`use-items.ts`, `use-purchases.ts`, `use-suppliers.ts`) for data fetching
- **Server Actions** (Next.js 15) for mutations
- **Zustand** for minimal client state when needed

### Component Architecture
```
src/
├── app/                    # Next.js 15 App Router
│   ├── actions/           # Server Actions (database operations)
│   └── [pages]/           # Route handlers
├── components/
│   ├── dashboard/         # Dashboard widgets
│   ├── items/            # Items management UI
│   ├── purchases/        # Purchase workflow UI
│   ├── suppliers/        # Supplier management UI
│   ├── layout/           # App shell components
│   └── ui/              # Base Radix UI components
├── hooks/                # Custom React hooks for data & behavior
├── lib/                  # Utilities and configurations
│   ├── supabase/        # Database client setup
│   ├── utils/           # Business logic utilities
│   └── validations/     # Zod schemas
└── types/               # TypeScript definitions
```

### Key Business Logic Patterns

#### Cost Allocation System
- Purchases support proportional distribution of shipping/taxes to inventory items
- Non-inventory items (office supplies) excluded from allocation
- Draft → Finalized workflow with allocation preview

#### Weighted Average Cost (WAC)
- Calculated on-demand with PostgreSQL functions
- Cached in `items.weightedaveragecost` field
- Updated automatically on purchase finalization

#### Display ID Pattern
- User-facing IDs separate from UUID primary keys
- Format: `PO-YYYYMMDD-XXX` for purchases, `BATCH-YYYYMMDD-XXX` for batches
- Improves UX while maintaining database performance

## Development Philosophy

### Small Business Context
- **Forgiving Data Entry**: Allow back-dating, editing, and corrections
- **Mobile-First UX**: Touch-friendly interface (≥44px targets) for workshop use
- **Direct Edit Workflows**: In-place editing over multi-step forms
- **Negative Inventory Support**: Real-world flexibility with proper alerting

### Technical Approach
- **Modular & Replaceable**: Components designed for easy swaps
- **Server Components First**: Default to Next.js 15 server components
- **Error Boundaries**: Comprehensive error handling throughout
- **Mutable Transactions**: Support corrections with audit timestamps

### AI Development Guidelines
Based on `.cursorrules`:
- **✅ Act Independently**: Bug fixes, code quality, documentation updates, TypeScript fixes
- **🔐 Ask Permission**: New features, schema changes, business logic modifications
- **90% Confidence Threshold**: Only proceed autonomously if solution confidence ≥ 90%

### Documentation Maintenance Responsibilities

**CRITICAL**: Always maintain documentation consistency with code changes.

#### Pre-Task Documentation Review
Before starting any significant task:
1. **Read relevant documentation first** - Check `docs/` folder for context
2. **Identify affected docs** - Which files might need updates after your changes?
3. **Note current state** - What documentation claims might become outdated?

#### Post-Task Documentation Updates
After completing any task that changes:
- **Architecture/Patterns** → Update `docs/developer-guide.md`
- **Database schema** → Update `docs/technical-reference.md` 
- **Business logic/rules** → Update `docs/product-specification.md`
- **AI workflow patterns** → Update `CLAUDE.md`
- **Development commands** → Update README.md and `docs/developer-guide.md`

#### Documentation Update Checklist
✅ **Read** - Review affected documentation before changes  
✅ **Code** - Implement the requested changes  
✅ **Update** - Modify documentation to reflect changes  
✅ **Verify** - Ensure no contradictions between docs and code  
✅ **Date** - Update `last_updated` dates in YAML frontmatter  

#### Common Documentation Patterns
- **New config values** → Document in developer-guide.md config section
- **New components** → Add to UI patterns section
- **New database functions** → Add to technical-reference.md
- **Changed business rules** → Update both product-specification.md and config examples
- **New development workflows** → Update developer-guide.md and README.md

#### Documentation Consistency Rules
- **Never create files** unless explicitly requested (follow `.cursorrules`)
- **Always update last_updated dates** when making substantial changes
- **Cross-reference related docs** in YAML frontmatter  
- **Use consistent terminology** across all documentation
- **Include code examples** that match actual implementation

#### Complex Problem Analysis
For particularly complex architectural decisions, debugging challenges, or system design questions, consider using **parallel analysis** with multiple AI models to get diverse perspectives:

```bash
# Use MCP Zen tools with more powerful models for complex analysis
mcp__zen__chat with model="gemini-2.5-pro" thinking_mode="high"
mcp__zen__thinkdeep with model="o3" 
mcp__zen__consensus with multiple models for critical decisions
```

**When to use parallel analysis:**
- Complex architectural decisions affecting multiple systems
- Performance optimization with unclear trade-offs  
- Security architecture and threat modeling
- Debugging complex multi-component issues
- Strategic technical planning and roadmaps

This approach provides both **comprehensive long-term vision** and **pragmatic implementation focus**.

### AI Behavior Guidelines
**CRITICAL**: Distinguish between analysis requests and implementation requests:

**📊 Analysis Mode** (NO CODE CHANGES):
- When users ask for "suggestions," "recommendations," "analysis," "reports," or "what can be done"
- Strategic planning discussions about testsuppliers blueprint
- Code review and improvement suggestions
- **Response**: Provide detailed analysis, recommendations, and strategic insights ONLY

**🔧 Implementation Mode** (CODE CHANGES ALLOWED):
- Look for explicit implementation signals: "implement this," "make these changes," "code this up," "build this," "create this"
- Direct bug fix requests: "fix this error," "update this function"
- **Response**: Proceed with code modifications

**❓ When In Doubt**: Ask "Would you like me to implement these suggestions or just provide the analysis?"

**Special Case - TestSuppliersTable**: This is the strategic blueprint component. Treat all requests about it as analysis/planning unless implementation is explicitly requested.

## Critical Files to Understand

### Documentation (Read These First)
**ALWAYS read relevant documentation before starting any task** to understand context and identify what needs updating.

- `docs/product-specification.md` - Business requirements authority
- `docs/technical-reference.md` - Database schema and APIs  
- `docs/developer-guide.md` - Technical patterns and standards
- `docs/tasks.md` - Current work and roadmap

### Core Type Definitions
- `src/types/database.ts` - Generated Supabase types (DO NOT EDIT)
- `src/types/index.ts` - Application types and interfaces

### Key Business Logic
- `src/app/actions/items.ts` - Items CRUD with tracking mode logic
- `src/app/actions/purchases.ts` - Purchase workflow and cost allocation
- `src/lib/utils/business.ts` - Business logic utilities
- `src/hooks/use-items.ts` - Items state management pattern
- `src/config/app-config.ts` - **Single configuration file** with all app settings

### UI Patterns
- `src/components/items/items-table.tsx` - Complex table with inline editing
- `src/components/suppliers/modern-data-table.tsx` - Advanced data table patterns
- `src/components/layout/app-layout-server.tsx` - App shell architecture

## Environment Setup

### Supabase Configuration
- **Project ID**: `jjpklpivpvywagmjjwpu`
- **Project Name**: `btinv-beetech`
- **Region**: `us-east-2`

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_remote_anon_key
```

## Testing Approach

### Playwright Configuration
- **Base URL**: `http://localhost:3001` (not 3000)
- **Web Server**: Automatically starts `pnpm dev` for tests
- **Browsers**: Chromium, Firefox, WebKit support
- **Focus**: Critical business workflows over unit tests

### Key Test Scenarios
- Inventory workflows: add item → purchase → receive → adjust → sell
- Purchase cost allocation and WAC calculations
- Two-mode tracking behavior differences
- Mobile-responsive interactions

## Common Patterns

### Application Configuration

The application uses a **single configuration file** (`src/config/app-config.ts`) for all settings:

```typescript
import { getTableConfig, businessRules, displaySettings } from '@/config/app-config';

// Table configurations
const suppliersConfig = getTableConfig('suppliers');
const defaultColumnVisibility = getDefaultColumnVisibility('suppliers');

// Business rules
const defaultLeadTime = businessRules.inventory.defaultLeadTimeDays;
const trackingMode = businessRules.inventory.defaultTrackingMode;

// Display settings
const densityMode = displaySettings.defaults.densityMode;
const pageSize = paginationSettings.pageSizes.tables.default;
```

**IMPORTANT**: When adding new config values, always update the configuration documentation in `docs/developer-guide.md` to maintain consistency.

### Error Handling
```typescript
import { handleError, handleSuccess } from '@/lib/error-handling';

// In server actions
try {
  const result = await someOperation();
  return handleSuccess(result);
} catch (error) {
  return handleError(error, 'operationName');
}
```

### Data Fetching with TanStack Query
```typescript
// Query keys pattern
export const itemsKeys = {
  all: ['items'] as const,
  lists: () => [...itemsKeys.all, 'list'] as const,
  list: (filters) => [...itemsKeys.lists(), filters] as const,
};

// Hook pattern
export function useItems(searchQuery = '', typeFilter = 'all') {
  return useQuery({
    queryKey: itemsKeys.list({ searchQuery, typeFilter }),
    queryFn: () => getItems(),
    staleTime: 5 * 60 * 1000,
  });
}
```

### Form Validation with Zod
```typescript
import { z } from 'zod';

const CreateItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  type: z.enum(['ingredient', 'packaging', 'product']),
});
```

This CLAUDE.md provides the essential context for understanding BTINV's unique two-mode inventory tracking system, technical architecture, and development patterns. The documentation in `docs/` provides comprehensive details for specific areas.