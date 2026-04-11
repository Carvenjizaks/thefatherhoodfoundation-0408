import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET() {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const supabase = createAdminClient()

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching contacts:", error)
      return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
    }

    return NextResponse.json({ contacts: contacts || [] })
  } catch (error) {
    console.error("Error in contacts API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
