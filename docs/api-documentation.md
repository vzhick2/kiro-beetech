---
title: "API Documentation"
description: "API endpoints, Supabase RPCs, and server actions for internal inventory management"
purpose: "Reference for API integration and backend functionality"
last_updated: "July 18, 2025"
doc_type: "api-reference"
related: ["data-model.md", "technical-design.md", "requirements.md"]
---

# API Documentation

Comprehensive API documentation for the internal KIRO inventory management system, including Supabase RPCs, server actions, and database functions.

**This application is designed for internal business use only and is not intended for public distribution or commercial licensing.**

## 🗄️ **Database Functions (Supabase RPCs)**

### Core Business Logic Functions

#### `calculate_wac(item_id UUID)`
**Purpose**: Calculate weighted average cost for an inventory item
**Parameters**: 
- `item_id`: UUID of the item to calculate WAC for
**Returns**: `DECIMAL` - The calculated weighted average cost
**Logic**: Uses all non-draft purchase history to calculate WAC

```sql
CREATE OR REPLACE FUNCTION calculate_wac(item_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_cost DECIMAL := 0;
    total_quantity INTEGER := 0;
    wac DECIMAL := 0;
BEGIN
    -- Calculate total cost and quantity from purchase history
    SELECT 
        COALESCE(SUM(pli.total_cost), 0),
        COALESCE(SUM(pli.quantity), 0)
    INTO total_cost, total_quantity
    FROM purchase_line_items pli
    JOIN purchases p ON pli.purchase_id = p.purchase_id
    WHERE pli.item_id = calculate_wac.item_id
    AND p.is_draft = false;
    
    -- Calculate WAC
    IF total_quantity > 0 THEN
        wac := total_cost / total_quantity;
    END IF;
    
    RETURN wac;
END;
$$ LANGUAGE plpgsql;
```

#### `get_cycle_count_alerts(threshold INTEGER DEFAULT 5)`
**Purpose**: Get items that need cycle count attention
**Parameters**:
- `threshold`: Maximum number of alerts to return (default: 5)
**Returns**: `TABLE` with alert information
**Logic**: Priority algorithm based on time since last count and current quantity

```sql
CREATE OR REPLACE FUNCTION get_cycle_count_alerts(threshold INTEGER DEFAULT 5)
RETURNS TABLE (
    item_id UUID,
    sku TEXT,
    name TEXT,
    current_quantity INTEGER,
    reorder_point INTEGER,
    priority_score DECIMAL,
    alert_type TEXT,
    shortage_amount INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.item_id,
        i.sku,
        i.name,
        i.current_quantity,
        i.reorder_point,
        -- Priority algorithm: (days since last count / 30) + (1 - current qty / reorder point)
        COALESCE(
            (CURRENT_DATE - i.last_counted_date)::DECIMAL / 30, 
            1
        ) + (1 - i.current_quantity::DECIMAL / GREATEST(i.reorder_point, 1)) as priority_score,
        CASE 
            WHEN i.current_quantity < 0 THEN 'NEGATIVE_INVENTORY'
            WHEN i.current_quantity < i.reorder_point THEN 'LOW_STOCK'
            ELSE 'OVERDUE_COUNT'
        END as alert_type,
        CASE 
            WHEN i.current_quantity < 0 THEN ABS(i.current_quantity)
            WHEN i.current_quantity < i.reorder_point THEN i.reorder_point - i.current_quantity
            ELSE 0
        END as shortage_amount
    FROM items i
    WHERE i.is_archived = false
    AND (
        i.current_quantity < 0 OR 
        i.current_quantity < i.reorder_point OR 
        i.last_counted_date IS NULL OR
        i.last_counted_date < CURRENT_DATE - INTERVAL '30 days'
    )
    ORDER BY priority_score DESC
    LIMIT threshold;
END;
$$ LANGUAGE plpgsql;
```

