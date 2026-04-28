import { cookies, headers } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_TOKEN_COOKIE = "ff_admin_token"
const LEGACY_TOKEN_VALUE = "ff_admin_authenticated_session_2026"

export interface AdminUser {
  userId: string
  email: string
  role: "owner" | "staff"
  name: string
}

export function decodeToken(token: string): AdminUser | null {
  try {
    // Check if it's the legacy token
    if (token === LEGACY_TOKEN_VALUE) {
      return {
        userId: "owner",
        email: "carvenjizaks",
        role: "owner",
        name: "Carven Izaks",
      }
    }
    // Decode base64 token
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"))
    return decoded as AdminUser
  } catch {
    return null
  }
}

export async function verifyAdminRequest(): Promise<boolean> {
  const user = await getAdminUser()
  return user !== null
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    // First try cookie-based auth
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE)
    if (token?.value) {
      const user = decodeToken(token.value)
      if (user) return user
    }

    // Fallback: check Authorization header (Bearer token)
    const headerStore = await headers()
    const authHeader = headerStore.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7)
      const user = decodeToken(bearerToken)
      if (user) return user
    }

    return null
  } catch {
    return null
  }
}

export async function isOwner(): Promise<boolean> {
  const user = await getAdminUser()
  return user?.role === "owner"
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
