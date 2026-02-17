import { NextResponse, type NextRequest } from 'next/server'

/**
 * Session update is disabled to avoid browser restriction issues
 * in the v0 embedded preview. The middleware passes through all requests.
 */
export async function updateSession(request: NextRequest) {
  return NextResponse.next({ request })
}
