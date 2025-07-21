-- Fix transaction type enum mismatch between database and TypeScript
-- Database uses lowercase, TypeScript expects uppercase
-- Solution: Add uppercase aliases and update enum to match TypeScript expectations

-- First, see what values are currently in use
DO $$
BEGIN
    RAISE NOTICE 'Current transaction types in use:';
    FOR rec IN 
        SELECT DISTINCT transactiontype, COUNT(*) 
        FROM transactions 
        GROUP BY transactiontype 
    LOOP
        RAISE NOTICE '  %: % records', rec.transactiontype, rec.count;
    END LOOP;
END $$;

-- Add new enum values (uppercase) to support TypeScript expectations
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'PURCHASE';
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'SALE'; 
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'ADJUSTMENT';
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'BATCH_CONSUMPTION';
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'BATCH_PRODUCTION';

-- Create a mapping function for consistent case handling
CREATE OR REPLACE FUNCTION normalize_transaction_type(input_type TEXT)
RETURNS transaction_type AS $$
BEGIN
    CASE UPPER(input_type)
        WHEN 'PURCHASE' THEN RETURN 'PURCHASE'::transaction_type;
        WHEN 'SALE' THEN RETURN 'SALE'::transaction_type;
        WHEN 'ADJUSTMENT' THEN RETURN 'ADJUSTMENT'::transaction_type;
        WHEN 'BATCH_CONSUMPTION' THEN RETURN 'BATCH_CONSUMPTION'::transaction_type;
        WHEN 'BATCH_PRODUCTION' THEN RETURN 'BATCH_PRODUCTION'::transaction_type;
        -- Legacy lowercase support
        WHEN 'purchase' THEN RETURN 'PURCHASE'::transaction_type;
        WHEN 'sale' THEN RETURN 'SALE'::transaction_type;  
        WHEN 'adjustment' THEN RETURN 'ADJUSTMENT'::transaction_type;
        WHEN 'batch_consumption' THEN RETURN 'BATCH_CONSUMPTION'::transaction_type;
        WHEN 'batch_production' THEN RETURN 'BATCH_PRODUCTION'::transaction_type;
        ELSE 
            RAISE EXCEPTION 'Invalid transaction type: %', input_type;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update existing lowercase records to uppercase (if any)
UPDATE transactions 
SET transactiontype = normalize_transaction_type(transactiontype::TEXT)
WHERE transactiontype IN ('purchase', 'sale', 'adjustment', 'batch_consumption', 'batch_production');

-- Grant permissions
GRANT EXECUTE ON FUNCTION normalize_transaction_type(TEXT) TO authenticated;

-- Add comment
COMMENT ON FUNCTION normalize_transaction_type IS 'Normalizes transaction types to uppercase format expected by TypeScript. Supports both legacy lowercase and new uppercase values.';