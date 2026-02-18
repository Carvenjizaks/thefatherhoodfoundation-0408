import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Note: This uses a simple client without cookie-based auth
// to avoid "Browser Restriction Detected" errors in embedded previews.
// Auth is handled via Supabase's built-in token management.

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? ''

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
