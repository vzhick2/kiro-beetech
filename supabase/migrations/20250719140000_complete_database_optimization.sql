-- Migration: Complete Database Optimization
-- Date: 2025-07-19
-- Description: Fix all database functions and optimize for production use

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
-- 2. Improved WAC Calculation Function  
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
-- 3. Enhanced Finalize Draft Purchase Function
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
-- 4. Get Last Used Suppliers Function
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
-- 5. Get Low Stock Items Function
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
-- 6. Update Triggers for Automatic Timestamp Updates
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
-- 7. Grant Permissions for RPC Functions
-- =================================================================

GRANT EXECUTE ON FUNCTION get_cycle_count_alerts(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_wac(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_draft_purchase(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_last_used_suppliers(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_low_stock_items() TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;

-- =================================================================
-- 8. Test Critical Functions
-- =================================================================

SELECT 'Database optimization migration completed successfully!' as status;

-- Test the cycle count alerts function
SELECT 'Testing cycle count alerts...' as test_status;
SELECT * FROM get_cycle_count_alerts(3);

-- Test low stock items
SELECT 'Testing low stock items...' as test_status;
SELECT * FROM get_low_stock_items() LIMIT 3;
