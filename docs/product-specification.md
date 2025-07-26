---
title: 'Product Specification'
description: 'Complete business requirements and UI design for internal inventory management system'
purpose: 'Unified reference for product requirements, business rules, and user interface specifications'
last_updated: 'July 22, 2025'
doc_type: 'product-specification'
related:
  ['README.md', 'developer-guide.md', 'technical-reference.md', 'tasks.md']
---

# Product Specification

Complete product specification covering business requirements, user interface design, and workflows for the internal BTINV inventory management system.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## Table of Contents

1. [Business Requirements](#business-requirements)
2. [Functional Requirements](#functional-requirements)
3. [UI Design Philosophy](#ui-design-philosophy)
4. [Navigation & Layout](#navigation--layout)
5. [Visual Design System](#visual-design-system)
6. [Core User Workflows](#core-user-workflows)
7. [Mobile-First Views](#mobile-first-views)
8. [Desktop-First Views](#desktop-first-views)
9. [Data Entry Standards](#data-entry-standards)
10. [Error Handling & States](#error-handling--states)

## 🎯 Business Requirements

### Core Business Objectives

1. **COGS Tracking**: Focus on cost tracking for ingredients and core materials that impact product margins
2. **Purchase Workflows**: Support statement-based bookkeeping with monthly inventory detail batching
3. **Cost Allocation**: Automatically distribute shipping, taxes, and fees proportionally to inventory items
4. **Multi-Modal Tracking**: Support full tracking for core ingredients, cost-only tracking for packaging, and estimation for consumables
5. **Business Operations**: Accommodate real-world workflows with flexible data entry and flexible timing

### Target Users

- **Primary**: Small business owners (2-10 person operations)
- **Secondary**: Production staff for batch logging and cycle counts
- **Workflow**: Statement-based bookkeeping with monthly inventory sessions

### Business Context

- **Scale**: Small businesses with mixed COGS/non-COGS purchases
- **Industry**: Manufacturing, food production, cosmetics, craft businesses
- **Bookkeeping**: Statement-based entry, not real-time purchase logging
- **Focus**: 80/20 rule - capture 80% of COGS value with 20% of data entry effort

## 📋 Functional Requirements

### 1. Flexible Inventory Tracking

#### 1.1 Two-Mode Item Management

- **Fully Tracked Mode**: Exact quantities with traditional low-stock alerts (core ingredients)
- **Cost-Added Mode**: Purchase history alerts, quantities hidden in UI (packaging materials)
- **Mode Assignment**: Business decision based on cost impact and tracking effort
- **Mode Switching**: Change tracking modes with data preservation (minimal snapshot tracking for historical reference)
- **UI Quantity Hiding**: Cost-added items show "Cost added" instead of quantity values

#### 1.2 Items Interface

- **Mixed Tracking Display**: Show different alert types based on tracking mode
- **Time-Based Alerts**: "Check supply" alerts for cost-only items based on purchase history
- **Quantity vs Cost Focus**: Emphasize relevant metrics per tracking mode
- **Mobile-responsive design with 44px touch targets**
- **Keyboard navigation support**

### 2. Smart Purchase Management

#### 2.1 Proportional Cost Allocation

- **Allocation Algorithm**: Distribute shipping/taxes proportional to item base costs
- **Cost Breakdown Tracking**: Separate base cost from allocated overhead
- **Non-Inventory Support**: Handle office supplies and equipment purchases
- **Mixed Invoice Handling**: Support COGS and non-COGS items on same purchase
- **Variance Validation**: Prevent finalization if calculated total differs significantly from actual

#### 2.2 Statement-Based Workflow

- **Monthly Batch Entry**: Support for entering multiple purchases from statements
- **COGS vs Non-COGS Split**: Clear separation of inventory-affecting purchases
- **Purchase Variance Checking**: Validate totals before finalizing
- **Flexible Entry Timing**: Support for back-dating and delayed entry
- **Draft Purchase System**: Create and modify purchases before finalizing

#### 2.3 Purchase Workflow

- **Preview Allocation**: See cost distribution before finalizing
- **Base Cost Entry**: Enter actual item costs before overhead allocation
- **Automatic WAC Updates**: Update weighted average costs with allocated totals
- **Error Prevention**: Comprehensive validation and variance checking
- **Audit Trail**: Complete tracking of cost allocation decisions

### Purchase Workflow Detail

1. **Create Draft**: Basic purchase info (supplier, date, notes)
2. **Add Line Items**: Items, quantities, base costs
3. **Enter Overhead**: Shipping, taxes, other fees
4. **Preview Allocation**: See cost distribution before finalizing
5. **Validate Totals**: Check for significant variances
6. **Finalize**: Apply allocation, update WAC, log transactions, change status from draft to finalized

### 3. Business Logic

#### 3.1 Alert System

- **Single Source of Truth**: Unified cycle count alert calculation
- **Mixed Tracking Alerts**: Different alert types for different tracking modes
- **Priority Scoring**: Standardized algorithm for alert prioritization
- **Time-Based Alerts**: Purchase history alerts for cost-only items
- **Configurable Thresholds**: Adjustable alert sensitivity

#### 3.2 WAC Calculation

- **Inventory-Aware WAC**: Weighted average cost calculation
- **Allocation Integration**: Include allocated overhead in WAC calculation
- **Atomic Updates**: Consistent inventory and cost updates
- **Purchase Integration**: Automatic WAC recalculation on purchase finalization
- **Cost Breakdown Preservation**: Maintain base cost vs overhead distinction

#### 3.3 Inventory Operations

- **Sales Deduction**: Inventory deduction for sales transactions
- **Recipe Consumption**: Ingredient deduction for batch production
- **Inventory Adjustments**: Manual adjustments with reason tracking
- **Waste Tracking**: Record and track material waste
- **Transaction Logging**: Complete audit trail for all inventory changes

### 4. Data Entry Rules

#### 4.1 Workflow Support

- **Statement-Based Entry**: Support monthly batch entry from financial statements
- **Back-Dating**: All transactions support historical effective dates
- **Corrections**: All records editable with audit trail
- **Partial Data**: Support incomplete data entry with warnings
- **Mixed Purchases**: Handle COGS and non-COGS items on same invoice

#### 4.2 Bookkeeping Integration

- **Statement-Based Entry**: Design for monthly inventory sessions
- **COGS Identification**: Flagging of inventory-affecting purchases
- **Batch Processing**: Entry of multiple purchases
- **Mixed Purchase Handling**: Workflows for COGS/non-COGS splits
- **Receipt Reconciliation**: Match inventory details to bookkeeping entries

### 5. Recipe & Production Management

#### 5.1 Recipe Definition

- **Flexible Ingredients**: Support multiple ingredient types and units
- **Cost Calculation**: Real-time cost estimates based on current WAC
- **Version Control**: Track recipe changes over time
- **Yield Tracking**: Expected vs actual output monitoring
- **Scaling Support**: Batch size adjustments with proportional scaling

#### 5.2 Batch Production

- **Production Logging**: Record actual production runs
- **Ingredient Consumption**: Automatic inventory deduction
- **Yield Analysis**: Compare planned vs actual output
- **Cost Tracking**: Material and labor cost capture
- **Quality Notes**: Production notes and observations

### 6. Sales & Revenue Tracking

#### 6.1 Sales Entry

- **Multiple Channels**: Support QBO, BigCommerce, and manual entry
- **Bulk Import**: CSV import for sales data
- **Period-Based Entry**: Monthly/quarterly sales periods
- **Revenue Tracking**: Optional revenue capture for reporting
- **Inventory Deduction**: Automatic stock reduction on sales

#### 6.2 Channel Integration

- **QBO CSV Import**: Standardized import format
- **Data Validation**: Format checking and error reporting
- **Missing Item Handling**: Create items during import process
- **Effective Date Override**: Support for historical sales entry
- **Import Statistics**: Success/error reporting

### 7. Reporting & Analytics

#### 7.1 Business Intelligence

- **COGS Analysis**: Monthly COGS trends and percentages
- **Cost Allocation Reports**: Overhead distribution analysis
- **Tracking Mode Performance**: Insights on different tracking approaches
- **Supplier Analysis**: Purchase pattern analysis
- **Item Performance**: Usage and cost tracking

#### 7.2 Operational Reports

- **Cycle Count Alerts**: Priority-based inventory attention list
- **Low Stock Warnings**: Reorder point notifications
- **Purchase Variance**: Budget vs actual analysis
- **Production Yields**: Batch efficiency tracking
- **Transaction History**: Complete audit trail

## 🎨 UI Design Philosophy

### Business Focus

**Following the 80/20 rule**, the UI prioritizes cost tracking for inventory management. Support statement-based bookkeeping with monthly inventory sessions aligned with business practices.

**Mixed Tracking Support**: Visual indicators for different tracking modes (Full, Cost-Only, Estimate) allow businesses to balance precision with practicality.

### Small Business Context

- **Forgiving Data Entry**: Allow back-dating, editing, and corrections - small businesses need flexibility
- **Mobile-First UX**: Workshop/warehouse use requires touch-friendly interface (≥44px targets)
- **Direct Edit Workflows**: Enable in-place editing rather than complex forms
- **Risk-Appropriate Security**: Small scale = no complex audit trails needed, focus on usability

## 🧭 Navigation & Layout

### Navigation Architecture

Responsive sidebar (persistent on desktop, hamburger on mobile) with primary views. Global "+" button for quick actions. Mobile-first navigation with search bar visible on all screen sizes for quick item/recipe searches.

**Mobile Sidebar Optimization**: Narrower mobile sidebar (w-32, 128px) with balanced padding to maximize content space while maintaining touch-friendly navigation.

### Layout Principles

- **Persistent Sidebar**: Always accessible navigation on desktop
- **Hamburger Menu**: Space-efficient mobile navigation
- **Global Search**: Quick item/recipe lookup from any page
- **Quick Actions**: Prominent "+" button for common tasks
- **Breadcrumbs**: Clear navigation context
- **Page Headers**: Consistent page identification

## 🎨 Visual Design System

### Color Palette

- **Primary Blue**: `#2563eb` for actions and primary elements
- **Sidebar Dark**: `#1e293b` with white text
- **Background Light**: `#f8fafc` for main content area
- **Hover States**: `#34455a` for interactive elements
- **Success Green**: `#10b981` for positive states
- **Warning Orange**: `#f59e0b` for attention items
- **Error Red**: `#ef4444` for critical issues

### Typography

- **Font Family**: Inter (web font)
- **Date Format**: "Jul 15, 2025" (abbreviated month)
- **Currency Format**: "$1,234.56" (standard US format)
- **Headings**: Clear hierarchy with consistent sizing
- **Body Text**: Readable 14px base size

### Spacing & Layout

- **8-Point Grid**: Consistent spacing system
- **Touch Targets**: 44x44px minimum on mobile
- **Content Padding**: Balanced spacing for readability
- **Card Design**: Clean, minimal card layouts
- **Focus States**: Clear accessibility indicators

### Interactive Elements

- **Focus Rings**: Accessible keyboard navigation
- **Hover States**: Clear interactive feedback
- **Loading States**: Skeleton loaders for content
- **Transitions**: Smooth 200ms transitions
- **Button Styles**: Consistent sizing and colors

## 🔄 Core User Workflows

### Business-Aligned Workflows

1. **Procure to Stock**: Traditional entry or bank CSV import → review drafts → complete line items → save with WAC
2. **Production Run**: Select recipe → log batch → analyze yield with stock checks and negative inventory warnings
3. **Bulk Sales Entry**: CSV import with date ranges → decrement stock with positive validation
4. **Cycle Count**: Dashboard alerts → adjust quantity → algorithm reduces over-reliance
5. **Monthly Reconciliation**: Review dashboard → edit missed data → cycle count alerts for corrections
6. **Recipe Development**: Create/edit → test batch → version on edit → tied to batch validation

### Purchase Workflow Detail

1. **Create Draft**: Basic purchase info (supplier, date, notes)
2. **Add Line Items**: Items, quantities, base costs
3. **Enter Overhead**: Shipping, taxes, other fees
4. **Preview Allocation**: See cost distribution before finalizing
5. **Validate Totals**: Check for significant variances
6. **Finalize**: Apply allocation, update WAC, log transactions, change status from draft to finalized

### Production Workflow Detail

1. **Select Recipe**: Choose from active recipes
2. **Set Batch Size**: Scale ingredients proportionally
3. **Check Inventory**: Verify sufficient ingredients
4. **Log Production**: Record actual quantities made
5. **Calculate Costs**: Material + labor cost tracking
6. **Update Inventory**: Deduct ingredients, add products

## 📱 Mobile-First Views

_These views prioritize mobile because small business owners typically use phones/tablets while working in warehouses, workshops, or production areas - quick inventory checks while walking the floor, logging batches during production runs, and performing cycle counts with items in hand require touch-friendly mobile interfaces._

### Items Management

- **Goal**: Manage item status with flexible tracking modes
- **Mobile Features**:
  - **Large Touch Targets**: 44px minimum tap areas
  - **Swipe Actions**: Quick edit/archive gestures
  - **Quick Search**: Instant filtering by name/SKU
  - **Mode Indicators**: Clear visual tracking mode badges
  - **Quantity Adjustments**: Simple +/- buttons for stock updates
- **Tracking Mode Setup**: Easy toggle between Fully Tracked/Cost Added tracking with setup wizard
- **COGS Focus**: Highlight high-value items for cost tracking attention
- **Mobile Layout**: Responsive table that stacks on narrow screens

### Suppliers Management

- **Goal**: Supplier management with focus on purchase relationships
- **Mobile Features**:
  - **Contact Actions**: Tap-to-call, tap-to-email
  - **Quick Add**: Streamlined supplier creation
  - **Search & Filter**: Find suppliers quickly
  - **Archive Toggle**: Easy supplier status management
- **Basic CRUD Operations**: Create, edit, archive suppliers with essential information
- **Contact Management**: Essential contact details and payment terms
- **Mobile Responsive**: Table layout adapting to narrow mobile screens

### Batches & Production

- **Goal**: Log production with cost tracking
- **Mobile Features**:
  - **Recipe Selection**: Large, easy-to-tap recipe cards
  - **Quantity Input**: Number pad-friendly input fields
  - **Photo Capture**: Optional batch photos
  - **Quick Notes**: Voice-to-text production notes
  - **Yield Tracking**: Simple actual vs planned comparison
- **Smart Batch Logging**: Auto-generated display IDs (BATCH-YYYYMMDD-XXX)
- **Yield Analysis**: Simple comparison of planned vs actual output
- **Mobile Layout**: Single-column layout optimized for phone screens

### Cycle Counts & Adjustments

- **Goal**: Quick inventory updates during physical counts
- **Mobile Features**:
  - **Barcode Scanning**: Camera-based SKU lookup
  - **Voice Input**: Spoken quantity entry
  - **Offline Support**: Work without internet, sync later
  - **Quick Adjustments**: Preset adjustment amounts
  - **Photo Evidence**: Capture images for audit trail
- **Priority Alerts**: Algorithm-based inventory attention list
- **Adjustment Tracking**: Reason codes and notes
- **Mobile Workflow**: Optimized for one-handed operation

## 🖥️ Desktop-First Views

_These views require complex data entry and analysis, suited for desktop/laptop screens where users can handle multi-line forms, CSV imports, and detailed reporting._

### Purchases with Allocation

- **Goal**: Streamlined purchase logging with intelligent cost distribution
- **Desktop Features**:
  - **Multi-Line Entry**: Spreadsheet-style line item editing
  - **Split Screen**: Purchase details and allocation preview
  - **Drag & Drop**: File uploads for receipts/documents
  - **Keyboard Shortcuts**: Power user efficiency
  - **Advanced Filtering**: Complex purchase searches
- **Smart Allocation Engine**:
  - **Proportional Distribution**: Automatic overhead allocation
  - **Variance Detection**: Highlight unusual cost distributions
  - **Preview Mode**: See allocation before finalizing
  - **Manual Override**: Adjust allocation when needed
- **Purchase Review**: Draft management with allocation verification
- **Desktop Layout**: Multi-column layout with detailed forms

### Sales & Revenue

- **Goal**: Bulk logging aligned with monthly inventory sessions
- **Desktop Features**:
  - **CSV Import Interface**: Drag-and-drop file handling
  - **Data Validation**: Real-time format checking
  - **Bulk Edit**: Multi-row editing capabilities
  - **Advanced Filters**: Date ranges, channels, items
  - **Export Options**: Custom report generation
- **Period-Based Entry**: Monthly/quarterly sales periods matching business cycles
- **Integration Points**: Simple CSV import with validation
- **Desktop Layout**: Full-width tables with advanced controls

### Reports & Analytics

- **Goal**: Actionable insights for cost management
- **Desktop Features**:
  - **Interactive Charts**: Drill-down capabilities
  - **Custom Date Ranges**: Flexible reporting periods
  - **Print Layouts**: Formatted report printing
  - **Dashboard Widgets**: Customizable KPI displays
  - **Export Tools**: Excel, PDF, CSV exports
- **COGS Analysis**: Monthly COGS trends with variance analysis
- **Tracking Mode Performance**: Insights on different tracking modes
- **Supplier Analysis**: Purchase pattern analysis
- **Desktop Layout**: Multi-panel dashboard with charts

### Recipe Management

- **Goal**: Define/edit products with cost awareness
- **Desktop Features**:
  - **Ingredient Library**: Searchable ingredient database
  - **Cost Calculator**: Real-time recipe costing
  - **Version Control**: Recipe change tracking
  - **Batch Scaling**: Proportional ingredient adjustment
  - **Print Recipes**: Production-ready formatting
- **Cost Impact Preview**: Show estimated cost per batch based on ingredient WAC
- **Ingredient Substitution**: UI for temporary ingredient swaps with cost impact
- **Desktop Layout**: Side-by-side ingredient list and cost breakdown

## 📦 Purchase Management

### Master-Detail Interface Design

**Layout**: Split-screen interface with purchase list (master) on left and detailed purchase editor (detail) on right, optimized for desktop workflow with mobile-responsive stacking.

**Master Panel Features**:
- Purchase list with search and filtering
- Status indicators (Draft/Finalized)
- Quick purchase summary (supplier, date, total, item count)
- New purchase creation

**Detail Panel Features**:
- Spreadsheet-style line item editing
- Real-time total calculations
- Receipt/document upload (drag & drop)
- Automatic cost allocation preview
- Enhanced keyboard navigation

### Purchase Workflow

#### 1. Draft Creation & Editing
- **Spreadsheet Interface**: Excel-like line item entry with Tab/Enter navigation
- **Auto-Item Creation**: Missing items can be created inline via modal popup
- **Real-time Calculations**: Automatic total updates as items are added/edited
- **Receipt Upload**: Drag & drop document attachment support
- **Total Validation**: Simple check that line items don't exceed invoice total

#### 2. Item Entry Enhancement
- **Smart Dropdown**: Type-ahead search with "+ Add [item name]" option for missing items
- **Quick Item Creation Modal**: Minimal fields (name, SKU, type, unit, tracking mode)
- **Auto-SKU Generation**: Suggested SKU based on item name
- **Inline Validation**: Real-time field validation and error display

#### 3. Cost Allocation System
- **Automatic Distribution**: Shipping/taxes allocated proportionally to COGS items
- **Non-COGS Calculation**: Auto-calculated as difference between total invoice and COGS items
- **Real-time Preview**: Show allocation impact as totals change
- **Override Capability**: Manual adjustment of allocation when needed

#### 4. Finalization & Post-Edit
- **Direct Edit**: Finalized purchases can be edited directly with automatic WAC recalculation
- **WAC Recalculation**: System automatically reverses old impact and applies new calculations
- **Audit Trail**: Complete tracking of changes with timestamps
- **Simple Validation**: Basic checks (totals, required fields) without complex variance detection

### Always Visible Fields

- **Purchase Number** (`displayid`) - Reference for tracking and communication ("PO-2025-001")
- **Supplier Name** (via `supplierid` relationship) - Who the order is from
- **Purchase Date** (`purchasedate`) - When the purchase was placed
- **Status** (`isdraft`) - Show as "Draft" or "Finalized" for workflow management
- **Total Amount** (`total`) - Financial overview of the purchase

### Conditionally Visible Fields

- **Effective Date** (`effectivedate`) - When inventory impact occurs, might be different from purchase date
- **Shipping Cost** (`shipping`) - Important for cost analysis but might be in detail view
- **Tax Amount** (`taxes`) - Important for cost analysis but might be in detail view
- **Other Costs** (`othercosts`) - Additional fees, important for managers
- **Notes** (`notes`) - Valuable but space-consuming
- **Attachments** - Receipt images and documents

### Hidden from Users

- **Overhead allocation calculations** - Backend business logic
- **Internal processing timestamps** - Users care about business dates, not system processing times

### Enhanced Features

#### Desktop Optimizations
- **Keyboard Shortcuts**: 
  - Tab: Move between cells
  - Enter: Save cell, move to next row
  - Ctrl+S: Save draft
  - Ctrl+Enter: Finalize purchase
  - Escape: Cancel current edit
- **Drag & Drop**: Receipt and document upload
- **Multi-file Support**: Multiple receipt attachments per purchase
- **Back-dating Support**: Historical effective dates with WAC impact warnings

#### Mobile Considerations
- **Responsive Stacking**: Master-detail becomes vertical stack on mobile
- **Touch-friendly**: 44px minimum touch targets
- **Swipe Navigation**: Switch between purchases via swipe gestures
- **Quick Actions**: Essential functions accessible with large buttons

## 📝 Data Entry Standards

### Form Design Principles

- **Top-Aligned Labels**: Clear field identification
- **Bordered Inputs**: Visual field boundaries
- **Inline Validation**: Real-time error checking
- **Smart Defaults**: Sensible field pre-population
- **Progressive Disclosure**: Show complexity as needed

### Input Standards

- **Number Formats**: Consistent decimal handling
- **Date Inputs**: Calendar pickers with manual entry
- **Currency**: Automatic formatting and validation
- **Text Areas**: Expandable for longer content
- **Dropdowns**: Searchable when many options

### Direct Edit Workflows

- **Inline Editing**: Click-to-edit table cells
- **Batch Operations**: Multi-row updates
- **Keyboard Navigation**: Tab order and shortcuts
- **Auto-Save**: Automatic draft saving
- **Undo/Redo**: Change history tracking

### Validation & Feedback

- **Real-Time Validation**: Immediate error feedback
- **Field-Level Messages**: Specific error guidance
- **Form-Level Summary**: Overall validation status
- **Success Confirmation**: Clear completion feedback
- **Warning States**: Attention-needed indicators

## ⚠️ Error Handling & States

### System States

#### Loading States

- **Skeleton Loaders**: Content-shaped placeholders
- **Progressive Loading**: Load critical content first
- **Spinner Indicators**: For quick operations
- **Progress Bars**: For lengthy operations
- **Timeout Handling**: Graceful failure recovery

#### Empty States

- **Encouraging Messages**: "Add your first item!"
- **Action Prompts**: Clear next steps
- **Visual Elements**: Helpful illustrations
- **Quick Actions**: Direct creation buttons
- **Import Options**: Alternative data entry paths

#### Error States

- **Inline Validation**: Field-level error messages
- **Toast Notifications**: System-level alerts
- **Error Pages**: Graceful failure handling
- **Recovery Actions**: Clear resolution steps
- **Support Contact**: Help when needed

### Error Handling Standards

#### User-Friendly Messages

- **Plain Language**: Avoid technical jargon
- **Actionable Guidance**: Tell users what to do
- **Context Aware**: Relevant to current task
- **Severity Levels**: Info, warning, error
- **Dismissible**: User control over messages

#### Business Rule Validation

- **Negative Inventory**: Allow with warnings
- **Cost Allocation**: Prevent invalid distributions
- **Duplicate Prevention**: SKU and display ID uniqueness
- **Date Validation**: Business-appropriate date ranges
- **Required Fields**: Clear field requirements

#### Data Patterns

- **URL Parameters**: Maintain filter state
- **Local Storage**: Remember user preferences
- **Optimistic Updates**: Immediate UI feedback
- **Rollback Capability**: Undo failed operations
- **Conflict Resolution**: Handle concurrent edits

### Visual Feedback

#### Interactive States

- **Hover Effects**: Clear interaction feedback
- **Focus Indicators**: Accessibility compliance
- **Active States**: Current selection clarity
- **Disabled States**: Unavailable action indication
- **Loading States**: Operation in progress

#### Status Indicators

- **Tracking Mode Badges**: 🟢 Fully Tracked, 🟡 Cost Added
- **Alert Priorities**: Color-coded importance
- **Draft Status**: Clear workflow stage
- **Archive States**: Inactive item indication
- **Sync Status**: Data synchronization state

---

This product specification provides comprehensive coverage of business requirements, user interface design, and workflow specifications. For technical implementation details, see [developer-guide.md](./developer-guide.md) and [technical-reference.md](./technical-reference.md). For development progress, see [tasks.md](./tasks.md).
