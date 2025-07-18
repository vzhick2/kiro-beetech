# KIRO Inventory Management System

> **A modern, full-stack inventory management solution built with Next.js 15, React 19, and TypeScript**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.52.0-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)

## 📋 **Overview**

KIRO is a comprehensive inventory management system designed for small to medium-sized businesses. Built with modern web technologies, it provides real-time inventory tracking, purchase management, recipe systems, and detailed reporting capabilities.

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

### � **Analytics & Reporting**
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
- **Tailwind CSS 3.4.17** for styling
- **Radix UI** for accessible components

### **Backend & Database**
- **Supabase** for database and authentication
- **Server Actions** for form handling
- **TanStack Query** for data fetching
- **Zod** for validation

### **Developer Experience**
- **ESLint 9** with Next.js config
- **React Compiler** for automatic optimization
- **Instrumentation** for monitoring
- **Hot Module Replacement** with Turbopack

## 📦 **Installation**

### **Prerequisites**
- Node.js 18.18+ (recommended: 20+)
- npm, yarn, or pnpm
- Git

### **Setup**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kiro-inventory-management.git
   cd kiro-inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3001
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
- ✅ Command palette for quick actions

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

## 🔧 **Development**

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Code Quality**
- **ESLint**: Strict linting with Next.js recommendations
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for pre-commit checks

## 📚 **Documentation**

- [Dependency Audit](./DEPENDENCY_AUDIT.md) - Complete technology stack analysis
- [Development Workflow](./DEVELOPMENT_WORKFLOW.md) - VS Code workflow system
- [Project Progress](./PROJECT_PROGRESS.md) - Development progress tracking
- [Data Model](./data-model.md) - Database schema and architecture
- [UI Blueprint](./ui-blueprint.md) - UI design and user workflows
- [Development Standards](./dev-standards.md) - Technical standards and guidelines
- [AI Guidelines](./ai-guidelines.md) - AI assistant guidelines

## 🔐 **Security**

- ✅ **Server Actions**: Enhanced security with unguessable IDs
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Input Validation**: Zod schemas for all forms
- ✅ **Authentication**: Supabase Auth integration
- ✅ **Authorization**: Row-level security policies

## 🔄 **Changelog**

### **v0.1.0** (July 18, 2025)
- ✅ Initial release with Next.js 15.4.1
- ✅ React 19.1.0 upgrade complete
- ✅ Modern UI with Tailwind CSS
- ✅ Comprehensive dependency audit
- ✅ Performance optimizations with Turbopack
- ✅ React Compiler integration
- ✅ Enhanced search functionality
- ✅ Server Actions with background tasks

## 📞 **Support**

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/kiro-inventory-management/issues)
- 📧 **Email**: support@kiro-inventory.com
- 📖 **Documentation**: [Full docs](https://docs.kiro-inventory.com)

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies**
