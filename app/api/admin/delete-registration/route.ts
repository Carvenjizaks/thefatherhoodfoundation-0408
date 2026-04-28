import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { verifyAdminRequest } from "@/lib/admin-auth"

const ALLOWED_TABLES = ["event_registrations", "table_talk_registrations", "contacts", "donations"]

export async function POST(request: Request) {
  const isAuthorized = await verifyAdminRequest()
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id, table } = await request.json()

    if (!id || !table) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json({ error: "Invalid table" }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete registration error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
