import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const authenticated = cookieStore.get("mgm_admin_auth")?.value === "true"
  if (!authenticated) return new NextResponse("Unauthorized", { status: 401 })

  const supabase = await createClient()
  const { data: subs } = await supabase
    .from("mgm_subscriptions")
    .select("*")
    .order("created_at", { ascending: false })

  const headers = [
    "id", "husband_first_name", "husband_last_name", "husband_email",
    "wife_first_name", "wife_last_name", "wife_email",
    "country", "city", "anniversary_month",
    "current_month", "current_week_in_cycle",
    "receive_couple_emails", "receive_husband_emails", "receive_wife_emails",
    "is_active", "unsubscribed_husband", "unsubscribed_wife", "unsubscribed_couple",
    "last_sent_at", "next_send_at", "created_at",
  ]

  function escape(value: unknown): string {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = (subs || []).map((sub) =>
    headers.map((h) => escape(sub[h])).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="mgm-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
