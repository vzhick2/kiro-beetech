-- Remove mode_changed_date field from items table
-- This simplifies the tracking mode system while keeping essential functionality

BEGIN;

-- Drop the mode_changed_date column if it exists
ALTER TABLE items DROP COLUMN IF EXISTS mode_changed_date;

-- Update the change_item_tracking_mode function to not use mode_changed_date
CREATE OR REPLACE FUNCTION change_item_tracking_mode(
  p_item_id UUID, 
  p_new_mode TEXT, 
  p_inventory_snapshot NUMERIC DEFAULT NULL,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSON AS $$
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
  
  -- Validate new mode value
  IF p_new_mode NOT IN ('fully_tracked', 'cost_added') THEN
    RAISE EXCEPTION 'Invalid tracking mode: %. Must be fully_tracked or cost_added', p_new_mode;
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
        updated_at = NOW()
    WHERE itemid = p_item_id;
    
  ELSIF p_new_mode = 'cost_added' THEN
    -- Switching TO cost added - preserve current quantity as snapshot
    UPDATE items 
    SET tracking_mode = p_new_mode,
        last_inventory_snapshot = v_current_quantity,
        updated_at = NOW()
    WHERE itemid = p_item_id;
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
$$ LANGUAGE plpgsql;

-- Add a comment to document the simplification
COMMENT ON FUNCTION change_item_tracking_mode IS 
'Changes item tracking mode without storing change timestamp. 
Uses simple mitigation: business process should document mode changes in notes or transaction logs when needed.';

COMMIT;
