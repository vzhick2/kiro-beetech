---
title: "Data Model and Architecture"
description: "Database schema, architecture principles, and security design"
purpose: "Reference for data foundation, integrity patterns, and system## 5. Business Logic RPCs & Common Mitigations

All RPCs include common mitigations:
- **Negative Inventory Alerts**: Instead of preventing negatives, system detects and alerts on negative inventory for user resolution
- **Cycle Count Alerts**: Queries use algorithm: SELECT * FROM items ORDER BY (currentQuantity / GREATEST(COALESCE(reorderPoint, 1), 1)) + (CURRENT_DATE - lastCountedDate) / 30 DESC LIMIT 5; // MVP focuses on item-level alerts; expiry-based alerts moved to Phase 2 roadmap.
- Exclude non-inventory from allocation: filter by type IN ('ingredient', 'packaging', 'product') to exclude any future non-inventory types.tecture"
last_updated: "July 17, 2025"
doc_type: "technical-reference"
related: ["README.md", "ui-blueprint.md", "dev-standards.md"]
---

# Data Model and Architecture

Database schema and architectural foundation for inventory management with mutable logs and validation mitigations.

## Part 1: Core Design Principles

### Data Integrity
- **Mutable Transaction Logs**: Editable transactions with timestamps for flexible corrections.
- **Negative Inventory Alerts**: Support real-world workflows by allowing negative inventory with robust alert system for user resolution
- **Cycle Count Alerts**: Algorithm-based inventory checks to reduce manual monitoring.
- **Cost Allocation**: Exclude non-inventory items from shipping/tax allocation to maintain COGS accuracy.

### Technical Foundation
- **Authentication**: Supabase Auth with Row Level Security (RLS).
- **Performance**: Next.js SSR with optimized PostgreSQL queries.
- **Atomic Operations**: PostgreSQL RPCs for critical multi-step operations.
- **On-Demand Costing with Caching**: Critical calculations like Weighted Average Cost (WAC) are performed on-demand by pure functions and cached in the `items` table. This decouples complex calculations from critical operations like saving purchases, reducing risk and simplifying logic.

### Design Patterns
- **Display ID Pattern**: Separate user-facing identifiers (displayId) from database primary keys (UUID) for optimal UX and performance. Applied to batches, purchases, sales periods, and recipes.
- **Optional Field Strategy**: Capture data fields for future analysis (laborCost, expiryDate) without implementing complex behaviors in MVP.
- **Deferred Logic Approach**: Store data now, add complex system behaviors in Phase 2 to protect MVP timeline.

## Part 2: Database Schema

## 1. Core Tables

### suppliers

- supplierId (UUID, PK)  
- name (text)  
- storeUrl (text, nullable)  
- phone (text, nullable)  
- isArchived (boolean, default false)  // For deactivating suppliers only

### items

- itemId (UUID, PK)  // Database primary key for performance and relationships
- name (text)  
- SKU (text, unique)  // User-facing identifier - primary reference for users
- type (enum: 'ingredient', 'packaging', 'product')  // For allocation filtering  
- isArchived (boolean, default false)  // For deactivating items only  
- inventoryUnit (enum: 'g', 'kg', 'oz', 'lb', 'ml', 'L', 'fl oz', 'pcs', 'box', 'case')  // Standardized for consistency  
- currentQuantity (numeric, default 0\)  
- weightedAverageCost (numeric, default 0\)  
- reorderPoint (numeric, nullable)  // For cycle count alerts  
- lastCountedDate (date, nullable)  // For cycle count alerts
- primarySupplierId (UUID, FK to suppliers, nullable)  // For quick reorders
- leadTimeDays (integer, nullable, default 7)  // For auto reorder calculations

**Note**: SKU serves as the display identifier for items - users search, reference, and manage items by SKU rather than internal itemId.

## 2. Transactional Tables


### purchases

- purchaseId (UUID, PK)  // Database primary key for performance and relationships
- displayId (text, unique)  // User-visible reference: 'PO-YYYYMMDD-XXX' format
- supplierId (UUID, FK to suppliers)  
- purchaseDate (date)  // Cleared transaction date  
- effectiveDate (date)  // For back-dating; all inventory and cost changes can be back-dated for historical accuracy.  
- grandTotal (numeric)  
- shipping (numeric, default 0)  
- taxes (numeric, default 0)  
- otherCosts (numeric, default 0)  
- notes (text, nullable)  
- isDraft (boolean, default false)  // For partial saves and import drafts

