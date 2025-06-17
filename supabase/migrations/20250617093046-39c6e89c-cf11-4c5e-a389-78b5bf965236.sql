
-- First, let's check the current BenchmarkRate table structure and update it to use service_category_level_4_id for resource skills
-- Also add some sample benchmark rate data

-- Update BenchmarkRate table to ensure we have the right structure
-- (The table already exists but let's make sure it's properly set up)

-- Insert sample ServiceCategory data for all levels if not exists
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES
-- Level 1 categories
(1, 'Technology Services', NULL),
(1, 'Business Process Services', NULL),
(1, 'Consulting Services', NULL)
ON CONFLICT DO NOTHING;

-- Level 2 categories (children of Level 1)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES
(2, 'Application Development', (SELECT id FROM public."ServiceCategory" WHERE name = 'Technology Services' AND level = 1 LIMIT 1)),
(2, 'Infrastructure Services', (SELECT id FROM public."ServiceCategory" WHERE name = 'Technology Services' AND level = 1 LIMIT 1)),
(2, 'Finance & Accounting', (SELECT id FROM public."ServiceCategory" WHERE name = 'Business Process Services' AND level = 1 LIMIT 1)),
(2, 'Human Resources', (SELECT id FROM public."ServiceCategory" WHERE name = 'Business Process Services' AND level = 1 LIMIT 1)),
(2, 'Strategy Consulting', (SELECT id FROM public."ServiceCategory" WHERE name = 'Consulting Services' AND level = 1 LIMIT 1)),
(2, 'Digital Transformation', (SELECT id FROM public."ServiceCategory" WHERE name = 'Consulting Services' AND level = 1 LIMIT 1))
ON CONFLICT DO NOTHING;

-- Level 3 categories (children of Level 2)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES
(3, 'Web Development', (SELECT id FROM public."ServiceCategory" WHERE name = 'Application Development' AND level = 2 LIMIT 1)),
(3, 'Mobile Development', (SELECT id FROM public."ServiceCategory" WHERE name = 'Application Development' AND level = 2 LIMIT 1)),
(3, 'Cloud Services', (SELECT id FROM public."ServiceCategory" WHERE name = 'Infrastructure Services' AND level = 2 LIMIT 1)),
(3, 'Network Management', (SELECT id FROM public."ServiceCategory" WHERE name = 'Infrastructure Services' AND level = 2 LIMIT 1)),
(3, 'Accounts Payable', (SELECT id FROM public."ServiceCategory" WHERE name = 'Finance & Accounting' AND level = 2 LIMIT 1)),
(3, 'Financial Reporting', (SELECT id FROM public."ServiceCategory" WHERE name = 'Finance & Accounting' AND level = 2 LIMIT 1)),
(3, 'Recruitment', (SELECT id FROM public."ServiceCategory" WHERE name = 'Human Resources' AND level = 2 LIMIT 1)),
(3, 'Payroll Processing', (SELECT id FROM public."ServiceCategory" WHERE name = 'Human Resources' AND level = 2 LIMIT 1)),
(3, 'Business Strategy', (SELECT id FROM public."ServiceCategory" WHERE name = 'Strategy Consulting' AND level = 2 LIMIT 1)),
(3, 'Market Analysis', (SELECT id FROM public."ServiceCategory" WHERE name = 'Strategy Consulting' AND level = 2 LIMIT 1)),
(3, 'Technology Integration', (SELECT id FROM public."ServiceCategory" WHERE name = 'Digital Transformation' AND level = 2 LIMIT 1)),
(3, 'Process Automation', (SELECT id FROM public."ServiceCategory" WHERE name = 'Digital Transformation' AND level = 2 LIMIT 1))
ON CONFLICT DO NOTHING;

