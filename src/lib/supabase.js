import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment variables (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Beginner-friendly warning if environment variables are not configured yet
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ [EcoCycle Warning] Supabase credentials missing! Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create and export the Supabase client instance
// If credentials are empty during initial setup, fallback to empty strings to avoid crashing Vite startup
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
