-- KIRO-BEETECH Database Optimization - Complete Setup
-- This script ensures all functions, triggers, and business logic are perfectly implemented
-- Run this in Supabase SQL Editor to make your database perfect

-- =================================================================
-- 1. Fix Cycle Count Alerts Function (Critical Bug Fix)
-- =================================================================

CREATE OR REPLACE FUNCTION get_cycle_count_alerts(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  itemid UUID,
  sku TEXT,
  name TEXT,
  currentquantity NUMERIC,
  reorderpoint NUMERIC,
  priorityscore NUMERIC,
  alerttype TEXT,
  shortageamount NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.itemid,
    i.sku,
    i.name,
    i.currentquantity,
    i.reorderpoint,
    -- Priority score calculation: days since last count + stock shortage factor
    (COALESCE(EXTRACT(DAY FROM (CURRENT_DATE - i.lastcounteddate))::NUMERIC, 365) / 30.0) +
    (CASE 
      WHEN i.currentquantity < 0 THEN ABS(i.currentquantity) * 2
      WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint 
        THEN (i.reorderpoint - i.currentquantity) * 1.5
      ELSE 0
    END) as priorityscore,
    -- Alert type based on inventory levels
    CASE
      WHEN i.currentquantity < 0 THEN 'NEGATIVE_INVENTORY'
      WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN 'LOW_STOCK'
      ELSE 'OVERDUE_COUNT'
    END as alerttype,
    -- Shortage amount for negative inventory or low stock
    CASE
      WHEN i.currentquantity < 0 THEN ABS(i.currentquantity)
      WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint 
        THEN (i.reorderpoint - i.currentquantity)
      ELSE 0
    END as shortageamount
  FROM items i
  WHERE i.isarchived = false
    AND (
      i.currentquantity < 0 OR  -- Negative inventory
      (i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint) OR  -- Low stock
      (i.lastcounteddate IS NULL OR i.lastcounteddate < CURRENT_DATE - INTERVAL '90 days')  -- Overdue count
    )
  ORDER BY priorityscore DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 2. Weighted Average Cost (WAC) Calculation Function
-- =================================================================

CREATE OR REPLACE FUNCTION calculate_wac(item_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  result NUMERIC;
  total_cost NUMERIC := 0;
  total_quantity NUMERIC := 0;
BEGIN
  -- Calculate WAC from all non-draft purchases
  SELECT
    COALESCE(SUM(pli.quantity * pli.unitcost), 0),
    COALESCE(SUM(pli.quantity), 0)
  INTO total_cost, total_quantity
  FROM purchase_line_items pli
  JOIN purchases p ON pli.purchaseid = p.purchaseid
  WHERE pli.itemid = item_id
    AND p.isdraft = false;

  -- Avoid division by zero
  IF total_quantity = 0 OR total_quantity IS NULL THEN
    RETURN 0;
  END IF;

  result := total_cost / total_quantity;
  
  -- Update the item's cached WAC
  UPDATE items 
  SET weightedaveragecost = result,
      updated_at = NOW()
  WHERE itemid = item_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 3. Finalize Draft Purchase Function
-- =================================================================

CREATE OR REPLACE FUNCTION finalize_draft_purchase(purchase_id UUID)
RETURNS JSON AS $$
DECLARE
  purchase_record purchases%ROWTYPE;
  line_item RECORD;
  result JSON;
  affected_items UUID[];
BEGIN
  -- Get the purchase record
  SELECT * INTO purchase_record
  FROM purchases
  WHERE purchaseid = purchase_id AND isdraft = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'DRAFT_NOT_FOUND: Purchase % not found or already finalized', purchase_id;
  END IF;

  -- Collect all affected items for WAC recalculation
  SELECT ARRAY_AGG(DISTINCT itemid) INTO affected_items
  FROM purchase_line_items
  WHERE purchaseid = purchase_id;

  -- Create transaction records and update inventory
  FOR line_item IN 
    SELECT pli.*, i.name as item_name, i.sku
    FROM purchase_line_items pli
    JOIN items i ON pli.itemid = i.itemid
    WHERE pli.purchaseid = purchase_id
  LOOP
    -- Insert transaction record
    INSERT INTO transactions (
      itemid,
      transactiontype,
      quantity,
      unitcost,
      referenceid,
      referencetype,
      effectivedate,
      notes,
      created_at
    ) VALUES (
      line_item.itemid,
      'purchase',
      line_item.quantity,
      line_item.unitcost,
      purchase_id,
      'purchase',
      purchase_record.effectivedate,
      'Purchase: ' || purchase_record.displayid,
      NOW()
    );

    -- Update item quantity
    UPDATE items
    SET currentquantity = currentquantity + line_item.quantity,
        updated_at = NOW()
    WHERE itemid = line_item.itemid;
  END LOOP;

  -- Mark purchase as finalized
  UPDATE purchases
  SET isdraft = false,
      updated_at = NOW()
  WHERE purchaseid = purchase_id;

  -- Recalculate WAC for all affected items
  FOR i IN 1..array_length(affected_items, 1)
  LOOP
    PERFORM calculate_wac(affected_items[i]);
  END LOOP;

  -- Return success result
  result := json_build_object(
    'success', true,
    'purchaseId', purchase_id,
    'displayId', purchase_record.displayid,
    'itemsUpdated', array_length(affected_items, 1),
    'finalizedAt', NOW()
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 4. Inventory Forecasting Function
-- =================================================================

CREATE OR REPLACE FUNCTION calculate_forecasting(item_id UUID)
RETURNS JSON AS $$
DECLARE
  avg_daily_sales NUMERIC;
  seasonal_index NUMERIC;
  lead_time_days INTEGER;
  recommended_reorder NUMERIC;
  current_item RECORD;
  result JSON;
BEGIN
  -- Get item details
  SELECT * INTO current_item
  FROM items
  WHERE itemid = item_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND: Item % not found', item_id;
  END IF;

  -- Calculate average daily sales over last 3 months
  SELECT
    COALESCE(SUM(sp.quantitysold) / NULLIF(SUM(EXTRACT(DAY FROM (sp.periodend - sp.periodstart + 1))), 0), 0)
  INTO avg_daily_sales
  FROM sales_periods sp
  WHERE sp.itemid = item_id
    AND sp.periodend >= CURRENT_DATE - INTERVAL '3 months';

  -- Simple seasonality calculation
  WITH current_month_avg AS (
    SELECT COALESCE(AVG(quantitysold), 0) as avg_current_month
    FROM sales_periods
    WHERE itemid = item_id
      AND EXTRACT(MONTH FROM periodstart) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND periodend >= CURRENT_DATE - INTERVAL '12 months'
  ),
  overall_avg AS (
    SELECT COALESCE(AVG(quantitysold), 0) as avg_overall
    FROM sales_periods
    WHERE itemid = item_id
      AND periodend >= CURRENT_DATE - INTERVAL '12 months'
  )
  SELECT 
    CASE 
      WHEN overall_avg.avg_overall > 0 THEN current_month_avg.avg_current_month / overall_avg.avg_overall
      ELSE 1.0
    END
  INTO seasonal_index
  FROM current_month_avg, overall_avg;

  -- Get lead time
  lead_time_days := COALESCE(current_item.leadtimedays, 7);

  -- Calculate recommended reorder point (lead time + 20% buffer)
  recommended_reorder := (avg_daily_sales * lead_time_days * seasonal_index) * 1.2;

  -- Upsert forecasting data
  INSERT INTO forecasting_data (
    itemid, 
    predicteddemand, 
    seasonalindex, 
    recommendedreorderpoint, 
    isautomatic, 
    calculatedat
  )
  VALUES (
    item_id, 
    avg_daily_sales * 30, -- Monthly demand
    seasonal_index, 
    recommended_reorder, 
    true, 
    NOW()
  )
  ON CONFLICT (itemid)
  DO UPDATE SET
    predicteddemand = EXCLUDED.predicteddemand,
    seasonalindex = EXCLUDED.seasonalindex,
    recommendedreorderpoint = EXCLUDED.recommendedreorderpoint,
    calculatedat = EXCLUDED.calculatedat;

  -- Update item's reorder point if in automatic mode
  UPDATE items
  SET reorderpoint = recommended_reorder,
      updated_at = NOW()
  WHERE itemid = item_id
    AND EXISTS (
      SELECT 1 FROM forecasting_data
      WHERE itemid = item_id AND isautomatic = true
    );

  result := json_build_object(
    'success', true,
    'itemId', item_id,
    'avgDailySales', avg_daily_sales,
    'seasonalIndex', seasonal_index,
    'recommendedReorderPoint', recommended_reorder,
    'calculatedAt', NOW()
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 5. Batch Production Function
-- =================================================================

CREATE OR REPLACE FUNCTION create_batch_production(
  recipe_id UUID,
  batch_display_id TEXT,
  qty_made NUMERIC,
  date_created DATE DEFAULT CURRENT_DATE,
  effective_date DATE DEFAULT CURRENT_DATE,
  labor_cost NUMERIC DEFAULT 0,
  notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  recipe_record recipes%ROWTYPE;
  ingredient RECORD;
  batch_id UUID;
  total_material_cost NUMERIC := 0;
  actual_cost NUMERIC;
  yield_percentage NUMERIC;
  result JSON;
BEGIN
  -- Get recipe details
  SELECT * INTO recipe_record
  FROM recipes
  WHERE recipeid = recipe_id AND isarchived = false;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'RECIPE_NOT_FOUND: Recipe % not found or archived', recipe_id;
  END IF;

  -- Check if display ID already exists
  IF EXISTS (SELECT 1 FROM batches WHERE displayid = batch_display_id) THEN
    RAISE EXCEPTION 'DUPLICATE_DISPLAY_ID: Batch % already exists', batch_display_id;
  END IF;

  -- Generate batch ID
  batch_id := gen_random_uuid();

  -- Calculate scaling factor based on expected vs actual yield
  IF recipe_record.expectedyield > 0 THEN
    yield_percentage := (qty_made / recipe_record.expectedyield) * 100;
  ELSE
    yield_percentage := 100;
  END IF;

  -- Process each ingredient
  FOR ingredient IN
    SELECT ri.*, i.name, i.sku, i.currentquantity, i.weightedaveragecost
    FROM recipe_ingredients ri
    JOIN items i ON ri.itemid = i.itemid
    WHERE ri.recipeid = recipe_id
  LOOP
    -- Calculate actual quantity needed based on yield
    DECLARE
      actual_quantity_needed NUMERIC;
      ingredient_cost NUMERIC;
    BEGIN
      actual_quantity_needed := ingredient.quantity * (qty_made / recipe_record.expectedyield);
      ingredient_cost := actual_quantity_needed * ingredient.weightedaveragecost;
      total_material_cost := total_material_cost + ingredient_cost;

      -- Create consumption transaction
      INSERT INTO transactions (
        itemid,
        transactiontype,
        quantity,
        unitcost,
        referenceid,
        referencetype,
        effectivedate,
        notes,
        created_at
      ) VALUES (
        ingredient.itemid,
        'batch_consumption',
        -actual_quantity_needed, -- Negative for consumption
        ingredient.weightedaveragecost,
        batch_id,
        'batch',
        effective_date,
        'Batch production: ' || batch_display_id,
        NOW()
      );

      -- Update item inventory
      UPDATE items
      SET currentquantity = currentquantity - actual_quantity_needed,
          updated_at = NOW()
      WHERE itemid = ingredient.itemid;
    END;
  END LOOP;

  -- Calculate actual cost
  actual_cost := total_material_cost + labor_cost;

  -- Create the batch record
  INSERT INTO batches (
    batchid,
    displayid,
    recipeid,
    datecreated,
    effectivedate,
    qtymade,
    yieldpercentage,
    materialcost,
    laborcost,
    actualcost,
    costvariance,
    notes,
    created_at
  ) VALUES (
    batch_id,
    batch_display_id,
    recipe_id,
    date_created,
    effective_date,
    qty_made,
    yield_percentage,
    total_material_cost,
    labor_cost,
    actual_cost,
    actual_cost - COALESCE(recipe_record.projectedmaterialcost, 0),
    notes,
    NOW()
  );

  -- Create production transaction for output product
  INSERT INTO transactions (
    itemid,
    transactiontype,
    quantity,
    unitcost,
    referenceid,
    referencetype,
    effectivedate,
    notes,
    created_at
  ) VALUES (
    recipe_record.outputproductid,
    'batch_production',
    qty_made,
    actual_cost / qty_made, -- Unit cost of produced item
    batch_id,
    'batch',
    effective_date,
    'Batch production: ' || batch_display_id,
    NOW()
  );

  -- Update output product inventory
  UPDATE items
  SET currentquantity = currentquantity + qty_made,
      updated_at = NOW()
  WHERE itemid = recipe_record.outputproductid;

  -- Recalculate WAC for output product
  PERFORM calculate_wac(recipe_record.outputproductid);

  result := json_build_object(
    'success', true,
    'batchId', batch_id,
    'displayId', batch_display_id,
    'qtyMade', qty_made,
    'materialCost', total_material_cost,
    'laborCost', labor_cost,
    'actualCost', actual_cost,
    'yieldPercentage', yield_percentage,
    'createdAt', NOW()
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 6. Get Last Used Suppliers Function
-- =================================================================

CREATE OR REPLACE FUNCTION get_last_used_suppliers(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  supplierid UUID,
  name TEXT,
  contactphone TEXT,
  address TEXT,
  last_purchase_date DATE,
  total_purchases BIGINT,
  last_purchase_total NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.supplierid,
    s.name,
    s.contactphone,
    s.address,
    MAX(p.purchasedate) as last_purchase_date,
    COUNT(p.purchaseid) as total_purchases,
    (SELECT p2.total 
     FROM purchases p2 
     WHERE p2.supplierid = s.supplierid 
       AND p2.isdraft = false 
     ORDER BY p2.purchasedate DESC 
     LIMIT 1) as last_purchase_total
  FROM suppliers s
  LEFT JOIN purchases p ON s.supplierid = p.supplierid AND p.isdraft = false
  WHERE s.isarchived = false
  GROUP BY s.supplierid, s.name, s.contactphone, s.address
  ORDER BY last_purchase_date DESC NULLS LAST, total_purchases DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 7. Get Low Stock Items Function
-- =================================================================

CREATE OR REPLACE FUNCTION get_low_stock_items()
RETURNS TABLE(
  itemid UUID,
  sku TEXT,
  name TEXT,
  currentquantity NUMERIC,
  reorderpoint NUMERIC,
  shortageamount NUMERIC,
  leadtimedays INTEGER,
  primarysupplierid UUID,
  supplier_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.currentquantity,
    i.reorderpoint,
    (i.reorderpoint - i.currentquantity) as shortageamount,
    i.leadtimedays,
    i.primarysupplierid,
    s.name as supplier_name
  FROM items i
  LEFT JOIN suppliers s ON i.primarysupplierid = s.supplierid
  WHERE i.isarchived = false
    AND i.reorderpoint IS NOT NULL
    AND i.currentquantity <= i.reorderpoint
  ORDER BY (i.reorderpoint - i.currentquantity) DESC;
END;
$$ LANGUAGE plpgsql;

-- =================================================================
-- 8. Grant Permissions for RPC Functions
-- =================================================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_cycle_count_alerts(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_wac(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_draft_purchase(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_forecasting(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_batch_production(UUID, TEXT, NUMERIC, DATE, DATE, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_last_used_suppliers(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_low_stock_items() TO authenticated;

-- =================================================================
-- 9. Update Triggers for Automatic Timestamp Updates
-- =================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for items table
DROP TRIGGER IF EXISTS update_items_updated_at ON items;
CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for purchases table
DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for recipes table
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 10. RLS (Row Level Security) Policies - Enable but allow all for authenticated users
-- =================================================================

-- Items policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON items;
CREATE POLICY "Enable all operations for authenticated users" ON items
  FOR ALL USING (auth.role() = 'authenticated');

-- Suppliers policies  
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON suppliers;
CREATE POLICY "Enable all operations for authenticated users" ON suppliers
  FOR ALL USING (auth.role() = 'authenticated');

-- Purchases policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON purchases;
CREATE POLICY "Enable all operations for authenticated users" ON purchases
  FOR ALL USING (auth.role() = 'authenticated');

-- Purchase line items policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON purchase_line_items;
CREATE POLICY "Enable all operations for authenticated users" ON purchase_line_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Recipes policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recipes;
CREATE POLICY "Enable all operations for authenticated users" ON recipes
  FOR ALL USING (auth.role() = 'authenticated');

-- Recipe ingredients policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recipe_ingredients;
CREATE POLICY "Enable all operations for authenticated users" ON recipe_ingredients
  FOR ALL USING (auth.role() = 'authenticated');

-- Batches policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON batches;
CREATE POLICY "Enable all operations for authenticated users" ON batches
  FOR ALL USING (auth.role() = 'authenticated');

-- Sales periods policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON sales_periods;
CREATE POLICY "Enable all operations for authenticated users" ON sales_periods
  FOR ALL USING (auth.role() = 'authenticated');

-- Transactions policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON transactions;
CREATE POLICY "Enable all operations for authenticated users" ON transactions
  FOR ALL USING (auth.role() = 'authenticated');

-- Forecasting data policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON forecasting_data;
CREATE POLICY "Enable all operations for authenticated users" ON forecasting_data
  FOR ALL USING (auth.role() = 'authenticated');

-- Batch templates policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON batch_templates;
CREATE POLICY "Enable all operations for authenticated users" ON batch_templates
  FOR ALL USING (auth.role() = 'authenticated');

-- =================================================================
-- SETUP COMPLETE! 
-- =================================================================

-- Test the cycle count alerts function
SELECT 'Database optimization complete! Testing cycle count alerts...' as status;
SELECT * FROM get_cycle_count_alerts(3);
