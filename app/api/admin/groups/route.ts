import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const supabase = createAdminClient()
    const { data: groups, error } = await supabase
      .from("contact_groups")
      .select("*, contact_group_members(count)")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ groups: groups || [] })
  } catch (error) {
    console.error("Groups GET error:", error)
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const { name, description, color } = await request.json()
    if (!name?.trim()) return NextResponse.json({ error: "Group name is required" }, { status: 400 })

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("contact_groups")
      .insert({ name: name.trim(), description: description?.trim() || null, color: color || "#8B2B3E" })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ group: data })
  } catch (error) {
    console.error("Groups POST error:", error)
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 })
  }
}
