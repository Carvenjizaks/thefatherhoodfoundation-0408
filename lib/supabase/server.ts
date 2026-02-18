import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Note: This uses a simple client without cookie-based auth
// to avoid "Browser Restriction Detected" errors in embedded previews.
// Auth is handled via Supabase's built-in token management.

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
