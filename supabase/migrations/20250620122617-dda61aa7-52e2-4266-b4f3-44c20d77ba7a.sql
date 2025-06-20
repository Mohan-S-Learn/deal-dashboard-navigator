
-- Add RLS policies for all tables to allow public access

-- Quotes table policies
CREATE POLICY "Allow public read access to quotes" 
ON public."Quotes" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quotes" 
ON public."Quotes" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quotes" 
ON public."Quotes" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quotes" 
ON public."Quotes" 
FOR DELETE 
TO public 
USING (true);

-- Geography table policies
CREATE POLICY "Allow public read access to geography" 
ON public."Geography" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to geography" 
ON public."Geography" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to geography" 
ON public."Geography" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to geography" 
ON public."Geography" 
FOR DELETE 
TO public 
USING (true);

-- Market table policies
CREATE POLICY "Allow public read access to market" 
ON public."Market" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to market" 
ON public."Market" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to market" 
ON public."Market" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to market" 
ON public."Market" 
FOR DELETE 
TO public 
USING (true);

-- ResourceType table policies
CREATE POLICY "Allow public read access to resource_type" 
ON public."ResourceType" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to resource_type" 
ON public."ResourceType" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to resource_type" 
ON public."ResourceType" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to resource_type" 
ON public."ResourceType" 
FOR DELETE 
TO public 
USING (true);

-- ServiceCategory table policies
CREATE POLICY "Allow public read access to service_category" 
ON public."ServiceCategory" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to service_category" 
ON public."ServiceCategory" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to service_category" 
ON public."ServiceCategory" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to service_category" 
ON public."ServiceCategory" 
FOR DELETE 
TO public 
USING (true);

-- QuoteGeography table policies
CREATE POLICY "Allow public read access to quote_geography" 
ON public."QuoteGeography" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quote_geography" 
ON public."QuoteGeography" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quote_geography" 
ON public."QuoteGeography" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quote_geography" 
ON public."QuoteGeography" 
FOR DELETE 
TO public 
USING (true);

-- QuoteResourceType table policies
CREATE POLICY "Allow public read access to quote_resource_type" 
ON public."QuoteResourceType" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quote_resource_type" 
ON public."QuoteResourceType" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quote_resource_type" 
ON public."QuoteResourceType" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quote_resource_type" 
ON public."QuoteResourceType" 
FOR DELETE 
TO public 
USING (true);

-- QuoteServiceCategory table policies
CREATE POLICY "Allow public read access to quote_service_category" 
ON public."QuoteServiceCategory" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quote_service_category" 
ON public."QuoteServiceCategory" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quote_service_category" 
ON public."QuoteServiceCategory" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quote_service_category" 
ON public."QuoteServiceCategory" 
FOR DELETE 
TO public 
USING (true);

-- VolumeDiscount table policies
CREATE POLICY "Allow public read access to volume_discount" 
ON public."VolumeDiscount" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to volume_discount" 
ON public."VolumeDiscount" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to volume_discount" 
ON public."VolumeDiscount" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to volume_discount" 
ON public."VolumeDiscount" 
FOR DELETE 
TO public 
USING (true);

-- CostCategory table policies
CREATE POLICY "Allow public read access to cost_category" 
ON public."CostCategory" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to cost_category" 
ON public."CostCategory" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to cost_category" 
ON public."CostCategory" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to cost_category" 
ON public."CostCategory" 
FOR DELETE 
TO public 
USING (true);

-- BenchmarkRate table policies
CREATE POLICY "Allow public read access to benchmark_rate" 
ON public."BenchmarkRate" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to benchmark_rate" 
ON public."BenchmarkRate" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to benchmark_rate" 
ON public."BenchmarkRate" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to benchmark_rate" 
ON public."BenchmarkRate" 
FOR DELETE 
TO public 
USING (true);

-- QuoteRevenue table policies
CREATE POLICY "Allow public read access to quote_revenue" 
ON public."QuoteRevenue" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quote_revenue" 
ON public."QuoteRevenue" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quote_revenue" 
ON public."QuoteRevenue" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quote_revenue" 
ON public."QuoteRevenue" 
FOR DELETE 
TO public 
USING (true);

-- QuoteResourceEffort table policies
CREATE POLICY "Allow public read access to quote_resource_effort" 
ON public."QuoteResourceEffort" 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow public insert access to quote_resource_effort" 
ON public."QuoteResourceEffort" 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public update access to quote_resource_effort" 
ON public."QuoteResourceEffort" 
FOR UPDATE 
TO public 
USING (true);

CREATE POLICY "Allow public delete access to quote_resource_effort" 
ON public."QuoteResourceEffort" 
FOR DELETE 
TO public 
USING (true);
