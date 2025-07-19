---
title: "Development Guide"
description: "Complete development standards, workflow, and progress tracking for internal business application"
purpose: "Reference for development process, technical standards, and project progress"
last_updated: "July 18, 2025"
doc_type: "development-reference"
related: ["README.md", "data-model.md", "ui-blueprint.md", "requirements.md", "tasks.md"]
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
- **Data Tables**: TanStack Table for custom, performant grids
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

### ✅ **Completed Tasks**

#### **1. Project Setup and Navigation Layout**
- [x] **1.1** Create Next.js project foundation
  - ✅ Next.js 15.4.1 project with TypeScript
  - ✅ shadcn/ui components and Tailwind CSS
  - ✅ Required dependencies installed
  - ✅ Environment configuration ready

- [x] **1.2** Build main application layout and navigation
  - ✅ AppLayout component with unified sidebar approach
  - ✅ Fixed header design matching BigCommerce aesthetic
  - ✅ Responsive navigation: unified sidebar for mobile/desktop
  - ✅ Navigation menu with all required sections
  - ✅ Mobile hamburger menu with slide-in animation
  - ✅ Proper z-index layering and positioning

- [x] **1.3** Define core TypeScript interfaces and utilities
  - ✅ Core interfaces defined in types/index.ts
  - ✅ Utility functions in lib/utils
  - ✅ Page title hook for navigation

#### **2. Design System Implementation**
- [x] **2.1** Implement BigCommerce-inspired design system
  - ✅ Dark blue sidebar (#1e293b) with white text
  - ✅ Light gray background (#f8fafc)
  - ✅ Consistent hover states (#34455a)
  - ✅ Proper typography and spacing
  - ✅ Unified color palette with CSS variables

- [x] **2.2** Create responsive layout components
  - ✅ Mobile-first approach with touch-friendly targets
  - ✅ Smooth animations and transitions
  - ✅ Consistent spacing and visual hierarchy
  - ✅ Proper focus states and accessibility

#### **3. Core Pages Implementation**
- [x] **3.1** Dashboard with business metrics
  - ✅ 30-second health check layout
  - ✅ Key metrics cards with sample data
  - ✅ Recent activity feed
  - ✅ Proper spacing and visual hierarchy

- [x] **3.2** Items management page
  - ✅ Full-featured items table with search
  - ✅ Type filtering and actions
  - ✅ Sample inventory data
  - ✅ Mobile-responsive table design

### 🚧 **In Progress**

- [ ] **3.3** Purchase management workflow
  - [ ] Master-detail layout for purchases
  - [ ] CSV import functionality
  - [ ] Draft purchase creation
  - [ ] Line item management

### 📋 **Next Development Priorities**

1. **Database Schema Setup** (Task 2.1-2.2)
   - Create Supabase schema following data-model.md
   - Implement business logic functions (WAC calculation, alerts)
   - Set up Row Level Security

2. **Purchase Management** (Task 4.1-4.3)
   - Build Purchase Inbox component
   - Implement CSV import workflow
   - Create line item management interface

3. **Recipe and Batch System** (Task 5.1-5.2)
   - Recipe Manager with ingredient tracking
   - Batch Logger with yield calculations
   - Template system for common batches

## 🎨 **Design System Reference**

### **Colors (from globals.css)**
```css
--app-sidebar: 220 46% 13%;     /* #1e293b - Dark blue */
--app-header: 220 46% 13%;      /* Same as sidebar */
--app-background: 210 20% 98%;  /* #f8fafc - Light gray */
--app-hover: 220 46% 16%;       /* #34455a - Hover state */
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
4. Update progress tracking when complete

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
- [ ] Read requirement specification
- [ ] Check design documentation
- [ ] Create/update TypeScript interfaces
- [ ] Implement component following design system
- [ ] Add mobile responsive behavior
- [ ] Test on both desktop and mobile
- [ ] Update progress documentation

## 🔧 **Development Commands**

### **Quick Commands**
```bash
pnpm dev  # Runs on port 3000
pnpm build  # Build for production
pnpm lint  # Run ESLint
pnpm type-check  # TypeScript checking
```

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
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

## 🏗️ **Schema & Evolution**
- Follow the schema defined in `data-model.md`, using mutable logs for history
- The schema is expected to evolve. Use Supabase migrations to manage changes
- Prioritize simplicity and compute complex values on-demand where possible

## 📈 **Progress Tracking**

### **Design Compliance**
- **Color Scheme**: Exact match to BigCommerce design
- **Typography**: System fonts with proper weights
- **Icons**: Lucide React icons matching the aesthetic
- **Spacing**: Consistent 6/4 unit system
- **Responsive**: Mobile-first with unified components
- **Interactions**: Smooth hover states and animations

### **Key Design Decisions**
1. **Unified Sidebar**: Same component for mobile/desktop (no Sheet component)
2. **Fixed Header**: Consistent positioning with proper z-index
3. **No Transparency**: Clean solid backgrounds as requested
4. **Consistent Spacing**: Following 4px/8px/16px/24px system
5. **Touch Targets**: 44px minimum for mobile interactions

### **Architecture Following Project Specs**
- **Database Schema**: Following data-model.md exactly with all tables and relationships
- **Component Structure**: AppLayout as root with unified sidebar
- **Development Workflow**: Spec-driven, task-oriented, iterative approach

---

*Last Updated: July 18, 2025*
*For detailed task breakdown, see `tasks.md`*
*For requirements specification, see `requirements.md`* 