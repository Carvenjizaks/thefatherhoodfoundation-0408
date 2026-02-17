import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client that does not use cookies.
 * This avoids browser restriction issues in embedded previews.
 */
export async function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
