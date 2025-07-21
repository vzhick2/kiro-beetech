-- Simplified approach: Remove confusing "overhead" item type
-- Focus on smart cost allocation for shipping/taxes only
-- Keep inventory tracking simple - track what matters for COGS

-- Remove the overhead item type we added (it was confusing)
-- Keep only: ingredient, packaging, product

-- Function to handle purchases with or without exact inventory tracking
CREATE OR REPLACE FUNCTION create_simple_purchase_workflow(
  p_supplier_id UUID,
  p_total_amount NUMERIC,
  p_shipping NUMERIC DEFAULT 0,
  p_tax NUMERIC DEFAULT 0,
  p_other_fees NUMERIC DEFAULT 0,
  p_office_supplies NUMERIC DEFAULT 0 -- Non-COGS amount
) RETURNS UUID AS $$
DECLARE
  v_purchase_id UUID;
  v_cogs_subtotal NUMERIC;
BEGIN
  -- Calculate COGS portion (total minus office supplies and fees)
  v_cogs_subtotal := p_total_amount - p_office_supplies - p_shipping - p_tax - p_other_fees;
  
  -- Create purchase record
  INSERT INTO purchases (
    supplierid,
    total,
    shipping_cost,
    tax_amount, 
    other_fees,
    non_inventory_total,
    subtotal_items,
    isdraft
  ) VALUES (
    p_supplier_id,
    p_total_amount,
    p_shipping,
    p_tax,
    p_other_fees,
    p_office_supplies,
    v_cogs_subtotal,
    true
  ) RETURNING purchaseid INTO v_purchase_id;
  
  RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple rule: Only track inventory for items that meaningfully impact COGS
-- Everything else goes to non_inventory_total

-- Function to check if an item should be inventory-tracked
CREATE OR REPLACE FUNCTION should_track_inventory(item_name TEXT, item_cost NUMERIC)
RETURNS BOOLEAN AS $$
BEGIN
  -- Simple heuristics for what to track:
  -- 1. High-value items (>$5 per unit)
  -- 2. Core ingredients (contain keywords)
  -- 3. Expensive packaging (>$0.50 per unit)
  
  RETURN (
    item_cost > 5.00 OR
    item_name ILIKE '%oil%' OR
    item_name ILIKE '%butter%' OR
    item_name ILIKE '%wax%' OR
    item_name ILIKE '%extract%' OR
    item_name ILIKE '%essential%' OR
    (item_name ILIKE '%jar%' AND item_cost > 0.50) OR
    (item_name ILIKE '%bottle%' AND item_cost > 0.50) OR
    (item_name ILIKE '%container%' AND item_cost > 0.50)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant permissions
GRANT EXECUTE ON FUNCTION create_simple_purchase_workflow(UUID, NUMERIC, NUMERIC, NUMERIC, NUMERIC, NUMERIC) TO authenticated;
GRANT EXECUTE ON FUNCTION should_track_inventory(TEXT, NUMERIC) TO authenticated;

-- Add comments
COMMENT ON FUNCTION create_simple_purchase_workflow IS 'Simplified purchase creation focusing on COGS vs non-COGS distinction';
COMMENT ON FUNCTION should_track_inventory IS 'Helper to decide if an item is worth tracking in inventory based on cost and type';