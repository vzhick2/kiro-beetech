-- Function to update item quantity atomically
CREATE OR REPLACE FUNCTION update_item_quantity_atomic(item_id UUID, quantity_change NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
  new_quantity NUMERIC;
BEGIN
  UPDATE items 
  SET currentquantity = currentquantity + quantity_change,
      updated_at = NOW()
  WHERE itemid = item_id
  RETURNING currentquantity INTO new_quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ITEM_NOT_FOUND: Item % not found', item_id;
  END IF;
  
  RETURN new_quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;