import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Pages that should never be blocked (admin, API, static assets, etc.)
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip excluded paths
  if (EXCLUDED_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Skip root path check here — homepage is always visible
  // Only check paths with actual segments
  if (pathname === "/") {
    return NextResponse.next()
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      // If env vars not set, allow all traffic through
      return NextResponse.next()
    }

    const url = supabaseUrl.startsWith("http") ? supabaseUrl : `https://${supabaseUrl}`

    const response = await fetch(
      `${url}/rest/v1/page_settings?page_path=eq.${encodeURIComponent(pathname)}&select=is_visible,hidden_message`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // Short timeout so it doesn't slow down page loads
        signal: AbortSignal.timeout(2000),
      }
    )

    if (response.ok) {
      const data = await response.json()

      if (data && data.length > 0 && data[0].is_visible === false) {
        // Page is disabled — redirect to coming-soon with message
        const comingSoonUrl = new URL("/coming-soon", request.url)
        comingSoonUrl.searchParams.set("from", pathname)
        if (data[0].hidden_message) {
          comingSoonUrl.searchParams.set("message", data[0].hidden_message)
        }
        return NextResponse.redirect(comingSoonUrl)
      }
    }
  } catch {
    // If DB check fails, allow through — don't block users due to DB errors
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)",
}
