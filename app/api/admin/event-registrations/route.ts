import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

export async function GET(request: Request) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()
    const { searchParams } = new URL(request.url)
    const eventSlug = searchParams.get("event")

    const supabase = createAdminClient()

    let query = supabase
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (eventSlug) {
      query = query.eq("event_slug", eventSlug)
    }

    const { data: registrations, error } = await query

    if (error) {
      console.error("[v0] Error fetching event registrations:", error)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    return NextResponse.json({ registrations: registrations || [] })
  } catch (error) {
    console.error("[v0] Error in event registrations API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
