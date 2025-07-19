# Changelog

All notable changes to the KIRO Internal Inventory Management System will be documented in this file.

**This is a private, internal business application - not a public or commercial product.**

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed - July 19, 2025

- **Critical Database Field Naming**: Fixed database field naming inconsistency in purchase management
  - Corrected `isDraft` → `isdraft` and `purchaseId` → `purchaseid` to match database schema
  - Ensures proper runtime functionality for purchase operations
  - Updated all purchase server actions for consistency

### Changed - July 19, 2025

- **Simplified User Experience**: Removed command palette system for streamlined navigation
  - Eliminated CMDK dependency to reduce complexity
  - Simplified navigation to focus on core business workflows
  - Improved mobile search bar visibility across all screen sizes
  - Enhanced mobile-first responsive design

### Added

- **Complete Supabase Development Environment Setup**
  - Remote Supabase project integration (`cursor-kiro-beetech`)
  - Comprehensive npm scripts for database management
  - TypeScript type generation from database schema
  - Sample data with 3 suppliers, 7 items, 2 recipes, 2 purchases, 5 transactions, 2 batches, 2 sales periods

### Database & Infrastructure

- **Supabase CLI Integration**: Available via `npx supabase` with full command support
- **Database Schema**: Complete schema with all tables, relationships, and business logic functions
- **Environment Configuration**: Remote Supabase URLs for production-ready development
- **Sample Data**: Realistic honey production business data for testing
- **Documentation**: Comprehensive setup guide and troubleshooting

### Development Tools

- **Database Scripts**: npm scripts for remote development
- **Type Generation**: Automatic TypeScript types from database schema
- **Migration Management**: Schema versioning and deployment tools

### Changed

- Enhanced error handling for business workflows
- Improved mobile interface for workshop use
- Updated notification system for internal alerts
- **Supabase Client**: Updated with fallback configuration and proper TypeScript types

## [0.1.0] - 2024-12-19

### Added

- Initial internal business application setup
- Next.js 15.4.1 with React 19.1.0 foundation
- Modern UI optimized for small business workflows
- Comprehensive technology stack audit
- Performance optimizations for internal use
- React Compiler for automatic optimization
- Enhanced search for inventory management
- Server Actions for business operations

### Technical Foundation

- **Next.js**: 15.4.1 with Turbopack for faster development
- **React**: 19.1.0 with enhanced features
- **TypeScript**: 5.8.3 for type safety
- **Tailwind CSS**: 4.1.11 for styling
- **Supabase**: 2.52.0 for database and authentication
- **TanStack Query**: 5.83.0 for data management
- **ESLint**: 9.31.0 for code quality

### Performance Improvements

- 76% faster development server with Turbopack
- Automatic memoization with React Compiler
- Optimized for internal business workflows
- Enhanced server-side rendering

### Internal Business Features

- Mobile-first design for workshop operations
- Forgiving data entry workflows
- Support for back-dating and corrections
- Cycle count alerts for proactive management
- Direct-edit workflows for quick updates

---

## Version History Summary

| Version    | Date       | Major Changes                               |
| ---------- | ---------- | ------------------------------------------- |
| 0.1.0      | 2024-12-19 | Initial internal business application setup |
| Unreleased | -          | Core inventory management features          |

---

_For detailed technical specifications, see [docs/technical-design.md](./docs/technical-design.md)_
