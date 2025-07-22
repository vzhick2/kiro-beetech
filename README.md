# BTINV Inventory Management System

> **A private, simplified COGS-focused inventory solution for small business operations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 📋 Overview

BTINV is a **private, business-focused inventory management system** designed for small businesses that prioritize COGS (Cost of Goods Sold) tracking. Following the 80/20 rule, it focuses on tracking cost drivers for profitability while supporting real-world business workflows like statement-based bookkeeping and monthly inventory sessions.

The system supports both Next.js web application and Google Sheets implementations to accommodate different technical requirements and team preferences.

## ✨ Key Features

### 🧮 **Cost Management**

- **Intelligent Cost Allocation**: Proportional distribution of shipping, taxes, and fees to inventory items
- **Weighted Average Cost (WAC)**: Automatic calculation with manual recalculation tools
- **Two-Mode Tracking**: Fully tracked for core ingredients, cost-added for packaging materials
- **COGS-Focused Analytics**: 80/20 rule applied to track cost drivers

### 📦 **Purchase Management**

- **Draft Purchases**: Overhead allocation (shipping, taxes) with allocation preview
- **Statement Integration**: Automated bank CSV import with supplier matching
- **Mixed Invoice Support**: Handle COGS and non-COGS items in single purchases
- **Allocation Engine**: Real-time preview of cost distribution with variance warnings

### 🏪 **Inventory Tracking**

- **Two-Mode Tracking System**: Fully Tracked 🟢 and Cost Added 🟡 modes
- **Cycle Count Alerts**: Algorithm-based alerts for inventory that needs attention
- **Negative Inventory Support**: Allow operations to continue with proper alerting
- **Mutable Transaction Logs**: Support real-world corrections with timestamp tracking

### 🏭 **Production Management**

- **Recipe & Batch Production**: Convert ingredients to finished goods with cost tracking
- **Yield Tracking**: Monitor production efficiency and material usage
- **Cost Variance Analysis**: Track actual vs projected production costs

### 📊 **Sales & Reporting**

- **QBO CSV Import**: Automated sales data integration
- **Comprehensive Reporting**: Item history, supplier analysis, recipe costing
- **COGS Percentage Tracking**: Simple traffic light indicators (Green <30%, Yellow 30-50%, Red >50%)
- **Monthly Reconciliation**: Aligned with accounting periods and business practices

### 🔍 **Business Intelligence**

- **Automated Supplier Matching**: Confidence-scored matching from bank statements
- **Reorder Suggestions**: Based on tracking mode and supplier history
- **Cost Impact Preview**: See financial effects before finalizing changes
- **Complete Audit Trail**: Transaction history for all inventory movements

## Quick Start

### Next.js Application

```bash
# Clone and install dependencies
git clone <repository-url>
cd KIRO-BEETECH
pnpm install

# Set up environment variables
cp .env.example .env.local
# Configure Supabase credentials

# Run development server
pnpm dev
```

### Google Sheets Alternative

For teams preferring spreadsheet workflows, see:
- **[Google Sheets Alternative](./docs/google-sheets-alternative.md)** - Complete implementation with Apps Script

## Documentation

### Core Documentation

- **[Development Guide](./docs/development.md)** - Setup, standards, and troubleshooting
- **[Technical Reference](./docs/technical-reference.md)** - Database schema, APIs, and architecture
- **[Requirements](./docs/requirements.md)** - Functional and business requirements
- **[Technical Design](./docs/technical-design.md)** - Architecture and implementation details

### Additional Resources

- **[UI Blueprint](./docs/ui-blueprint.md)** - User interface design and workflows
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions
- **[Tasks](./docs/tasks.md)** - Development tasks and roadmap

## 🚀 Technology Stack

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

- **Allocation Engine** for proportional cost distribution
- **Two-Mode Tracking System** with fully tracked and cost-added modes
- **WAC Calculation** with inventory awareness
- **Statement-Based Import** with automated supplier matching

## 📦 Installation

### Prerequisites

- Node.js 18.18+ (recommended: 20+)
- pnpm (recommended) or npm
- Git

### Next.js Application Setup

```bash
# Clone and install dependencies
git clone <repository-url>
cd KIRO-BEETECH
pnpm install

# Environment setup
cp .env.example .env.local
# Add your Supabase credentials from:
# https://supabase.com/dashboard/project/[your-project]/settings/api

# Run database migrations
pnpm supabase:migrate

# Run development server
pnpm dev

# Open in browser
# http://localhost:3000
```

### Google Sheets Alternative

For teams preferring spreadsheet workflows, see:
- **[Google Sheets Alternative](./docs/google-sheets-alternative.md)** - Complete implementation with Apps Script

## 🔧 Development

### Commands

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

### Project Structure

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

## 📚 Documentation

### Core Documentation

- **[Developer Guide](./docs/developer-guide.md)** - Setup, architecture, standards, and AI guidelines
- **[Product Specification](./docs/product-specification.md)** - Business requirements and UI design
- **[Technical Reference](./docs/technical-reference.md)** - Database schema, APIs, and architecture
- **[Tasks](./docs/tasks.md)** - Development tasks and roadmap

### Additional Resources

- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions
- **[Google Sheets Alternative](./docs/google-sheets-alternative.md)** - Complete spreadsheet implementation

## 📊 Progress Tracking

This app follows a **business-focused design** that prioritizes practical inventory management for small businesses.

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

- ✅ Two-mode tracking system (Fully Tracked/Cost Added)
- ✅ Cycle count alerts with priority scoring
- ✅ CSV import system with validation
- ✅ Purchase management with draft workflow
- ✅ WAC calculation with inventory awareness
- ✅ Business rules across components
- ✅ Purchase workflow with allocation preview

### **Core Features 🚧 (40% Complete)**

- ✅ Enhanced Server Actions with allocation functionality
- ✅ Suppliers management (removed AG Grid complexity)
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

## 🔐 Security & Privacy

- **Private Application**: Not intended for public use or distribution
- **Data Security**: All data stored in Supabase with RLS policies
- **No Analytics**: Privacy-focused with minimal data collection
- **Local Development**: Full control over data and deployment

## 📝 License

**Private/Internal Use Only** - This project is not licensed for public use, distribution, or commercial purposes.

---

**Built for small business owners who need practical inventory management.**
