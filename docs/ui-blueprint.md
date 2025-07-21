---
title: 'UI Blueprint'
description: 'UI design and workflow specifications for mobile-first internal business app'
purpose: 'Reference for user interface design, workflows, and component specifications'
last_updated: 'January 20, 2025'
doc_type: 'ui-design'
related:
  [
    'README.md',
    'data-model.md',
    'development-guide.md',
    'requirements.md',
    'technical-design.md',
  ]
---

# UI Blueprint

UI design and workflows for mobile-first internal business app focusing on simplified COGS tracking and statement-based bookkeeping.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## Design Philosophy

**Simplified Business Focus**: Following the 80/20 rule, the UI prioritizes meaningful cost tracking over perfectionist inventory management. Support statement-based bookkeeping with monthly inventory sessions aligned with actual business practices.

**Mixed Tracking Support**: Visual indicators for different tracking modes (Full, Cost-Only, Estimate) allow businesses to balance precision with practicality.

## Navigation Architecture

Responsive sidebar (persistent on desktop, hamburger on mobile) with primary views. Global "+" button for quick actions. Simplified mobile-first navigation with search bar visible on all screen sizes for quick item/recipe searches.

## Visual Identity & Design Tokens

- **Color Palette**: Blue accents for actions; zinc greys for neutrals.
- **Typography**: Inter font. Dates: "Jul 15, 2025" format. Currency: "$1,234.56" format.
- **Spacing**: 8-point grid for consistency.
- **Interactive**: Focus rings for accessibility; 44x44px minimum touch targets on mobile.

## System States

- **Loading/Empty States**: Skeleton loaders; encouraging empty text (e.g., "Add your first item!").
- **Error Handling**: Inline validation with plain language using standardized error types from data-model.md; toasts for API errors with clear actions.
- **Data Patterns**: URL params for filters; "Show key info first" - lists show essentials, details in panels.
- **User References**: Always show user-friendly identifiers (SKU for items, displayId for batches/purchases) rather than internal database IDs.
- **Tracking Mode Indicators**: Color-coded badges showing item tracking modes:
  - 🟢 **Full** (exact quantities tracked)
  - 🟡 **Cost-Only** (time-based alerts)
  - 🟠 **Estimate** (fixed cost, no inventory)

## Form & Input Design

Top-aligned labels with bordered inputs. Direct-edit mode for existing records using mutable logs. Inline validation flags non-inventory items in purchases. Negative inventory warnings shown but transactions allowed to support real-world workflows.

**Smart Cost Allocation Preview**: Purchase forms show allocation preview before saving, displaying proportional distribution of shipping/taxes/fees to inventory items with variance warnings for unusual allocations.

## P1 Views (Mobile-First: Workshop Focus)

**Rationale**: These views prioritize mobile because small business owners typically use phones/tablets while working in warehouses, workshops, or production areas - quick inventory checks while walking the floor, logging batches during production runs, and performing cycle counts with items in hand require touch-friendly mobile interfaces.

### Dashboard

- **Goal**: 30-second business health check with focus on actionable COGS insights.
- **Features**:
  - **Mixed Alert Center**: Combined alerts showing low-stock items (Full tracking), time-based checks (Cost-Only tracking), and variance warnings (Estimate tracking)
  - **COGS Summary**: Simple percentage showing COGS/Revenue ratio with traffic light indicators (Green <30%, Yellow 30-50%, Red >50%)
  - **Draft Purchases Alert**: Show count of pending draft purchases with smart allocation preview
  - **Monthly Session Reminder**: Visual indicator when approaching month-end for inventory session
  - **Quick Actions**: Export options (All Data, Recent Changes) optimized for mobile
- **Mitigations**: Mixed tracking alerts reduce over-reliance on any single tracking method; margin insights focus on meaningful business metrics.

### Items

- **Goal**: Manage item status with flexible tracking modes.
- **Features**:
  - **Tracking Mode Setup**: Easy toggle between Full/Cost-Only/Estimate tracking with setup wizard
  - **Mode-Aware Interface**: UI adapts based on tracking mode:
    - Full: Shows current quantity with plus/minus buttons
    - Cost-Only: Shows days since last count with "Count Now" button
    - Estimate: Shows fixed cost with "Review Cost" button
  - **Quick Reorder**: Smart button using primarySupplierId and reorderPoint
  - **COGS Focus**: Highlight high-value items for better cost tracking attention
- **Mitigations**: Mode indicators prevent confusion; negative inventory warnings with alert system; history tracking via mutable logs.

### Recipes

- **Goal**: Define/edit products with cost awareness.
- **Features**:
  - **Cost Impact Preview**: Show estimated cost per batch based on ingredient WAC
  - **Yield Tracking**: Simple interface for tracking actual vs expected yields
  - **Ingredient Substitution**: UI for temporary ingredient swaps with cost impact
- **Mitigations**: Cost calculations use current WAC; ingredient availability warnings.

### Batches

- **Goal**: Log production with cost tracking.
- **Features**:
  - **Smart Batch Logging**: Auto-generated display IDs (BATCH-YYYYMMDD-XXX)
  - **Cost Variance Alerts**: Visual indicators when actual costs deviate from recipe estimates
  - **Flexible Ingredient Entry**: Support for substitutions and partial usage
  - **Yield Analysis**: Simple comparison of planned vs actual output
