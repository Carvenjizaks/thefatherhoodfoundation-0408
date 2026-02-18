import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // During SSR or in embedded previews, env vars may not be available yet.
  // Return a safe no-op proxy that won't throw.
  if (!supabaseUrl || !supabaseAnonKey) {
    const noopError = new Error('Supabase not initialized — missing env vars')
    const noopResult = { data: null, error: noopError }
    const chainable: any = new Proxy({}, {
      get() {
        return (..._args: any[]) => chainable
      },
    })
    chainable.then = undefined // prevent it from being treated as a Promise
    Object.assign(chainable, { data: null, error: noopError })

    return new Proxy({} as SupabaseClient, {
      get(_, prop) {
        if (prop === 'auth') {
          return new Proxy({}, {
            get() {
              return async () => noopResult
            },
          })
        }
        if (prop === 'from') {
          return () => chainable
        }
        if (prop === 'rpc') {
          return async () => noopResult
        }
        return undefined
      },
    })
  }

  client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return client
}
