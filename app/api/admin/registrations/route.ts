import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Fetch all Table Talk registrations
    const { data, error } = await supabase
      .from("table_talk_registrations")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching registrations:", error)
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      )
    }

    return NextResponse.json({ registrations: data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
