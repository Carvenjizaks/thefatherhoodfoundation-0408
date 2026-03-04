import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch all registrations
    const { data, error } = await supabase
      .from("table_talk_registrations")
      .select("*")
      .order("session_date", { ascending: true })
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
