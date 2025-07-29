---
title: 'Technical Reference'
description: 'Complete database schema, APIs, and technical architecture for internal inventory management'
purpose: 'Unified technical reference combining data model and API documentation'
last_updated: 'July 29, 2025'
doc_type: 'technical-reference'
related:
  ['README.md', 'developer-guide.md', 'product-specification.md', 'tasks.md']
---

# Technical Reference

Complete technical documentation for the internal BTINV inventory management system, including database schema, API endpoints, business logic functions, and architectural patterns.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## Table of Contents

1. [Core Design Principles](#core-design-principles)
2. [Database Schema](#database-schema)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Database Functions (Supabase RPCs)](#database-functions-supabase-rpcs)
5. [Server Actions (Next.js 15)](#server-actions-nextjs-15)
6. [Data Fetching (TanStack Query)](#data-fetching-tanstack-query)
7. [Authentication & Authorization](#authentication--authorization)
8. [Error Handling](#error-handling)
9. [CSV Import System](#csv-import-system)
10. [Performance Considerations](#performance-considerations)

## Core Design Principles

### Data Integrity

- **Mutable Transaction Logs**: Editable transactions with timestamps for flexible corrections
- **Negative Inventory Alerts**: Support real-world workflows by allowing negative inventory with robust alert system for user resolution
- **Cycle Count Alerts**: Algorithm-based inventory checks to reduce manual monitoring
- **Cost Allocation**: Exclude non-inventory items from shipping/tax allocation to maintain COGS accuracy

### Technical Foundation

- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Performance**: Next.js SSR with PostgreSQL queries
- **Atomic Operations**: PostgreSQL RPCs for critical multi-step operations
- **On-Demand Costing with Caching**: Critical calculations like Weighted Average Cost (WAC) are performed on-demand by pure functions and cached in the `items` table

### Design Patterns

- **Display ID Pattern**: Separate user-facing identifiers (displayId) from database primary keys (UUID) for optimal UX and performance
- **Optional Field Strategy**: Capture data fields for future analysis (laborCost, expiryDate) without implementing complex behaviors in MVP
- **Logic Strategy**: Store data now, add complex system behaviors in Phase 2 to protect MVP timeline
- **Two-Mode Tracking**: Inventory management with 'fully_tracked' and 'cost_added' modes based on business impact
- **Simple Audit Strategy**: Use existing transaction logs and item notes for tracking important changes rather than dedicated audit fields
- **Single Configuration File**: Centralized configuration system in `src/config/app-config.ts` for all business rules, UI settings, and table configurations

### Tracking Mode Change Mitigations

Since we removed the `mode_changed_date` field for simplicity, we use these alternatives for audit trail needs:

1. **Transaction Log Entries**: Mode changes can be documented in the `transactions` table with type 'adjustment' and descriptive notes
2. **Item Notes Field**: Critical mode changes can be documented in the item's notes field with timestamp and reason
3. **Updated_at Timestamp**: The `updated_at` field provides a general indicator of when the item was last modified
4. **Inventory Snapshot**: The `lastInventorySnapshot` field preserves the quantity at the time of mode change for historical reference

## Database Schema

### Core Tables

```sql
-- Items with enhanced categorization
CREATE TABLE items (
  itemId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayId TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  type item_type NOT NULL,
  category TEXT, -- New field for subcategorization
  inventoryUnit inventory_unit NOT NULL,
  currentQuantity NUMERIC DEFAULT 0,
  weightedAverageCost NUMERIC DEFAULT 0,
  tracking_mode tracking_mode DEFAULT 'fully_tracked',
  isArchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Add category suggestions for natural skincare business
-- Base categories by type:
-- Ingredients: Base Oils, Essential Oils, Butters, Waxes, Preservatives, Active Ingredients, Colorants
-- Packaging: Containers, Labels, Caps/Pumps, Boxes  
-- Products: Face Care, Body Care, Lip Care, Hair Care

-- Suppliers for purchase management
CREATE TABLE suppliers (
  supplierId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  website TEXT,
  contactphone TEXT,
  address TEXT,
  notes TEXT,
  isArchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchases with draft support
CREATE TABLE purchases (
  purchaseId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayId TEXT UNIQUE NOT NULL,
  supplierId UUID REFERENCES suppliers(supplierId) NOT NULL,
  purchaseDate DATE NOT NULL,
  effectiveDate DATE NOT NULL,
  total NUMERIC NOT NULL,
  shipping NUMERIC DEFAULT 0,
  taxes NUMERIC DEFAULT 0,
  otherCosts NUMERIC DEFAULT 0,
  notes TEXT,
  isDraft BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Purchase line items for cost allocation
CREATE TABLE purchase_line_items (
  lineItemId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaseId UUID REFERENCES purchases(purchaseId) NOT NULL,
  itemId UUID REFERENCES items(itemId) NOT NULL,
  quantity NUMERIC NOT NULL,
  unitCost NUMERIC NOT NULL,
  totalCost NUMERIC NOT NULL,
  notes TEXT
);

-- Recipes for production management
CREATE TABLE recipes (
  recipeId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  displayVersion TEXT NOT NULL,
  outputProductId UUID REFERENCES items(itemId) NOT NULL,
  expectedYield NUMERIC NOT NULL,
  laborMinutes INTEGER,
  projectedMaterialCost NUMERIC,
  isArchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Recipe ingredients for batch calculations
CREATE TABLE recipe_ingredients (
  ingredientId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipeId UUID REFERENCES recipes(recipeId) NOT NULL,
  itemId UUID REFERENCES items(itemId) NOT NULL,
  quantity NUMERIC NOT NULL,
  notes TEXT
);

-- Production batches with yield tracking
CREATE TABLE batches (
  batchId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayId TEXT UNIQUE NOT NULL,
  recipeId UUID REFERENCES recipes(recipeId) NOT NULL,
  dateCreated DATE NOT NULL,
  effectiveDate DATE NOT NULL,
  qtyMade NUMERIC NOT NULL,
  yieldPercentage NUMERIC,
  materialCost NUMERIC NOT NULL,
  laborCost NUMERIC DEFAULT 0,
  actualCost NUMERIC NOT NULL,
  costVariance NUMERIC,
  expiryDate DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales periods for forecasting
CREATE TABLE sales_periods (
  salesPeriodId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayId TEXT UNIQUE NOT NULL,
  itemId UUID REFERENCES items(itemId) NOT NULL,
  channel sales_channel NOT NULL,
  periodStart DATE NOT NULL,
  periodEnd DATE NOT NULL,
  quantitySold NUMERIC NOT NULL,
  revenue NUMERIC,
  dataSource data_source DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction log for audit trail
CREATE TABLE transactions (
  transactionId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itemId UUID REFERENCES items(itemId) NOT NULL,
  transactionType transaction_type NOT NULL,
  quantity NUMERIC NOT NULL,
  unitCost NUMERIC,
  referenceId UUID,
  referenceType TEXT,
  effectiveDate DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forecasting data for automatic reorder points
CREATE TABLE forecasting_data (
  forecastingId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itemId UUID REFERENCES items(itemId) NOT NULL,
  predictedDemand NUMERIC NOT NULL,
  seasonalIndex NUMERIC DEFAULT 1.0,
  recommendedReorderPoint NUMERIC,
  isAutomatic BOOLEAN DEFAULT TRUE,
  calculatedAt TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(itemId)
);

-- Batch templates for reusable configurations
CREATE TABLE batch_templates (
  templateId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  recipeId UUID REFERENCES recipes(recipeId) NOT NULL,
  scaleFactor NUMERIC DEFAULT 1.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Enums and Types

```sql
CREATE TYPE item_type AS ENUM ('ingredient', 'packaging', 'product');
CREATE TYPE inventory_unit AS ENUM ('each', 'lb', 'oz', 'kg', 'g', 'gal', 'qt', 'pt', 'cup', 'fl_oz', 'ml', 'l');
CREATE TYPE transaction_type AS ENUM ('purchase', 'sale', 'adjustment', 'batch_consumption', 'batch_production');
CREATE TYPE sales_channel AS ENUM ('qbo', 'bigcommerce');
CREATE TYPE data_source AS ENUM ('manual', 'imported');

-- Note: tracking_mode uses TEXT with CHECK constraint for flexibility
-- ALTER TABLE items ADD CONSTRAINT items_tracking_mode_check 
-- CHECK (tracking_mode IN ('fully_tracked', 'cost_added'));
```

### Database Indexes

```sql
-- Items table indexes
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_archived ON items(isArchived);

-- Transactions table indexes
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_date ON transactions(effective_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- Purchases table indexes
CREATE INDEX idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_purchases_draft ON purchases(is_draft);
```

## TypeScript Interfaces

### Core Data Interfaces

```typescript
interface Item {
  itemId: string;
  name: string;
  SKU: string;
  type: 'ingredient' | 'packaging' | 'product';
  inventoryUnit: InventoryUnit;
  currentQuantity: number;
  weightedAverageCost: number;
  reorderPoint?: number;
  lastCountedDate?: Date;
  primarySupplierId?: string;
  leadTimeDays: number;
  isArchived: boolean;
}

interface Purchase {
  purchaseId: string;
  displayId: string;
  supplierId: string;
  purchaseDate: Date;
  effectiveDate: Date;
  total: number;
  shipping: number;
  taxes: number;
  otherCosts: number;
  notes?: string;
  isDraft: boolean;
  lineItems: PurchaseLineItem[];
}

interface PurchaseLineItem {
  lineItemId: string;
  purchaseId: string;
  itemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  notes?: string;
}

interface Recipe {
  recipeId: string;
  name: string;
  version: number;
  displayVersion: string;
  outputProductId: string;
  expectedYield: number;
  laborMinutes?: number;
  projectedMaterialCost?: number;
  ingredients: RecipeIngredient[];
}

interface RecipeIngredient {
  ingredientId: string;
  recipeId: string;
  itemId: string;
  quantity: number;
  notes?: string;
}

interface Batch {
  batchId: string;
  displayId: string;
  recipeId: string;
  dateCreated: Date;
  effectiveDate: Date;
  qtyMade: number;
  yieldPercentage?: number;
  materialCost: number;
  laborCost: number;
  actualCost: number;
  costVariance?: number;
  expiryDate?: Date;
  notes?: string;
}

interface Supplier {
  supplierId: string;
  name: string;
  website?: string;
  phone?: string;
  isArchived: boolean;
}

interface SalesPeriod {
  salesPeriodId: string;
  displayId: string;
  itemId: string;
  channel: 'qbo' | 'bigcommerce';
  periodStart: Date;
  periodEnd: Date;
  quantitySold: number;
  revenue?: number;
  dataSource: 'manual' | 'imported';
}

interface Transaction {
  transactionId: string;
  itemId: string;
  transactionType:
    | 'purchase'
    | 'sale'
    | 'adjustment'
    | 'batch_consumption'
    | 'batch_production';
  quantity: number;
  unitCost?: number;
  referenceId?: string;
  referenceType?: string;
  effectiveDate: Date;
  notes?: string;
  created_at: Date;
}
```

### Business Logic Interfaces

```typescript
interface CycleCountAlert {
  itemId: string;
  SKU: string;
  name: string;
  currentQuantity: number;
  reorderPoint?: number;
  priorityScore: number;
  alertType: 'NEGATIVE_INVENTORY' | 'LOW_STOCK';
  shortageAmount?: number;
}

interface ForecastingData {
  forecastingId: string;
  itemId: string;
  predictedDemand: number;
  seasonalIndex: number;
  recommendedReorderPoint: number;
  isAutomatic: boolean;
  calculatedAt: Date;
}

interface BatchTemplate {
  templateId: string;
  name: string;
  recipeId: string;
  scaleFactor: number;
  notes?: string;
  created_at: Date;
}

// Notification and Alert System
interface AlertConfig {
  type: 'NEGATIVE_INVENTORY' | 'LOW_STOCK' | 'CYCLE_COUNT' | 'BATCH_COMPLETE';
  threshold?: number;
  enabled: boolean;
  deliveryMethods: ('email' | 'in_app')[];
  recipients?: string[];
}
```

### Error Handling Interfaces

```typescript
enum ErrorType {
  NEGATIVE_INVENTORY_WARNING = 'NEGATIVE_INVENTORY_WARNING',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  DUPLICATE_DISPLAY_ID = 'DUPLICATE_DISPLAY_ID',
  ARCHIVED_REFERENCE = 'ARCHIVED_REFERENCE',
  INVALID_ALLOCATION = 'INVALID_ALLOCATION',
  NO_PURCHASE_HISTORY = 'NO_PURCHASE_HISTORY',
}

interface BusinessError {
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  canProceed: boolean;
}

// Type definitions for inventory units and other enums
type InventoryUnit =
  | 'each'
  | 'lb'
  | 'oz'
  | 'kg'
  | 'g'
  | 'gal'
  | 'qt'
  | 'pt'
  | 'cup'
  | 'fl_oz'
  | 'ml'
  | 'l';
type ItemType = 'ingredient' | 'packaging' | 'product';
type TransactionType =
  | 'purchase'
  | 'sale'
  | 'adjustment'
  | 'batch_consumption'
  | 'batch_production';
```

## Database Functions (Supabase RPCs)

### Core Business Logic Functions

#### `calculate_wac(item_id UUID)`

**Purpose**: Calculate weighted average cost for an inventory item
**Parameters**: `item_id` - UUID of the item to calculate WAC for
**Returns**: `DECIMAL` - The calculated weighted average cost
**Logic**: Uses all non-draft purchase history to calculate WAC

```sql
CREATE OR REPLACE FUNCTION calculate_wac(item_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  result NUMERIC;
BEGIN
  SELECT
    SUM(quantity * unitCost) / SUM(quantity)
  INTO result
  FROM purchase_line_items pli
  JOIN purchases p ON pli.purchaseId = p.purchaseId
  WHERE pli.itemId = item_id
    AND p.isDraft = false;

  IF result IS NULL THEN
    RAISE WARNING 'NO_HISTORY: No purchase history found for item %', item_id;
    RETURN 0;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

#### `get_cycle_count_alerts(limit_count INTEGER DEFAULT 5)`

**Purpose**: Get items that need cycle count attention
**Parameters**: `limit_count` - Maximum number of alerts to return (default: 5)
**Returns**: `TABLE` with alert information
**Logic**: Priority algorithm based on time since last count and current quantity

```sql
CREATE OR REPLACE FUNCTION get_cycle_count_alerts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  itemId UUID,
  SKU TEXT,
  name TEXT,
  currentQuantity NUMERIC,
  reorderPoint NUMERIC,
  priorityScore NUMERIC,
  alertType TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.itemId,
    i.SKU,
    i.name,
    i.currentQuantity,
    i.reorderPoint,
    ((CURRENT_DATE - COALESCE(i.lastCountedDate, CURRENT_DATE - INTERVAL '365 days')) / 30.0) +
    (1 - i.currentQuantity / GREATEST(COALESCE(i.reorderPoint, 1), 1)) as priorityScore,
    CASE
      WHEN i.currentQuantity < 0 THEN 'NEGATIVE_INVENTORY'
      WHEN i.currentQuantity <= COALESCE(i.reorderPoint, 0) THEN 'LOW_STOCK'
    END as alertType
  FROM items i
  WHERE i.isArchived = false
  ORDER BY priorityScore DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

#### `calculate_forecasting(item_id UUID)`

**Purpose**: Calculate forecasting data for an item
**Parameters**: `item_id` - UUID of the item to forecast
**Returns**: `VOID` - Updates forecasting_data table
**Logic**: 3-month moving average with seasonal adjustments

```sql
CREATE OR REPLACE FUNCTION calculate_forecasting(item_id UUID)
RETURNS VOID AS $$
DECLARE
  avg_monthly_sales NUMERIC;
  seasonal_index NUMERIC;
  lead_time_days INTEGER;
  recommended_reorder NUMERIC;
BEGIN
  -- Calculate 3-month moving average
  SELECT
    AVG(quantitySold) / 30.0, -- Daily average
    COALESCE(i.leadTimeDays, 7)
  INTO avg_monthly_sales, lead_time_days
  FROM sales_periods sp
  JOIN items i ON sp.itemId = i.itemId
  WHERE sp.itemId = item_id
    AND sp.periodEnd >= CURRENT_DATE - INTERVAL '3 months';

  -- Simple seasonality: compare current month to average
  SELECT
    COALESCE(
      (SELECT AVG(quantitySold) FROM sales_periods
       WHERE itemId = item_id
         AND EXTRACT(MONTH FROM periodStart) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND periodEnd >= CURRENT_DATE - INTERVAL '12 months') /
      NULLIF(avg_monthly_sales * 30, 0),
      1.0
    )
  INTO seasonal_index;

  -- Calculate recommended reorder point
  recommended_reorder := (avg_monthly_sales * lead_time_days * seasonal_index) * 1.2; -- 20% buffer

  -- Upsert forecasting data for trending
  INSERT INTO forecasting_data (itemId, predictedDemand, seasonalIndex, recommendedReorderPoint, isAutomatic, calculatedAt)
  VALUES (item_id, avg_monthly_sales * 30, seasonal_index, recommended_reorder, TRUE, NOW())
  ON CONFLICT (itemId)
  DO UPDATE SET
    predictedDemand = EXCLUDED.predictedDemand,
    seasonalIndex = EXCLUDED.seasonalIndex,
    recommendedReorderPoint = EXCLUDED.recommendedReorderPoint,
    calculatedAt = EXCLUDED.calculatedAt;

  -- Only update item's reorder point if in automatic mode
  UPDATE items
  SET reorderPoint = recommended_reorder
  WHERE itemId = item_id
    AND EXISTS (
      SELECT 1 FROM forecasting_data
      WHERE itemId = item_id AND isAutomatic = TRUE
    );
END;
$$ LANGUAGE plpgsql;
```

#### `update_item_quantity_atomic(item_id UUID, quantity_change INTEGER)`

**Purpose**: Atomically update item quantity and log transaction
**Parameters**: `item_id`, `quantity_change` (positive or negative)
**Returns**: `TABLE` with updated quantity and transaction ID
**Logic**: Prevents race conditions by using atomic database operations

```sql
CREATE OR REPLACE FUNCTION update_item_quantity_atomic(
    item_id UUID,
    quantity_change INTEGER
)
RETURNS TABLE (
    new_quantity INTEGER,
    transaction_id UUID
) AS $$
DECLARE
    new_transaction_id UUID;
BEGIN
    -- Atomically update item quantity
    UPDATE items
    SET current_quantity = current_quantity + quantity_change,
        updated_at = NOW()
    WHERE itemId = item_id;

    -- Log the transaction
    INSERT INTO transactions (item_id, transaction_type, quantity_change, created_at)
    VALUES (item_id, 'adjustment', quantity_change, NOW())
    RETURNING transactionId INTO new_transaction_id;

    -- Return updated quantity and transaction ID
    RETURN QUERY
    SELECT current_quantity, new_transaction_id
    FROM items
    WHERE itemId = item_id;
END;
$$ LANGUAGE plpgsql;
```

### Transaction Management Functions

#### `finalize_draft_purchase(purchase_id UUID)`

**Purpose**: Convert a draft purchase to final and update inventory
**Parameters**: `purchase_id` - UUID of the draft purchase
**Returns**: `BOOLEAN` - Success status
**Logic**: Updates inventory, logs transactions, and recalculates WAC

```sql
CREATE OR REPLACE FUNCTION finalize_draft_purchase(purchase_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    line_item RECORD;
BEGIN
    -- Verify purchase exists and is draft
    IF NOT EXISTS (
        SELECT 1 FROM purchases
        WHERE purchase_id = finalize_draft_purchase.purchase_id
        AND is_draft = true
    ) THEN
        RAISE EXCEPTION 'Purchase not found or not a draft';
    END IF;

    -- Process each line item
    FOR line_item IN
        SELECT item_id, quantity, unit_cost, total_cost
        FROM purchase_line_items
        WHERE purchase_id = finalize_draft_purchase.purchase_id
    LOOP
        -- Use atomic update to prevent race conditions
        PERFORM update_item_quantity_atomic(
            line_item.item_id,
            line_item.quantity
        );

        -- Log the purchase transaction
        INSERT INTO transactions (
            item_id,
            transaction_type,
            quantity,
            reference_id,
            reference_type,
            unit_cost,
            created_at
        )
        VALUES (
            line_item.item_id,
            'purchase',
            line_item.quantity,
            finalize_draft_purchase.purchase_id,
            'purchase',
            line_item.unit_cost,
            NOW()
        );

        -- Recalculate WAC for the item
        PERFORM calculate_wac(line_item.item_id);
    END LOOP;

    -- Mark purchase as finalized
    UPDATE purchases
    SET is_draft = false, updated_at = NOW()
    WHERE purchase_id = finalize_draft_purchase.purchase_id;

    RETURN true;
END;
$$ LANGUAGE plpgsql;
```

#### `change_item_tracking_mode(item_id UUID, new_mode TEXT, inventory_snapshot NUMERIC, reason TEXT)`

**Purpose**: Change an item's tracking mode between 'fully_tracked' and 'cost_added'
**Parameters**:

- `item_id` - UUID of the item to change
- `new_mode` - Target tracking mode ('fully_tracked' or 'cost_added')
- `inventory_snapshot` - Current inventory count (required when switching TO fully_tracked)
- `reason` - Optional reason for the change (for business documentation)
  **Returns**: `JSON` - Success status and change details
  **Logic**: Validates transition, updates tracking mode, preserves inventory snapshot

```sql
CREATE OR REPLACE FUNCTION change_item_tracking_mode(
  item_id UUID,
  new_mode TEXT,
  inventory_snapshot NUMERIC DEFAULT NULL,
  reason TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  current_mode TEXT;
  current_quantity NUMERIC;
  result JSON;
BEGIN
  -- Get current item state
  SELECT trackingMode, currentQuantity
  INTO current_mode, current_quantity
  FROM items
  WHERE itemId = item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found: %', item_id;
  END IF;

  -- Validate transition
  IF current_mode = new_mode THEN
    RAISE EXCEPTION 'Item is already in % mode', new_mode;
  END IF;

  -- Handle transition logic
  IF new_mode = 'fully_tracked' THEN
    -- Switching TO fully tracked - requires inventory snapshot
    IF inventory_snapshot IS NULL THEN
      RAISE EXCEPTION 'Inventory snapshot required when switching to fully tracked mode';
    END IF;

    UPDATE items
    SET trackingMode = new_mode,
        currentQuantity = inventory_snapshot,
        lastInventorySnapshot = current_quantity,
        updated_at = NOW()
    WHERE itemId = item_id;

  ELSIF new_mode = 'cost_added' THEN
    -- Switching TO cost added - preserve current quantity as snapshot
    UPDATE items
    SET trackingMode = new_mode,
        lastInventorySnapshot = current_quantity,
        updated_at = NOW()
    WHERE itemId = item_id;

  ELSE
    RAISE EXCEPTION 'Invalid tracking mode: %', new_mode;
  END IF;

  -- Return success result
  result := json_build_object(
    'success', true,
    'itemId', item_id,
    'oldMode', current_mode,
    'newMode', new_mode,
    'snapshotTaken', inventory_snapshot,
    'reason', reason
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Server Actions (Next.js 15)

### Items Management

#### `createItem(formData: FormData)`

**Purpose**: Create a new inventory item
**Location**: `src/app/actions/items.ts`
**Parameters**: FormData with item details
**Returns**: Promise with success/error response

```typescript
'use server';

export async function createItem(formData: FormData) {
  try {
    const itemData = {
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      type: formData.get('type') as ItemType,
      inventoryUnit: formData.get('inventoryUnit') as InventoryUnit,
      currentQuantity: parseInt(formData.get('currentQuantity') as string),
      reorderPoint: parseInt(formData.get('reorderPoint') as string),
      leadTimeDays: parseInt(formData.get('leadTimeDays') as string),
      primarySupplierId: (formData.get('primarySupplierId') as string) || null,
    };

    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

#### `updateItemQuantity(itemId: string, quantityChange: number)`

**Purpose**: Update item quantity atomically with transaction logging
**Location**: `src/app/actions/items.ts`
**Parameters**: itemId, quantityChange (positive for increase, negative for decrease)
**Returns**: Promise with success/error response

```typescript
'use server';

export async function updateItemQuantity(
  itemId: string,
  quantityChange: number
) {
  try {
    // Use atomic update to prevent race conditions
    const { data: updatedItem, error: updateError } = await supabase.rpc(
      'update_item_quantity_atomic',
      {
        item_id: itemId,
        quantity_change: quantityChange,
      }
    );

    if (updateError) throw updateError;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Purchase Management

#### `finalizeDraftPurchase(purchaseId: string)`

**Purpose**: Convert a draft purchase to final and update inventory
**Location**: `src/app/actions/purchases.ts`
**Parameters**: purchaseId - UUID of the draft purchase
**Returns**: Promise with success/error response

```typescript
'use server';

export async function finalizeDraftPurchase(purchaseId: string) {
  try {
    const { error } = await supabase.rpc('finalize_draft_purchase', {
      purchase_id: purchaseId,
    });

    if (error) throw error;

    revalidatePath('/purchases');
    revalidatePath('/items');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Batch Management

#### `createBatch(batchData: BatchFormData)`

**Purpose**: Create a new batch with ingredient consumption
**Location**: `src/app/actions/batches.ts`
**Parameters**: BatchFormData object
**Returns**: Promise with success/error response

```typescript
'use server';

export async function createBatch(batchData: BatchFormData) {
  try {
    const { data, error } = await supabase.rpc(
      'create_batch_with_consumption',
      {
        batch_data: {
          recipe_id: batchData.recipeId,
          effective_date: batchData.effectiveDate,
          qty_made: batchData.qtyMade,
          material_cost: batchData.materialCost,
          labor_cost: batchData.laborCost,
          actual_cost: batchData.actualCost,
          notes: batchData.notes,
        },
        consumption_data: batchData.consumption,
      }
    );

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Data Fetching (TanStack Query)

### Items Queries

#### `useItems()`

**Purpose**: Fetch all items with filtering and search
**Location**: `src/hooks/use-items.ts`
**Parameters**: Optional filters and search terms
**Returns**: Query result with items data

```typescript
export function useItems(searchQuery = '', typeFilter = 'all') {
  return useQuery({
    queryKey: ['items', { search: searchQuery, type: typeFilter }],
    queryFn: async () => {
      let query = supabase.from('items').select('*').eq('is_archived', false);

      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
```

#### `useCycleCountAlerts(limit?: number)`

**Purpose**: Fetch cycle count alerts
**Location**: `src/hooks/use-alerts.ts`
**Parameters**: Optional limit (default: 5)
**Returns**: Query result with alerts data

```typescript
export function useCycleCountAlerts(limit: number = 5) {
  return useQuery({
    queryKey: ['cycle-count-alerts', limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cycle_count_alerts', {
        threshold: limit,
      });
      if (error) throw error;
      return data;
    },
  });
}
```

### Suppliers Management

#### `bulkArchiveSuppliers(supplierIds: string[])`

**Purpose**: Archive multiple suppliers (soft delete)
**Location**: `src/app/actions/suppliers.ts`
**Parameters**: Array of supplier UUIDs
**Returns**: Promise with enhanced response including counts and error details

```typescript
'use server';

export async function bulkArchiveSuppliers(supplierIds: string[]) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .update({ is_archived: true })
      .in('supplierId', supplierIds);

    if (error) throw error;

    revalidatePath('/suppliers');
    revalidatePath('/suppliers');

    return { 
      success: true, 
      message: `Successfully archived ${supplierIds.length} supplier(s)` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}
```

#### `bulkUnarchiveSuppliers(supplierIds: string[])`

**Purpose**: Unarchive multiple suppliers
**Location**: `src/app/actions/suppliers.ts`
**Parameters**: Array of supplier UUIDs
**Returns**: Promise with enhanced response including counts and error details

```typescript
'use server';

export async function bulkUnarchiveSuppliers(supplierIds: string[]) {
  try {
    const { error } = await supabase
      .from('suppliers')
      .update({ is_archived: false })
      .in('supplierId', supplierIds);

    if (error) throw error;

    revalidatePath('/suppliers');
    revalidatePath('/suppliers');

    return { 
      success: true, 
      message: `Successfully unarchived ${supplierIds.length} supplier(s)` 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}
```

#### `bulkDeleteSuppliers(supplierIds: string[])`

**Purpose**: Smart delete operation with validation - archive if relationships exist, delete if clean
**Location**: `src/app/actions/suppliers.ts`
**Parameters**: Array of supplier UUIDs
**Returns**: Promise with detailed response including operation breakdown

```typescript
'use server';

export async function bulkDeleteSuppliers(supplierIds: string[]) {
  try {
    const deletableIds: string[] = [];
    const blockedSuppliers: Array<{ id: string; name: string; reason: string }> = [];

    // Validate each supplier
    for (const id of supplierIds) {
      const canDelete = await canDeleteSupplier(id);
      
      if (canDelete.canDelete) {
        deletableIds.push(id);
      } else {
        // Get supplier name for user feedback
        const { data: supplier } = await supabase
          .from('suppliers')
          .select('companyName')
          .eq('supplierId', id)
          .single();
        
        blockedSuppliers.push({
          id,
          name: supplier?.companyName || 'Unknown Supplier',
          reason: canDelete.reason || 'Has related data'
        });
      }
    }

    let deletedCount = 0;
    let archivedCount = 0;

    // Delete clean suppliers
    if (deletableIds.length > 0) {
      const { error: deleteError } = await supabase
        .from('suppliers')
        .delete()
        .in('supplierId', deletableIds);

      if (deleteError) throw deleteError;
      deletedCount = deletableIds.length;
    }

    // Archive suppliers with relationships
    if (blockedSuppliers.length > 0) {
      const blockedIds = blockedSuppliers.map(s => s.id);
      const { error: archiveError } = await supabase
        .from('suppliers')
        .update({ is_archived: true })
        .in('supplierId', blockedIds);

      if (archiveError) throw archiveError;
      archivedCount = blockedIds.length;
    }

    revalidatePath('/suppliers');
    revalidatePath('/suppliers');

    // Build response message
    let message = '';
    if (deletedCount > 0 && archivedCount > 0) {
      message = `Successfully deleted ${deletedCount} supplier(s) and archived ${archivedCount} supplier(s) with relationships`;
    } else if (deletedCount > 0) {
      message = `Successfully deleted ${deletedCount} supplier(s)`;
    } else if (archivedCount > 0) {
      message = `Archived ${archivedCount} supplier(s) with existing relationships instead of deleting`;
    } else {
      message = 'No suppliers were processed';
    }

    return {
      success: true,
      message,
      details: {
        deleted: deletedCount,
        archived: archivedCount,
        blockedSuppliers: blockedSuppliers.map(s => ({
          name: s.name,
          reason: s.reason
        }))
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message 
    };
  }
}
```

#### `canDeleteSupplier(supplierId: string)`

**Purpose**: Validate if a supplier can be safely deleted without data integrity issues
**Location**: `src/app/actions/suppliers.ts`
**Parameters**: Supplier UUID
**Returns**: Promise with validation result and reason

```typescript
async function canDeleteSupplier(supplierId: string): Promise<{
  canDelete: boolean;
  reason?: string;
}> {
  try {
    // Check for purchases
    const { data: purchases, error: purchaseError } = await supabase
      .from('purchases')
      .select('purchaseId')
      .eq('supplierId', supplierId)
      .limit(1);

    if (purchaseError) throw purchaseError;

    if (purchases && purchases.length > 0) {
      return {
        canDelete: false,
        reason: 'Has purchase history'
      };
    }

    // Check for items with this as primary supplier
    const { data: items, error: itemError } = await supabase
      .from('items')
      .select('itemId')
      .eq('primarySupplierId', supplierId)
      .limit(1);

    if (itemError) throw itemError;

    if (items && items.length > 0) {
      return {
        canDelete: false,
        reason: 'Is primary supplier for items'
      };
    }

    // Safe to delete - no relationships found
    return {
      canDelete: true
    };
  } catch (error) {
    return {
      canDelete: false,
      reason: 'Error checking relationships'
    };
  }
}
```

## Authentication & Authorization

### Row Level Security (RLS) Policies

**Note**: This application is designed for internal business use with single-tenant access. RLS policies would need to be implemented based on the specific authentication requirements.

#### Example Multi-Tenant Implementation

If multi-tenant functionality is required in the future, add a `user_id UUID` column to relevant tables:

```sql
-- Add user_id column to items table
ALTER TABLE items ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Then apply RLS policies
CREATE POLICY "Users can view their own items" ON items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" ON items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" ON items
FOR UPDATE USING (auth.uid() = user_id);
```

#### Current Single-Tenant Implementation

For the current internal business use case, RLS can be simplified or disabled entirely since all users access the same business data.

## Error Handling

### Standard Error Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

### Standardized Error Types

- **NEGATIVE_INVENTORY_WARNING**: "[SKU] will go to [qty] (short by [amount]). This transaction will be logged but requires attention."
- **INSUFFICIENT_STOCK**: "Insufficient [SKU] for batch (available: [qty], needed: [qty])"
- **DUPLICATE_DISPLAY_ID**: "[type] reference [displayId] already exists"
- **ARCHIVED_REFERENCE**: "Cannot reference archived [type]: [name]"
- **INVALID_ALLOCATION**: "Cannot allocate shipping/taxes to non-inventory items"

### Error Handling Utilities

#### `handleError(error: unknown, context: string): AppError`

```typescript
export function handleError(error: unknown, context: string): AppError {
  console.error(`Error in ${context}:`, error);

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
      code: error.name,
    };
  }

  return {
    success: false,
    error: 'An unexpected error occurred',
  };
}
```

## CSV Import System

### QBO Sales CSV Format

**Required Headers:**

- `Date` - Transaction date
- `Transaction Type` - Must be "Sale" or "Invoice"
- `Product/Service` - Item name
- `Qty` - Quantity sold
- `Amount` - Revenue amount

**Optional Headers:**

- `Description` - Alternative item name
- `Rate` - Unit price
- `Customer` - Customer name
- `Channel` - Sales channel

### Import Process Flow

1. **File Upload**: User selects QBO CSV file
2. **Format Validation**: System validates CSV structure
3. **Data Preview**: Shows summary of items and quantities
4. **Import Options**: Configure effective date and missing item creation
5. **Processing**: Updates inventory and logs transactions
6. **Results**: Shows success/error statistics

#### `processQBOImport(formData: FormData)`

**Purpose**: Process and import QBO sales data
**Location**: `src/app/actions/csv-import.ts`
**Returns**: Promise with import results and statistics

```typescript
'use server';

export async function processQBOImport(formData: FormData) {
  try {
    const csvContent = formData.get('csvContent') as string;
    const effectiveDate = formData.get('effectiveDate') as string;
    const createMissingItems = formData.get('createMissingItems') === 'true';

    // Parse CSV data
    const parsingResult = parseQBOSalesCSV(csvContent);
    if (!parsingResult.success || !parsingResult.data) {
      return createErrorResponse('CSV parsing failed', parsingResult.errors);
    }

    const results = {
      itemsCreated: 0,
      itemsUpdated: 0,
      salesLogged: 0,
      errors: [] as string[],
    };

    // Process each sale
    for (const sale of parsingResult.data) {
      // Check if item exists, create if needed, update inventory, log transaction
      // Implementation details...
    }

    return createSuccessResponse({
      message: 'QBO import completed',
      results,
    });
  } catch (error) {
    return createErrorResponse('Failed to process QBO import', error);
  }
}
```

## Performance Considerations

### Caching Strategy

- **TanStack Query**: Automatic caching with 5-minute stale time
- **Server Components**: Static generation where possible
- **Database**: Query result caching for frequently accessed data

### Database Optimization

- **Indexes**: Strategic indexes on frequently queried columns
- **Atomic Operations**: RPC functions for complex transactions
- **Pagination**: Implement cursor-based pagination for large datasets
- **Connection Pooling**: Supabase handles connection management

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `DATABASE_ERROR`: Database operation failed
- `NETWORK_ERROR`: Network connectivity issue
- `CSV_PARSING_ERROR`: CSV format or parsing issues
- `IMPORT_ERROR`: Data import processing failed

---

This technical reference provides complete documentation for the database schema, API endpoints, business logic functions, and architectural patterns used in the BTINV inventory management system. For implementation details and setup instructions, see [developer-guide.md](./developer-guide.md).
