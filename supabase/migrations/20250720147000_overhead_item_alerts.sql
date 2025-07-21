-- Simple overhead item tracking for non-exact quantities
-- For items like labels, packaging, office supplies where you want alerts but not precise tracking

-- Function to create overhead items with simple low-stock alerts
CREATE OR REPLACE FUNCTION setup_overhead_item(
  p_name TEXT,
  p_sku TEXT,
  p_reorder_level INTEGER DEFAULT 1,
  p_alert_description TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_item_id UUID;
BEGIN
  INSERT INTO items (
    name,
    sku,
    type,
    currentquantity,
    reorderpoint,
    inventoryunit,
    description,
    isarchived
  ) VALUES (
    p_name,
    p_sku,
    'overhead',
    NULL, -- Don't track exact quantities
    p_reorder_level,
    'each',
    p_alert_description,
    false
  ) RETURNING itemid INTO v_item_id;
  
  RETURN v_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced cycle count alerts to handle overhead items differently  
CREATE OR REPLACE FUNCTION get_overhead_alerts()
RETURNS TABLE(
  itemid UUID,
  sku TEXT,
  name TEXT,
  description TEXT,
  reorderpoint NUMERIC,
  alert_type TEXT,
  days_since_purchase INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.description,
    i.reorderpoint,
    'OVERHEAD_REORDER_NEEDED' as alert_type,
    -- Calculate days since last purchase of this item
    COALESCE(
      EXTRACT(EPOCH FROM (CURRENT_DATE - MAX(p.purchasedate)))::INTEGER / (24 * 60 * 60),
      365
    ) as days_since_purchase
  FROM items i
  LEFT JOIN purchase_line_items pli ON i.itemid = pli.itemid
  LEFT JOIN purchases p ON pli.purchaseid = p.purchaseid AND NOT p.isdraft
  WHERE i.type = 'overhead'
    AND i.isarchived = false
    AND (
      -- No recent purchases (>30 days) OR explicitly marked for reorder
      COALESCE(MAX(p.purchasedate), CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '30 days'
      OR i.reorderpoint = 1 -- Manual flag for "check this item"
    )
  GROUP BY i.itemid, i.sku, i.name, i.description, i.reorderpoint
  ORDER BY MAX(COALESCE(p.purchasedate, CURRENT_DATE - INTERVAL '365 days')) ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION setup_overhead_item(TEXT, TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_overhead_alerts() TO authenticated;

-- Add comments
COMMENT ON FUNCTION setup_overhead_item IS 'Creates overhead items like labels, packaging materials that need alerts but not exact quantity tracking';
COMMENT ON FUNCTION get_overhead_alerts IS 'Returns alerts for overhead items based on purchase history rather than inventory levels';