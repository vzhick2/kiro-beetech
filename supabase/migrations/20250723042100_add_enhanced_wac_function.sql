-- Create enhanced WAC calculation function as documented
CREATE OR REPLACE FUNCTION calculate_weighted_average_cost(
  p_item_id UUID,
  p_new_quantity DECIMAL,
  p_new_unit_cost DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  v_current_quantity DECIMAL;
  v_current_wac DECIMAL;
  v_new_wac DECIMAL;
BEGIN
  -- Get current inventory state
  SELECT current_quantity, weighted_average_cost
  INTO v_current_quantity, v_current_wac
  FROM items
  WHERE item_id = p_item_id;

  -- Handle null values
  v_current_quantity := COALESCE(v_current_quantity, 0);
  v_current_wac := COALESCE(v_current_wac, 0);

  -- Calculate new WAC
  IF (v_current_quantity + p_new_quantity) > 0 THEN
    v_new_wac := (
      (v_current_quantity * v_current_wac) + 
      (p_new_quantity * p_new_unit_cost)
    ) / (v_current_quantity + p_new_quantity);
  ELSE
    v_new_wac := p_new_unit_cost;
  END IF;

  RETURN ROUND(v_new_wac, 4);
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION calculate_weighted_average_cost(UUID, DECIMAL, DECIMAL) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION calculate_weighted_average_cost(UUID, DECIMAL, DECIMAL) IS 
  'Calculates weighted average cost for an item when adding new inventory. 
   Used during purchase finalization to update WAC based on current inventory and new purchases.
   Returns the new WAC value rounded to 4 decimal places.';