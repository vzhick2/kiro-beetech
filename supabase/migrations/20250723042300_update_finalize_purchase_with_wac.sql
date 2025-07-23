-- Update finalize_draft_purchase to include WAC calculation
CREATE OR REPLACE FUNCTION finalize_draft_purchase(purchase_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
      -- Calculate new WAC before updating inventory
      SELECT calculate_weighted_average_cost(
        line_item.itemid,
        line_item.quantity,
        line_item.unitcost
      ) INTO new_wac;
      
      -- Update inventory quantity atomically
      SELECT new_quantity INTO new_quantity
      FROM update_item_quantity_atomic(line_item.itemid, line_item.quantity);
      
      -- Update WAC in items table
      UPDATE items 
      SET weightedaveragecost = new_wac, updated_at = NOW()
      WHERE itemid = line_item.itemid;
      
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
        'Purchase finalized: ' || purchase_record.displayid || ' (WAC updated to ' || new_wac || ')'
      ) RETURNING transactionid INTO transaction_id;
      
    END LOOP;
    
    -- Return success result
    result := json_build_object(
      'success', true,
      'purchase_id', purchase_id,
      'message', 'Purchase finalized successfully with WAC calculations'
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
$function$;