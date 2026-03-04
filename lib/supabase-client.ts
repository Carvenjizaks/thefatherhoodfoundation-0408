import { createBrowserClient } from '@supabase/ssr'

// Ensure URL has https:// protocol
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  // If URL is empty or doesn't have protocol, construct the full URL
  if (!url) {
    return ''
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // Add https:// if missing
  return `https://${url}`
}

export function createClient() {
  return createBrowserClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
