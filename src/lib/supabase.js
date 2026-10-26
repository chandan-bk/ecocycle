import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables (.env) or fallback to production cluster
const DEFAULT_SUPABASE_URL = 'https://anusmzkuuudrtgzgccby.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFudXNtemt1dXVkcnRnemdjY2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5NDkzNzQsImV4cCI6MjEwNzUyNTM3NH0.t2xEjuYNpWBwbvWtTm-4gwMBLehzC-2rH2SPIaqhJMI';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Create and export the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
