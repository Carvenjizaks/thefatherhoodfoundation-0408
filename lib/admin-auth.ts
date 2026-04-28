import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_TOKEN_COOKIE = "ff_admin_token"
const ADMIN_TOKEN_VALUE = "ff_admin_authenticated_session_2026"

export function generateAdminToken(): string {
  return ADMIN_TOKEN_VALUE
}

export async function verifyAdminRequest(): Promise<boolean> {
  try {
    // First try cookie-based auth
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE)
    if (token?.value === ADMIN_TOKEN_VALUE) {
      return true
    }

    // Fallback: check Authorization header (Bearer token)
    const headerStore = await headers()
    const authHeader = headerStore.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7)
      if (bearerToken === ADMIN_TOKEN_VALUE) {
        return true
      }
    }

    return false
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
