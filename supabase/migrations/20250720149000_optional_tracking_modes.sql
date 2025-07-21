-- Optional tracking system: Let users choose detail level per item type
-- Some items get full tracking, others get simplified cost-only tracking

-- Add tracking preference to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS tracking_mode TEXT DEFAULT 'full' CHECK (tracking_mode IN ('full', 'cost_only', 'estimate'));

-- Function to setup items with different tracking modes
CREATE OR REPLACE FUNCTION setup_item_tracking(
  p_item_name TEXT,
  p_sku TEXT,
  p_item_type item_type,
  p_tracking_mode TEXT DEFAULT 'full',
  p_cost_per_unit NUMERIC DEFAULT NULL,
  p_reorder_threshold INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_item_id UUID;
BEGIN
  INSERT INTO items (
    name,
    sku,
    type,
    tracking_mode,
    currentquantity,
    reorderpoint,
    inventoryunit,
    isarchived
  ) VALUES (
    p_item_name,
    p_sku,
    p_item_type,
    p_tracking_mode,
    CASE 
      WHEN p_tracking_mode = 'full' THEN 0
      WHEN p_tracking_mode = 'cost_only' THEN NULL
      WHEN p_tracking_mode = 'estimate' THEN NULL
    END,
    p_reorder_threshold,
    'each',
    false
  ) RETURNING itemid INTO v_item_id;
  
  -- For cost_only items, store the estimated cost per unit
  IF p_tracking_mode = 'cost_only' AND p_cost_per_unit IS NOT NULL THEN
    UPDATE items 
    SET weightedaveragecost = p_cost_per_unit,
        description = format('Cost-only tracking: ~$%.3f per unit', p_cost_per_unit)
    WHERE itemid = v_item_id;
  END IF;
  
  RETURN v_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced cycle count alerts that handle different tracking modes
CREATE OR REPLACE FUNCTION get_mixed_tracking_alerts()
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
  -- Full tracking items (traditional low stock alerts)
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.tracking_mode,
    'LOW_STOCK' as alert_type,
    format('%s is low: %s units remaining', i.name, i.currentquantity) as alert_message,
    CASE 
      WHEN i.currentquantity <= 0 THEN 3
      WHEN i.currentquantity <= i.reorderpoint THEN 2
      ELSE 1
    END as priority
  FROM items i
  WHERE i.tracking_mode = 'full'
    AND i.isarchived = false
    AND (i.currentquantity <= 0 OR (i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint))
  
  UNION ALL
  
  -- Cost-only items (time-based alerts)
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.tracking_mode,
    'CHECK_STOCK' as alert_type,
    format('Check %s supply (last purchased %s days ago)', 
           i.name, 
           EXTRACT(EPOCH FROM (CURRENT_DATE - COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days')))::INTEGER / (24 * 60 * 60)
    ) as alert_message,
    1 as priority
  FROM items i
  LEFT JOIN purchase_line_items pli ON i.itemid = pli.itemid
  LEFT JOIN purchases p ON pli.purchaseid = p.purchaseid AND NOT p.isdraft
  WHERE i.tracking_mode = 'cost_only'
    AND i.isarchived = false
    AND COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '45 days'
  GROUP BY i.itemid, i.sku, i.name, i.tracking_mode
  
  ORDER BY priority DESC, alert_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION setup_item_tracking(TEXT, TEXT, item_type, TEXT, NUMERIC, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mixed_tracking_alerts() TO authenticated;

-- Example usage comments
COMMENT ON FUNCTION setup_item_tracking IS 'Setup items with different tracking modes: full (exact quantities), cost_only (purchase history alerts), estimate (recipe estimation only)';

-- Usage examples:
-- Full tracking: setup_item_tracking('Shea Butter', 'SB-001', 'ingredient', 'full', NULL, 5);  
-- Cost only: setup_item_tracking('Cream Labels', 'CL-001', 'packaging', 'cost_only', 0.05, NULL);
-- Estimate only: setup_item_tracking('Small Labels', 'SL-001', 'packaging', 'estimate', 0.02, NULL);