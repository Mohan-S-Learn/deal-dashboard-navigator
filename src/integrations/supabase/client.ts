// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xweqtgbzftpmgnbkgbgw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZXF0Z2J6ZnRwbWduYmtnYmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTAzNjMsImV4cCI6MjA2NTQ4NjM2M30.uPu9CFFShWRWYkuWjGjXhR_X0GnzGi7chKp_FFCqp_M";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);