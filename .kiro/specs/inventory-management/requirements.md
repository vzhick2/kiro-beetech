# Requirements Document

## Introduction

This document outlines the requirements for a small business inventory management application designed to handle the complete inventory lifecycle from procurement to sales. The system prioritizes flexibility and real-world workflows through mutable transaction logs, proactive cycle count alerts, and mobile-first design for workshop operations with desktop optimization for administrative tasks.

The application supports small businesses with irregular workflows by allowing editable records, back-dating transactions, and providing intelligent alerts rather than rigid constraints. Key features include automated bank CSV import for purchases, recipe-based production tracking, and comprehensive inventory monitoring with negative inventory support.

## Requirements

### Requirement 1: Core Data Management

**User Story:** As a small business owner, I want to manage my suppliers and inventory items with flexible data entry, so that I can maintain accurate records despite irregular business workflows.

#### Acceptance Criteria

1. WHEN I create a new supplier THEN the system SHALL store supplier information including name, store URL, phone, and archive status
2. WHEN I create a new inventory item THEN the system SHALL store item details including name, SKU, type (ingredient/packaging/product), inventory unit, current quantity, weighted average cost, reorder point, primary supplier (primarySupplierId), and lead time (leadTimeDays)
3. WHEN I archive a supplier or item THEN the system SHALL use soft deletion to preserve historical data relationships
4. WHEN I search for items THEN the system SHALL allow search by SKU or name with the SKU serving as the primary user-facing identifier
5. IF I attempt to create duplicate SKUs THEN the system SHALL prevent creation and display an error message

### Requirement 2: Purchase Management and Cost Tracking

**User Story:** As a business owner, I want to log purchases and automatically calculate weighted average costs, so that I can maintain accurate inventory valuation and cost of goods sold.

#### Acceptance Criteria

1. WHEN I create a purchase THEN the system SHALL auto-generate a display ID in format 'PO-YYYYMMDD-XXX' and store purchase details including supplier, date, totals, and line items
2. WHEN I save a purchase THEN the system SHALL update item quantities and recalculate weighted average cost for affected items
3. WHEN I allocate shipping and taxes THEN the system SHALL distribute costs proportionally only to inventory items (excluding non-inventory types)
4. WHEN I import bank CSV data THEN the system SHALL match transactions to suppliers and create draft purchases for review
5. IF I import duplicate transactions THEN the system SHALL detect and prevent duplicate creation based on supplier, date, and total amount
6. WHEN I edit an existing purchase THEN the system SHALL update the mutable transaction log with timestamp and user information

### Requirement 3: Recipe and Production Management

**User Story:** As a manufacturer, I want to define recipes and log production batches, so that I can track ingredient consumption and product creation with yield analysis.

#### Acceptance Criteria

1. WHEN I create a recipe THEN the system SHALL store recipe details including name, version, output product, ingredients with quantities, expected yield, and labor minutes
2. WHEN I log a production batch THEN the system SHALL auto-generate a display ID in format 'BATCH-YYYYMMDD-XXX' and consume ingredient quantities while creating finished products
3. WHEN I create a batch THEN the system SHALL calculate yield percentage, material cost, and cost variance compared to recipe projections
4. IF insufficient ingredients are available THEN the system SHALL display warnings but allow negative inventory with alert notifications and proceed with the transaction
5. WHEN I edit a recipe THEN the system SHALL increment the version number and track changes in the transaction log
6. WHEN I query maximum possible batches THEN the system SHALL calculate based on current ingredient availability
7. WHEN I want to make a different batch size THEN the system SHALL allow me to scale recipe quantities proportionally and calculate scaled ingredient requirements
8. WHEN I scale a recipe THEN the system SHALL maintain ingredient ratios and update expected yield, labor time, and material costs proportionally
9. WHEN I create frequently used batch configurations THEN the system SHALL allow me to save them as templates for quick reuse
10. WHEN I use a batch template THEN the system SHALL pre-populate the batch form with saved configuration while allowing modifications

### Requirement 4: Sales and Inventory Deduction

**User Story:** As a business owner, I want to record sales and automatically deduct inventory, so that I can maintain accurate stock levels and track revenue.

