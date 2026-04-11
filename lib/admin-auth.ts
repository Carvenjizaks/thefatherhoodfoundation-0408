import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_TOKEN_COOKIE = "ff_admin_token"
const ADMIN_TOKEN_VALUE = "ff_admin_authenticated_session_2026"

export function generateAdminToken(): string {
  return ADMIN_TOKEN_VALUE
}

export async function verifyAdminRequest(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_TOKEN_COOKIE)
    return token?.value === ADMIN_TOKEN_VALUE
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
