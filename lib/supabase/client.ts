import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // During SSR in embedded previews, env vars may not be available yet.
  // Return a deferred client that will work once hydrated in the browser.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      // Return a placeholder during SSR — component will re-render on client
      return new Proxy({} as SupabaseClient, {
        get(_, prop) {
          if (prop === 'auth') {
            return new Proxy({}, {
              get() {
                return async () => ({ data: null, error: new Error('Supabase not initialized during SSR') })
              },
            })
          }
          if (prop === 'from') {
            return () => ({
              select: () => ({ data: null, error: null, eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }), order: () => ({ data: null, error: null }) }) }),
              insert: () => ({ data: null, error: null }),
              update: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
              delete: () => ({ data: null, error: null, eq: () => ({ data: null, error: null }) }),
            })
          }
          return undefined
        },
      })
    }
  }

  client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return client
}