#### Acceptance Criteria

1. WHEN I import sales data via CSV THEN the system SHALL process sales periods with date ranges and automatically deduct inventory quantities
2. WHEN I create a sales period THEN the system SHALL store item, channel, date range, quantity sold, and optional revenue information
3. IF I attempt to sell more than available inventory THEN the system SHALL allow the transaction but generate negative inventory alerts
4. WHEN I process sales THEN the system SHALL create transaction log entries with type 'sale' and update current quantities
5. WHEN I specify sales channels THEN the system SHALL support 'qbo' and 'bigcommerce' channel types for future integration

### Requirement 5: Inventory Monitoring and Cycle Count Alerts

**User Story:** As a business owner, I want proactive inventory alerts and cycle count recommendations, so that I can maintain accurate stock levels without constant manual monitoring.

#### Acceptance Criteria

1. WHEN inventory goes negative THEN the system SHALL generate immediate alerts showing shortage amounts and affected items
2. WHEN items fall below reorder points THEN the system SHALL generate low stock alerts using the cycle count algorithm
3. WHEN I access the dashboard THEN the system SHALL display top 5 items needing attention sorted by priority score calculated as: ((CURRENT_DATE - lastCountedDate) / 30) + (1 - currentQuantity / GREATEST(reorderPoint, 1)) where higher scores indicate higher priority
4. WHEN I perform a cycle count THEN the system SHALL update item quantities, record the count date, and log the adjustment in transaction history
5. IF I haven't counted items recently THEN the system SHALL prioritize them in cycle count alerts based on time since last count

### Requirement 6: Inventory Forecasting and Smart Reorder Points

**User Story:** As a business owner, I want the system to predict my inventory needs and automatically suggest reorder points, so that I can maintain optimal stock levels without constant manual analysis.

#### Acceptance Criteria

1. WHEN I have sufficient sales history THEN the system SHALL predict future inventory needs based on sales patterns and seasonality using simple moving averages (minimum 3 months of sales data required)
2. WHEN I create new items THEN the system SHALL default to automatic reorder point calculation based on usage patterns and lead times (using item.leadTimeDays or default to 7)
3. WHEN I want to override automatic reorder points THEN the system SHALL allow me to set manual reorder points that take precedence over automatic calculations
4. WHEN I have manual reorder points set THEN the system SHALL provide an option to switch back to automatic calculation
5. WHEN automatic reorder points are enabled THEN the system SHALL recalculate them monthly based on recent usage trends
6. WHEN I view item details THEN the system SHALL clearly indicate whether reorder points are automatic or manual
7. WHEN forecasting shows seasonal patterns THEN the system SHALL adjust reorder points higher during peak demand periods

### Requirement 7: Transaction History and Audit Trail

**User Story:** As a business owner, I want complete transaction history with the ability to make corrections, so that I can maintain accurate records and fix mistakes easily.

#### Acceptance Criteria

1. WHEN any inventory change occurs THEN the system SHALL create a transaction log entry with type, quantity change, source reference, effective date, and user information
2. WHEN I edit any transaction THEN the system SHALL update the mutable log with timestamp and maintain audit trail
3. WHEN I view transaction history THEN the system SHALL display user-friendly source references (display IDs) rather than internal database IDs
4. WHEN I make inventory adjustments THEN the system SHALL allow back-dating with effective date different from creation date
5. WHEN I query recent activity THEN the system SHALL provide chronological feed of all inventory changes with context

### Requirement 8: Mobile-First User Interface

**User Story:** As a business owner working in my workshop, I want mobile-optimized interfaces for inventory tasks, so that I can manage inventory while moving around my facility.

#### Acceptance Criteria

1. WHEN I access the app on mobile THEN the system SHALL provide touch-friendly interfaces with minimum 44x44px touch targets
2. WHEN I need quick inventory updates THEN the system SHALL provide direct-edit capabilities with plus/minus buttons for quantity adjustments
3. WHEN I view lists on mobile THEN the system SHALL show essential information first with expandable details
4. WHEN I navigate on mobile THEN the system SHALL use hamburger menu with persistent sidebar on desktop
5. WHEN I perform common actions THEN the system SHALL provide global "+" button and command palette (Cmd+K) for quick access

