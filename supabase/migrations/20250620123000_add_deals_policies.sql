
-- Add RLS policies for Deals table to allow public access

-- Enable RLS on Deals table
ALTER TABLE public."Deals" ENABLE ROW LEVEL SECURITY;

-- Create policy that allows public to SELECT from Deals
CREATE POLICY "Allow public read access to deals" 
ON public."Deals" 
FOR SELECT 
TO public 
USING (true);

-- Create policy that allows public to INSERT into Deals
CREATE POLICY "Allow public insert access to deals" 
ON public."Deals" 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policy that allows public to UPDATE Deals
CREATE POLICY "Allow public update access to deals" 
ON public."Deals" 
FOR UPDATE 
TO public 
USING (true);

-- Create policy that allows public to DELETE from Deals
CREATE POLICY "Allow public delete access to deals" 
ON public."Deals" 
FOR DELETE 
TO public 
USING (true);
