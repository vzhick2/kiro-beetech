-- Disable forecasting system until real usage data is available
-- Archive the forecasting table and functions to prevent confusion

-- Rename forecasting table to indicate it's archived
ALTER TABLE forecasting_data RENAME TO forecasting_data_archived;

-- Add comment explaining why it's disabled
COMMENT ON TABLE forecasting_data_archived IS 'DISABLED: Forecasting system archived until sufficient usage data (6+ months) is available. Focus on manual reorder points for now.';

-- Create simple reorder alerts view instead
CREATE OR REPLACE VIEW reorder_alerts AS
SELECT 
  i.itemid,
  i.name,
  i.sku,
  i.currentquantity,
  i.reorderpoint,
  i.leadtimedays,
  s.name as primary_supplier_name,
  CASE 
    WHEN i.currentquantity <= 0 THEN 'CRITICAL_OUT_OF_STOCK'
    WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN 'BELOW_REORDER_POINT'
    WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= (i.reorderpoint * 1.2) THEN 'APPROACHING_REORDER'
    ELSE 'SUFFICIENT_STOCK'
  END as alert_level,
  CASE 
    WHEN i.currentquantity <= 0 THEN i.reorderpoint - i.currentquantity
    WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN i.reorderpoint - i.currentquantity
    ELSE 0
  END as suggested_order_quantity
FROM items i
LEFT JOIN suppliers s ON i.primarysupplierid = s.supplierid
WHERE i.isarchived = false
  AND (
    i.currentquantity <= 0 
    OR (i.reorderpoint IS NOT NULL AND i.currentquantity <= (i.reorderpoint * 1.2))
  )
ORDER BY 
  CASE 
    WHEN i.currentquantity <= 0 THEN 1
    WHEN i.reorderpoint IS NOT NULL AND i.currentquantity <= i.reorderpoint THEN 2
    ELSE 3
  END,
  i.currentquantity ASC;

-- Grant access to the simplified view
GRANT SELECT ON reorder_alerts TO authenticated;

-- Add note about what to do when ready for forecasting
COMMENT ON VIEW reorder_alerts IS 'Simple reorder alerts based on manual reorder points. When ready for forecasting: 1) Collect 6+ months usage data, 2) Implement demand calculation, 3) Re-enable forecasting_data table.';