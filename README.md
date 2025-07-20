# KIRO Inventory Management System

> **A private, internal inventory management solution for small business operations**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## 📋 **Overview**

KIRO is a **private, internal inventory management system** designed specifically for small business operations. Built with modern web technologies, it provides real-time inventory tracking, purchase management, recipe systems, and detailed reporting capabilities for internal business use only.

**This is not a public application or open-source project.**

## ✨ **Key Features**

### 🏪 **Inventory Management**

- Real-time stock tracking with automated alerts
- Cycle counting and reconciliation
- Negative inventory warnings
- Multi-location inventory support

### 📦 **Purchase Management**

- Supplier management and catalog integration
- Purchase order creation and tracking
- Smart bank CSV import with automated drafts
- WAC (Weighted Average Cost) calculation

### 🍰 **Recipe & Batch Management**

- Recipe creation with ingredient tracking
- Batch production logging with yield analysis
- Ingredient consumption tracking
- Cost per unit calculations

### 📊 **Analytics & Reporting**

- Real-time dashboard with KPIs
- Cycle count alerts for proactive management
- Financial reporting and cost analysis
- Low-stock Action Center

### 🔍 **Advanced Search**

- Global search with Next.js 15 Form component
- Smart filtering and suggestions
- Recent activity tracking
- Quick navigation shortcuts

## 🚀 **Technology Stack**

### **Frontend**

- **Next.js 15.4.1** with App Router and Turbopack
- **React 19.1.0** with Server Components
- **TypeScript 5.8.3** for type safety
- **Tailwind CSS 4.1.11** for styling
- **Radix UI** for accessible components

### **Backend & Database**

- **Supabase** for database and authentication
- **Server Actions** for form handling
- **TanStack Query** for data fetching
- **Zod 4.0.5** for validation

### **Developer Experience**

- **ESLint 9** with Next.js config
- **React Compiler** for automatic optimization
- **Instrumentation** for monitoring
- **Hot Module Replacement** with Turbopack

## 📦 **Installation**

### **Prerequisites**

- Node.js 18.18+ (recommended: 20+)
- pnpm (recommended) or npm
- Git

### **Setup**

1. **Clone the repository**

   ```bash
   git clone <private-repository-url>
   cd kiro-inventory-management
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your actual Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://jjpklpivpvywagmjjwpu.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

   **Get your keys from:** https://supabase.com/dashboard/project/jjpklpivpvywagmjjwpu/settings/api

4. **Run development server**

   ```bash
   pnpm dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ **Design Philosophy**

This app prioritizes simplicity and flexibility for small businesses with irregular workflows:

- **Editable Records**: Mutable transaction logs with timestamps allow easy corrections
- **Simplified Operations**: Direct inline edits for quick fixes
- **Proactive Alerts**: Cycle count alerts reduce over-reliance on manual inventory checks
- **Mobile-First**: Optimized for on-the-go tasks with desktop focus for admin work
- **Flexible Data Entry**: Forgiving workflows that support back-dating and corrections

## 🎯 **Key Features Implemented**

### **Navigation System**

- ✅ Unified sidebar for mobile and desktop
- ✅ Static hamburger menu button
- ✅ BigCommerce-inspired design system
- ✅ Breadcrumb navigation
- ✅ Simplified navigation without command palette

### **Search & Discovery**

- ✅ Global search with Next.js 15 Form component
- ✅ Smart filtering and suggestions
- ✅ Recent activity tracking
- ✅ Quick navigation shortcuts

### **Performance Optimizations**

- ✅ Turbopack for 76% faster development
- ✅ React Compiler for automatic memoization
- ✅ Server Components for better performance
- ✅ Image optimization with Next.js

### **Developer Experience**

- ✅ TypeScript strict mode
- ✅ ESLint 9 with Next.js config
- ✅ Instrumentation for monitoring
- ✅ Hot Module Replacement

## 🗺️ **Development Roadmap**

### **Phase 1: Foundation ✅ (100% Complete)**

- ✅ Next.js 15.4.1 + React 19.1.0 setup
- ✅ Application layout and navigation
- ✅ Core TypeScript interfaces and utilities
- ✅ Performance optimizations

