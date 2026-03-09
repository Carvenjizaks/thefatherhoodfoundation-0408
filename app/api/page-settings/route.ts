import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("page_settings")
      .select("*")
      .order("page_name", { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching page settings:", error)
    return NextResponse.json({ error: "Failed to fetch page settings" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { slug, is_active, hidden_message } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("page_settings")
      .update({ 
        is_active, 
        hidden_message,
        updated_at: new Date().toISOString()
      })
      .eq("slug", slug)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating page settings:", error)
    return NextResponse.json({ error: "Failed to update page settings" }, { status: 500 })
  }
}
