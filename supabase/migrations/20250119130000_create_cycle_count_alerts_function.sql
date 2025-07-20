-- Create the get_cycle_count_alerts RPC function
-- This function returns cycle count alerts based on inventory levels and reorder points

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
    (COALESCE(EXTRACT(DAYS FROM (CURRENT_DATE - i.lastcounteddate)), 365) / 30.0) +
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