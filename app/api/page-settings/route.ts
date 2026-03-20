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
    const { page_path, is_visible, hidden_message } = await request.json()

    if (!page_path) {
      return NextResponse.json({ error: "page_path is required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("page_settings")
      .update({
        is_visible,
        hidden_message,
        updated_at: new Date().toISOString()
      })
      .eq("page_path", page_path)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error updating page settings:", error)
    return NextResponse.json({ error: "Failed to update page settings" }, { status: 500 })
  }
}
