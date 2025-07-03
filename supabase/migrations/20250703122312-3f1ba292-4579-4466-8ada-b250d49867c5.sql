-- Fix RLS policies if needed
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow public read access to deals" ON public."Deals";
    DROP POLICY IF EXISTS "Allow public insert access to deals" ON public."Deals";
    DROP POLICY IF EXISTS "Allow public update access to deals" ON public."Deals";
    DROP POLICY IF EXISTS "Allow public delete access to deals" ON public."Deals";
    
    -- Create comprehensive policies for all operations
    CREATE POLICY "Allow public read access to deals" 
    ON public."Deals" 
    FOR SELECT 
    TO public 
    USING (true);
    
    CREATE POLICY "Allow public insert access to deals" 
    ON public."Deals" 
    FOR INSERT 
    TO public 
    WITH CHECK (true);
    
    CREATE POLICY "Allow public update access to deals" 
    ON public."Deals" 
    FOR UPDATE 
    TO public 
    USING (true);
    
    CREATE POLICY "Allow public delete access to deals" 
    ON public."Deals" 
    FOR DELETE 
    TO public 
    USING (true);
END $$;