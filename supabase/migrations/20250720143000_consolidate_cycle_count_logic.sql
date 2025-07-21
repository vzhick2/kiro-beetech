-- Consolidate cycle count alert logic into a single function
-- Replace the dashboard hook's complex query with this standardized approach

CREATE OR REPLACE FUNCTION get_cycle_count_alerts_standardized(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(
  itemid UUID,
  sku TEXT,
  name TEXT,
  currentquantity NUMERIC,
  reorderpoint NUMERIC,
  lastcounteddate DATE,
  priorityscore NUMERIC,
  alerttype TEXT,
  shortageamount NUMERIC,
  days_since_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.itemid,
    i.sku,
    i.name,
    i.currentquantity,
    i.reorderpoint,
    i.lastcounteddate,
    -- Standardized priority calculation
    (
      COALESCE(
        LEAST(
          EXTRACT(EPOCH FROM (CURRENT_DATE - COALESCE(i.lastcounteddate, CURRENT_DATE - INTERVAL '365 days')))::NUMERIC / (30 * 24 * 60 * 60), 
          10
        ), 
        10
      ) +
      CASE 
        WHEN i.currentquantity <= 0 THEN 5
        WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN 3
        ELSE 1
      END
    )::NUMERIC as priorityscore,
    -- Standardized alert type
    CASE 
      WHEN i.currentquantity <= 0 THEN 'NEGATIVE_INVENTORY'
      WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN 'LOW_STOCK'
      WHEN COALESCE(i.lastcounteddate, CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '90 days' THEN 'OVERDUE_COUNT'
      ELSE 'REVIEW_NEEDED'
    END as alerttype,
    -- Shortage amount
    CASE 
      WHEN i.currentquantity <= 0 THEN ABS(i.currentquantity)
      WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN i.reorderpoint - i.currentquantity
      ELSE 0
    END::NUMERIC as shortageamount,
    -- Days since last count
    EXTRACT(EPOCH FROM (CURRENT_DATE - COALESCE(i.lastcounteddate, CURRENT_DATE - INTERVAL '365 days')))::INTEGER / (24 * 60 * 60) as days_since_count
  FROM items i
  WHERE i.isarchived = false
    AND (
      i.currentquantity <= 0 
      OR (i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint)
      OR COALESCE(i.lastcounteddate, CURRENT_DATE - INTERVAL '365 days') < CURRENT_DATE - INTERVAL '90 days'
    )
  ORDER BY priorityscore DESC, i.currentquantity ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access
GRANT EXECUTE ON FUNCTION get_cycle_count_alerts_standardized(INTEGER) TO authenticated;

-- Add comment explaining this is the single source of truth
COMMENT ON FUNCTION get_cycle_count_alerts_standardized IS 'SINGLE SOURCE OF TRUTH: Use this function for all cycle count alerts. Replaces duplicate logic in dashboard hooks and business utils.';