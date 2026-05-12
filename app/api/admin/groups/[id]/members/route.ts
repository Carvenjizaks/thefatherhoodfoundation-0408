import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { id } = await params

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("contact_group_members")
      .select("contact_id, added_at, contacts(id, first_name, last_name, email, tags)")
      .eq("group_id", id)
      .order("added_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ members: data || [] })
  } catch (error) {
    console.error("Group members GET error:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { id: group_id } = await params

    const { contact_ids } = await request.json()
    if (!Array.isArray(contact_ids) || contact_ids.length === 0) {
      return NextResponse.json({ error: "contact_ids array required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const rows = contact_ids.map((contact_id: string) => ({ group_id, contact_id }))
    const { error } = await supabase.from("contact_group_members").upsert(rows, { onConflict: "group_id,contact_id" })

    if (error) throw error
    return NextResponse.json({ success: true, added: contact_ids.length })
  } catch (error) {
    console.error("Group members POST error:", error)
    return NextResponse.json({ error: "Failed to add members" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { id: group_id } = await params
    const { contact_ids } = await request.json()

    const supabase = createAdminClient()
    const { error } = await supabase
      .from("contact_group_members")
      .delete()
      .eq("group_id", group_id)
      .in("contact_id", contact_ids)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Group members DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove members" }, { status: 500 })
  }
}
