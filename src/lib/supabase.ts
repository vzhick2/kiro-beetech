import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Remote Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Client for browser/frontend use (with RLS)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Admin client for server actions (bypasses RLS)
// Falls back to regular client if service key is not available
export const supabaseAdmin = supabaseServiceKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper to check if we have admin privileges
export const hasAdminAccess = !!supabaseServiceKey;

// Environment info for debugging
export const supabaseConfig = {
  hasServiceKey: !!supabaseServiceKey,
  url: supabaseUrl,
  isProduction: process.env.NODE_ENV === 'production',
};
