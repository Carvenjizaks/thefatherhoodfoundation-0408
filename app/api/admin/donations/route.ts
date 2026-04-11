import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET() {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const supabase = createAdminClient()

    const { data: donations, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching donations:", error)
      return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
    }

    return NextResponse.json({ donations: donations || [] })
  } catch (error) {
    console.error("Error in donations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
