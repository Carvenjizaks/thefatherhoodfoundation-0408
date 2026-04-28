import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "carvenjizaks@gmail.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "!carvenjizaks*Ci26"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const cookieStore = await cookies()
      cookieStore.set("ff_admin_token", "ff_admin_authenticated_session_2026", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