#### `calculate_forecasting(item_id UUID)`
**Purpose**: Calculate forecasting data for an item
**Parameters**:
- `item_id`: UUID of the item to forecast
**Returns**: `TABLE` with forecasting information
**Logic**: 3-month moving average with seasonal adjustments

```sql
CREATE OR REPLACE FUNCTION calculate_forecasting(item_id UUID)
RETURNS TABLE (
    predicted_demand INTEGER,
    seasonal_index DECIMAL,
    recommended_reorder_point INTEGER
) AS $$
DECLARE
    avg_demand INTEGER;
    seasonal_factor DECIMAL := 1.0;
    lead_time INTEGER;
BEGIN
    -- Get 3-month average demand
    SELECT COALESCE(AVG(quantity_sold), 0)
    INTO avg_demand
    FROM sales_periods
    WHERE item_id = calculate_forecasting.item_id
    AND period_end >= CURRENT_DATE - INTERVAL '3 months';
    
    -- Get item lead time
    SELECT COALESCE(lead_time_days, 7)
    INTO lead_time
    FROM items
    WHERE item_id = calculate_forecasting.item_id;
    
    -- Calculate seasonal index (simplified)
    -- In production, this would use more sophisticated seasonal analysis
    seasonal_factor := 1.0 + (EXTRACT(MONTH FROM CURRENT_DATE) - 6) * 0.1;
    
    RETURN QUERY
    SELECT 
        (avg_demand * seasonal_factor)::INTEGER as predicted_demand,
        seasonal_factor as seasonal_index,
        (avg_demand * seasonal_factor * lead_time / 30 * 1.2)::INTEGER as recommended_reorder_point;
END;
$$ LANGUAGE plpgsql;
```

#### `update_item_quantity_atomic(item_id UUID, quantity_change INTEGER)`
**Purpose**: Atomically update item quantity and log transaction
**Parameters**:
- `item_id`: UUID of the item to update
- `quantity_change`: Amount to change quantity by (positive or negative)
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

#### `create_purchase_with_line_items(purchase_data JSONB, line_items_data JSONB[])`
**Purpose**: Create a purchase with line items atomically
**Parameters**:
- `purchase_data`: JSON object with purchase details
- `line_items_data`: Array of JSON objects with line item details
**Returns**: `UUID` - The created purchase ID
**Logic**: Atomic transaction ensuring data consistency

```sql
CREATE OR REPLACE FUNCTION create_purchase_with_line_items(
    purchase_data JSONB,
    line_items_data JSONB[]
)
RETURNS UUID AS $$
DECLARE
    new_purchase_id UUID;
    line_item JSONB;
    item_update_result RECORD;
BEGIN
    -- Insert purchase
    INSERT INTO purchases (
        supplier_id,
        purchase_date,
        effective_date,
        grand_total,
        shipping,
        taxes,
        other_costs,
        notes,
        is_draft
    )
    SELECT 
        (purchase_data->>'supplier_id')::UUID,
        (purchase_data->>'purchase_date')::DATE,
        (purchase_data->>'effective_date')::DATE,
        (purchase_data->>'grand_total')::DECIMAL,
        (purchase_data->>'shipping')::DECIMAL,
        (purchase_data->>'taxes')::DECIMAL,
        (purchase_data->>'other_costs')::DECIMAL,
        purchase_data->>'notes',
        (purchase_data->>'is_draft')::BOOLEAN
    RETURNING purchase_id INTO new_purchase_id;
    
    -- Insert line items and update inventory (only if not draft)
    FOR line_item IN SELECT * FROM jsonb_array_elements(line_items_data)
    LOOP
        -- Insert line item
        INSERT INTO purchase_line_items (
            purchase_id,
            item_id,
            quantity,
            unit_cost,
            total_cost,
            notes
        )
        VALUES (
            new_purchase_id,
            (line_item->>'item_id')::UUID,
            (line_item->>'quantity')::INTEGER,
            (line_item->>'unit_cost')::DECIMAL,
            (line_item->>'total_cost')::DECIMAL,
            line_item->>'notes'
        );
        
        -- Update inventory and log transaction (only if purchase is not draft)
        IF NOT (purchase_data->>'is_draft')::BOOLEAN THEN
            -- Use atomic update to prevent race conditions
            PERFORM update_item_quantity_atomic(
                (line_item->>'item_id')::UUID,
                (line_item->>'quantity')::INTEGER
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
                (line_item->>'item_id')::UUID,
                'purchase',
                (line_item->>'quantity')::INTEGER,
                new_purchase_id,
                'purchase',
                (line_item->>'unit_cost')::DECIMAL,
                NOW()
            );
            
            -- Recalculate WAC for the item
            PERFORM calculate_wac((line_item->>'item_id')::UUID);
        END IF;
    END LOOP;
    
    RETURN new_purchase_id;
END;
$$ LANGUAGE plpgsql;
```

