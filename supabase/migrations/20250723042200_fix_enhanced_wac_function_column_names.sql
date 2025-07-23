-- Fix column names in the enhanced WAC function
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
  -- Get current inventory state (using correct column names)
  SELECT currentquantity, weightedaveragecost
  INTO v_current_quantity, v_current_wac
  FROM items
  WHERE itemid = p_item_id;

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