import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (error) {
    console.warn('[Supabase] Failed to initialize client:', error);
  }
} else {
  console.warn('[Supabase] Missing environment variables. Auth features will be disabled.');
}

export { supabase };