#### `finalize_draft_purchase(purchase_id UUID)`
**Purpose**: Convert a draft purchase to final and update inventory
**Parameters**:
- `purchase_id`: UUID of the draft purchase to finalize
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

```

#### `create_batch_with_consumption(batch_data JSONB, consumption_data JSONB[])`
**Purpose**: Create a batch and consume ingredients atomically
**Parameters**:
- `batch_data`: JSON object with batch details
- `consumption_data`: Array of JSON objects with ingredient consumption
**Returns**: `UUID` - The created batch ID
**Logic**: Atomic transaction for batch creation and inventory updates

```sql
CREATE OR REPLACE FUNCTION create_batch_with_consumption(
    batch_data JSONB,
    consumption_data JSONB[]
)
RETURNS UUID AS $$
DECLARE
    new_batch_id UUID;
    consumption JSONB;
BEGIN
    -- Insert batch
    INSERT INTO batches (
        recipe_id,
        date_created,
        effective_date,
        qty_made,
        material_cost,
        labor_cost,
        actual_cost,
        notes
    )
    SELECT 
        (batch_data->>'recipe_id')::UUID,
        CURRENT_DATE,
        (batch_data->>'effective_date')::DATE,
        (batch_data->>'qty_made')::INTEGER,
        (batch_data->>'material_cost')::DECIMAL,
        (batch_data->>'labor_cost')::DECIMAL,
        (batch_data->>'actual_cost')::DECIMAL,
        batch_data->>'notes'
    RETURNING batch_id INTO new_batch_id;
    
    -- Process ingredient consumption
    FOREACH consumption IN ARRAY consumption_data
    LOOP
        -- Use atomic update to prevent race conditions
        PERFORM update_item_quantity_atomic(
            (consumption->>'item_id')::UUID,
            -(consumption->>'quantity')::INTEGER
        );
        
        -- Create transaction log entry
        INSERT INTO transactions (
            item_id,
            transaction_type,
            quantity,
            reference_id,
            reference_type,
            effective_date,
            notes
        )
        VALUES (
            (consumption->>'item_id')::UUID,
            'batch_consumption',
            -(consumption->>'quantity')::INTEGER,
            new_batch_id::TEXT,
            'batch',
            (batch_data->>'effective_date')::DATE,
            consumption->>'notes'
        );
    END LOOP;
    
    RETURN new_batch_id;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 **Server Actions (Next.js 15)**

### Items Management

#### `createItem(formData: FormData)`
**Purpose**: Create a new inventory item
**Location**: `src/app/actions/items.ts`
**Parameters**: FormData with item details
**Returns**: Promise with success/error response

```typescript
'use server'

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
      primarySupplierId: formData.get('primarySupplierId') as string || null
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
**Note**: Uses atomic database operations to prevent race conditions

```typescript
'use server'

