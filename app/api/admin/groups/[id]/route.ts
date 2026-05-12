import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { id } = await params
    const { name, description, color } = await request.json()

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("contact_groups")
      .update({ name: name?.trim(), description: description?.trim() || null, color, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ group: data })
  } catch (error) {
    console.error("Group PATCH error:", error)
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { id } = await params

    const supabase = createAdminClient()
    const { error } = await supabase.from("contact_groups").delete().eq("id", id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Group DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 })
  }
}
