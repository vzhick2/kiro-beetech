-- Migration: Replace email with website field in suppliers table
-- Date: July 19, 2025
-- Description: Update suppliers table to replace contactemail with website field

BEGIN;

-- Add new website column
ALTER TABLE suppliers 
ADD COLUMN website TEXT;

-- Copy existing email data to website field (if you have any data to preserve)
-- Assuming email might contain website URLs or you want to convert manually
UPDATE suppliers 
SET website = contactemail 
WHERE contactemail IS NOT NULL;

-- Drop the old email column
ALTER TABLE suppliers 
DROP COLUMN IF EXISTS contactemail;

-- Update any indexes or constraints if they exist
-- (Add any specific constraints your application needs)

COMMIT;
