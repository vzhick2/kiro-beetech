-- Optimized function to get last used supplier for all items
CREATE OR REPLACE FUNCTION get_last_used_suppliers()
RETURNS TABLE (
  itemid UUID,
  supplier_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (pli.itemid) 
    pli.itemid,
    s.name as supplier_name
  FROM purchase_line_items pli
  JOIN purchases p ON pli.purchaseid = p.purchaseid
  JOIN suppliers s ON p.supplierid = s.supplierid
  WHERE p.isdraft = false
  ORDER BY pli.itemid, p.purchasedate DESC;
END;
$$ LANGUAGE plpgsql; 