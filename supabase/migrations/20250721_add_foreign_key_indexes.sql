-- Add foreign key indexes for better query performance
-- Based on Supabase advisor recommendations

-- Add indexes for foreign key columns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_line_items_itemid ON purchase_line_items(itemid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchase_line_items_purchaseid ON purchase_line_items(purchaseid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_purchases_supplierid ON purchases(supplierid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipe_ingredients_itemid ON recipe_ingredients(itemid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipe_ingredients_recipeid ON recipe_ingredients(recipeid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_periods_itemid ON sales_periods(itemid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_batches_recipeid ON batches(recipeid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_itemid ON transactions(itemid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_forecasting_data_itemid ON forecasting_data(itemid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_batch_templates_recipeid ON batch_templates(recipeid);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_items_primarysupplierid ON items(primarysupplierid);

DROP INDEX CONCURRENTLY IF EXISTS idx_items_category;
DROP INDEX CONCURRENTLY IF EXISTS idx_suppliers_created_at;
<<<<<<< HEAD
DROP INDEX CONCURRENTLY IF EXISTS idx_purchases_created_at_status;
=======
DROP INDEX CONCURRENTLY IF EXISTS idx_purchases_created_at_status;
>>>>>>> 3cf6b52c0e60e6f2edfef63f54d65e75e46550dc
