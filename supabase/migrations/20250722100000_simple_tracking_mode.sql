-- Simple two-mode tracking system
-- Replace the complex migration with just the essential tracking mode column

-- Add tracking mode column to items table
ALTER TABLE items 
ADD COLUMN IF NOT EXISTS tracking_mode TEXT DEFAULT 'fully_tracked' 
CHECK (tracking_mode IN ('fully_tracked', 'cost_added'));

-- Update existing items to have default tracking mode if null
UPDATE items 
SET tracking_mode = 'fully_tracked' 
WHERE tracking_mode IS NULL;

-- Add comment for clarity
COMMENT ON COLUMN items.tracking_mode IS 'Determines how inventory is tracked: fully_tracked = quantities + costs, cost_added = costs only';
