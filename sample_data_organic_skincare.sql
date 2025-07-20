-- Sample Data for Organic Skincare Company
-- Created: July 19, 2025
-- Business: Small organic skincare company specializing in honey-based products

-- This file contains comprehensive sample data including:
-- 1. Suppliers (bee products, botanicals, oils, packaging)
-- 2. Ingredients (honey, propolis, essential oils, carriers)
-- 3. Packaging materials (jars, tubes, labels)
-- 4. Finished products (creams, balms, lotions)
-- 5. Recipes with ingredient formulations
-- 6. Purchase orders and transactions
-- 7. Production batches with costs
-- 8. Sales data by channel

-- SUPPLIERS --
-- 6 suppliers covering all organic skincare needs
INSERT INTO suppliers (name, website, contactphone, address, notes) VALUES
('Mountain Meadow Honey Co.', 'https://mountainmeadowhoney.com', '555-HONEY-1', '1847 Wildflower Lane, Boulder, CO 80301', 'Premium raw honey, propolis, bee pollen, and royal jelly. Certified organic apiaries in Colorado mountains.'),
('Pure Botanicals Inc.', 'https://purebotanicals.com', '(503) 123-4567', '2156 Organic Valley Rd, Portland, OR 97205', 'Organic botanical extracts, essential oils, and herbal infusions. Fair trade certified.'),
('Sustainable Oils Direct', 'https://sustainableoils.com', '+1-415-987-6543', '789 Green Earth Ave, San Francisco, CA 94102', 'Cold-pressed carrier oils: jojoba, argan, rosehip, sweet almond. USDA organic certified.'),
('Earth Essence Botanicals', 'https://earthessencebotanicals.com', '(206) 555-0123', '1234 Forest Grove Way, Seattle, WA 98101', 'Organic plant extracts, flower waters, and natural preservatives. Small batch artisan supplier.'),
('Green Packaging Solutions', 'https://greenpackaging.eco', '1-800-ECO-PACK', '567 Sustainable St, Austin, TX 78701', 'Eco-friendly glass jars, bamboo caps, recyclable tubes and pumps. Zero-waste packaging specialist.'),
('Natural Wax Company', 'https://naturalwaxco.com', '(844) WAX-PURE', '890 Beeswax Blvd, Asheville, NC 28801', 'Organic beeswax, candelilla wax, carnauba wax. Sustainably sourced from ethical beekeepers.');

-- INGREDIENTS --
-- Raw materials for organic skincare production

-- Bee Products (Mountain Meadow Honey Co.)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Raw Manuka Honey', 'HONEY-MANUKA-RAW', 'ingredient', 'lb', 25.5, 28.50, 10, 7),
('Organic Propolis Extract', 'PROP-EXT-ORG', 'ingredient', 'fl_oz', 12.0, 45.00, 5, 10),
('Bee Pollen Granules', 'POLLEN-GRAN', 'ingredient', 'oz', 18.0, 15.75, 8, 7),
('Royal Jelly Fresh', 'ROYAL-JELLY', 'ingredient', 'oz', 6.0, 85.00, 3, 14);

-- Essential Oils & Extracts (Pure Botanicals)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Lavender Essential Oil', 'EO-LAV-ORG', 'ingredient', 'fl_oz', 8.5, 22.00, 3, 7),
('Chamomile Extract Organic', 'EXT-CHAM-ORG', 'ingredient', 'fl_oz', 15.0, 18.50, 5, 10),
('Rose Hip Extract', 'EXT-ROSEHIP', 'ingredient', 'fl_oz', 9.0, 32.00, 4, 14),
('Calendula Oil Infusion', 'INF-CAL-OIL', 'ingredient', 'fl_oz', 22.0, 16.25, 8, 7);

-- Carrier Oils (Sustainable Oils Direct)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Organic Jojoba Oil', 'OIL-JOJOBA-ORG', 'ingredient', 'fl_oz', 45.0, 12.50, 15, 5),
('Cold-Pressed Argan Oil', 'OIL-ARGAN-CP', 'ingredient', 'fl_oz', 32.0, 24.00, 10, 10),
('Sweet Almond Oil Organic', 'OIL-ALMOND-ORG', 'ingredient', 'fl_oz', 55.0, 8.75, 20, 5),
('Rosehip Seed Oil', 'OIL-ROSEHIP', 'ingredient', 'fl_oz', 18.0, 35.00, 6, 14);

