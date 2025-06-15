
-- Create ResourceSkill table
CREATE TABLE public."ResourceSkill" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create CostCategory table
CREATE TABLE public."CostCategory" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  service_category_level_3_id INTEGER REFERENCES public."ServiceCategory"(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create BenchmarkRate table
CREATE TABLE public."BenchmarkRate" (
  id SERIAL PRIMARY KEY,
  service_category_level_1_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_2_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_3_id INTEGER REFERENCES public."ServiceCategory"(id),
  resource_skill_id INTEGER NOT NULL REFERENCES public."ResourceSkill"(id),
  experience_years INTEGER NOT NULL,
  geography_id INTEGER REFERENCES public."Geography"(id),
  benchmark_rate_usd_per_hour NUMERIC(10,2),
  cb_cost_usd_per_hour NUMERIC(10,2),
  margin_percent NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create QuoteRevenue table
CREATE TABLE public."QuoteRevenue" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  service_category_level_1_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_2_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_3_id INTEGER REFERENCES public."ServiceCategory"(id),
  resource_skill_id INTEGER NOT NULL REFERENCES public."ResourceSkill"(id),
  experience_years INTEGER NOT NULL,
  cost_category_id INTEGER REFERENCES public."CostCategory"(id),
  geography_id INTEGER REFERENCES public."Geography"(id),
  benchmark_rate_usd_per_hour NUMERIC(10,2),
  cb_cost_usd_per_hour NUMERIC(10,2),
  margin_percent NUMERIC(5,2),
  is_benchmark_rate_overridden BOOLEAN DEFAULT FALSE,
  is_cb_cost_overridden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name")
);

-- Create QuoteResourceEffort table
CREATE TABLE public."QuoteResourceEffort" (
  id SERIAL PRIMARY KEY,
  "Deal_Id" TEXT NOT NULL,
  "Quote_Name" TEXT NOT NULL,
  service_category_level_1_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_2_id INTEGER REFERENCES public."ServiceCategory"(id),
  service_category_level_3_id INTEGER REFERENCES public."ServiceCategory"(id),
  resource_skill_id INTEGER NOT NULL REFERENCES public."ResourceSkill"(id),
  experience_years INTEGER NOT NULL,
  cost_category_id INTEGER REFERENCES public."CostCategory"(id),
  effort_year INTEGER NOT NULL,
  effort_month INTEGER NOT NULL CHECK (effort_month >= 1 AND effort_month <= 12),
  hours_allocated NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY ("Deal_Id", "Quote_Name") REFERENCES public."Quotes"("Deal_Id", "Quote_Name")
);

-- Insert some sample ResourceSkill data
INSERT INTO public."ResourceSkill" (name) VALUES
('Programmer'),
('Tester'),
('Business Analyst'),
('Project Manager'),
('DevOps Engineer'),
('UI/UX Designer'),
('Data Analyst'),
('Solution Architect');

-- Insert some sample CostCategory data
INSERT INTO public."CostCategory" (name) VALUES
('Development'),
('Testing'),
('Analysis'),
('Management'),
('Infrastructure');