-- Level 4 categories (Resource Skills - children of Level 3)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES
-- Web Development skills
(4, 'Frontend Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Web Development' AND level = 3 LIMIT 1)),
(4, 'Backend Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Web Development' AND level = 3 LIMIT 1)),
(4, 'Full Stack Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Web Development' AND level = 3 LIMIT 1)),
-- Mobile Development skills
(4, 'iOS Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Mobile Development' AND level = 3 LIMIT 1)),
(4, 'Android Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Mobile Development' AND level = 3 LIMIT 1)),
(4, 'React Native Developer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Mobile Development' AND level = 3 LIMIT 1)),
-- Cloud Services skills
(4, 'Cloud Architect', (SELECT id FROM public."ServiceCategory" WHERE name = 'Cloud Services' AND level = 3 LIMIT 1)),
(4, 'DevOps Engineer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Cloud Services' AND level = 3 LIMIT 1)),
(4, 'Cloud Security Specialist', (SELECT id FROM public."ServiceCategory" WHERE name = 'Cloud Services' AND level = 3 LIMIT 1)),
-- Network Management skills
(4, 'Network Administrator', (SELECT id FROM public."ServiceCategory" WHERE name = 'Network Management' AND level = 3 LIMIT 1)),
(4, 'Network Security Engineer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Network Management' AND level = 3 LIMIT 1)),
-- Finance skills
(4, 'AP Specialist', (SELECT id FROM public."ServiceCategory" WHERE name = 'Accounts Payable' AND level = 3 LIMIT 1)),
(4, 'Financial Analyst', (SELECT id FROM public."ServiceCategory" WHERE name = 'Financial Reporting' AND level = 3 LIMIT 1)),
(4, 'Senior Financial Analyst', (SELECT id FROM public."ServiceCategory" WHERE name = 'Financial Reporting' AND level = 3 LIMIT 1)),
-- HR skills
(4, 'Recruiter', (SELECT id FROM public."ServiceCategory" WHERE name = 'Recruitment' AND level = 3 LIMIT 1)),
(4, 'Senior Recruiter', (SELECT id FROM public."ServiceCategory" WHERE name = 'Recruitment' AND level = 3 LIMIT 1)),
(4, 'Payroll Specialist', (SELECT id FROM public."ServiceCategory" WHERE name = 'Payroll Processing' AND level = 3 LIMIT 1)),
-- Consulting skills
(4, 'Business Analyst', (SELECT id FROM public."ServiceCategory" WHERE name = 'Business Strategy' AND level = 3 LIMIT 1)),
(4, 'Strategy Consultant', (SELECT id FROM public."ServiceCategory" WHERE name = 'Business Strategy' AND level = 3 LIMIT 1)),
(4, 'Market Research Analyst', (SELECT id FROM public."ServiceCategory" WHERE name = 'Market Analysis' AND level = 3 LIMIT 1)),
(4, 'Integration Specialist', (SELECT id FROM public."ServiceCategory" WHERE name = 'Technology Integration' AND level = 3 LIMIT 1)),
(4, 'Process Automation Engineer', (SELECT id FROM public."ServiceCategory" WHERE name = 'Process Automation' AND level = 3 LIMIT 1))
ON CONFLICT DO NOTHING;

