import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Note: This uses a simple client without cookie-based auth
// to avoid "Browser Restriction Detected" errors in embedded previews.
// Auth is handled via Supabase's built-in token management.

export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