- **Mitigations**: Stock sufficiency warnings; cost variance prompts for review.

## P2 Views (Desktop-First: Admin Focus)

**Rationale**: These views require complex data entry and analysis, better suited for desktop/laptop screens where users can handle multi-line forms, CSV imports, and detailed reporting.

### Purchases (Enhanced with Smart Allocation)

- **Goal**: Streamlined purchase logging with intelligent cost distribution.
- **Features**:
  - **Smart Allocation Engine**:
    - Real-time preview of shipping/tax/fee distribution
    - Proportional allocation based on item base costs
    - Visual variance warnings for unusual distributions
    - Override capability for manual adjustments
  - **Statement Integration**:
    - "Import Statement" workflow for bulk entry
    - Automated supplier matching with confidence scores
    - Mixed invoice handling (COGS + non-COGS items)
  - **Enhanced Validation**:
    - Pre-save allocation preview with approval step
    - Cost variance prompts for review
    - WAC impact preview before finalization
  - **Purchase Review**: Draft management with allocation verification
- **Mobile Responsive**: Collapses to simplified workflow on mobile
- **Mitigations**: Smart allocation prevents manual calculation errors; statement workflow matches real bookkeeping practices.

### Sales (Simplified)

- **Goal**: Bulk logging aligned with monthly inventory sessions.
- **Features**:
  - **Period-Based Entry**: Monthly/quarterly sales periods matching business cycles
  - **Channel Tracking**: Revenue by sales channel for basic analytics
  - **Integration Points**: Simple CSV import with validation
- **Mitigations**: Period-based approach aligns with statement workflow; validation ensures data quality.

### Reports (COGS-Focused)

- **Goal**: Actionable insights for cost management.
- **Features**:
  - **COGS Analysis**: Monthly COGS trends with variance analysis
  - **Inventory Valuation**: Current inventory value using WAC
  - **Purchase Variance**: Analysis of actual vs budgeted purchase costs
  - **Tracking Mode Performance**: Insights on different tracking approaches
- **Export Options**: All reports exportable for external analysis

### Activity & Audit

- **Goal**: Track changes across all tracking modes.
- **Features**:
  - **Unified Activity Feed**: All edits, adjustments, and mode changes
  - **Cost Impact Tracking**: Show financial impact of inventory adjustments
  - **User Action History**: Complete audit trail with timestamps
- **Mitigations**: Comprehensive logging supports compliance and troubleshooting.

### Settings (Enhanced)

- **Goal**: Configure tracking modes and business rules.
- **Features**:
  - **Tracking Mode Defaults**: Set default tracking mode for new items
  - **Alert Thresholds**: Configure time-based and quantity-based alerts
  - **Cost Allocation Rules**: Customize proportional allocation logic
  - **Statement Integration**: Configure automated import matching rules
- **Business Rules**: Labor rates, overhead allocation, variance tolerances

## Key Workflows (Simplified & Enhanced)

1. **Purchase-to-Stock (Enhanced)**:
   - **Statement Workflow**: Import → Auto-match suppliers → Review drafts → Apply smart allocation → Finalize with WAC
   - **Manual Entry**: Create purchase → Add line items → Preview allocation → Approve and save
   - **Allocation Intelligence**: Real-time cost distribution with variance warnings

2. **Monthly Inventory Session**:
   - **Full Tracking**: Physical counts with quantity adjustments
   - **Cost-Only**: Time-based reviews and spot checks
   - **Estimate**: Cost validation and fixed-cost updates
   - **Mixed Approach**: Combine tracking modes based on item importance

3. **Production Run (Cost-Aware)**:
   - Recipe selection with cost preview → Batch logging → Yield tracking → Cost variance analysis
   - Automatic ingredient substitution handling with cost impact

4. **COGS Analysis**:
   - **Monthly Review**: COGS percentage trends and variance analysis
   - **Item Performance**: High-impact items for focused tracking
   - **Purchase Effectiveness**: Supplier performance and cost optimization

5. **Tracking Mode Management**:
   - **Setup Workflow**: Item categorization → Mode assignment → Alert configuration
   - **Mode Migration**: Easy switching between tracking modes with data preservation
   - **Performance Review**: Regular assessment of tracking mode effectiveness

## Mobile-Specific Enhancements

- **Touch-Optimized Allocation**: Large buttons for quick approval/rejection of cost allocations
- **Voice Notes**: Quick voice memos for inventory sessions and batch notes
- **Barcode Integration**: Camera-based SKU lookup for mobile inventory counts
- **Offline Support**: Core functionality works without internet for warehouse use

## Accessibility & Usability

- **High Contrast Mode**: Enhanced visibility for warehouse lighting conditions
- **Large Touch Targets**: Minimum 44px for all interactive elements
- **Clear Status Indicators**: Color-blind friendly tracking mode indicators
- **Simplified Language**: Plain English for all business terms and processes

This blueprint ensures a practical, cost-focused interface that adapts to different business tracking needs while maintaining simplicity and mobile usability for small business operations.
