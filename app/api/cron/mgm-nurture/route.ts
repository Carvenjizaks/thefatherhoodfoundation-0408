import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getEmailContent } from "@/lib/mgm/email-content"
import { buildNurtureEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"
import { advanceProgress, computeNextSendAt } from "@/lib/mgm/schedule"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefatherhoodfoundation.org"

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("Authorization")
  const querySecret = request.nextUrl.searchParams.get("secret")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  const now = new Date()

  // Fetch due subscriptions
  const { data: subscriptions, error } = await supabase
    .from("mgm_subscriptions")
    .select("*")
    .eq("is_active", true)
    .lte("next_send_at", now.toISOString())
    .limit(50)

  if (error) {
    console.error("[MGM Cron] Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ message: "No due subscriptions", processed: 0 })
  }

  let processed = 0
  let errors = 0

  for (const sub of subscriptions) {
    try {
      const content = getEmailContent(sub.current_month)
      if (!content) {
        console.error(`[MGM Cron] No content for month ${sub.current_month}`)
        continue
      }

      const week = sub.current_week_in_cycle
      const logs: Promise<any>[] = []

      // Week 1: Couples email
      if (week === 1 && sub.receive_couple_emails && !sub.unsubscribed_couple) {
        const email = buildNurtureEmail({
          recipientName: sub.husband_first_name,
          partnerName: sub.wife_first_name,
          emailBlock: content.couples1,
          theme: content.theme,
          month: content.month,
          ctaUrl: `${SITE_URL}/my-great-marriage/check-in`,
          preferenceToken: sub.couple_preference_token,
          recipientLabel: "couple emails",
          isCouple: true,
        })

        const recipients: string[] = []
        if (!sub.unsubscribed_husband) recipients.push(sub.husband_email)
        if (!sub.unsubscribed_wife) recipients.push(sub.wife_email)

        if (recipients.length > 0) {
          const result = await sendMgmEmail({ to: recipients, ...email })
          logs.push(supabase.from("mgm_email_logs").insert({
            subscription_id: sub.id,
            stream_type: "COUPLES_1",
            recipient_type: "BOTH",
            recipient_email: recipients.join(", "),
            subject: email.subject,
            status: result.success ? "sent" : "failed",
            error_message: result.error || null,
          }))
        }
      }

      // Week 2: Husband email
      if (week === 2 && sub.receive_husband_emails && !sub.unsubscribed_husband) {
        const email = buildNurtureEmail({
          recipientName: sub.husband_first_name,
          emailBlock: content.husbands,
          theme: content.theme,
          month: content.month,
          ctaUrl: `${SITE_URL}/my-great-marriage`,
          preferenceToken: sub.husband_preference_token,
          recipientLabel: "husband emails",
          isCouple: false,
        })

        const result = await sendMgmEmail({ to: sub.husband_email, ...email })
        logs.push(supabase.from("mgm_email_logs").insert({
          subscription_id: sub.id,
          stream_type: "HUSBANDS",
          recipient_type: "HUSBAND",
          recipient_email: sub.husband_email,
          subject: email.subject,
          status: result.success ? "sent" : "failed",
          error_message: result.error || null,
        }))
      }

      // Week 3: Wife email
      if (week === 3 && sub.receive_wife_emails && !sub.unsubscribed_wife) {
        const email = buildNurtureEmail({
          recipientName: sub.wife_first_name,
          emailBlock: content.wives,
          theme: content.theme,
          month: content.month,
          ctaUrl: `${SITE_URL}/my-great-marriage`,
          preferenceToken: sub.wife_preference_token,
          recipientLabel: "wife emails",
          isCouple: false,
        })

        const result = await sendMgmEmail({ to: sub.wife_email, ...email })
        logs.push(supabase.from("mgm_email_logs").insert({
          subscription_id: sub.id,
          stream_type: "WIVES",
          recipient_type: "WIFE",
          recipient_email: sub.wife_email,
          subject: email.subject,
          status: result.success ? "sent" : "failed",
          error_message: result.error || null,
        }))
      }

      // Week 4: Couples check-in reminder
      if (week === 4 && sub.receive_couple_emails && !sub.unsubscribed_couple) {
        const email = buildNurtureEmail({
          recipientName: sub.husband_first_name,
          partnerName: sub.wife_first_name,
          emailBlock: content.couples2,
          theme: content.theme,
          month: content.month,
          ctaUrl: `${SITE_URL}/my-great-marriage/check-in`,
          preferenceToken: sub.couple_preference_token,
          recipientLabel: "couple emails",
          isCouple: true,
        })

        const recipients: string[] = []
        if (!sub.unsubscribed_husband) recipients.push(sub.husband_email)
        if (!sub.unsubscribed_wife) recipients.push(sub.wife_email)

        if (recipients.length > 0) {
          const result = await sendMgmEmail({ to: recipients, ...email })
          logs.push(supabase.from("mgm_email_logs").insert({
            subscription_id: sub.id,
            stream_type: "COUPLES_2",
            recipient_type: "BOTH",
            recipient_email: recipients.join(", "),
            subject: email.subject,
            status: result.success ? "sent" : "failed",
            error_message: result.error || null,
          }))
        }
      }

      // Flush logs
      await Promise.all(logs)

      // Advance progress
      const { nextMonth, nextWeek, isCompleted } = advanceProgress(sub.current_month, sub.current_week_in_cycle)
      const nextSendAt = computeNextSendAt(now)

      await supabase
        .from("mgm_subscriptions")
        .update({
          current_month: nextMonth,
          current_week_in_cycle: nextWeek,
          last_sent_at: now.toISOString(),
          next_send_at: nextSendAt.toISOString(),
          is_active: !isCompleted,
        })
        .eq("id", sub.id)

      processed++
    } catch (err) {
      console.error(`[MGM Cron] Error processing subscription ${sub.id}:`, err)
      errors++
    }
  }

  return NextResponse.json({ message: "Cron complete", processed, errors })
}
