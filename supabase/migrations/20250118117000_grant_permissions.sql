-- Grant execute permissions for update_item_quantity_atomic function
GRANT EXECUTE ON FUNCTION update_item_quantity_atomic(UUID, NUMERIC) TO authenticated;