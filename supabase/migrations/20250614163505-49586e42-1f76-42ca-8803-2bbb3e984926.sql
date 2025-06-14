
-- Fix the primary key constraint with correct table name
-- Drop the existing primary key constraint
ALTER TABLE public."Quotes" DROP CONSTRAINT IF EXISTS "Quotes_pkey";

-- Add a proper primary key using Deal_Id and Quote_Name combination
-- This allows multiple quotes per deal as long as they have different names
ALTER TABLE public."Quotes" ADD CONSTRAINT "Quotes_pkey" 
PRIMARY KEY ("Deal_Id", "Quote_Name");
