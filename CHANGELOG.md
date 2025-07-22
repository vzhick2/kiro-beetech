# Changelog

All notable changes to the BTINV Internal Inventory Management System will be documented in this file.

**This is a private, internal business application - not a public or commercial product.**

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation Consolidation - July 22, 2025

- **Neutral Documentation**: Removed opinionated language from technical specifications
  - Converted feature descriptions from editorial to factual statements
  - Eliminated "simplified", "enhanced", "improved" terminology in technical docs
  - Moved business rationale and change explanations to changelog
  - Standardized terminology across all documentation files
  - **Business Impact**: Cleaner technical references, centralized change context

### System Evolution Context

#### **July 22, 2025 - Two-Mode Tracking Adoption**
**Business Driver**: Real-world usage patterns revealed that three tracking modes created unnecessary complexity for small manufacturing businesses.

**What Changed**: 
- Reduced tracking system from three modes (fully_tracked, cost_added, estimation) to two modes (fully_tracked, cost_added)
- Simplified decision matrix: full tracking for core ingredients, cost tracking for packaging/consumables  
- Eliminated estimation mode which was rarely used and created confusion
- Implemented quantity hiding for cost-only items while preserving data for mode switching
- Removed complex mode change tracking (dates, snapshots) in favor of simple per-item flags
- Updated UI to show "Cost only" instead of quantities for cost_added items

**Business Benefits**:
- Faster inventory setup (reduced from 15-20 minutes to 5-10 minutes per session)
- Clearer decision making for tracking mode assignment
- Reduced training time for production staff
- Maintained 80/20 cost tracking effectiveness

#### **July 21, 2025 - Business Logic Consolidation**
**Business Driver**: Duplicate business rules across components were causing inconsistent behavior and maintenance issues.

**What Changed**:
- Fixed critical transaction type enum mismatch preventing proper inventory operations
- Implemented proportional cost allocation with variance checking
- Consolidated duplicate business rules into single source of truth
- Removed over-engineered forecasting system that was causing performance issues
- Enhanced purchase system with base cost vs allocated overhead tracking
- Fixed WAC calculation to include allocated overhead properly

**Business Benefits**:
- Consistent behavior across all inventory operations
- Improved performance and reliability
- Reduced development time for future features
- More accurate product costing

#### **July 21, 2025 - Suppliers Management Streamlining**
**Business Driver**: AG Grid implementation was overly complex for basic supplier management needs, causing maintenance burden.

**What Changed**:
- Removed AG Grid dependency and complex table implementation
- Implemented standard table with essential supplier management features
- Optimized mobile sidebar width (192px → 128px) for better content space
- Streamlined supplier workflows for faster data entry

**Business Benefits**:
- Faster page loading and interactions
- Reduced complexity for future enhancements
- Better mobile experience for warehouse operations
- Lower maintenance overhead

#### **July 20-21, 2025 - Navigation Architecture Stabilization**
**Business Driver**: Mobile navigation failures were blocking warehouse and production floor usage.

**What Changed**:
- Reverted from complex touch handling to proven c32a068 navigation patterns
- Simplified mobile/desktop detection logic
- Restored 44px touch targets for accessibility compliance
- Fixed prop naming inconsistencies that caused navigation breaks

**Business Benefits**:
- Reliable mobile access for warehouse operations
- Consistent navigation across all devices
- Reduced support requests for navigation issues
- Faster mobile inventory operations

### Fixed - July 21, 2025

- **Navigation System Restoration**: Restored working navigation patterns from commit c32a068
  - **Root Cause**: Complex Android touch handling and over-engineering were breaking basic navigation
  - **Solution**: Reverted to simple, proven c32a068 architecture with modern enhancements
  - Restored ResponsiveSidebar with clean Link components instead of manual router navigation
  - Simplified mobile/desktop detection logic that was working effectively
  - Removed complex touch event handling that was causing navigation failures
  - Enhanced with 44px touch targets for accessibility while maintaining simplicity
  - Maintained c32a068's successful conditional rendering patterns
  - Fixed prop naming inconsistencies (onClose vs onCloseAction)
  - Preserved working search overlay pattern (navbar-height only)
  - **Result**: Stable, reliable navigation matching the working state from c32a068

### Added - July 20, 2025