### purchase\_line\_items

- purchaseLineItemId (UUID, PK)  
- purchaseId (UUID, FK to purchases)  
- itemId (UUID, FK to items)  
- quantity (numeric)  
- unitCost (numeric)  
- totalCost (numeric)  
- lotNumber (text, nullable)


### Recipe Management

Recipes use direct edits with version increment for trusted small-team context. Recipe changes update the current version while transaction logs track changes for reference.

### recipes

- recipeId (UUID, PK)  // Database primary key for performance and relationships
- name (text)  
- version (integer, default 1)  // Internal version tracking for database
- displayVersion (text, default 'v1.0')  // User-friendly version like 'v1.2', 'v2.0'
// Removed isArchived for recipes - use direct edits for trusted context  
- yieldsItemId (UUID, FK to items)  
- expectedYield (numeric)  
- laborMinutes (integer, nullable)  
- projectedMaterialCost (numeric, nullable)

### recipe\_ingredients (Join Table)

- recipeIngredientId (UUID, PK)  
- recipeId (UUID, FK to recipes)  
- itemId (UUID, FK to items)  
- quantity (numeric)


### batches

- batchId (UUID, PK)  // Database primary key for performance and relationships
- displayId (text, unique)  // User-visible ID: 'BATCH-YYYYMMDD-XXX' format
- recipeId (UUID, FK to recipes)  
- dateCreated (date)  
- effectiveDate (date)  // For back-dating; all production and costing can be back-dated for auditability.  
- qtyMade (numeric)  
- yieldPercentage (numeric, nullable)  
- materialCost (numeric)  
- laborCost (numeric, nullable, default 0)  // Optional labor cost capture for Phase 2 analysis
- actualCost (numeric)  
- costVariance (numeric, nullable)  
- expiryDate (date, nullable)  // Optional expiry tracking for future analysis
- notes (text, nullable)

### sales\_periods

- salesPeriodId (UUID, PK)  // Database primary key for performance and relationships
- displayId (text, unique)  // User-visible reference: 'SALES-YYYYMM-[channel]' format
- itemId (UUID, FK to items)  
- channel (enum: 'qbo', 'bigcommerce')  
- periodStart (date)  // Simplified range approach
- periodEnd (date)    // Replaces periodType/year/month/quarter complexity
- quantitySold (numeric)  
- revenue (numeric, nullable)  // Optional but encouraged for margins  
- dataSource (enum: 'manual', 'imported')

### forecasting_data

- forecastingId (UUID, PK)  
- itemId (UUID, FK to items, unique)  
- predictedDemand (numeric)  
- seasonalIndex (numeric, default 1.0)  
- recommendedReorderPoint (numeric)  
- isAutomatic (boolean, default true)  
- calculatedAt (timestamptz, default now())

### batch_templates

- templateId (UUID, PK)  
- name (text)  
- recipeId (UUID, FK to recipes)  
- scaleFactor (numeric, default 1.0)  
- notes (text, nullable)  
- created_at (timestamptz, default now())

## 3\. Ledger & History Tables


### transactions (Mutable Log)

- transactionId (UUID, PK)  
- itemId (UUID, FK to items)  
- quantityChange (numeric)  
- newQuantity (numeric)  
- type (enum: 'purchase', 'batch_usage', 'batch_creation', 'cycle_count', 'inventory_adjustment', 'sale')  // Standardized terms  
- sourceId (UUID, nullable)  // Links to purchaseId, batchId, salesPeriodId, etc.
- sourceDisplayId (text, nullable)  // User-friendly reference to source record (e.g., 'PO-20250717-001', 'BATCH-20250717-002')
- effectiveDate (date)  // For back-dating; all changes are tracked for auditability.  
- created_at (timestamptz, default now())  
- updated_at (timestamptz, nullable)  
- updated_by (UUID, nullable)  // User ID for tracking  
// Removed isArchived for transactions - focus on active records for trusted context  
- notes (text, nullable)  // For change reasons

**Note**: sourceDisplayId provides human-readable context for transaction origins, making audit trails more user-friendly while sourceId maintains database relationships.

