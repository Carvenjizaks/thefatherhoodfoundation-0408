import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ error: "Invalid unsubscribe token" }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("contacts")
      .update({ unsubscribed: true, unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token)
      .select("email, first_name")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, email: data.email, firstName: data.first_name })
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
  }
}