### **Phase 2: Core Features 🚧 (15% Complete)**

- 📋 Database schema implementation
- 📋 Core business logic functions (WAC, cycle count alerts)
- 🚧 Items management completion
- 📋 Suppliers management

### **Phase 3: Business Workflows 📋 (0% Complete)**

- 📋 Purchase management workflow
- 📋 CSV import and draft purchase system
- 📋 Recipe and batch management
- 📋 Sales tracking and reporting

### **Phase 4: Advanced Features 📋 (0% Complete)**

- 📋 Forecasting and reorder point management
- 📋 Transaction logging and audit trail
- 📋 Error handling and validation system
- 📋 Real-time updates and notifications

### **Phase 5: Polish & Optimization 📋 (0% Complete)**

- 📋 Mobile-first responsive design
- 📋 Data import/export functionality
- 📋 Authentication and security
- 📋 Comprehensive testing suite

**Current Progress: ~25% Complete**

## 🔧 **Development**

### **Available Scripts**

```bash
# Development
pnpm dev             # Start development server with Turbo
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm type-check      # TypeScript checking

# Deployment (Vercel CLI)
pnpm run deploy:preview  # Deploy preview
pnpm run deploy          # Deploy production
```

### **Code Quality**

- **ESLint**: Strict linting with Next.js recommendations
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for pre-commit checks

## 🤖 **MCP Integration**

This project is configured to use the **Model Context Protocol (MCP)** to provide AI assistants with secure access to development tools. This allows for powerful, context-aware assistance directly within the IDE.

### **Available Servers**

The following MCP servers are configured in `.vscode/mcp.json`:

1.  **`supabase`**: Provides tools for interacting with the Supabase database, including an `execute_sql` command for running queries.
2.  **`github`**: Offers tools for interacting with the project's GitHub repository.

### **Setup and Connection**

To use the MCP servers, you must have the **Kilo Code** VS Code extension installed.

1.  **Generate Access Tokens**:
    - **Supabase**: Create a personal access token from your Supabase account dashboard.
    - **GitHub**: Create a personal access token with `repo`, `workflow`, `read:org`, and `user` scopes.

2.  **Connect to Servers**:
    - Open the VS Code Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
    - Run the command `MCP: Connect to Servers`.
    - Enter your access tokens when prompted. The extension will securely store them.

### **Example Usage**

Once the servers are connected, you can use them to perform various tasks.

#### Supabase Example

To query the database for a list of suppliers:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "execute_sql",
    "arguments": {
      "query": "SELECT * FROM suppliers LIMIT 10;"
    }
  }
}
```

#### GitHub Example

To retrieve information about the repository:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_repo_info",
    "arguments": {
      "owner": "your-github-username",
      "repo": "kiro-inventory-management"
    }
  }
}
```

## 📚 **Documentation**

- [Data Model](./docs/data-model.md) - Database schema and architecture
- [Technical Design](./docs/technical-design.md) - System design and architecture
- [Requirements](./docs/requirements.md) - User stories and acceptance criteria
- [Implementation Tasks](./docs/tasks.md) - Development tasks and progress
- [UI Blueprint](./docs/ui-blueprint.md) - UI design and user workflows
- [Development Guide](./docs/development-guide.md) - Development standards, workflow, and progress
- [AI Guidelines](./docs/ai-guidelines.md) - AI assistant guidelines
- [Deployment Guide](./docs/deployment.md) - Production deployment
- [Dependency Audit](./docs/dependency-audit.md) - Technology stack analysis
- [API Documentation](./docs/api-documentation.md) - Backend functions and endpoints

## 🔐 **Security**

- ✅ **Server Actions**: Enhanced security with unguessable IDs
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Input Validation**: Zod schemas for all forms
- ✅ **Authentication**: Supabase Auth integration
- ✅ **Authorization**: Row-level security policies

## 📞 **Internal Support**

- 📖 **Documentation**: [Full docs](./docs/)
- 🔧 **Development**: Internal development team
- 🐛 **Issues**: Internal issue tracking system

---

**Built with ❤️ for internal business operations using Next.js 15, React 19, and modern web technologies**

_For detailed changelog, see [CHANGELOG.md](./CHANGELOG.md)_