(Note: All direct edits, archiving, and inventory adjustments are tracked with user, timestamp, and effectiveDate. COGS is computed on-demand using WAC, excluding non-inventory; merged into logs.)

## 4\. Relationships & Integrity

### Foreign Key Relationships
- **suppliers → purchases**: One supplier can have many purchases (1:N)
- **purchases → purchase_line_items**: One purchase can have many line items (1:N) 
- **items → purchase_line_items**: One item can appear in many purchases (1:N)
- **recipes → batches**: One recipe can produce many batches (1:N)
- **recipes → recipe_ingredients**: One recipe can have many ingredients (1:N)
- **items → recipe_ingredients**: One item can be used in many recipes (1:N)
- **items → sales_periods**: One item can have many sales periods (1:N)
- **items → transactions**: One item can have many transactions (1:N)

### Database Constraints
- **CHECK Constraints**: 
  - `purchase_line_items.quantity > 0` (positive quantities only)
  - `batches.qtyMade > 0` (positive production only)
  - `purchase_line_items.unitCost >= 0` (non-negative costs)
- **UNIQUE Constraints**:
  - `items.SKU` (unique product identifiers)
  - `batches.displayId`, `purchases.displayId`, `sales_periods.displayId` (unique display references)
- **NOT NULL Requirements**: All foreign keys, quantities, and display IDs

**Note**: Items.currentQuantity can go negative to support real-world workflows (e.g., logging production before cycle count updates). Negative inventory is handled through alert system rather than database constraints.

### Data Integrity Rules
- **Soft Deletes**: Use `isArchived` flag for suppliers/items to preserve historical data
- **Referential Integrity**: ON DELETE SET NULL for archived records, CASCADE for dependent data
- **Audit Trail**: All changes tracked in transactions table with user attribution


## 5\. Business Logic RPCs & Common Mitigations

All RPCs include common mitigations:
- **Negative Inventory Alerts**: Instead of preventing negatives, system detects and alerts on negative inventory for user resolution
- **Cycle Count Alerts**: Queries use algorithm: SELECT * FROM items ORDER BY ((CURRENT_DATE - lastCountedDate) / 30) + (1 - currentQuantity / GREATEST(COALESCE(reorderPoint, 1), 1)) DESC LIMIT 5; // MVP focuses on item-level alerts; expiry-based alerts moved to Phase 2 roadmap.
- Exclude non-inventory from allocation: filter by type IN ('ingredient', 'packaging', 'product') to exclude any future non-inventory types.

### Enum Value Documentation

**Item Types**: 
- `'ingredient'`: Raw materials consumed in production (subject to allocation)
- `'packaging'`: Materials used for product packaging (subject to allocation)  
- `'product'`: Finished goods created from recipes (excluded from purchase allocation)

**Transaction Types**:
- `'purchase'`: Inventory increase from supplier purchase
- `'batch_usage'`: Ingredient consumption during production
- `'batch_creation'`: Product creation from batch completion
- `'cycle_count'`: Manual inventory adjustment from counting
- `'inventory_adjustment'`: Direct quantity correction
- `'sale'`: Inventory decrease from customer sales

**Sales Channels**:
- `'qbo'`: QuickBooks Online integration (Phase 2)
- `'bigcommerce'`: BigCommerce integration (Phase 2)

**Inventory Units**: Standardized units for consistent calculations
- **Weight**: 'g', 'kg', 'oz', 'lb' 
- **Volume**: 'ml', 'L', 'fl oz'
- **Count**: 'pcs', 'box', 'case'

### func_log_purchase(purchase_data)

- **Purpose**: Log/edit purchase; update inventory/costs.  
- **Logic (Atomic)**: Auto-generate displayId using format 'PO-[effectiveDate:YYYYMMDD]-[sequence:001]' and assign purchaseId (UUID) for database relationships; insert/update purchases and line_items; increment item quantities. After successful save, triggers on-demand recalculation of item's weightedAverageCost to update cached value. Allocate shipping/taxes proportionally to inventory items only (filter by type IN ('ingredient', 'packaging', 'product') to exclude any future non-inventory types).
- **Validation**: Ensure quantities/costs >=0 for purchases (RAISE if negative); supplier/items exist/not archived.  
- **Mitigations**: Exclude non-inventory from allocation; update mutable log with timestamp/updated\_by; WAC calculation decoupled from critical save operation; auto-displayId generation provides user-friendly purchase references.

