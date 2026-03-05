import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

// Ensure URL has https:// protocol - v4 rebuild
function getSupabaseUrl(): string {
  // Try SUPABASE_URL first (usually has correct format), then NEXT_PUBLIC_SUPABASE_URL
  const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  
  if (!rawUrl) {
    throw new Error('Missing Supabase URL: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL must be set')
  }
  
  // If it already has a protocol, return as-is
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }
  
  // Add https:// if missing
  return `https://${rawUrl}`
}

/**
 * Creates a Supabase client for server-side operations.
 * Don't put this client in a global variable - always create a new client within each function.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    },
  )
}

/**
 * Creates a Supabase admin client for server-side operations that bypass RLS.
 * Uses the service role key - only use this in secure server contexts.
 */
export function createAdminClient() {
  return createSupabaseClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
