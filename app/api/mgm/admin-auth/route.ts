import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_DASHBOARD_PASSWORD

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cookieStore = await cookies()
    cookieStore.set("mgm_admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
