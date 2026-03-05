import { createBrowserClient } from '@supabase/ssr'

// Ensure URL has https:// protocol
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  return `https://${url}`
}

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
