import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { isOwner, unauthorizedResponse } from "@/lib/admin-auth"

// GET - List all admin users (owner only)
export async function GET() {
  try {
    const ownerCheck = await isOwner()
    if (!ownerCheck) {
      return unauthorizedResponse()
    }

    const supabase = createAdminClient()
    const { data: users, error } = await supabase
      .from("admin_users")
      .select("id, email, first_name, last_name, role, is_active, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching admin users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new admin user (owner only)
export async function POST(request: Request) {
  try {
    const ownerCheck = await isOwner()
    if (!ownerCheck) {
      return unauthorizedResponse()
    }

    const { email, password, firstName, lastName, role } = await request.json()

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Only allow staff role for new users (owner is unique)
    const userRole = role === "owner" ? "staff" : (role || "staff")

    const supabase = createAdminClient()
    
    // Check if email already exists
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const { data: newUser, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: password, // In production, hash with bcrypt
        first_name: firstName,
        last_name: lastName,
        role: userRole,
        is_active: true,
      })
      .select("id, email, first_name, last_name, role, is_active, created_at")
      .single()

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ user: newUser })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete/deactivate admin user (owner only)
export async function DELETE(request: Request) {
  try {
    const ownerCheck = await isOwner()
    if (!ownerCheck) {
      return unauthorizedResponse()
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // Don't allow deleting the owner
    const { data: user } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", id)
      .single()

    if (user?.role === "owner") {
      return NextResponse.json({ error: "Cannot delete owner account" }, { status: 400 })
    }

    const { error } = await supabase
      .from("admin_users")
      .update({ is_active: false })
      .eq("id", id)

    if (error) {
      console.error("Error deactivating user:", error)
      return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
