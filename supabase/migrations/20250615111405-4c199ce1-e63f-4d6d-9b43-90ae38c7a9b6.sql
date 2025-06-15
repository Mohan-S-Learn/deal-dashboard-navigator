
-- Remove the check constraint that prevents level 4 entries
ALTER TABLE public."ServiceCategory" DROP CONSTRAINT IF EXISTS "ClientCategory_level_check";

-- Add a new check constraint that allows levels 1-4
ALTER TABLE public."ServiceCategory" ADD CONSTRAINT "ServiceCategory_level_check" CHECK (level >= 1 AND level <= 4);

-- Now add Level 4 service categories (Resource Skills) to the ServiceCategory table
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES
-- For Infrastructure > Server > Web Development
(4, 'Programmer', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Web Development' LIMIT 1)),
(4, 'DevOps Engineer', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Web Development' LIMIT 1)),

-- For Infrastructure > Server > Database Management  
(4, 'Database Administrator', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Database Management' LIMIT 1)),
(4, 'Data Analyst', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Database Management' LIMIT 1)),

-- For Business > Analysis > Requirements
(4, 'Business Analyst', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Requirements Analysis' LIMIT 1)),
(4, 'Solution Architect', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Requirements Analysis' LIMIT 1)),

-- For Business > Management > Project Management
(4, 'Project Manager', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Project Management' LIMIT 1)),

-- For Design > UI/UX > User Interface
(4, 'UI/UX Designer', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'User Interface Design' LIMIT 1)),

-- For Quality > Testing > Manual Testing
(4, 'Manual Tester', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Manual Testing' LIMIT 1)),
(4, 'Test Automation Engineer', (SELECT id FROM public."ServiceCategory" WHERE level = 3 AND name = 'Automated Testing' LIMIT 1));

-- Add service_category_level_4_id column to tables that reference ResourceSkill
ALTER TABLE public."BenchmarkRate" ADD COLUMN service_category_level_4_id INTEGER REFERENCES public."ServiceCategory"(id);
ALTER TABLE public."QuoteRevenue" ADD COLUMN service_category_level_4_id INTEGER REFERENCES public."ServiceCategory"(id);
ALTER TABLE public."QuoteResourceEffort" ADD COLUMN service_category_level_4_id INTEGER REFERENCES public."ServiceCategory"(id);

-- Migrate existing data (map old resource_skill_id to new service_category_level_4_id)
-- Update BenchmarkRate
UPDATE public."BenchmarkRate" SET service_category_level_4_id = (
  SELECT sc.id FROM public."ServiceCategory" sc 
  INNER JOIN public."ResourceSkill" rs ON rs.name = sc.name
  WHERE rs.id = public."BenchmarkRate".resource_skill_id AND sc.level = 4
  LIMIT 1
);

-- Update QuoteRevenue  
UPDATE public."QuoteRevenue" SET service_category_level_4_id = (
  SELECT sc.id FROM public."ServiceCategory" sc 
  INNER JOIN public."ResourceSkill" rs ON rs.name = sc.name
  WHERE rs.id = public."QuoteRevenue".resource_skill_id AND sc.level = 4
  LIMIT 1
);

-- Update QuoteResourceEffort
UPDATE public."QuoteResourceEffort" SET service_category_level_4_id = (
  SELECT sc.id FROM public."ServiceCategory" sc 
  INNER JOIN public."ResourceSkill" rs ON rs.name = sc.name
  WHERE rs.id = public."QuoteResourceEffort".resource_skill_id AND sc.level = 4
  LIMIT 1
);

-- Make the new columns NOT NULL after migration
ALTER TABLE public."BenchmarkRate" ALTER COLUMN service_category_level_4_id SET NOT NULL;
ALTER TABLE public."QuoteRevenue" ALTER COLUMN service_category_level_4_id SET NOT NULL;
ALTER TABLE public."QuoteResourceEffort" ALTER COLUMN service_category_level_4_id SET NOT NULL;

-- Drop the old resource_skill_id columns
ALTER TABLE public."BenchmarkRate" DROP COLUMN resource_skill_id;
ALTER TABLE public."QuoteRevenue" DROP COLUMN resource_skill_id;
ALTER TABLE public."QuoteResourceEffort" DROP COLUMN resource_skill_id;

-- Drop the ResourceSkill table since it's no longer needed
DROP TABLE public."ResourceSkill";