### func_import_purchases_csv(csv_data)

- **Purpose**: Process bank CSV imports; create purchase drafts with supplier matching.
- **Logic (Atomic)**: Parse CSV rows; match transactions to known suppliers by name similarity; create draft purchases for matches; return structured data (createdDrafts, ignoredTransactions, potentialDuplicates).
- **Validation**: CSV format validation; duplicate detection via supplierId+purchaseDate+grandTotal; supplier name sanitization.
- **Mitigations**: Robust error handling for malformed CSVs; duplicate prevention; maintains audit trail through mutable logs.

### func_log_batch(batch_data)

- **Purpose**: Log/edit batch; consume ingredients, create products.  
- **Logic (Atomic)**: Auto-generate displayId using format 'BATCH-[effectiveDate:YYYYMMDD]-[sequence:001]' and assign simple batchId (UUID) for database relationships; read recipe; decrement ingredients, increment product; calc yield/variance/costs.  
- **Validation**: Recipe exists/not archived; IF potential <0, emit NEGATIVE_INVENTORY_WARNING but proceed, log, and trigger alert.  
- **Mitigations**: Negative inventory alerts on deductions; mutable edit support with history; auto-displayId generation eliminates manual entry errors; simple PK ensures database performance.

### func_perform_cycle_count(check_data)

- **Purpose**: Adjust item quantity with note.  
- **Logic (Atomic)**: Update items.currentQuantity and lastCountedDate; log in transactions.  
- **Validation**: Item exists/not archived; allows negative quantities with warning system.  
- **Mitigations**: Ties to cycle count alert algorithm for proactive use; mutable for easy re-adjusts.

### calculate_wac(item_id)

- **Purpose**: Calculate Weighted Average Cost for an item on-demand.
- **Logic (Pure Function)**: Query purchase_line_items for the item; calculate SUM(quantity * unitCost) / SUM(quantity) from non-draft purchases. If no history, return 0 with 'NO_HISTORY' warning.
- **Usage**: Called after purchase saves to update cached WAC in items table; can be called manually for recalculation.
- **Implementation**: 
```sql
CREATE OR REPLACE FUNCTION calculate_wac(item_id UUID)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT 
      SUM(quantity * unitCost) / SUM(quantity)
    FROM purchase_line_items pli
    JOIN purchases p ON pli.purchaseId = p.purchaseId
    WHERE pli.itemId = item_id
      AND p.isDraft = false
  );
END;
$$ LANGUAGE plpgsql;
```

### calculate_forecasting(item_id)

- **Purpose**: Calculate and update forecasting data for automatic reorder points.
- **Logic (Atomic)**: Calculate 3-month moving average from sales_periods; detect seasonality via monthly comparison; compute recommended reorder point using lead times and seasonal adjustments. Upsert to forecasting_data table for persistence.
- **Usage**: Called monthly for automatic reorder point updates; triggered when switching from manual to automatic mode.
- **Validation**: Requires minimum 3 months of sales data; defaults to leadTimeDays * 10 if insufficient data.
- **Mitigations**: Simple seasonality detection (monthly sales vs average); 20% buffer for safety stock; updates forecasting_data table for persistence.

### func_create_batch_template(template_data)

- **Purpose**: Save frequently used batch configurations as reusable templates.
- **Logic (Atomic)**: Store template with recipe reference, scale factor, and notes; validate recipe exists and not archived.
- **Usage**: Called when user saves a batch configuration for reuse; enables quick batch creation with pre-filled values.
- **Validation**: Recipe exists/not archived; scale factor > 0; unique template names per recipe.
- **Mitigations**: Template reuse reduces manual entry errors; maintains recipe relationships for consistency.

## 6. Common Query Patterns

