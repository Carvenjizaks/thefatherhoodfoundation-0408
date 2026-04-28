import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

const ALLOWED_TABLES = ["event_registrations", "table_talk_registrations", "donations"]
const ALLOWED_FIELDS = ["payment_status", "checked_in"]

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const { id, table, field, value } = await request.json()

    if (!id || !table || !field || value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate table and field to prevent injection
    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 })
    }

    if (!ALLOWED_FIELDS.includes(field)) {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from(table)
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }

    return NextResponse.json({ success: true, id, field, value })
  } catch (error) {
    console.error("Update status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
