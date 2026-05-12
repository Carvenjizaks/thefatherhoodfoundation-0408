import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("t")
  const url = searchParams.get("url")

  // Always redirect even if tracking fails
  const destination = url ? decodeURIComponent(url) : "/"

  if (token && url) {
    try {
      const supabase = createAdminClient()

      const { data: log } = await supabase
        .from("email_campaign_logs")
        .select("id, campaign_id, contact_id, email, opened_at")
        .eq("open_token", token)
        .single()

      if (log) {
        const now = new Date().toISOString()

        // Record click event
        await supabase.from("email_link_clicks").insert({
          log_id: log.id,
          campaign_id: log.campaign_id,
          contact_id: log.contact_id,
          email: log.email,
          original_url: decodeURIComponent(url),
          clicked_at: now,
          user_agent: request.headers.get("user-agent") || null,
        })

        // Increment click_count on the log row
        await supabase.rpc("increment_log_click", { log_id_arg: log.id })

        // Update last_clicked_at; also mark opened if not already
        await supabase
          .from("email_campaign_logs")
          .update({
            last_clicked_at: now,
            opened_at: log.opened_at ?? now,
          })
          .eq("id", log.id)
      }
    } catch {
      // Silently fail — always redirect
    }
  }

  return NextResponse.redirect(destination, { status: 302 })
}
