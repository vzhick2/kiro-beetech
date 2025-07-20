-- Function to calculate weighted average cost
CREATE OR REPLACE FUNCTION calculate_wac(item_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  result NUMERIC;
BEGIN
  SELECT
    SUM(quantity * unitcost) / SUM(quantity)
  INTO result
  FROM purchase_line_items pli
  JOIN purchases p ON pli.purchaseid = p.purchaseid
  WHERE pli.itemid = item_id
    AND p.isdraft = false;

  IF result IS NULL THEN
    RAISE WARNING 'NO_HISTORY: No purchase history found for item %', item_id;
    RETURN 0;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql;