# BTINV Inventory Management System

> **A private, simplified COGS-focused inventory solution for small business operations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue?style=flat-square&logo=typescript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 📋 Overview

BTINV is a **private, business-focused inventory management system** designed for small businesses that prioritize COGS (Cost of Goods Sold) tracking. Following the 80/20 rule, it focuses on tracking cost drivers for profitability while supporting real-world business workflows like statement-based bookkeeping and monthly inventory sessions.

## ✨ Key Features

### 🧮 **Cost Management**

- **Intelligent Cost Allocation**: Proportional distribution of shipping, taxes, and fees to inventory items
- **Weighted Average Cost (WAC)**: Automatic calculation with manual recalculation tools
- **Two-Mode Tracking**: Fully tracked for core ingredients, cost-added for packaging materials
- **COGS-Focused Analytics**: 80/20 rule applied to track cost drivers

### 📦 **Purchase Management**

- **Draft Purchases**: Simple draft/finalized workflow with overhead allocation preview
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

## 📦 Installation & Setup

### Prerequisites

- Node.js 18.18+ (recommended: 20+)
- pnpm (recommended) or npm
- Git

### Installation Steps

```bash
# Clone and install dependencies
git clone <repository-url>
cd KIRO-BEETECH
pnpm install

# Environment setup
cp .env.example .env.local
# Add your Supabase credentials from:
# https://supabase.com/dashboard/project/[your-project]/settings/api

# Run development server
pnpm dev
```

_For detailed setup instructions, environment configuration, and database migrations, see [Developer Guide](./docs/developer-guide.md#environment-setup)._

## 📚 Documentation

### Core Documentation

- **[Developer Guide](./docs/developer-guide.md)** - Setup, architecture, standards, and AI guidelines
- **[Product Specification](./docs/product-specification.md)** - Business requirements and UI design
- **[Technical Reference](./docs/technical-reference.md)** - Database schema, APIs, and architecture
- **[Tasks](./docs/tasks.md)** - Development tasks and roadmap

## 🚀 Technology Stack

- **Frontend**: Next.js 15.4.1, React 19.1.0, TypeScript 5.5.4, Tailwind CSS 4.1.11
- **Backend**: Supabase, PostgreSQL, Server Actions
- **Data**: TanStack Query, Zod validation
- **UI Components**: Radix UI, TanStack Table
- **Development**: ESLint, Prettier, Husky

_For comprehensive technology stack details, version management, and environment configuration, see [Developer Guide](./docs/developer-guide.md#technology-stack)._

## 🔧 Development

### Commands

```bash
# Essential commands
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm lint                   # Run ESLint
pnpm type-check            # Run TypeScript checks
pnpm supabase:types        # Generate TypeScript types
```

_See [Developer Guide](./docs/developer-guide.md) for complete command reference._

### Project Structure

```
src/
├── app/                   # Next.js 15 App Router
├── components/           # React components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── types/               # TypeScript definitions
```

_See [Developer Guide](./docs/developer-guide.md) for detailed project structure and [Technical Reference](./docs/technical-reference.md) for database schema._

## 📚 Documentation

### Core Documentation

- **[Developer Guide](./docs/developer-guide.md)** - Setup, architecture, standards, and AI guidelines
- **[Product Specification](./docs/product-specification.md)** - Business requirements and UI design
- **[Technical Reference](./docs/technical-reference.md)** - Database schema, APIs, and architecture
- **[Tasks](./docs/tasks.md)** - Development tasks and roadmap

### Additional Resources

_See [Developer Guide](./docs/developer-guide.md) for complete command reference and [Technical Reference](./docs/technical-reference.md) for database schema._

## 📋 Current Development Status

For detailed development progress, task tracking, and completion status, see **[Tasks](./docs/tasks.md)**.

## 🔐 Security & Privacy

- **Private Application**: Not intended for public use or distribution
- **Data Security**: All data stored in Supabase with RLS policies
- **No Analytics**: Privacy-focused with minimal data collection
- **Local Development**: Full control over data and deployment

## 📝 License

**Private/Internal Use Only** - This project is not licensed for public use, distribution, or commercial purposes.

---

**Built for small business owners who need practical inventory management.**
