import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getEmailContent } from "@/lib/mgm/email-content"
import { buildNurtureEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"
import {
  advanceProgress,
  computeNextSendAt,
  resolveEmailForState,
  shouldSendToHusband,
  shouldSendToWife,
  markInactiveIfNoStreamsEnabled,
} from "@/lib/mgm/schedule"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thefatherhoodfoundation.org"

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

  // Fetch all active subscriptions that are due
  const { data: subscriptions, error } = await supabase
    .from("mgm_subscriptions")
    .select("*")
    .eq("is_active", true)
    .lte("next_send_at", now.toISOString())
    .limit(100)

  if (error) {
    console.error("[MGM Cron] Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ message: "No due subscriptions", processed: 0 })
  }

  let processed = 0
  let skipped = 0
  let errors = 0

  for (const sub of subscriptions) {
    try {
      const streamType = resolveEmailForState(sub.current_week_in_cycle)
      const content = getEmailContent(sub.current_month)

      if (!content) {
        console.error(`[MGM Cron] No content for month ${sub.current_month}, skipping ${sub.id}`)
        skipped++
        continue
      }

      // ── IDEMPOTENCY: check if this cycle was already sent ──────────────
      const { data: recentLog } = await supabase
        .from("mgm_email_logs")
        .select("id")
        .eq("subscription_id", sub.id)
        .eq("stream_type", streamType)
        .gte("sent_at", new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()) // within 3 days
        .maybeSingle()

      if (recentLog) {
        console.warn(`[MGM Cron] Already sent ${streamType} for ${sub.id} recently, skipping duplicate`)
        skipped++
        continue
      }

      // ── RECIPIENT RESOLUTION ───────────────────────────────────────────
      const husbandReceives = shouldSendToHusband(sub, streamType)
      const wifeReceives = shouldSendToWife(sub, streamType)

      const logEntries: Promise<any>[] = []
      let anySent = false

      // ── COUPLES_1 and COUPLES_2 ────────────────────────────────────────
      if (streamType === "COUPLES_1" || streamType === "COUPLES_2") {
        const emailBlock = streamType === "COUPLES_1" ? content.couples1 : content.couples2
        const ctaUrl = `${SITE_URL}/my-great-marriage/check-in`

        // Send to husband individually if enabled
        if (husbandReceives) {
          const email = buildNurtureEmail({
            recipientName: sub.husband_first_name,
            partnerName: sub.wife_first_name,
            emailBlock,
            theme: content.theme,
            month: content.month,
            ctaUrl,
            preferenceToken: sub.husband_preference_token,
            recipientLabel: "couple emails",
            isCouple: true,
          })
          const result = await sendMgmEmail({ to: sub.husband_email, ...email })
          logEntries.push(
            supabase.from("mgm_email_logs").insert({
              subscription_id: sub.id,
              stream_type: streamType,
              recipient_type: "HUSBAND",
              recipient_email: sub.husband_email,
              subject: email.subject,
              status: result.success ? "sent" : "failed",
              provider_message_id: result.messageId || null,
              error_message: result.error || null,
            })
          )
          if (result.success) anySent = true
        }

        // Send to wife individually if enabled
        if (wifeReceives) {
          const email = buildNurtureEmail({
            recipientName: sub.wife_first_name,
            partnerName: sub.husband_first_name,
            emailBlock,
            theme: content.theme,
            month: content.month,
            ctaUrl,
            preferenceToken: sub.wife_preference_token,
            recipientLabel: "couple emails",
            isCouple: true,
          })
          const result = await sendMgmEmail({ to: sub.wife_email, ...email })
          logEntries.push(
            supabase.from("mgm_email_logs").insert({
              subscription_id: sub.id,
              stream_type: streamType,
              recipient_type: "WIFE",
              recipient_email: sub.wife_email,
              subject: email.subject,
              status: result.success ? "sent" : "failed",
              provider_message_id: result.messageId || null,
              error_message: result.error || null,
            })
          )
          if (result.success) anySent = true
        }
      }

      // ── HUSBANDS ───────────────────────────────────────────────────────
      if (streamType === "HUSBANDS" && husbandReceives) {
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
        logEntries.push(
          supabase.from("mgm_email_logs").insert({
            subscription_id: sub.id,
            stream_type: "HUSBANDS",
            recipient_type: "HUSBAND",
            recipient_email: sub.husband_email,
            subject: email.subject,
            status: result.success ? "sent" : "failed",
            provider_message_id: result.messageId || null,
            error_message: result.error || null,
          })
        )
        if (result.success) anySent = true
      }

      // ── WIVES ──────────────────────────────────────────────────────────
      if (streamType === "WIVES" && wifeReceives) {
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
        logEntries.push(
          supabase.from("mgm_email_logs").insert({
            subscription_id: sub.id,
            stream_type: "WIVES",
            recipient_type: "WIFE",
            recipient_email: sub.wife_email,
            subject: email.subject,
            status: result.success ? "sent" : "failed",
            provider_message_id: result.messageId || null,
            error_message: result.error || null,
          })
        )
        if (result.success) anySent = true
      }

      // Flush logs in parallel
      await Promise.all(logEntries)

      // ── ADVANCE JOURNEY STATE ──────────────────────────────────────────
      const { nextMonth, nextWeek, isCompleted } = advanceProgress(
        sub.current_month,
        sub.current_week_in_cycle
      )

      // nextSendAt = current nextSendAt + 7 days (not now + 7 days)
      const currentSendAt = new Date(sub.next_send_at)
      const nextSendAt = computeNextSendAt(currentSendAt)

      // Check if all streams are now disabled — mark inactive if so
      const shouldDeactivate =
        isCompleted || markInactiveIfNoStreamsEnabled(sub)

      await supabase
        .from("mgm_subscriptions")
        .update({
          current_month: nextMonth,
          current_week_in_cycle: nextWeek,
          last_sent_at: now.toISOString(),
          next_send_at: nextSendAt.toISOString(),
          is_active: !shouldDeactivate,
        })
        .eq("id", sub.id)

      processed++
    } catch (err) {
      console.error(`[MGM Cron] Error processing subscription ${sub.id}:`, err)
      errors++
    }
  }

  return NextResponse.json({
    message: "Cron complete",
    processed,
    skipped,
    errors,
    checkedAt: now.toISOString(),
  })
}
