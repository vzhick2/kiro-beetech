---
title: 'Data Model and Architecture'
description: 'Database schema, architecture principles, and security design for internal business use'
purpose: 'Reference for data foundation, integrity patterns, and system architecture'
last_updated: 'July 18, 2025'
doc_type: 'technical-reference'
related:
  ['README.md', 'ui-blueprint.md', 'development-guide.md', 'requirements.md']
---

# Data Model and Architecture

Database schema and architectural foundation for internal inventory management with mutable logs and validation mitigations.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

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

## Part 2: TypeScript Interfaces

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
  grandTotal: number;
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
  storeUrl?: string;
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

interface QuickReorderRequest {
  itemId: string;
  supplierId: string;
  quantity: number;
  estimatedCost: number;
}

// Notification and Alert System
interface AlertConfig {
  type: 'NEGATIVE_INVENTORY' | 'LOW_STOCK' | 'CYCLE_COUNT' | 'BATCH_COMPLETE';
  threshold?: number;
  enabled: boolean;
  deliveryMethods: ('email' | 'in_app')[];
  recipients?: string[];
}

interface NotificationRule {
  id: string;
  name: string;
  condition: string; // SQL-like condition
  enabled: boolean;
  deliveryMethods: ('email' | 'in_app')[];
  recipients?: string[];
}

interface AlertTrigger {
  ruleId: string;
  triggeredAt: Date;
  data: Record<string, any>;
  delivered: boolean;
  deliveryAttempts: number;
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

## Part 3: Database Schema

### Core Tables

```sql
-- Items table with inventory tracking
CREATE TABLE items (
  itemId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  SKU TEXT UNIQUE NOT NULL,
  type item_type NOT NULL,
  isArchived BOOLEAN DEFAULT FALSE,
  inventoryUnit inventory_unit NOT NULL,
  currentQuantity NUMERIC DEFAULT 0,
  weightedAverageCost NUMERIC DEFAULT 0,
  reorderPoint NUMERIC,
  lastCountedDate DATE,
  primarySupplierId UUID REFERENCES suppliers(supplierId),
  leadTimeDays INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Suppliers for purchase management
CREATE TABLE suppliers (
  supplierId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  storeUrl TEXT,
  phone TEXT,
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
  grandTotal NUMERIC NOT NULL,
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
```

## Part 4: Business Logic Functions

### Core Business Functions

#### Weighted Average Cost Calculation

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

#### Cycle Count Alert Algorithm

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

#### Inventory Forecasting Logic

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

## Part 5: Error Handling Standards

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

---

This data model and architecture ensures flexible data supporting business workflows—editable, validated, and cycle count alert-assisted. For UI workflows, see ui-blueprint.md.