export async function updateItemQuantity(itemId: string, quantityChange: number) {
  try {
    // Use atomic update to prevent race conditions
    const { data: updatedItem, error: updateError } = await supabase
      .rpc('update_item_quantity_atomic', {
        item_id: itemId,
        quantity_change: quantityChange
      });

    if (updateError) throw updateError;

    if (updateError) throw updateError;

    // Log transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        item_id: itemId,
        transaction_type: 'adjustment',
        quantity: quantityChange,
        effective_date: new Date().toISOString(),
        notes: 'Manual quantity adjustment'
      });

    if (transactionError) throw transactionError;

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Purchase Management

#### `createPurchase(purchaseData: PurchaseFormData)`
**Purpose**: Create a new purchase with line items
**Location**: `src/app/actions/purchases.ts`
**Parameters**: PurchaseFormData object
**Returns**: Promise with success/error response

```typescript
'use server'

export async function createPurchase(purchaseData: PurchaseFormData) {
  try {
    const { data, error } = await supabase.rpc('create_purchase_with_line_items', {
      purchase_data: {
        supplier_id: purchaseData.supplierId,
        purchase_date: purchaseData.purchaseDate,
        effective_date: purchaseData.effectiveDate,
        grand_total: purchaseData.grandTotal,
        shipping: purchaseData.shipping,
        taxes: purchaseData.taxes,
        other_costs: purchaseData.otherCosts,
        notes: purchaseData.notes,
        is_draft: purchaseData.isDraft
      },
      line_items_data: purchaseData.lineItems
    });

    if (error) throw error;
    return { success: true, data };
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
'use server'

export async function createBatch(batchData: BatchFormData) {
  try {
    const { data, error } = await supabase.rpc('create_batch_with_consumption', {
      batch_data: {
        recipe_id: batchData.recipeId,
        effective_date: batchData.effectiveDate,
        qty_made: batchData.qtyMade,
        material_cost: batchData.materialCost,
        labor_cost: batchData.laborCost,
        actual_cost: batchData.actualCost,
        notes: batchData.notes
      },
      consumption_data: batchData.consumption
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 📊 **Data Fetching (TanStack Query)**

### Items Queries

#### `useItems()`
**Purpose**: Fetch all items with filtering and search
**Location**: `src/hooks/use-items.ts`
**Parameters**: Optional filters and search terms
**Returns**: Query result with items data

```typescript
export function useItems(filters?: ItemFilters) {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: async () => {
      let query = supabase
        .from('items')
        .select('*')
        .eq('is_archived', false);

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
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
        threshold: limit
      });
      if (error) throw error;
      return data;
    }
  });
}
```

## 🔐 **Authentication & Authorization**

### Row Level Security (RLS) Policies

#### Items Table Policy
```sql
CREATE POLICY "Users can view their own items" ON items
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" ON items
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" ON items
FOR UPDATE USING (auth.uid() = user_id);
```

#### Purchases Table Policy
```sql
CREATE POLICY "Users can view their own purchases" ON purchases
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON purchases
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 📝 **Error Handling**

### Standard Error Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `DATABASE_ERROR`: Database operation failed
- `NETWORK_ERROR`: Network connectivity issue

## 🚀 **Performance Considerations**

### Database Indexes
```sql
-- Items table indexes
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_archived ON items(is_archived);

-- Transactions table indexes
CREATE INDEX idx_transactions_item_id ON transactions(item_id);
CREATE INDEX idx_transactions_date ON transactions(effective_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);

-- Purchases table indexes
CREATE INDEX idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX idx_purchases_date ON purchases(purchase_date);
CREATE INDEX idx_purchases_draft ON purchases(is_draft);
```

### Caching Strategy
- **TanStack Query**: Automatic caching with 5-minute stale time
- **Server Components**: Static generation where possible
- **Database**: Query result caching for frequently accessed data

---

*For detailed database schema, see [data-model.md](./data-model.md). For technical specifications, see [technical-design.md](./technical-design.md).* 