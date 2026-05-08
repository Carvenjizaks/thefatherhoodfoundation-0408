import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { token, role, husbandEmails, wifeEmails, coupleEmails } = await request.json()
    if (!token || !role) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const supabase = await createClient()

    const { data: sub } = await supabase
      .from("mgm_subscriptions")
      .select("id")
      .or(`husband_preference_token.eq.${token},wife_preference_token.eq.${token},couple_preference_token.eq.${token}`)
      .eq("is_active", true)
      .maybeSingle()

    if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 })

    const updates: Record<string, boolean> = {}
    if (role === "husband") {
      updates.receive_husband_emails = !!husbandEmails
      updates.receive_couple_emails = !!coupleEmails
    } else if (role === "wife") {
      updates.receive_wife_emails = !!wifeEmails
    } else if (role === "couple") {
      updates.receive_couple_emails = !!coupleEmails
      updates.receive_husband_emails = !!husbandEmails
      updates.receive_wife_emails = !!wifeEmails
    }

    const { error } = await supabase.from("mgm_subscriptions").update(updates).eq("id", sub.id)
    if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
