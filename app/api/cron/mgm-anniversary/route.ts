import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { buildAnniversaryEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"

export async function GET(request: NextRequest) {
  // Authenticate cron request
  const authHeader = request.headers.get("Authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  const now = new Date()
  
  // Get today's month and day (ignoring year)
  const todayMonth = now.getMonth() + 1 // 1-12
  const todayDay = now.getDate()

  // Find all active subscriptions whose anniversary is today
  // We compare month and day from the anniversary_date
  const { data: subscriptions, error } = await supabase
    .from("mgm_subscriptions")
    .select("*")
    .eq("is_active", true)
    .not("anniversary_date", "is", null)

  if (error) {
    console.error("[MGM Anniversary] Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ message: "No subscriptions with anniversaries", processed: 0 })
  }

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const sub of subscriptions) {
    try {
      // Parse anniversary date
      const anniversaryDate = new Date(sub.anniversary_date)
      const annMonth = anniversaryDate.getMonth() + 1
      const annDay = anniversaryDate.getDate()

      // Check if today is the anniversary
      if (annMonth !== todayMonth || annDay !== todayDay) {
        continue // Not today's anniversary
      }

      // Calculate years married
      const yearsMarried = now.getFullYear() - anniversaryDate.getFullYear()

      // Check if we already sent anniversary email this year
      const thisYearStart = new Date(now.getFullYear(), 0, 1)
      const { data: recentLog } = await supabase
        .from("mgm_email_logs")
        .select("id")
        .eq("subscription_id", sub.id)
        .eq("stream_type", "ANNIVERSARY")
        .gte("created_at", thisYearStart.toISOString())
        .maybeSingle()

      if (recentLog) {
        console.warn(`[MGM Anniversary] Already sent anniversary for ${sub.id} this year, skipping`)
        skipped++
        continue
      }

      // Build and send anniversary email
      const email = buildAnniversaryEmail({
        husbandFirstName: sub.husband_first_name,
        wifeFirstName: sub.wife_first_name,
        yearsMarried,
        anniversaryDate: sub.anniversary_date,
        husbandToken: sub.husband_preference_token,
        wifeToken: sub.wife_preference_token,
      })

      // Send to both husband and wife
      const recipients = [sub.husband_email, sub.wife_email]
      const result = await sendMgmEmail({ to: recipients, ...email })

      // Log the email
      await supabase.from("mgm_email_logs").insert({
        subscription_id: sub.id,
        stream_type: "ANNIVERSARY",
        recipient_type: "BOTH",
        recipient_email: recipients.join(", "),
        subject: email.subject,
        status: result.success ? "sent" : "failed",
        provider_message_id: result.messageId || null,
        error_message: result.error || null,
      })

      if (result.success) {
        console.log(`[MGM Anniversary] Sent anniversary email to ${sub.husband_first_name} & ${sub.wife_first_name} (${yearsMarried} years)`)
        processed++
      } else {
        console.error(`[MGM Anniversary] Failed to send to ${sub.id}:`, result.error)
        errors++
      }
    } catch (err) {
      console.error(`[MGM Anniversary] Error processing subscription ${sub.id}:`, err)
      errors++
    }
  }

  return NextResponse.json({
    message: "Anniversary cron complete",
    processed,
    skipped,
    errors,
    checkedAt: now.toISOString(),
  })
}
