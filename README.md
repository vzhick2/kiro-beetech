# BTINV Inventory Management System

> **A private, simplified COGS-focused inventory solution for small business operations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## 📋 **Overview**

BTINV is a **private, business-focused inventory management system** designed specifically for small businesses that prioritize meaningful COGS (Cost of Goods Sold) tracking over perfectionist inventory management. Following the 80/20 rule, it focuses on tracking what matters most for profitability while supporting real-world business workflows like statement-based bookkeeping and monthly inventory sessions.

**This is not a public application or open-source project.**

## ✨ **Key Features**

### 🧮 **Smart Cost Management**

- **Intelligent Cost Allocation**: Proportional distribution of shipping, taxes, and fees to inventory items
- **Enhanced WAC Calculation**: Properly implemented Weighted Average Cost with inventory-aware calculations
- **Two-Mode Tracking**: Fully tracked for core ingredients, cost-added for packaging materials
- **COGS-Focused Analytics**: 80/20 rule applied to track meaningful cost drivers

### 📦 **Enhanced Purchase Management**

- **Smart Allocation Engine**: Real-time preview of cost distribution with variance warnings
- **Statement Integration**: Automated bank CSV import with supplier matching
- **Mixed Invoice Support**: Handle COGS and non-COGS items in single purchases
- **Draft Review Workflow**: Approval-based purchase finalization with allocation verification

### 🏪 **Flexible Inventory Tracking**

- **Two-Mode Tracking System**: Simplified approach with Fully Tracked 🟢 and Cost Added 🟡 modes
- **Smart Alert System**: Low-stock alerts for tracked items, supply check reminders for cost-only items
- **Monthly Sessions**: Aligned with business cycles and statement-based bookkeeping
- **Forgiving Workflows**: Support negative inventory and real-world correction needs

### 📊 **Business-Aligned Reporting**

- **COGS Percentage Tracking**: Simple traffic light indicators (Green <30%, Yellow 30-50%, Red >50%)
- **Purchase Variance Analysis**: Track actual vs budgeted purchase costs
- **Two-Mode Performance**: Insights on fully tracked vs cost-added item performance
- **Monthly Reconciliation**: Aligned with accounting periods and business practices

### 🔍 **Intelligent Automation**

- **Automated Supplier Matching**: Confidence-scored matching from bank statements
- **Smart Reorder Suggestions**: Based on tracking mode and supplier history
- **Proportional Allocation**: Automatic overhead distribution with manual override capability
- **Cost Impact Preview**: See financial effects before finalizing changes

## 🚀 **Technology Stack**

### **Frontend**

- **Next.js 15.4.1** with App Router and Turbopack
- **React 19.1.0** with Server Components
- **TypeScript 5.8.3** for type safety
- **Tailwind CSS 4.1.11** for styling
- **Radix UI** for accessible components
- **TanStack Table** for data tables

### **Backend & Database**

- **Supabase** for database and authentication
- **Enhanced Server Actions** for smart allocation and business logic
- **PostgreSQL** with advanced stored procedures for cost calculations
- **TanStack Query** for optimistic updates and caching

### **Business Logic**

- **Smart Allocation Engine** for proportional cost distribution
- **Two-Mode Tracking System** with simplified fully tracked and cost-added modes
- **Enhanced WAC Calculation** with proper inventory awareness
- **Statement-Based Import** with automated supplier matching

## 📦 **Installation**

### **Prerequisites**

- Node.js 18.18+ (recommended: 20+)
- pnpm (recommended) or npm
- Git

### **Setup**

1. **Clone the repository**

   ```bash
   git clone https://github.com/vzhick2/btinv-beetech.git
   cd btinv-beetech
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

   **Get your keys from:** https://supabase.com/dashboard/project/jjpklpivpvywagmjjwpu/settings/api

4. **Run database migrations**

   ```bash
   pnpm supabase:migrate
   ```

5. **Run development server**

   ```bash
   pnpm dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📚 **Documentation**

- **[Requirements](docs/requirements.md)** - Business requirements and feature specifications
- **[Data Model](docs/data-model.md)** - Database schema and relationships
- **[Technical Design](docs/technical-design.md)** - Architecture decisions and patterns
- **[Development Guide](docs/development-guide.md)** - Development standards and workflow
- **[Tasks](docs/tasks.md)** - Development progress and task tracking
- **[UI Blueprint](docs/ui-blueprint.md)** - UI design patterns and mobile-first approach

## 🔧 **Development**

### **Commands**

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

### **Project Structure**

```
src/
├── app/                   # Next.js 15 App Router
│   ├── actions/          # Server Actions
│   ├── api/              # API routes
│   └── [pages]/          # Application pages
├── components/           # React components
│   ├── dashboard/        # Dashboard components
│   ├── items/           # Items management
│   ├── layout/          # Layout components
│   ├── purchases/       # Purchase management
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
│   ├── supabase/        # Supabase client
│   ├── utils/           # Business logic utilities
│   └── validations/     # Zod schemas
└── types/               # TypeScript definitions
```

## 📊 **Progress Tracking**

This app follows a **simplified, business-focused approach** that prioritizes practical inventory management over perfectionist systems.

### **Phase 1: Foundation** ✅ **100% Complete**

- ✅ Next.js 15.4.1 + React 19.1.0 setup with TypeScript
- ✅ Supabase integration with PostgreSQL database
- ✅ Tailwind CSS 4.1.11 design system
- ✅ Mobile-first responsive layout
- ✅ Authentication and security setup

### **Phase 2: Core Database** ✅ **100% Complete**

- ✅ Complete database schema with proper relationships
- ✅ PostgreSQL functions for WAC calculations
- ✅ Transaction logging system for audit trails
- ✅ Row Level Security policies
- ✅ Seed data generation for testing

### **Phase 3: Smart Business Logic** ✅ **100% Complete**

- ✅ Smart cost allocation engine with preview
- ✅ Two-mode tracking system (Fully Tracked/Cost Added)
- ✅ Cycle count alerts with priority scoring
- ✅ CSV import system with validation
- ✅ Purchase management with draft workflow
- ✅ Enhanced WAC calculation with inventory awareness
- ✅ Consolidated business rules across components
- ✅ Enhanced purchase workflow with allocation preview

### **Core Features 🚧 (40% Complete)**

- ✅ Enhanced Server Actions with smart allocation
- ✅ Simplified suppliers management (removed AG Grid complexity)
- 🚧 Items management with two-mode tracking support
- 📋 Complete UI implementation for all tracking modes

### **Phase 5: Advanced Workflows 📋 (20% Complete)**

- 📋 Recipe management with cost calculations
- 📋 Batch production with yield tracking
- 📋 Sales integration with BigCommerce
- 📋 Reporting dashboard with COGS analytics
- 📋 Statement-based import automation

### **Phase 6: Polish & Optimization 📋 (0% Complete)**

- 📋 Performance optimization
- 📋 Advanced error handling
- 📋 User onboarding flow
- 📋 Mobile app considerations
- 📋 Documentation completion

## 🔐 **Security & Privacy**

- **Private Application**: Not intended for public use or distribution
- **Data Security**: All data stored in Supabase with RLS policies
- **No Analytics**: Privacy-focused with minimal data collection
- **Local Development**: Full control over data and deployment

## 📝 **License**

**Private/Internal Use Only** - This project is not licensed for public use, distribution, or commercial purposes.

---

**Built for small business owners who need practical inventory management without the complexity of enterprise solutions.**
