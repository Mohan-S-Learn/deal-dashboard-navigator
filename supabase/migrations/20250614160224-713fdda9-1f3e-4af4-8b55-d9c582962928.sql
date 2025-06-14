
-- Disable Row Level Security on the Deals table to allow data access
ALTER TABLE public."Deals" DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on the Quotes table if it has the same issue
ALTER TABLE public."Quotes" DISABLE ROW LEVEL SECURITY;
