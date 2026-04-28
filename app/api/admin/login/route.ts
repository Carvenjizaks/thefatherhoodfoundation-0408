import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// Fallback for owner if DB is not available
const OWNER_USERNAME = process.env.ADMIN_USERNAME || "carvenjizaks"
const OWNER_PASSWORD = process.env.ADMIN_PASSWORD || "!carvenjizaks*Ci26"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Try to authenticate against admin_users table first
    const supabase = createAdminClient()
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("id, email, first_name, last_name, role, is_active, password_hash")
      .eq("email", username)
      .eq("is_active", true)
      .single()

    if (adminUser && !error) {
      // Check password against stored password_hash
      const isValidPassword = adminUser.password_hash === password

      if (isValidPassword) {
        const cookieStore = await cookies()
        const tokenData = {
          userId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          name: `${adminUser.first_name} ${adminUser.last_name}`,
        }
        
        // Store token with user info encoded
        const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")
        
        cookieStore.set("ff_admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 24 hours
          path: "/",
        })

        return NextResponse.json({ 
          success: true, 
          token,
          user: {
            id: adminUser.id,
            email: adminUser.email,
            firstName: adminUser.first_name,
            lastName: adminUser.last_name,
            role: adminUser.role,
          }
        })
      }
    }

    // Fallback to env-based owner login (backwards compatibility)
    if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
      const cookieStore = await cookies()
      const tokenData = {
        userId: "owner",
        email: OWNER_USERNAME,
        role: "owner",
        name: "Carven Izaks",
      }
      
      const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")
      
      cookieStore.set("ff_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      })

      return NextResponse.json({ 
        success: true, 
        token,
        user: {
          id: "owner",
          email: OWNER_USERNAME,
          firstName: "Carven",
          lastName: "Izaks",
          role: "owner",
        }
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