### Dashboard Queries
```sql
-- Negative inventory alerts (requires immediate attention)
SELECT itemId, SKU, name, currentQuantity, 
  ABS(currentQuantity) as shortage_amount,
  'NEGATIVE_INVENTORY' as alert_type
FROM items 
WHERE currentQuantity < 0 AND isArchived = false
ORDER BY currentQuantity ASC;

-- Low stock items (cycle count alerts)
SELECT itemId, SKU, name, currentQuantity, reorderPoint,
  CASE 
    WHEN currentQuantity < 0 THEN 'NEGATIVE_INVENTORY'
    WHEN currentQuantity < COALESCE(reorderPoint, 0) THEN 'LOW_STOCK'
    ELSE NULL 
  END as alert_type
FROM items 
WHERE currentQuantity <= COALESCE(reorderPoint, 0) 
ORDER BY (currentQuantity / GREATEST(COALESCE(reorderPoint, 1), 1)) ASC
LIMIT 5;

-- Combined inventory alerts for dashboard
SELECT itemId, SKU, name, currentQuantity, reorderPoint,
  CASE 
    WHEN currentQuantity < 0 THEN 'NEGATIVE_INVENTORY'
    WHEN currentQuantity < COALESCE(reorderPoint, 0) THEN 'LOW_STOCK'
    ELSE NULL 
  END as alert_type,
  CASE 
    WHEN currentQuantity < 0 THEN ABS(currentQuantity)
    ELSE NULL 
  END as shortage_amount
FROM items 
WHERE (currentQuantity < 0 OR currentQuantity <= COALESCE(reorderPoint, 0))
  AND isArchived = false
ORDER BY 
  CASE WHEN currentQuantity < 0 THEN 1 ELSE 2 END,  -- Negatives first
  currentQuantity ASC;

-- Recent activity feed
SELECT t.type, t.quantityChange, t.sourceDisplayId, t.effectiveDate, i.SKU
FROM transactions t
JOIN items i ON t.itemId = i.itemId
ORDER BY t.created_at DESC
LIMIT 20;
```

### Production Queries
```sql
-- Max batches possible for recipe
SELECT MIN(FLOOR(i.currentQuantity / ri.quantity)) as max_batches
FROM recipe_ingredients ri
JOIN items i ON ri.itemId = i.itemId
WHERE ri.recipeId = $1 AND i.currentQuantity >= ri.quantity;

-- Batch yield analysis
SELECT displayId, yieldPercentage, costVariance
FROM batches 
WHERE recipeId = $1 
ORDER BY dateCreated DESC;
```

### Inventory Queries
```sql
-- Item lookup by SKU (primary user search)
SELECT itemId, name, currentQuantity, weightedAverageCost
FROM items 
WHERE SKU = $1 AND isArchived = false;

-- Purchase history for item
SELECT p.displayId, p.effectiveDate, pli.quantity, pli.unitCost
FROM purchase_line_items pli
JOIN purchases p ON pli.purchaseId = p.purchaseId
WHERE pli.itemId = $1 AND p.isDraft = false
ORDER BY p.effectiveDate DESC;
```

## 7. Error Handling Standards

### Standardized Error Types
- **NEGATIVE_INVENTORY_WARNING**: "[SKU] will go to [qty] (short by [amount]). This transaction will be logged but requires attention."
- **INSUFFICIENT_STOCK**: "Insufficient [SKU] for batch (available: [qty], needed: [qty])"
- **DUPLICATE_DISPLAY_ID**: "[type] reference [displayId] already exists"
- **ARCHIVED_REFERENCE**: "Cannot reference archived [type]: [name]"
- **INVALID_ALLOCATION**: "Cannot allocate shipping/taxes to non-inventory items"

### Alert Types for UI
- **NEGATIVE_INVENTORY**: Critical alert for items with currentQuantity < 0
- **LOW_STOCK**: Warning alert for items below reorder point
- **SHORTAGE_AMOUNT**: Calculated field showing how much inventory is short (ABS of negative quantity)

### RPC Error Handling Pattern
```sql
-- Standard error raising in RPCs
IF condition_failed THEN
  RAISE EXCEPTION '[ERROR_TYPE]: %', detailed_message
  USING HINT = 'User-friendly suggestion for resolution';
END IF;
```

## Part 3: Performance & Architectural Notes

**Query Optimization**: Use simple indexing, careful WITH RECURSIVE for batch tracing.

**Schema Evolution**: Tables designed for non-breaking additive changes; complex migrations to be documented post-MVP.

**Error Prevention**: RPC validations provide negative inventory alerts; mutable logs enable quick fixes; cycle count alerts reduce drift.

---

This data model and architecture ensures flexible data supporting business workflows—editable, validated, and cycle count alert-assisted. For UI workflows, see ui-blueprint.md.
