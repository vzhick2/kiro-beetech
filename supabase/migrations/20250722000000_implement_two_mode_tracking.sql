-- Two-mode tracking system: Fully Tracked + Cost Added
-- Simplifies the inventory management to two clear modes

-- Add tracking mode column to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS tracking_mode TEXT DEFAULT 'fully_tracked' 
CHECK (tracking_mode IN ('fully_tracked', 'cost_added'));

-- Add mode transition tracking columns
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS mode_changed_date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_inventory_snapshot NUMERIC;

-- Create enum type for better type safety (optional, can use TEXT constraint above)
-- Note: This is mainly for documentation, the CHECK constraint above handles validation

-- Function to handle mode transitions with validation
CREATE OR REPLACE FUNCTION change_item_tracking_mode(
  p_item_id UUID,
  p_new_mode TEXT,
  p_inventory_snapshot NUMERIC DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  v_current_mode TEXT;
  v_current_quantity NUMERIC;
  v_result JSON;
BEGIN
  -- Get current item state
  SELECT tracking_mode, currentquantity 
  INTO v_current_mode, v_current_quantity
  FROM items 
  WHERE itemid = p_item_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Item not found: %', p_item_id;
  END IF;
  
  -- Validate transition
  IF v_current_mode = p_new_mode THEN
    RAISE EXCEPTION 'Item is already in % mode', p_new_mode;
  END IF;
  
  -- Handle transition logic
  IF p_new_mode = 'fully_tracked' THEN
    -- Switching TO fully tracked - requires inventory snapshot
    IF p_inventory_snapshot IS NULL THEN
      RAISE EXCEPTION 'Inventory snapshot required when switching to fully tracked mode';
    END IF;
    
    UPDATE items 
    SET tracking_mode = p_new_mode,
        currentquantity = p_inventory_snapshot,
        last_inventory_snapshot = v_current_quantity,
        mode_changed_date = NOW()
    WHERE itemid = p_item_id;
    
  ELSIF p_new_mode = 'cost_added' THEN
    -- Switching TO cost added - preserve current quantity as snapshot
    UPDATE items 
    SET tracking_mode = p_new_mode,
        last_inventory_snapshot = v_current_quantity,
        mode_changed_date = NOW()
    WHERE itemid = p_item_id;
    
  ELSE
    RAISE EXCEPTION 'Invalid tracking mode: %', p_new_mode;
  END IF;
  
  -- Return success result
  v_result := json_build_object(
    'success', true,
    'item_id', p_item_id,
    'old_mode', v_current_mode,
    'new_mode', p_new_mode,
    'snapshot_taken', p_inventory_snapshot,
    'reason', p_reason
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get two-mode tracking alerts
CREATE OR REPLACE FUNCTION get_two_mode_alerts()
RETURNS TABLE(
  itemid UUID,
  sku TEXT,
  name TEXT,
  tracking_mode TEXT,
  alert_type TEXT,
  alert_message TEXT,
  priority INTEGER
) AS $$
BEGIN
  RETURN QUERY
  -- Fully tracked items (traditional low stock alerts)
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.tracking_mode,
    'LOW_STOCK' as alert_type,
    format('%s is low: %s units remaining', i.name, i.currentquantity) as alert_message,
    CASE 
      WHEN i.currentquantity <= 0 THEN 3
      WHEN i.currentquantity <= COALESCE(i.reorderpoint, 0) THEN 2
      ELSE 1
    END as priority
  FROM items i
  WHERE i.tracking_mode = 'fully_tracked'
    AND i.isarchived = false
    AND (i.currentquantity <= 0 OR (i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint))
  
  UNION ALL
  
  -- Cost-added items (cost review alerts)
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.tracking_mode,
    'COST_REVIEW' as alert_type,
    format('Review %s cost (last purchased %s days ago)', 
           i.name, 
           EXTRACT(EPOCH FROM (CURRENT_DATE - COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days')))::INTEGER / (24 * 60 * 60)
    ) as alert_message,
    1 as priority
  FROM items i
  LEFT JOIN purchase_line_items pli ON i.itemid = pli.itemid
  LEFT JOIN purchases p ON pli.purchaseid = p.purchaseid AND NOT p.isdraft
  WHERE i.tracking_mode = 'cost_added'
    AND i.isarchived = false
    AND COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '90 days'
  GROUP BY i.itemid, i.sku, i.name, i.tracking_mode
  
  ORDER BY priority DESC, alert_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate recipe cost with two-mode support
CREATE OR REPLACE FUNCTION calculate_recipe_cost_two_mode(p_recipe_id UUID)
RETURNS JSON AS $$
DECLARE
  v_result JSON;
  v_total_cost NUMERIC := 0;
  v_warnings TEXT[] := ARRAY[]::TEXT[];
  v_cost_breakdown JSON[] := ARRAY[]::JSON[];
  v_can_proceed BOOLEAN := true;
  r RECORD;
BEGIN
  -- Get recipe ingredients with item tracking modes
  FOR r IN 
    SELECT 
      ri.quantity,
      i.itemid,
      i.name,
      i.sku,
      i.tracking_mode,
      i.weightedaveragecost,
      i.currentquantity
    FROM recipe_ingredients ri
    JOIN items i ON ri.itemid = i.itemid
    WHERE ri.recipeid = p_recipe_id
      AND i.isarchived = false
  LOOP
    DECLARE
      v_item_cost NUMERIC;
      v_breakdown JSON;
    BEGIN
      v_item_cost := r.quantity * r.weightedaveragecost;
      v_total_cost := v_total_cost + v_item_cost;
      
      -- Check availability for fully tracked items
      IF r.tracking_mode = 'fully_tracked' AND r.currentquantity < r.quantity THEN
        v_warnings := v_warnings || format('Insufficient %s: need %s, have %s', r.name, r.quantity, r.currentquantity);
        v_can_proceed := false;
      END IF;
      
      -- Build cost breakdown
      v_breakdown := json_build_object(
        'item_id', r.itemid,
        'name', r.name,
        'sku', r.sku,
        'tracking_mode', r.tracking_mode,
        'quantity', r.quantity,
        'unit_cost', r.weightedaveragecost,
        'total_cost', v_item_cost,
        'sufficient', CASE 
          WHEN r.tracking_mode = 'fully_tracked' THEN r.currentquantity >= r.quantity
          ELSE true  -- Cost-added items don't track quantity
        END
      );
      
      v_cost_breakdown := v_cost_breakdown || v_breakdown;
    END;
  END LOOP;
  
  -- Build final result
  v_result := json_build_object(
    'total_cost', v_total_cost,
    'cost_breakdown', v_cost_breakdown,
    'warnings', v_warnings,
    'can_proceed', v_can_proceed,
    'recipe_id', p_recipe_id
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION change_item_tracking_mode(UUID, TEXT, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_two_mode_alerts() TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_recipe_cost_two_mode(UUID) TO authenticated;

-- Add helpful comments
COMMENT ON FUNCTION change_item_tracking_mode IS 'Change item tracking mode with validation and transition handling';
COMMENT ON FUNCTION get_two_mode_alerts IS 'Get alerts for both tracking modes: LOW_STOCK for fully tracked, COST_REVIEW for cost added';
COMMENT ON FUNCTION calculate_recipe_cost_two_mode IS 'Calculate recipe cost with two-mode ingredient support';

-- Usage examples:
-- Change to fully tracked: SELECT change_item_tracking_mode('item-uuid', 'fully_tracked', 50.0, 'Increasing importance');
-- Change to cost added: SELECT change_item_tracking_mode('item-uuid', 'cost_added', NULL, 'Simplifying tracking');
-- Get alerts: SELECT * FROM get_two_mode_alerts();
-- Calculate recipe cost: SELECT calculate_recipe_cost_two_mode('recipe-uuid');