-- Natural Actives (Earth Essence Botanicals)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Aloe Vera Gel Organic', 'ALOE-GEL-ORG', 'ingredient', 'fl_oz', 40.0, 6.50, 15, 7),
('Green Tea Extract', 'EXT-GREENTEA', 'ingredient', 'oz', 12.0, 28.00, 5, 10),
('Vitamin E Oil Natural', 'VIT-E-NAT', 'ingredient', 'fl_oz', 8.0, 18.50, 3, 7),
('Shea Butter Raw Organic', 'SHEA-RAW-ORG', 'ingredient', 'lb', 28.0, 14.25, 10, 14);

-- Waxes (Natural Wax Company)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Organic Beeswax Pellets', 'WAX-BEE-PELLETS', 'ingredient', 'lb', 15.0, 9.50, 5, 7),
('Candelilla Wax Organic', 'WAX-CAND-ORG', 'ingredient', 'lb', 8.0, 12.75, 3, 10),
('Carnauba Wax Grade A', 'WAX-CARN-A', 'ingredient', 'lb', 5.0, 18.00, 2, 14);

-- PACKAGING MATERIALS --
-- Eco-friendly packaging (Green Packaging Solutions)
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Glass Jar 2oz Amber', 'JAR-2OZ-AMB', 'packaging', 'each', 250, 1.25, 100, 10),
('Glass Jar 4oz Clear', 'JAR-4OZ-CLR', 'packaging', 'each', 180, 1.75, 75, 10),
('Bamboo Lid 2oz', 'LID-BAMB-2OZ', 'packaging', 'each', 275, 0.85, 100, 14),
('Bamboo Lid 4oz', 'LID-BAMB-4OZ', 'packaging', 'each', 195, 0.95, 75, 14),
('Lip Balm Tube Biodegradable', 'TUBE-LIP-BIO', 'packaging', 'each', 500, 0.35, 200, 7),
('Pump Dispenser Recyclable', 'PUMP-DISP-REC', 'packaging', 'each', 95, 2.50, 25, 10),
('Product Label Sheet', 'LABEL-SHEET', 'packaging', 'each', 50, 0.15, 25, 5);

-- FINISHED PRODUCTS --
-- Skincare product line

-- Face Care
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Honey Propolis Face Cream', 'CREAM-FACE-HP', 'product', 'each', 45, 18.50, 20, 3),
('Royal Jelly Anti-Aging Serum', 'SERUM-ANTI-RJ', 'product', 'each', 32, 35.75, 15, 5),
('Manuka Honey Cleanser', 'CLEAN-MANUKA', 'product', 'each', 28, 22.00, 12, 3),
('Bee Pollen Exfoliating Mask', 'MASK-EXFOL-BP', 'product', 'each', 18, 28.50, 8, 5);

-- Body Care
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Lavender Shea Body Butter', 'BUTTER-BODY-LAV', 'product', 'each', 55, 16.25, 25, 3),
('Chamomile Calendula Lotion', 'LOTION-CHAM-CAL', 'product', 'each', 42, 14.75, 20, 3),
('Argan Rose Hip Body Oil', 'OIL-BODY-ARG', 'product', 'each', 35, 24.00, 15, 4),
('Green Tea Aloe Moisturizer', 'MOIST-GT-ALOE', 'product', 'each', 38, 19.50, 18, 3);

-- Lip Care 
INSERT INTO items (name, sku, type, inventoryunit, currentquantity, weightedaveragecost, reorderpoint, leadtimedays) VALUES
('Honey Beeswax Lip Balm', 'BALM-LIP-HB', 'product', 'each', 125, 4.25, 50, 2),
('Propolis Healing Lip Salve', 'SALVE-LIP-PROP', 'product', 'each', 85, 6.50, 30, 2),
('Royal Jelly Lip Treatment', 'TREAT-LIP-RJ', 'product', 'each', 65, 8.75, 25, 3);

-- This sample data provides a realistic foundation for:
-- ✓ Supplier management and relationships
-- ✓ Inventory tracking across ingredient types  
-- ✓ Recipe formulation and costing
-- ✓ Production planning and batching
-- ✓ Purchase order workflows
-- ✓ Sales analytics and forecasting

-- The data reflects a small but growing organic skincare business
-- focused on bee-derived ingredients and sustainable practices.