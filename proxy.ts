import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const EXCLUDED_PATHS = [
  "/admin",
  "/api",
  "/coming-soon",
  "/_next",
  "/favicon",
  "/images",
  "/fonts",
  "/icons",
  "/pillars",
  "/books",
]

async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/" || EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.next()
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/page_settings?page_path=eq.${encodeURIComponent(pathname)}&select=is_visible,hidden_message`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: AbortSignal.timeout(2000),
      }
    )

    if (response.ok) {
      const data = await response.json()
      if (data && data.length > 0 && data[0].is_visible === false) {
        const url = new URL("/coming-soon", request.url)
        url.searchParams.set("from", pathname)
        if (data[0].hidden_message) {
          url.searchParams.set("message", data[0].hidden_message)
        }
        return NextResponse.redirect(url)
      }
    }
  } catch {
    // Allow through on any error
  }

  return NextResponse.next()
}

export default proxy