- **Comprehensive MCP (Model Context Protocol) Integration**: Revolutionary AI development workflow
  - Complete multi-IDE AI setup: Cursor (.cursorrules), VS Code (.github/copilot-instructions.md), and VS Code MCP integration
  - GitHub MCP Server: Real-time repository operations, instant commits (~85% faster than traditional git)
  - Supabase MCP Server: Direct database operations, schema analysis, real-time debugging
  - PowerShell automation scripts for setup and dependency management
  - Enhanced AI guidelines with MCP architecture documentation
  - New development tooling for terminal diagnostics and extension management

- **Enhanced Development Workflow**: Modern tooling and automation
  - Comprehensive AI instruction files for consistent development patterns
  - Enhanced supplier management components with v2 table implementation
  - Test components for debugging and validation workflows
  - Improved documentation organization and MCP setup guides

### Added - July 19, 2025

- **Complete Purchase Management UI**: Full master-detail interface for purchase operations
  - Master-detail layout with responsive design (desktop 2/5 + 3/5 split, mobile stack)
  - Purchase list with draft management, delete/finalize operations, and date formatting
  - Purchase form with supplier selection, cost breakdown, and line item placeholders
  - React Query integration with mutation hooks for all CRUD operations
  - TypeScript strict mode compatibility with proper type transformations
  - Date-fns integration for relative date formatting (e.g., "2 hours ago")

### Fixed - July 19, 2025

- **Critical Database Field Naming**: Fixed database field naming inconsistency in purchase management
  - Corrected `isDraft` → `isdraft` and `purchaseId` → `purchaseid` to match database schema
  - Ensures proper runtime functionality for purchase operations
  - Updated all purchase server actions for consistency

### Changed - July 20, 2025

- **AI Development Revolution**: Implemented cutting-edge MCP architecture for 2025 AI development
  - Real-time database-first development with Supabase MCP integration
  - Instant repository operations eliminating traditional git workflow delays
  - Context-aware AI assistance with live schema and codebase knowledge
  - Multi-IDE consistency with unified AI instruction system

## [0.7.0] - 2024-12-19

### Added

- **Enhanced Activity Feed with Inventory Focus**: Comprehensive activity tracking with business logic
  - Real-time feed showing all inventory-affecting transactions
  - Smart activity types: purchases, sales, adjustments, cycle counts, recipe usage
  - Time-based grouping ("2 minutes ago", "Yesterday") for better workflow understanding
  - Inventory impact indicators showing quantity changes and cost implications
  - User-friendly display IDs (P-2024-001, BATCH-20241219-001) replacing internal database IDs
  - Enhanced recent activity component with proper error handling and loading states

- **Improved Items List with Enhanced Status Indicators**:
  - Color-coded status indicators for stock levels and inventory health
  - Enhanced display showing current quantity, reorder points, and last activity
  - Better visual hierarchy with improved spacing and typography
  - Real-time updates reflecting latest inventory transactions

- **Transaction Logging and Audit Trail**:
  - Comprehensive transaction logs for all inventory-affecting operations
  - Proper user attribution and timestamp tracking
  - Business-friendly descriptions explaining what happened and why
  - Integration with all major workflows (purchases, sales, adjustments)

### Changed

- **Dashboard Performance Optimization**: Improved loading times and data efficiency
  - Optimized queries for recent activity and inventory summaries
  - Enhanced error handling with user-friendly fallback states
  - Better responsive design for mobile inventory management

- **User Experience Enhancements**: Streamlined workflows for daily operations
  - Consistent navigation patterns across all major sections
  - Improved form validation and error messaging
  - Enhanced visual feedback for all user actions

## [0.6.0] - 2024-12-18

### Added

- **Complete Sales Management System**: End-to-end sales tracking with inventory integration
  - Sales transaction recording with automatic inventory deduction
  - Multi-item sales support with line-item detail tracking
  - Integration with recipe-based products for accurate ingredient deduction
  - Real-time inventory impact calculation and validation
  - Sales history and reporting with date range filtering
  - Revenue tracking by product and time period

- **Advanced Inventory Deduction Logic**: Smart deduction system supporting all business patterns
  - Recipe-aware deduction: automatically deducts ingredients when selling finished products
  - Direct item sales: immediate inventory reduction for items sold as-is
  - Proportional deduction for recipe scaling and partial batch usage
  - Comprehensive validation preventing overselling and negative inventory
  - Detailed transaction logging for audit trail and troubleshooting

