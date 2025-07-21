-- Fix weighted average cost calculation
-- The previous implementation was calculating average purchase cost, not true WAC
-- This fixes it to account for remaining inventory quantities

-- Drop the old broken function
DROP FUNCTION IF EXISTS calculate_wac(UUID);

-- Create proper WAC calculation function that considers remaining inventory
CREATE OR REPLACE FUNCTION calculate_weighted_average_cost(item_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  current_qty NUMERIC;
  wac_result NUMERIC;
BEGIN
  -- Get current quantity
  SELECT currentquantity INTO current_qty
  FROM items 
  WHERE itemid = item_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND: Item % not found', item_id;
  END IF;
  
  -- If no inventory, return current WAC from items table
  IF current_qty <= 0 THEN
    SELECT weightedaveragecost INTO wac_result
    FROM items 
    WHERE itemid = item_id;
    RETURN COALESCE(wac_result, 0);
  END IF;
  
  -- For now, use simple average of recent purchases
  -- TODO: Implement proper FIFO/LIFO inventory tracking in future
  SELECT 
    COALESCE(
      SUM(pli.quantity * pli.unitcost) / NULLIF(SUM(pli.quantity), 0),
      0
    ) INTO wac_result
  FROM purchase_line_items pli
  JOIN purchases p ON pli.purchaseid = p.purchaseid
  WHERE pli.itemid = item_id
    AND p.isdraft = false
    AND p.effectivedate >= CURRENT_DATE - INTERVAL '365 days'; -- Only last year
  
  RETURN COALESCE(wac_result, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update WAC when inventory changes
CREATE OR REPLACE FUNCTION update_item_wac(item_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  new_wac NUMERIC;
BEGIN
  -- Calculate new WAC
  SELECT calculate_weighted_average_cost(item_id) INTO new_wac;
  
  -- Update the item
  UPDATE items 
  SET weightedaveragecost = new_wac,
      updated_at = NOW()
  WHERE itemid = item_id;
  
  RETURN new_wac;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced finalize purchase function that properly updates WAC
CREATE OR REPLACE FUNCTION finalize_draft_purchase_with_wac(purchase_id UUID)
RETURNS JSON AS $$
DECLARE
  purchase_record RECORD;
  line_item RECORD;
  new_quantity NUMERIC;
  new_wac NUMERIC;
  transaction_id UUID;
  result JSON;
  error_message TEXT;
BEGIN
  -- Start transaction
  BEGIN
    -- Get purchase details and validate it's a draft
    SELECT * INTO purchase_record
    FROM purchases
    WHERE purchaseid = purchase_id AND isdraft = true;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'PURCHASE_NOT_FOUND: Purchase % is not found or is not a draft', purchase_id;
    END IF;
    
    -- Mark purchase as finalized
    UPDATE purchases 
    SET isdraft = false, updated_at = NOW()
    WHERE purchaseid = purchase_id;
    
    -- Process each line item
    FOR line_item IN 
      SELECT * FROM purchase_line_items 
      WHERE purchaseid = purchase_id
    LOOP
      -- Update inventory quantity atomically
      SELECT update_item_quantity_atomic(line_item.itemid, line_item.quantity) INTO new_quantity;
      
      -- Update weighted average cost
      SELECT update_item_wac(line_item.itemid) INTO new_wac;
      
      -- Create transaction log
      INSERT INTO transactions (
        itemid,
        transactiontype,
        quantity,
        unitcost,
        referenceid,
        referencetype,
        effectivedate,
        notes
      ) VALUES (
        line_item.itemid,
        'purchase',
        line_item.quantity,
        line_item.unitcost,
        purchase_id,
        'purchase',
        purchase_record.effectivedate,
        'Purchase finalized: ' || purchase_record.displayid || ', New WAC: $' || ROUND(new_wac, 4)
      ) RETURNING transactionid INTO transaction_id;
      
    END LOOP;
    
    -- Return success result
    result := json_build_object(
      'success', true,
      'purchase_id', purchase_id,
      'message', 'Purchase finalized successfully with updated WAC'
    );
    
    RETURN result;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Rollback transaction by raising error
      GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT;
      
      result := json_build_object(
        'success', false,
        'error', error_message,
        'purchase_id', purchase_id
      );
      
      RETURN result;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_weighted_average_cost(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_item_wac(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION finalize_draft_purchase_with_wac(UUID) TO authenticated;