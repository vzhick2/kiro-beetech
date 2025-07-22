-- Simple two-mode tracking system migration
-- Replaces the existing complex three-mode system with simplified approach

-- Update existing tracking_mode column to use only two modes
UPDATE items 
SET tracking_mode = CASE 
  WHEN tracking_mode = 'full' THEN 'fully_tracked'
  WHEN tracking_mode IN ('cost_only', 'estimate') THEN 'cost_added'
  ELSE 'fully_tracked'
END;

-- Update the constraint to only allow two modes
ALTER TABLE items 
DROP CONSTRAINT IF EXISTS items_tracking_mode_check;

ALTER TABLE items 
ADD CONSTRAINT items_tracking_mode_check 
CHECK (tracking_mode IN ('fully_tracked', 'cost_added'));

-- Update default value
ALTER TABLE items 
ALTER COLUMN tracking_mode SET DEFAULT 'fully_tracked';

-- Update function to use simplified two-mode system
DROP FUNCTION IF EXISTS get_mixed_tracking_alerts();

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
      WHEN i.currentquantity <= i.reorderpoint THEN 2
      ELSE 1
    END as priority
  FROM items i
  WHERE i.tracking_mode = 'fully_tracked'
    AND i.isarchived = false
    AND (i.currentquantity <= 0 OR (i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint))
  
  UNION ALL
  
  -- Cost-only items (time-based alerts)
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.tracking_mode,
    'CHECK_SUPPLY' as alert_type,
    format('Check %s supply (last purchased %s days ago)', 
           i.name, 
           EXTRACT(EPOCH FROM (CURRENT_DATE - COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days')))::INTEGER / (24 * 60 * 60)
    ) as alert_message,
    1 as priority
  FROM items i
  LEFT JOIN purchase_line_items pli ON i.itemid = pli.itemid
  LEFT JOIN purchases p ON pli.purchaseid = p.purchaseid AND NOT p.isdraft
  WHERE i.tracking_mode = 'cost_added'
    AND i.isarchived = false
    AND COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '45 days'
  GROUP BY i.itemid, i.sku, i.name, i.tracking_mode
  
  ORDER BY priority DESC, alert_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the complex setup function
DROP FUNCTION IF EXISTS setup_item_tracking(TEXT, TEXT, item_type, TEXT, NUMERIC, INTEGER);

-- Grant permissions for new function
GRANT EXECUTE ON FUNCTION get_two_mode_alerts() TO authenticated;

-- Add helpful comment
COMMENT ON COLUMN items.tracking_mode IS 'Simple two-mode system: fully_tracked = quantities + costs visible, cost_added = costs only, quantities hidden in UI';