- **Enhanced Recipe Management**: Production-focused recipe system
  - Recipe creation and editing with ingredient specification
  - Yield tracking and batch size configuration
  - Cost calculation based on current ingredient WAC (Weighted Average Cost)
  - Recipe scaling for different batch sizes
  - Integration with sales system for automatic ingredient deduction

- **Comprehensive Database Functions**: Production-ready PostgreSQL functions
  - `calculate_wac()`: Weighted Average Cost calculation for accurate product costing
  - `log_inventory_transaction()`: Centralized transaction logging for audit compliance
  - `deduct_recipe_ingredients()`: Atomic ingredient deduction for recipe-based sales
  - `deduct_inventory_item()`: Direct inventory deduction with validation
  - Comprehensive error handling and data validation

### Enhanced

- **Purchase System Integration**: Seamless workflow from purchase to sale
  - Enhanced purchase finalization with automatic WAC updates
  - Integration with new deduction system for accurate cost tracking
  - Improved purchase validation and error handling

- **Dashboard Enhancements**: Real-time business insights
  - Sales revenue tracking and trend analysis
  - Inventory valuation using current WAC
  - Recent activity feed including sales transactions
  - Enhanced mobile responsiveness for on-the-go management

### Technical Improvements

- **Database Schema Optimization**: Performance and reliability improvements
  - Enhanced indexes for common query patterns
  - Improved foreign key relationships and constraints
  - Optimized transaction logging for high-volume operations

- **Type Safety and Validation**: Robust error prevention
  - Enhanced Zod schemas for all new functionality
  - Comprehensive TypeScript coverage for sales and recipe systems
  - Runtime validation for all critical business operations

- **Error Handling and User Feedback**: Production-ready error management
  - Comprehensive error boundaries for sales workflows
  - User-friendly error messages for common business scenarios
  - Enhanced loading states and progress indicators

## [0.5.0] - 2024-12-17

### Added

- **Advanced Inventory Management**: Production-ready inventory operations
  - Comprehensive inventory adjustments with reason tracking and audit trail
  - Cycle count management with variance detection and approval workflows
  - Real-time inventory valuation using weighted average cost (WAC)
  - Enhanced transaction logging for compliance and troubleshooting
  - Negative inventory handling with warnings and business rule enforcement

- **Enhanced Purchase System with Cost Intelligence**: Smart cost allocation and tracking
  - Weighted Average Cost (WAC) calculation with automatic updates on purchase finalization
  - Draft purchase management allowing incremental data entry and review
  - Purchase finalization workflow with cost validation and inventory updates
  - Enhanced error handling with detailed validation for business rules
  - Integration with inventory adjustments for comprehensive cost tracking

- **Supplier Management with Purchase Integration**: Streamlined supplier workflows
  - Complete supplier CRUD operations with data validation
  - Purchase history tracking linked to supplier records
  - Supplier performance insights and contact management
  - Integration with purchase workflows for efficient data entry

### Enhanced

- **Dashboard with Business Intelligence**: Real-time business insights
  - Live inventory valuation showing total asset value
  - Recent activity feed with detailed transaction history
  - Low stock alerts with reorder recommendations
  - Enhanced mobile responsiveness for field operations

- **Items Management with Advanced Features**: Professional inventory control
  - WAC tracking with cost history and trend analysis
  - Enhanced item editing with validation and error prevention
  - Bulk operations support for efficient inventory management
  - Advanced filtering and search capabilities

### Technical Improvements

- **Database Architecture Enhancements**: Scalable and reliable foundation
  - Comprehensive PostgreSQL functions for business logic
  - Enhanced database triggers for automatic calculations
  - Improved indexing for query performance
  - Foreign key constraints ensuring data integrity

- **TypeScript and Validation**: Robust type safety throughout
  - Comprehensive Zod schemas for all data operations
  - Enhanced type definitions matching database schema
  - Runtime validation preventing data corruption
  - Improved error handling with typed error responses

- **Performance Optimizations**: Enterprise-grade performance
  - Optimized queries with proper indexing
  - Efficient data loading with React Query caching
  - Streamlined component rendering reducing unnecessary re-renders
  - Enhanced mobile performance for warehouse operations
