
-- Add new columns to the Quotes table for Deal Master data
ALTER TABLE public."Quotes" ADD COLUMN knowledge_transition_start_date DATE;
ALTER TABLE public."Quotes" ADD COLUMN knowledge_transition_end_date DATE;
ALTER TABLE public."Quotes" ADD COLUMN steady_state_start_date DATE;
ALTER TABLE public."Quotes" ADD COLUMN steady_state_end_date DATE;
ALTER TABLE public."Quotes" ADD COLUMN overall_duration_months INTEGER;
ALTER TABLE public."Quotes" ADD COLUMN market_id INTEGER;
ALTER TABLE public."Quotes" ADD COLUMN deal_discount_amount DECIMAL(15,2);
ALTER TABLE public."Quotes" ADD COLUMN deal_discount_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN travel_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN training_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN other_costs_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN infrastructure_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN compliance_percent DECIMAL(5,2);
ALTER TABLE public."Quotes" ADD COLUMN licenses_percent DECIMAL(5,2);

-- Create Market master table
CREATE TABLE public."Market" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default market values
INSERT INTO public."Market" (name) VALUES 
('Americas'),
('Europe'),
('India'),
('Australia'),
('Asia Pacific'),
('Middle East'),
('Africa');

-- Create Resource Type master table
CREATE TABLE public."ResourceType" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default resource type values
INSERT INTO public."ResourceType" (name) VALUES 
('FTE'),
('Contractor'),
('Rebadging');

-- Create Geography master table with cities
CREATE TABLE public."Geography" (
  id SERIAL PRIMARY KEY,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country, city)
);

-- Insert default geography and city values
INSERT INTO public."Geography" (country, city, region) VALUES 
('United States', 'New York', 'Americas'),
('United States', 'Chicago', 'Americas'),
('United States', 'San Francisco', 'Americas'),
('United States', 'Los Angeles', 'Americas'),
('Canada', 'Toronto', 'Americas'),
('Canada', 'Vancouver', 'Americas'),
('United Kingdom', 'London', 'Europe'),
('Germany', 'Berlin', 'Europe'),
('Germany', 'Frankfurt', 'Europe'),
('France', 'Paris', 'Europe'),
('Netherlands', 'Amsterdam', 'Europe'),
('India', 'Mumbai', 'Asia Pacific'),
('India', 'Bangalore', 'Asia Pacific'),
('India', 'Delhi', 'Asia Pacific'),
('India', 'Hyderabad', 'Asia Pacific'),
('India', 'Chennai', 'Asia Pacific'),
('Australia', 'Sydney', 'Asia Pacific'),
('Australia', 'Melbourne', 'Asia Pacific'),
('Singapore', 'Singapore', 'Asia Pacific'),
('Japan', 'Tokyo', 'Asia Pacific');

-- Create Client Category master table
CREATE TABLE public."ClientCategory" (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL CHECK (level IN (1, 2, 3)),
  name TEXT NOT NULL,
  parent_id INTEGER REFERENCES public."ClientCategory"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default client category values
INSERT INTO public."ClientCategory" (level, name, parent_id) VALUES 
-- Level 1 categories
(1, 'Financial Services', NULL),
(1, 'Technology', NULL),
(1, 'Healthcare', NULL),
(1, 'Manufacturing', NULL),
(1, 'Retail', NULL);

-- Level 2 categories for Financial Services
INSERT INTO public."ClientCategory" (level, name, parent_id) VALUES 
(2, 'Banking', 1),
(2, 'Insurance', 1),
(2, 'Investment Management', 1);

-- Level 2 categories for Technology
INSERT INTO public."ClientCategory" (level, name, parent_id) VALUES 
(2, 'Software', 2),
(2, 'Hardware', 2),
(2, 'Telecommunications', 2);

-- Level 3 categories for Banking
INSERT INTO public."ClientCategory" (level, name, parent_id) VALUES 
(3, 'Commercial Banking', 4),
(3, 'Investment Banking', 4),
(3, 'Retail Banking', 4);

-- Level 3 categories for Software
INSERT INTO public."ClientCategory" (level, name, parent_id) VALUES 
(3, 'Enterprise Software', 7),
(3, 'SaaS', 7),
(3, 'Mobile Applications', 7);

-- Create Volume Discount table (separate table for flexibility)
CREATE TABLE public."VolumeDiscount" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  range_start DECIMAL(15,2) NOT NULL,
  range_end DECIMAL(15,2),
  discount_percent DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name") ON DELETE CASCADE
);

-- Create junction table for Quote Resource Types (many-to-many)
CREATE TABLE public."QuoteResourceType" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  resource_type_id INTEGER NOT NULL REFERENCES public."ResourceType"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name") ON DELETE CASCADE,
  UNIQUE("Deal_Id", "Quote_Name", resource_type_id)
);

-- Create junction table for Quote Geographies (many-to-many)
CREATE TABLE public."QuoteGeography" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  geography_id INTEGER NOT NULL REFERENCES public."Geography"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name") ON DELETE CASCADE,
  UNIQUE("Deal_Id", "Quote_Name", geography_id)
);

-- Create junction table for Quote Client Categories
CREATE TABLE public."QuoteClientCategory" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  category_level_1_id INTEGER REFERENCES public."ClientCategory"(id),
  category_level_2_id INTEGER REFERENCES public."ClientCategory"(id),
  category_level_3_id INTEGER REFERENCES public."ClientCategory"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name") ON DELETE CASCADE,
  UNIQUE("Deal_Id", "Quote_Name")
);

-- Add foreign key constraint for market
ALTER TABLE public."Quotes" ADD CONSTRAINT fk_quotes_market 
FOREIGN KEY (market_id) REFERENCES public."Market"(id);