-- Now insert comprehensive benchmark rate data
-- This will create rates for various combinations of service categories, resource skills, experience levels, and geographies
WITH geography_ids AS (
  SELECT id, city, country FROM public."Geography" LIMIT 10
),
skill_combinations AS (
  SELECT 
    l1.id as level1_id,
    l2.id as level2_id, 
    l3.id as level3_id,
    l4.id as level4_id,
    l4.name as skill_name
  FROM public."ServiceCategory" l1
  JOIN public."ServiceCategory" l2 ON l2.parent_id = l1.id AND l2.level = 2
  JOIN public."ServiceCategory" l3 ON l3.parent_id = l2.id AND l3.level = 3  
  JOIN public."ServiceCategory" l4 ON l4.parent_id = l3.id AND l4.level = 4
  WHERE l1.level = 1
)
INSERT INTO public."BenchmarkRate" (
  service_category_level_1_id,
  service_category_level_2_id, 
  service_category_level_3_id,
  service_category_level_4_id,
  experience_years,
  geography_id,
  benchmark_rate_usd_per_hour,
  cb_cost_usd_per_hour,
  margin_percent
)
SELECT 
  sc.level1_id,
  sc.level2_id,
  sc.level3_id, 
  sc.level4_id,
  exp_years.years,
  geo.id,
  -- Base rates vary by skill type and experience, with geography multipliers
  CASE 
    WHEN sc.skill_name LIKE '%Senior%' OR sc.skill_name LIKE '%Architect%' OR sc.skill_name LIKE '%Consultant%' THEN 
      (60 + (exp_years.years * 8)) * 
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END
    WHEN sc.skill_name LIKE '%Developer%' OR sc.skill_name LIKE '%Engineer%' THEN
      (45 + (exp_years.years * 6)) *
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END
    ELSE 
      (35 + (exp_years.years * 4)) *
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END
  END AS benchmark_rate,
  -- CB Cost is typically 70-80% of benchmark rate
  CASE 
    WHEN sc.skill_name LIKE '%Senior%' OR sc.skill_name LIKE '%Architect%' OR sc.skill_name LIKE '%Consultant%' THEN 
      ((60 + (exp_years.years * 8)) * 
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END) * 0.75
    WHEN sc.skill_name LIKE '%Developer%' OR sc.skill_name LIKE '%Engineer%' THEN
      ((45 + (exp_years.years * 6)) *
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END) * 0.75
    ELSE 
      ((35 + (exp_years.years * 4)) *
      CASE 
        WHEN geo.country = 'United States' THEN 1.3
        WHEN geo.country = 'United Kingdom' THEN 1.2  
        WHEN geo.country = 'Germany' THEN 1.1
        WHEN geo.country = 'India' THEN 0.4
        WHEN geo.country = 'Philippines' THEN 0.3
        ELSE 0.8
      END) * 0.75
  END AS cb_cost,
  -- Standard margin of 25%
  25.0 as margin_percent
FROM skill_combinations sc
CROSS JOIN (VALUES (1), (2), (3), (5), (7), (10)) AS exp_years(years)
CROSS JOIN geography_ids geo
ON CONFLICT DO NOTHING;

-- Also add some rates without geography constraints (NULL geography_id) for fallback
INSERT INTO public."BenchmarkRate" (
  service_category_level_1_id,
  service_category_level_2_id, 
  service_category_level_3_id,
  service_category_level_4_id,
  experience_years,
  geography_id,
  benchmark_rate_usd_per_hour,
  cb_cost_usd_per_hour,
  margin_percent
)
SELECT 
  sc.level1_id,
  sc.level2_id,
  sc.level3_id, 
  sc.level4_id,
  exp_years.years,
  NULL, -- No geography constraint
  -- Base rates without geography multiplier
  CASE 
    WHEN sc.skill_name LIKE '%Senior%' OR sc.skill_name LIKE '%Architect%' OR sc.skill_name LIKE '%Consultant%' THEN 
      60 + (exp_years.years * 8)
    WHEN sc.skill_name LIKE '%Developer%' OR sc.skill_name LIKE '%Engineer%' THEN
      45 + (exp_years.years * 6)
    ELSE 
      35 + (exp_years.years * 4)
  END AS benchmark_rate,
  -- CB Cost is typically 75% of benchmark rate
  CASE 
    WHEN sc.skill_name LIKE '%Senior%' OR sc.skill_name LIKE '%Architect%' OR sc.skill_name LIKE '%Consultant%' THEN 
      (60 + (exp_years.years * 8)) * 0.75
    WHEN sc.skill_name LIKE '%Developer%' OR sc.skill_name LIKE '%Engineer%' THEN
      (45 + (exp_years.years * 6)) * 0.75
    ELSE 
      (35 + (exp_years.years * 4)) * 0.75
  END AS cb_cost,
  25.0 as margin_percent
FROM (
  SELECT 
    l1.id as level1_id,
    l2.id as level2_id, 
    l3.id as level3_id,
    l4.id as level4_id,
    l4.name as skill_name
  FROM public."ServiceCategory" l1
  JOIN public."ServiceCategory" l2 ON l2.parent_id = l1.id AND l2.level = 2
  JOIN public."ServiceCategory" l3 ON l3.parent_id = l2.id AND l3.level = 3  
  JOIN public."ServiceCategory" l4 ON l4.parent_id = l3.id AND l4.level = 4
  WHERE l1.level = 1
) sc
CROSS JOIN (VALUES (1), (2), (3), (5), (7), (10)) AS exp_years(years)
ON CONFLICT DO NOTHING;