### Requirement 9: Data Import and Export Capabilities

**User Story:** As a business owner, I want to import data from external sources and export my data for analysis, so that I can integrate with existing workflows and perform business analysis.

#### Acceptance Criteria

1. WHEN I import bank CSV files THEN the system SHALL automatically match transactions to suppliers and create purchase drafts
2. WHEN I export data THEN the system SHALL provide CSV export for items, purchases, and recent changes with one-click access
3. WHEN I import sales data THEN the system SHALL accept CSV format with date ranges and channel specification
4. WHEN I download templates THEN the system SHALL provide properly formatted CSV templates to reduce import errors
5. IF import data has errors THEN the system SHALL provide clear validation messages and allow correction before processing

### Requirement 10: Cost Calculation and Financial Tracking

**User Story:** As a business owner, I want accurate cost calculations and basic financial insights, so that I can understand my profitability and make informed business decisions.

#### Acceptance Criteria

1. WHEN I purchase items THEN the system SHALL calculate weighted average cost using all non-draft purchase history, defaulting to 0 with alert notification if no purchase history exists
2. WHEN I view dashboard THEN the system SHALL display basic margin calculator showing estimated margins from revenue minus COGS
3. WHEN I create batches THEN the system SHALL calculate material costs, labor costs, and cost variance against recipe projections
4. WHEN costs are allocated THEN the system SHALL exclude non-inventory items from shipping and tax allocation to maintain COGS accuracy
5. WHEN I query item costs THEN the system SHALL provide on-demand WAC calculation with caching for performance

### Requirement 11: Quick Reorder and Automated Restocking

**User Story:** As a business owner, I want automated assistance with restocking low inventory items, so that I can quickly replenish stock without manual data entry.

#### Acceptance Criteria

1. WHEN I view low-stock items THEN the system SHALL display "Quick Reorder" buttons for items below reorder point
2. WHEN I click Quick Reorder THEN the system SHALL auto-generate a draft purchase using the item's primary supplier and reorder point quantity
3. WHEN a draft purchase is created THEN the system SHALL allow me to review and modify before finalizing
4. WHEN I have multiple suppliers for an item THEN the system SHALL use primarySupplierId if set; else most recent from purchase history
5. WHEN I complete a quick reorder THEN the system SHALL follow the standard purchase workflow including WAC recalculation

### Requirement 12: System Configuration and Settings

**User Story:** As a business owner, I want to configure system settings and notification preferences, so that I can customize the application to match my business needs.

#### Acceptance Criteria

1. WHEN I access settings THEN the system SHALL provide configuration options for labor rate, cycle count alert thresholds, and notification preferences
2. WHEN I enable email alerts THEN the system SHALL send notifications when cycle count alerts exceed the configured threshold (default: 5+ items flagged)
3. WHEN I set labor rates THEN the system SHALL use these values for batch cost calculations and variance analysis
4. WHEN I configure alert thresholds THEN the system SHALL apply these settings to the cycle count alert algorithm
5. WHEN I update settings THEN the system SHALL validate configuration values and provide immediate feedback
6. WHEN I configure notification rules THEN the system SHALL allow me to customize alert types, delivery methods (email, in-app), and trigger conditions
7. WHEN I set up custom notifications THEN the system SHALL support rules for low stock, negative inventory, batch completion, and purchase approvals

### Requirement 13: System Security and Data Integrity

**User Story:** As a business owner, I want secure access to my data with proper validation, so that I can trust the system with my business-critical information.

#### Acceptance Criteria

1. WHEN I access the system THEN the system SHALL use Supabase Auth with Row Level Security for data protection
2. WHEN I perform database operations THEN the system SHALL use PostgreSQL RPCs for critical multi-step operations to ensure atomicity
3. WHEN I enter data THEN the system SHALL validate inputs both client-side for immediate feedback and server-side for final authority
4. WHEN I reference archived records THEN the system SHALL prevent new relationships while preserving historical data
5. IF validation fails THEN the system SHALL provide standardized error messages with clear resolution guidance