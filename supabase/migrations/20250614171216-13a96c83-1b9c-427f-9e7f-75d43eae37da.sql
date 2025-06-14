
-- First, drop the foreign key constraint temporarily
ALTER TABLE public."ClientCategory" DROP CONSTRAINT IF EXISTS "ClientCategory_parent_id_fkey";

-- Rename ClientCategory table to ServiceCategory
ALTER TABLE public."ClientCategory" RENAME TO "ServiceCategory";

-- Reset the sequence
ALTER SEQUENCE "ClientCategory_id_seq" RENAME TO "ServiceCategory_id_seq";
ALTER TABLE public."ServiceCategory" ALTER COLUMN id SET DEFAULT nextval('"ServiceCategory_id_seq"'::regclass);

-- Clear existing data
DELETE FROM public."ServiceCategory";
ALTER SEQUENCE "ServiceCategory_id_seq" RESTART WITH 1;

-- Re-add the foreign key constraint with the correct table name
ALTER TABLE public."ServiceCategory" ADD CONSTRAINT "ServiceCategory_parent_id_fkey" 
FOREIGN KEY (parent_id) REFERENCES public."ServiceCategory"(id);

-- Insert Level 1 categories first (no parent dependencies)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES 
(1, 'Infrastructure', NULL),
(1, 'Application Development', NULL),
(1, 'Data & Analytics', NULL),
(1, 'Security', NULL),
(1, 'Cloud Services', NULL);

-- Insert Level 2 categories (depend on Level 1)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES 
-- Infrastructure subcategories
(2, 'Server', 1),
(2, 'Network', 1),
(2, 'Storage', 1),
(2, 'Database', 1),
-- Application Development subcategories
(2, 'Web Development', 2),
(2, 'Mobile Development', 2),
(2, 'API Development', 2),
-- Data & Analytics subcategories
(2, 'Data Engineering', 3),
(2, 'Business Intelligence', 3),
(2, 'Machine Learning', 3),
-- Security subcategories
(2, 'Cybersecurity', 4),
(2, 'Identity Management', 4),
(2, 'Compliance', 4),
-- Cloud Services subcategories
(2, 'Cloud Migration', 5),
(2, 'Cloud Management', 5),
(2, 'DevOps', 5);

-- Insert Level 3 categories (depend on Level 2)
INSERT INTO public."ServiceCategory" (level, name, parent_id) VALUES 
-- Server subcategories
(3, 'Azure', 6),
(3, 'AWS', 6),
(3, 'Google Cloud', 6),
(3, 'On-Premise', 6),
-- Network subcategories
(3, 'LAN/WAN', 7),
(3, 'Firewall', 7),
(3, 'Load Balancer', 7),
-- Web Development subcategories
(3, 'Frontend', 10),
(3, 'Backend', 10),
(3, 'Full Stack', 10),
-- Data Engineering subcategories
(3, 'ETL Pipeline', 13),
(3, 'Data Warehouse', 13),
(3, 'Real-time Processing', 13),
-- Cloud Migration subcategories
(3, 'Lift and Shift', 17),
(3, 'Re-platforming', 17),
(3, 'Re-architecting', 17);

-- Update the junction table name and constraints
ALTER TABLE public."QuoteClientCategory" RENAME TO "QuoteServiceCategory";

-- Drop old foreign key constraints
ALTER TABLE public."QuoteServiceCategory" DROP CONSTRAINT IF EXISTS "QuoteClientCategory_category_level_1_id_fkey";
ALTER TABLE public."QuoteServiceCategory" DROP CONSTRAINT IF EXISTS "QuoteClientCategory_category_level_2_id_fkey";
ALTER TABLE public."QuoteServiceCategory" DROP CONSTRAINT IF EXISTS "QuoteClientCategory_category_level_3_id_fkey";

-- Add new foreign key constraints pointing to ServiceCategory
ALTER TABLE public."QuoteServiceCategory" ADD CONSTRAINT "QuoteServiceCategory_category_level_1_id_fkey" 
FOREIGN KEY (category_level_1_id) REFERENCES public."ServiceCategory"(id);

ALTER TABLE public."QuoteServiceCategory" ADD CONSTRAINT "QuoteServiceCategory_category_level_2_id_fkey" 
FOREIGN KEY (category_level_2_id) REFERENCES public."ServiceCategory"(id);

ALTER TABLE public."QuoteServiceCategory" ADD CONSTRAINT "QuoteServiceCategory_category_level_3_id_fkey" 
FOREIGN KEY (category_level_3_id) REFERENCES public."ServiceCategory"(id);
