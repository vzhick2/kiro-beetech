-- Initial database schema for KIRO-BEETECH inventory management system
-- This creates all the core tables and types needed for the application

-- Create custom types
CREATE TYPE item_type AS ENUM ('ingredient', 'packaging', 'product');
CREATE TYPE inventory_unit AS ENUM ('each', 'lb', 'oz', 'kg', 'g', 'gal', 'qt', 'pt', 'cup', 'fl_oz', 'ml', 'l');
CREATE TYPE transaction_type AS ENUM ('purchase', 'sale', 'adjustment', 'batch_consumption', 'batch_production');
CREATE TYPE sales_channel AS ENUM ('qbo', 'bigcommerce');
CREATE TYPE data_source AS ENUM ('manual', 'imported');

-- Suppliers table
CREATE TABLE suppliers (
  supplierid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contactphone TEXT,
  address TEXT,
  notes TEXT,
  isarchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table with inventory tracking
CREATE TABLE items (
  itemid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  type item_type NOT NULL,
  isarchived BOOLEAN DEFAULT FALSE,
  inventoryunit inventory_unit NOT NULL,
  currentquantity NUMERIC DEFAULT 0,
  weightedaveragecost NUMERIC DEFAULT 0,
  reorderpoint NUMERIC,
  lastcounteddate DATE,
  primarysupplierid UUID REFERENCES suppliers(supplierid),
  leadtimedays INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Purchases with draft support
CREATE TABLE purchases (
  purchaseid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayid TEXT UNIQUE NOT NULL,
  supplierid UUID REFERENCES suppliers(supplierid) NOT NULL,
  purchasedate DATE NOT NULL,
  effectivedate DATE NOT NULL,
  total NUMERIC NOT NULL,
  shipping NUMERIC DEFAULT 0,
  taxes NUMERIC DEFAULT 0,
  othercosts NUMERIC DEFAULT 0,
  notes TEXT,
  isdraft BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Purchase line items for cost allocation
CREATE TABLE purchase_line_items (
  lineitemid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaseid UUID REFERENCES purchases(purchaseid) NOT NULL,
  itemid UUID REFERENCES items(itemid) NOT NULL,
  quantity NUMERIC NOT NULL,
  unitcost NUMERIC NOT NULL,
  totalcost NUMERIC NOT NULL,
  notes TEXT
);

-- Recipes for production management
CREATE TABLE recipes (
  recipeid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  displayversion TEXT NOT NULL,
  outputproductid UUID REFERENCES items(itemid) NOT NULL,
  expectedyield NUMERIC NOT NULL,
  laborminutes INTEGER,
  projectedmaterialcost NUMERIC,
  isarchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Recipe ingredients for batch calculations
CREATE TABLE recipe_ingredients (
  ingredientid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipeid UUID REFERENCES recipes(recipeid) NOT NULL,
  itemid UUID REFERENCES items(itemid) NOT NULL,
  quantity NUMERIC NOT NULL,
  notes TEXT
);

-- Production batches with yield tracking
CREATE TABLE batches (
  batchid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayid TEXT UNIQUE NOT NULL,
  recipeid UUID REFERENCES recipes(recipeid) NOT NULL,
  datecreated DATE NOT NULL,
  effectivedate DATE NOT NULL,
  qtymade NUMERIC NOT NULL,
  yieldpercentage NUMERIC,
  materialcost NUMERIC NOT NULL,
  laborcost NUMERIC DEFAULT 0,
  actualcost NUMERIC NOT NULL,
  costvariance NUMERIC,
  expirydate DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales periods for forecasting
CREATE TABLE sales_periods (
  salesperiodid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  displayid TEXT UNIQUE NOT NULL,
  itemid UUID REFERENCES items(itemid) NOT NULL,
  channel sales_channel NOT NULL,
  periodstart DATE NOT NULL,
  periodend DATE NOT NULL,
  quantitysold NUMERIC NOT NULL,
  revenue NUMERIC,
  datasource data_source DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction log for audit trail
CREATE TABLE transactions (
  transactionid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itemid UUID REFERENCES items(itemid) NOT NULL,
  transactiontype transaction_type NOT NULL,
  quantity NUMERIC NOT NULL,
  unitcost NUMERIC,
  referenceid UUID,
  referencetype TEXT,
  effectivedate DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forecasting data for automatic reorder points
CREATE TABLE forecasting_data (
  forecastingid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itemid UUID REFERENCES items(itemid) NOT NULL,
  predicteddemand NUMERIC NOT NULL,
  seasonalindex NUMERIC DEFAULT 1.0,
  recommendedreorderpoint NUMERIC,
  isautomatic BOOLEAN DEFAULT TRUE,
  calculatedat TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(itemid)
);

-- Batch templates for reusable configurations
CREATE TABLE batch_templates (
  templateid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  recipeid UUID REFERENCES recipes(recipeid) NOT NULL,
  scalefactor NUMERIC DEFAULT 1.0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_items_sku ON items(sku);
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_archived ON items(isarchived);
CREATE INDEX idx_purchases_supplier ON purchases(supplierid);
CREATE INDEX idx_purchases_date ON purchases(purchasedate);
CREATE INDEX idx_transactions_item ON transactions(itemid);
CREATE INDEX idx_transactions_date ON transactions(effectivedate);
CREATE INDEX idx_transactions_type ON transactions(transactiontype);

-- Enable Row Level Security
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasting_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_templates ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for authenticated users for now)
CREATE POLICY "Allow all for authenticated users" ON suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON purchases FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON purchase_line_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON recipes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON recipe_ingredients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON batches FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON sales_periods FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON forecasting_data FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON batch_templates FOR ALL TO authenticated USING (true);