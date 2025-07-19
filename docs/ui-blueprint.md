---
title: "UI Blueprint"
description: "UI design and workflow specifications for mobile-first internal business app"
purpose: "Reference for user interface design, workflows, and component specifications"
last_updated: "July 17, 2025"
doc_type: "ui-design"
related: ["README.md", "data-model.md", "development-guide.md"]
---

# UI Blueprint

UI design and workflows for mobile-first internal business app with direct edits and cycle count alerts.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## Navigation Architecture

Responsive sidebar (persistent on desktop, hamburger on mobile) with primary views. Global "+" button for quick actions. Command Palette (Cmd+K) for item/recipe search.

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


## Form & Input Design

Top-aligned labels with bordered inputs. Direct-edit mode for existing records using mutable logs. Inline validation flags non-inventory items in purchases. Negative inventory warnings shown but transactions allowed to support real-world workflows.

## P1 Views (Mobile-First: Workshop Focus)

**Rationale**: These views prioritize mobile because small business owners typically use phones/tablets while working in warehouses, workshops, or production areas - quick inventory checks while walking the floor, logging batches during production runs, and performing cycle counts with items in hand require touch-friendly mobile interfaces.

### Dashboard

- **Goal**: 30-second business health check.  
- **Features**: Action Center lists top 5 low-stock items (algorithm: sort by ((CURRENT_DATE - lastCountedDate) / 30) + (1 - currentQuantity / GREATEST(reorderPoint, 1)) for cycle count alerts). "View All" links to Items (pre-filtered). Export All Data button (CSV for items/purchases) in header with download icon, plus one-click "Export Recent Changes" (last 30 days via mutable logs), optimized for mobile touch targets (44x44px). **Basic Margin Calculator**: On-demand query showing estimated margins (revenue - COGS from sales_periods and WAC), displayed as a simple stat for quick profitability insights.
- **Mitigations**: Cycle count alerts reduce cycle count over-reliance; links to direct-edit modals. Export uses Supabase queries for real-time data accuracy. Margin calculation uses existing data without new schema requirements.

### Items

- **Goal**: Manage item status with quick edits.  
- **Features**: List with search/filters (Name/SKU/Type); direct-edit currentQuantity (plus/minus buttons); "cycle count alert" mode sorts by cycle count alert algorithm. **Quick Reorder Button**: For low-stock items, display "Quick Reorder" button that auto-generates a draft purchase using primarySupplierId if set, else most recent supplier from purchase history, pulling quantity from reorderPoint. **Auto/Manual Indicator**: Show 'Auto' or 'Manual' badge next to reorderPoint in item details to indicate calculation method. Simple client-side action triggering purchase draft RPC.
- **Mitigations**: Negative inventory warnings with alert system; history subtitle ("Last change: [Date] by [User]") via mutable logs. All direct edits require edit permissions and are tracked for auditability. Quick Reorder reduces manual entry for restocking workflows.

### Recipes

- **Goal**: Define/edit products easily.  
- **Features**: CRUD with ingredient lists; on-demand "Max Batches Possible" in details; direct edits with version increment.  
- **Mitigations**: Negative inventory warnings in linked batches with alert system for resolution.

### Batches

- **Goal**: Log production with adjustments.  
- **Features**: Form for recipe-based logging with auto-generated display IDs (format: 'BATCH-YYYYMMDD-XXX' shown to users); recipe scaling with proportional ingredient calculations; batch template creation and reuse for frequently used configurations; optional labor cost and expiry date fields; yield/cost variance; expandable notes; direct-edit for post-log fixes.  
- **UI Focus**: All batch lists, search, and references use displayId for user-friendly experience; database relationships use internal batchId for performance.
- **Mitigations**: RPC validation for stock sufficiency with negative inventory warnings; auto-displayId generation prevents manual entry errors; optional fields support future analysis without MVP complexity.

