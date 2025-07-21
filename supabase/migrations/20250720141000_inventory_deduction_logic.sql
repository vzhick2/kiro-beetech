-- Inventory deduction logic for sales, consumption, and adjustments
-- This adds the missing outbound transaction types

-- Function to record inventory deduction (sales, consumption, adjustments)
CREATE OR REPLACE FUNCTION deduct_inventory(
  item_id UUID,
  quantity_to_deduct NUMERIC,
  transaction_type_param transaction_type,
  reference_id UUID DEFAULT NULL,
  reference_type TEXT DEFAULT NULL,
  effective_date DATE DEFAULT CURRENT_DATE,
  unit_cost NUMERIC DEFAULT NULL,
  notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  current_qty NUMERIC;
  new_quantity NUMERIC;
  item_name TEXT;
  item_sku TEXT;
  transaction_id UUID;
  result JSON;
  error_message TEXT;
BEGIN
  -- Validate transaction type is for deduction
  IF transaction_type_param NOT IN ('sale', 'adjustment', 'batch_consumption') THEN
    RAISE EXCEPTION 'INVALID_TRANSACTION_TYPE: % is not a deduction transaction type', transaction_type_param;
  END IF;

  -- Validate quantity is positive
  IF quantity_to_deduct <= 0 THEN
    RAISE EXCEPTION 'INVALID_QUANTITY: Deduction quantity must be positive, got %', quantity_to_deduct;
  END IF;

  BEGIN
    -- Get current item details
    SELECT currentquantity, name, sku INTO current_qty, item_name, item_sku
    FROM items 
    WHERE itemid = item_id AND isarchived = false;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'ITEM_NOT_FOUND: Active item % not found', item_id;
    END IF;
    
    -- Calculate new quantity (allow negative for tracking shortages)
    new_quantity := current_qty - quantity_to_deduct;
    
    -- Update inventory quantity
    UPDATE items 
    SET currentquantity = new_quantity,
        updated_at = NOW()
    WHERE itemid = item_id;
    
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
      item_id,
      transaction_type_param,
      -quantity_to_deduct, -- Negative for deductions
      unit_cost,
      reference_id,
      reference_type,
      effective_date,
      COALESCE(notes, transaction_type_param || ' deduction for ' || item_name || ' (' || item_sku || ')')
    ) RETURNING transactionid INTO transaction_id;
    
    -- Return success result with warning if inventory went negative
    result := json_build_object(
      'success', true,
      'transaction_id', transaction_id,
      'item_id', item_id,
      'previous_quantity', current_qty,
      'new_quantity', new_quantity,
      'deducted_quantity', quantity_to_deduct,
      'negative_inventory', new_quantity < 0,
      'message', 'Inventory deduction recorded successfully'
    );
    
    RETURN result;
    
  EXCEPTION
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT;
      
      result := json_build_object(
        'success', false,
        'error', error_message,
        'item_id', item_id
      );
      
      RETURN result;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process batch/recipe consumption
CREATE OR REPLACE FUNCTION consume_recipe_ingredients(
  recipe_id UUID,
  batch_quantity NUMERIC,
  batch_id UUID DEFAULT NULL,
  effective_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
  recipe_record RECORD;
  ingredient RECORD;
  consumption_result JSON;
  all_results JSON[] := '{}';
  total_consumed INTEGER := 0;
  result JSON;
  error_message TEXT;
BEGIN
  -- Get recipe details
  SELECT * INTO recipe_record
  FROM recipes 
  WHERE recipeid = recipe_id AND isarchived = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'RECIPE_NOT_FOUND: Active recipe % not found', recipe_id;
  END IF;
  
  -- Validate batch quantity
  IF batch_quantity <= 0 THEN
    RAISE EXCEPTION 'INVALID_BATCH_QUANTITY: Batch quantity must be positive, got %', batch_quantity;
  END IF;
  
  BEGIN
    -- Process each ingredient
    FOR ingredient IN 
      SELECT ri.*, i.name, i.sku, i.currentquantity
      FROM recipe_ingredients ri
      JOIN items i ON ri.itemid = i.itemid
      WHERE ri.recipeid = recipe_id
    LOOP
      -- Calculate scaled ingredient quantity needed
      DECLARE
        scaled_quantity NUMERIC;
      BEGIN
        scaled_quantity := ingredient.quantity * batch_quantity;
        
        -- Deduct ingredient inventory
        SELECT deduct_inventory(
          ingredient.itemid,
          scaled_quantity,
          'batch_consumption',
          batch_id,
          'batch',
          effective_date,
          NULL, -- Let system calculate cost
          'Recipe consumption: ' || recipe_record.name || ' (batch qty: ' || batch_quantity || ')'
        ) INTO consumption_result;
        
        -- Add to results array
        all_results := array_append(all_results, consumption_result);
        total_consumed := total_consumed + 1;
      END;
    END LOOP;
    
    -- Return success result
    result := json_build_object(
      'success', true,
      'recipe_id', recipe_id,
      'recipe_name', recipe_record.name,
      'batch_quantity', batch_quantity,
      'ingredients_consumed', total_consumed,
      'consumption_details', all_results,
      'message', 'Recipe ingredients consumed successfully'
    );
    
    RETURN result;
    
  EXCEPTION
    WHEN OTHERS THEN
      GET STACKED DIAGNOSTICS error_message = MESSAGE_TEXT;
      
      result := json_build_object(
        'success', false,
        'error', error_message,
        'recipe_id', recipe_id
      );
      
      RETURN result;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function for manual inventory adjustments
CREATE OR REPLACE FUNCTION adjust_inventory(
  item_id UUID,
  new_quantity NUMERIC,
  reason TEXT DEFAULT 'Manual adjustment',
  effective_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $$
DECLARE
  current_qty NUMERIC;
  quantity_change NUMERIC;
  adjustment_result JSON;
BEGIN
  -- Get current quantity
  SELECT currentquantity INTO current_qty
  FROM items 
  WHERE itemid = item_id AND isarchived = false;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND: Active item % not found', item_id;
  END IF;
  
  -- Calculate change
  quantity_change := new_quantity - current_qty;
  
  -- If no change, return early
  IF quantity_change = 0 THEN
    RETURN json_build_object(
      'success', true,
      'message', 'No adjustment needed - quantities match',
      'item_id', item_id,
      'quantity', current_qty
    );
  END IF;
  
  -- If positive change, it's an addition
  IF quantity_change > 0 THEN
    SELECT update_item_quantity_atomic(item_id, quantity_change);
    
    INSERT INTO transactions (
      itemid, transactiontype, quantity, effectivedate, notes
    ) VALUES (
      item_id, 'adjustment', quantity_change, effective_date, 
      'Positive adjustment: ' || reason
    );
  ELSE
    -- Negative change, use deduction function
    SELECT deduct_inventory(
      item_id,
      ABS(quantity_change),
      'adjustment',
      NULL,
      'adjustment',
      effective_date,
      NULL,
      'Negative adjustment: ' || reason
    ) INTO adjustment_result;
    
    RETURN adjustment_result;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'item_id', item_id,
    'previous_quantity', current_qty,
    'new_quantity', new_quantity,
    'adjustment_amount', quantity_change,
    'reason', reason,
    'message', 'Inventory adjustment completed successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION deduct_inventory(UUID, NUMERIC, transaction_type, UUID, TEXT, DATE, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION consume_recipe_ingredients(UUID, NUMERIC, UUID, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION adjust_inventory(UUID, NUMERIC, TEXT, DATE) TO authenticated;