import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { buildWelcomeEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get("mgm_admin_auth")?.value === "true"
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { action, subId } = await request.json()
  const supabase = await createClient()

  if (action === "mark_inactive") {
    const { error } = await supabase.from("mgm_subscriptions").update({ is_active: false }).eq("id", subId)
    if (error) return NextResponse.json({ error: "Failed" }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "resend_welcome") {
    const { data: sub } = await supabase.from("mgm_subscriptions").select("*").eq("id", subId).single()
    if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const email = buildWelcomeEmail({
      husbandFirstName: sub.husband_first_name,
      wifeFirstName: sub.wife_first_name,
      husbandToken: sub.husband_preference_token,
      wifeToken: sub.wife_preference_token,
    })

    await sendMgmEmail({ to: [sub.husband_email, sub.wife_email], ...email })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
