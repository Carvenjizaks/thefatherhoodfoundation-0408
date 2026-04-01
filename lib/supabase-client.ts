import { createBrowserClient } from '@supabase/ssr'

// Ensure URL has https:// protocol
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // Return empty string during build to prevent errors (client will re-init on browser)
  if (!url) {
    if (typeof window === 'undefined') {
      return ''
    }
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  return `https://${url}`
}

export function createClient() {
  const url = getSupabaseUrl()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // Return a placeholder client during SSR build
  if (!url || !anonKey) {
    return null as unknown as ReturnType<typeof createBrowserClient>
  }
  
  return createBrowserClient(url, anonKey)
}
