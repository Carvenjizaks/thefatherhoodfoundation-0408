import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { token, role } = await request.json()
    if (!token || !role) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const supabase = await createClient()

    const { data: sub } = await supabase
      .from("mgm_subscriptions")
      .select("id, unsubscribed_husband, unsubscribed_wife, unsubscribed_couple")
      .or(`husband_preference_token.eq.${token},wife_preference_token.eq.${token},couple_preference_token.eq.${token}`)
      .eq("is_active", true)
      .maybeSingle()

    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const updates: Record<string, boolean> = {}
    if (role === "husband") updates.unsubscribed_husband = true
    if (role === "wife") updates.unsubscribed_wife = true
    if (role === "couple") {
      updates.unsubscribed_husband = true
      updates.unsubscribed_wife = true
      updates.unsubscribed_couple = true
      updates.is_active = false
    }

    // If both now unsubscribed, deactivate
    const willHusbandUnsub = role === "husband" || role === "couple" || sub.unsubscribed_husband
    const willWifeUnsub = role === "wife" || role === "couple" || sub.unsubscribed_wife
    if (willHusbandUnsub && willWifeUnsub) updates.is_active = false

    const { error } = await supabase.from("mgm_subscriptions").update(updates).eq("id", sub.id)
    if (error) return NextResponse.json({ error: "Failed" }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
