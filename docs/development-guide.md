---
title: 'Development Guide'
description: 'Complete development standards, workflow, and progress tracking for internal business application'
purpose: 'Reference for development process, technical standards, and project progress'
last_updated: 'July 21, 2025'
doc_type: 'development-reference'
related:
  [
    'README.md',
    'data-model.md',
    'ui-blueprint.md',
    'requirements.md',
    'tasks.md',
  ]
---

# Development Guide

Complete development standards, workflow, and progress tracking for the internal KIRO inventory management system.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 📋 **Development Philosophy**

Balance speed and stability for both human and AI developers:

- **Git Workflow**: Feature branches with PRs to main; self-approved PRs acceptable for solo work
- **Code Quality**: ESLint + Prettier with pre-commit hooks for consistency
- **Testing**: Unit tests with Vitest for critical business logic (WAC calculations, negative inventory alerts, cycle count algorithms)
- **Spec-Driven Development**: Follow requirements.md → data-model.md → tasks.md → implementation

## 🛠️ **Tech Stack Overview**

- **Frontend**: Next.js 15.4.1 (React 19.1.0) with TypeScript for SSR and fast loads
- **Backend/Database**: Supabase (PostgreSQL) with mutable logs, simplified RPCs for atomic ops
- **UI Library**: shadcn/ui + Tailwind CSS 4.1.11 for customizable, accessible components
- **State Management**: TanStack Query for server data; URL params for view state; Zustand for global UI
- **Data Tables**: TanStack Table for custom, performant grids (simplified from AG Grid)
- **Deployment**: Vercel for CI/CD; GitHub for repos

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

## 🔧 **API Design & Business Logic**

### **Database Functions**

- PostgreSQL RPCs for critical multi-step operations
- Direct Supabase mutations for simple CRUD
- Client-side validation for fast UX; server-side in RPCs for final authority

### **Key Mitigations**

- Negative inventory alerts with warnings (real-world flexibility)
- Cycle count alerts for proactive inventory management
- Purchase allocation exclusion (non-inventory items)
- Import duplicate detection
- Smart forecasting with seasonal adjustments

### **Forecasting Logic**

- Simple 3-month moving averages with seasonal indices
- Monthly recalculation for automatic reorder points
- Batch templates for reusable production configurations

### **External Integrations (Phase 2)**

- **Webhook Processing**: Supabase Edge Functions for BigCommerce/QBO event handling
- **OAuth Management**: Secure token storage and refresh for third-party API access
- **Sync Validation**: Real-time inventory deduction with negative inventory warnings

## 🔒 **Privacy & Security**

- **No Analytics (MVP)**: Rely on Vercel/Supabase logs for essential monitoring
- **File Security**: CSV imports processed server-side with validation
- **Future**: Any analytics must be privacy-focused, opt-in only, and avoid PII

## 📊 **Current Project Status**

For detailed task breakdown and progress tracking, see [tasks.md](./tasks.md).

### **Key Architectural Decisions**

1. **Unified Sidebar**: Same component for mobile/desktop (no Sheet component)
2. **Fixed Header**: Consistent positioning with proper z-index
3. **No Transparency**: Clean solid backgrounds as requested
4. **Consistent Spacing**: Following 4px/8px/16px/24px system
5. **Touch Targets**: 44px minimum for mobile interactions

### **Architecture Following Project Specs**

- **Database Schema**: Following data-model.md exactly with all tables and relationships
- **Component Structure**: AppLayout as root with unified sidebar
- **Development Workflow**: Spec-driven, task-oriented, iterative approach

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

## 🚀 **Development Workflow**

### **Step 1: Reference the Specs**

Before implementing any feature:

1. Read the relevant requirement in `requirements.md`
2. Check the design specifications in `data-model.md`
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

### **Implementation Checklist**

For each new feature:

- [ ] Read requirement specification in `requirements.md`
- [ ] Check design documentation in `data-model.md`
- [ ] Create/update TypeScript interfaces
- [ ] Implement component following design system
- [ ] Add mobile responsive behavior
- [ ] Test on both desktop and mobile
- [ ] Update progress documentation in `tasks.md`

## � **Dependency Management**

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

### **Historical Note**

AG Grid lockfile issues (July 2025) were caused by manual package.json edits without corresponding lockfile updates. This created deployment failures when Vercel's `--frozen-lockfile` validation detected the mismatch.

## �🔧 **Development Commands**

### **Quick Commands**

```bash
pnpm dev  # Runs on port 3000
pnpm build  # Build for production
pnpm lint  # Run ESLint
pnpm type-check  # TypeScript checking
```

### **Supabase Development**

```bash
# Remote Development
pnpm supabase:types     # Generate types from remote database
```

### **Environment Setup**

- **Remote Development**: Uses cloud Supabase project `cursor-kiro-beetech`

### **Access URLs**

- **Local**: http://localhost:3000
- **Network**: http://localhost:3000 (for mobile testing)

### **Common File Locations**

- **Layout**: `src/components/layout/app-layout-server.tsx`
- **Sidebar**: `src/components/layout/responsive-sidebar.tsx`
- **Pages**: `src/app/[page]/page.tsx`
- **Types**: `src/types/index.ts`
- **Styles**: `src/app/globals.css`

## 📋 **VS Code Extensions Recommended**

- **Tailwind CSS IntelliSense** - Essential for Tailwind development
- **GitLens** - Enhanced Git integration and history
- **Supabase Extension** - Database management and schema tools

**Note**: Auto Rename Tag, Bracket Pair Colorizer, and TypeScript Importer are now built into VS Code (2025).

## 🏗️ **Schema & Evolution**

- Follow the schema defined in `data-model.md`, using mutable logs for history
- The schema is expected to evolve. Use Supabase migrations to manage changes
- Prioritize simplicity and compute complex values on-demand where possible

## 📈 **Progress Tracking**

All project progress and task completion tracking is maintained in [tasks.md](./tasks.md).

### **Design Compliance**

- **Color Scheme**: Exact match to BigCommerce design
- **Typography**: System fonts with proper weights
- **Icons**: Lucide React icons matching the aesthetic
- **Spacing**: Consistent 6/4 unit system
- **Responsive**: Mobile-first with unified components
- **Interactions**: Smooth hover states and animations

---

_Last Updated: July 18, 2025_
_For detailed task breakdown, see `tasks.md`_
_For requirements specification, see `requirements.md`_
