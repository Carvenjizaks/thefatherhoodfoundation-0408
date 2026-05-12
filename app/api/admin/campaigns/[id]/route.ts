import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await verifyAdminRequest()
  if (!isAdmin) return unauthorizedResponse()

  const { id } = await params
  const supabase = createAdminClient()

  // Campaign summary from analytics view
  const { data: campaign } = await supabase
    .from("campaign_analytics")
    .select("*")
    .eq("id", id)
    .single()

  const [logsRes, clicksRes] = await Promise.all([
    supabase
      .from("email_campaign_logs")
      .select("id, email, first_name, status, sent_at, opened_at, click_count, last_clicked_at, error")
      .eq("campaign_id", id)
      .order("sent_at", { ascending: true }),
    supabase
      .from("email_link_clicks")
      .select("id, email, original_url, clicked_at")
      .eq("campaign_id", id)
      .order("clicked_at", { ascending: false })
      .limit(100),
  ])

  return NextResponse.json({
    campaign,
    logs: logsRes.data || [],
    clicks: clicksRes.data || [],
  })
}
