# Development Workflow Guide

## Working with .kiro Specifications in VS Code

This guide helps you replicate the .kiro workflow in VS Code for the inventory management system.

## Quick Reference

### 📋 Core Files to Reference
- **Requirements**: `.kiro/specs/inventory-management/requirements.md`
- **Design**: `.kiro/specs/inventory-management/design.md`
- **Tasks**: `.kiro/specs/inventory-management/tasks.md`
- **Progress**: `PROJECT_PROGRESS.md` (this workspace)

### 🎯 Current Focus Areas

#### Next Development Priorities (from tasks.md)
1. **Database Schema** (Task 2.1-2.2)
   - Location: Need to create Supabase schema
   - Reference: design.md lines 180-350
   - Status: Not started

2. **Purchase Management** (Task 4.1-4.3)
   - Location: `src/app/purchases/page.tsx`
   - Reference: requirements.md Requirement 2
   - Status: Basic page created, needs full implementation

3. **Recipe System** (Task 5.1-5.2)
   - Location: `src/app/recipes/page.tsx`
   - Reference: requirements.md Requirement 3
   - Status: Basic page created, needs full implementation

### 🔄 Development Process

#### Step 1: Reference the Specs
Before implementing any feature:
1. Read the relevant requirement in `requirements.md`
2. Check the design specifications in `design.md`
3. Find the corresponding task in `tasks.md`
4. Update `PROJECT_PROGRESS.md` when complete

#### Step 2: Follow the Architecture
- **Components**: Located in `src/components/`
- **Pages**: Located in `src/app/`
- **Types**: Located in `src/types/`
- **Utilities**: Located in `src/lib/`

#### Step 3: Match the Design
- **Colors**: Use the BigCommerce-inspired palette
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 4px/8px/16px/24px system
- **Components**: Mobile-first, accessible, consistent

### 📊 Progress Tracking

Update `PROJECT_PROGRESS.md` after each session:
- Mark completed tasks with ✅
- Note any design decisions or changes
- Track next priorities
- Document any issues or blockers

### 🎨 Design System Reference

#### Colors (from globals.css)
```css
--app-sidebar: 220 46% 13%;     /* #1e293b - Dark blue */
--app-header: 220 46% 13%;      /* Same as sidebar */
--app-background: 210 20% 98%;  /* #f8fafc - Light gray */
--app-hover: 220 46% 16%;       /* #34455a - Hover state */
```

#### Typography
- **Headers**: text-2xl font-semibold text-gray-800
- **Body**: text-sm text-gray-900
- **Muted**: text-gray-500, text-gray-600
- **Navigation**: text-gray-300 with hover:text-white

#### Spacing
- **Cards**: p-6 for padding
- **Sections**: space-y-6, mb-6
- **Buttons**: px-3 py-2 for normal, px-4 py-2 for larger
- **Tables**: px-6 py-4 for cells

### 🚀 Quick Commands

#### Development Server
```bash
npm run dev  # Runs on port 3001, accessible on network
```

#### Access URLs
- **Local**: http://localhost:3001
- **Network**: http://192.168.0.55:3001 (for mobile testing)

#### Common File Locations
- **Layout**: `src/components/layout/app-layout.tsx`
- **Sidebar**: `src/components/layout/sidebar.tsx`
- **Pages**: `src/app/[page]/page.tsx`
- **Types**: `src/types/index.ts`
- **Styles**: `src/app/globals.css`

### 📝 Implementation Checklist

For each new feature:
- [ ] Read requirement specification
- [ ] Check design documentation
- [ ] Create/update TypeScript interfaces
- [ ] Implement component following design system
- [ ] Add mobile responsive behavior
- [ ] Test on both desktop and mobile
- [ ] Update progress documentation

### 🔧 VS Code Extensions Recommended
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **TypeScript Importer**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

### 📋 Current Status Summary

**✅ Completed**: Basic layout, navigation, design system, dashboard, items page
**🚧 In Progress**: Following .kiro specifications for remaining features
**📋 Next**: Database schema, purchase management, recipe system

---

*This workflow ensures we stay aligned with the .kiro specifications while working efficiently in VS Code.*