## P2 Views (Desktop-First: Admin Focus)

**Rationale**: These views require complex data entry and analysis, better suited for desktop/laptop screens where users can handle multi-line forms, CSV imports, and detailed reporting. While fully mobile-compatible, the desktop experience is optimized for efficiency.

### Purchases (Purchase Inbox)

- **Goal**: Streamlined purchase logging with automated bank import workflow.  
- **Features**: 
  - **Master-Detail Layout**: Draft list (left pane) + purchase form (right pane) for desktop efficiency
  - **Smart Import**: "Import Bank CSV" button triggers automated supplier matching and draft creation
  - **Review Workflow**: "Review Ignored Transactions" shows unmatched transactions with "Create Supplier & Draft" buttons
  - **Traditional Entry**: Manual purchase form for direct entry when needed with auto-generated purchase references (displayId: 'PO-YYYYMMDD-XXX')
  - **Import Templates**: Downloadable CSV templates for sales/purchases via link in view header, reducing user errors in imports
  - **Validation**: Multi-line form with supplier select (creatable); allocate shipping/taxes proportionally (form flag excludes non-inventory)
- **Mobile Responsive**: Collapses to single-column list-and-navigate flow on mobile devices
- **Mitigations**: Import duplicate detection; post-save validation (e.g., cost variance prompt); negative inventory warnings for quantities. CSV templates reduce import errors.

### Sales

- **Goal**: Bulk logging with corrections.  
- **Features**: Simplified CSV import with periodStart/periodEnd date ranges by channel; review summaries. **Import Templates**: Downloadable CSV templates via link in view header to ensure correct format for sales data imports.
- **Mitigations**: Import validation for positives; link to cycle counts for drift. CSV templates reduce import format errors.

### Activity

- **Goal**: Overview recent changes.  
- **Features**: Reverse-chronological feed of events (e.g., "Edited Batch #123 on [Date]"); date filters.  
- **Mitigations**: Draws from mutable logs for editable history. All edits, including direct edits and archiving, are tracked with user, timestamp, and effectiveDate.

### Settings

- **Goal**: App configs.  
- **Features**: Form for labor rate, cycle count alert thresholds, and notification preferences; accessed via profile. **Customizable Notification Rules**: Interface for setting up custom alert types, delivery methods (email, in-app), and trigger conditions for low stock, negative inventory, batch completion, and purchase approvals.
- **Email Alerts**: Optional Supabase Edge Function to email owner when cycle count alerts exceed threshold. Uses existing alert algorithm for low complexity.

## Key Workflows (Cross-View Processes)

All terminology is standardized: use "cycle count alert" for proactive inventory checks, "inventory adjustment" for direct edits, and "archived" for soft-deleted records.

1. **Procure to Stock**: 
   - **Traditional**: Enter purchase; allocate (exclude non-inventory); save with WAC
   - **Import Workflow**: Import bank CSV → Review automated drafts → Complete line items → Save with WAC
   - Mitigation: Validation with negative inventory warnings; direct edit for fixes; duplicate detection
2. **Production Run**: Select recipe; log batch; analyze yield. Mitigation: Stock checks with negative inventory warnings; editable post-save.  
3. **Bulk Sales Entry**: Simplified CSV import with date ranges; decrement stock. Mitigation: Positive validation; cycle count alerts for corrections.  
4. **Cycle Count**: Triggered via Dashboard cycle count alerts; adjust quantity. Mitigation: Algorithm reduces over-reliance; negative inventory alerts for attention.  
5. **Monthly Reconciliation**: Review Dashboard; edit missed data; cycle count alerts for corrections. Mitigation: Mutable logs track changes.  
6. **Recipe Development**: Create/edit; test batch. Mitigation: Version on edit; tied to batch validation.

For development standards, see development-guide.md; for schema, see data-model.md.

This blueprint ensures mobile-optimized, forgiving, and risk-mitigated UX for small business needs.
