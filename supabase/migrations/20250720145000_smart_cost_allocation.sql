-- Enhanced purchase system with smart cost allocation
-- Tracks base cost vs allocated overhead (shipping/taxes/fees) separately
-- Supports "overhead" item types that get allocated but don't track quantities

-- First, add overhead item type to existing enum
ALTER TYPE item_type ADD VALUE IF NOT EXISTS 'overhead';

-- Add columns to track cost breakdown in purchase_items
ALTER TABLE purchase_items 
ADD COLUMN IF NOT EXISTS base_unit_cost NUMERIC(10,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS allocated_overhead NUMERIC(10,4) DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_overhead_item BOOLEAN DEFAULT false;

-- Add purchase-level overhead tracking
ALTER TABLE purchases
ADD COLUMN IF NOT EXISTS subtotal_items NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_fees NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS non_inventory_total NUMERIC(10,2) DEFAULT 0;

-- Function to calculate smart proportional allocation
CREATE OR REPLACE FUNCTION calculate_smart_allocation(
  p_purchase_id UUID
) RETURNS TABLE(
  item_id UUID,
  base_cost NUMERIC,
  allocated_overhead NUMERIC,
  final_unit_cost NUMERIC
) AS $$
DECLARE
  v_purchase RECORD;
  v_inventory_subtotal NUMERIC := 0;
  v_total_overhead NUMERIC := 0;
  v_allocation_ratio NUMERIC;
BEGIN
  -- Get purchase details
  SELECT * INTO v_purchase 
  FROM purchases p 
  WHERE p.purchaseid = p_purchase_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Purchase not found: %', p_purchase_id;
  END IF;
  
  -- Calculate total overhead (shipping + tax + fees)
  v_total_overhead := COALESCE(v_purchase.shipping_cost, 0) + 
                      COALESCE(v_purchase.tax_amount, 0) + 
                      COALESCE(v_purchase.other_fees, 0);
  
  -- Calculate inventory items subtotal (excludes overhead items and non-inventory)
  SELECT COALESCE(SUM(pi.quantity * pi.base_unit_cost), 0)
  INTO v_inventory_subtotal
  FROM purchase_items pi
  JOIN items i ON pi.itemid = i.itemid
  WHERE pi.purchaseid = p_purchase_id
    AND NOT pi.is_overhead_item
    AND i.type IN ('ingredient', 'packaging', 'product');
  
  -- If no inventory items, return empty
  IF v_inventory_subtotal = 0 THEN
    RETURN;
  END IF;
  
  -- Calculate allocation ratio (overhead / inventory subtotal)
  v_allocation_ratio := CASE 
    WHEN v_inventory_subtotal > 0 THEN v_total_overhead / v_inventory_subtotal
    ELSE 0
  END;
  
  -- Return allocated costs for each inventory item
  RETURN QUERY
  SELECT 
    pi.itemid,
    pi.base_unit_cost,
    (pi.base_unit_cost * v_allocation_ratio)::NUMERIC(10,4) as allocated_overhead,
    (pi.base_unit_cost * (1 + v_allocation_ratio))::NUMERIC(10,4) as final_unit_cost
  FROM purchase_items pi
  JOIN items i ON pi.itemid = i.itemid  
  WHERE pi.purchaseid = p_purchase_id
    AND NOT pi.is_overhead_item
    AND i.type IN ('ingredient', 'packaging', 'product');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finalize purchase with smart allocation
CREATE OR REPLACE FUNCTION finalize_purchase_with_smart_allocation(
  p_purchase_id UUID
) RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  updated_items INTEGER
) AS $$
DECLARE
  v_purchase RECORD;
  v_allocation RECORD;
  v_updated_count INTEGER := 0;
  v_total_calculated NUMERIC := 0;
  v_total_actual NUMERIC := 0;
  v_variance NUMERIC := 0;
BEGIN
  -- Get purchase
  SELECT * INTO v_purchase FROM purchases WHERE purchaseid = p_purchase_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Purchase not found', 0;
    RETURN;
  END IF;
  
  IF NOT v_purchase.isdraft THEN
    RETURN QUERY SELECT false, 'Purchase already finalized', 0;
    RETURN;
  END IF;
  
  -- Calculate and apply smart allocation
  FOR v_allocation IN 
    SELECT * FROM calculate_smart_allocation(p_purchase_id)
  LOOP
    -- Update purchase item with allocation breakdown
    UPDATE purchase_items 
    SET allocated_overhead = v_allocation.allocated_overhead,
        unitcost = v_allocation.final_unit_cost
    WHERE purchaseid = p_purchase_id AND itemid = v_allocation.item_id;
    
    -- Update item inventory and WAC
    PERFORM update_item_wac(
      v_allocation.item_id,
      (SELECT quantity FROM purchase_items WHERE purchaseid = p_purchase_id AND itemid = v_allocation.item_id),
      v_allocation.final_unit_cost
    );
    
    v_updated_count := v_updated_count + 1;
  END LOOP;
  
  -- Calculate variance check
  SELECT 
    COALESCE(SUM(pi.quantity * pi.unitcost), 0) +
    COALESCE(p.non_inventory_total, 0) +
    COALESCE(p.shipping_cost, 0) + 
    COALESCE(p.tax_amount, 0) +
    COALESCE(p.other_fees, 0),
    COALESCE(p.total, 0)
  INTO v_total_calculated, v_total_actual
  FROM purchases p
  LEFT JOIN purchase_items pi ON p.purchaseid = pi.purchaseid
  WHERE p.purchaseid = p_purchase_id
  GROUP BY p.purchaseid, p.total, p.non_inventory_total, p.shipping_cost, p.tax_amount, p.other_fees;
  
  v_variance := ABS(v_total_calculated - v_total_actual);
  
  -- Only finalize if variance is acceptable (< $0.50)
  IF v_variance < 0.50 THEN
    UPDATE purchases 
    SET isdraft = false,
        subtotal_items = (
          SELECT COALESCE(SUM(quantity * base_unit_cost), 0) 
          FROM purchase_items 
          WHERE purchaseid = p_purchase_id
        )
    WHERE purchaseid = p_purchase_id;
    
    RETURN QUERY SELECT true, 'Purchase finalized successfully', v_updated_count;
  ELSE
    RETURN QUERY SELECT false, 
      format('Total variance too high: $%.2f calculated vs $%.2f actual', v_total_calculated, v_total_actual), 
      v_updated_count;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_smart_allocation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_purchase_with_smart_allocation(UUID) TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION calculate_smart_allocation IS 'Calculates proportional allocation of shipping/taxes/fees to inventory items based on their base cost ratio';
COMMENT ON FUNCTION finalize_purchase_with_smart_allocation IS 'Finalizes purchase with smart cost allocation and variance checking. Tracks base cost vs allocated overhead separately.';