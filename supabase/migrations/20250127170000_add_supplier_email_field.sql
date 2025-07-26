-- Migration: Add email field to suppliers table
-- Date: January 27, 2025
-- Description: Add email field alongside existing website field for supplier contact information

BEGIN;

-- Add email column to suppliers table
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add comment for clarity
COMMENT ON COLUMN suppliers.email IS 'Supplier contact email address';
COMMENT ON COLUMN suppliers.website IS 'Supplier website URL';

-- Update user interface fields guide reference
COMMENT ON TABLE suppliers IS 'Supplier management with both email and website contact fields';

COMMIT; 