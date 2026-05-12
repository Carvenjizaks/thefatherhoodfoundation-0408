import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("t")

    if (token) {
      const supabase = createAdminClient()
      // Find the log entry by open_token
      const { data: log } = await supabase
        .from("email_campaign_logs")
        .select("id, opened_at")
        .eq("open_token", token)
        .single()

      if (log && !log.opened_at) {
        // First open — record it
        await supabase
          .from("email_campaign_logs")
          .update({ opened_at: new Date().toISOString() })
          .eq("id", log.id)

        // Also bump campaign opened_count
        const { data: logFull } = await supabase
          .from("email_campaign_logs")
          .select("campaign_id")
          .eq("id", log.id)
          .single()

        if (logFull?.campaign_id) {
          await supabase.rpc("increment_campaign_opened", { campaign_id_arg: logFull.campaign_id })
        }
      }
    }
  } catch {
    // Silently fail — never block the pixel response
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  })
}
