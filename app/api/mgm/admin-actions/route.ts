import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { buildWelcomeEmail, FROM_ADDRESS } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"

async function isAdmin() {
  const cookieStore = await cookies()
  return cookieStore.get("mgm_admin_auth")?.value === "true"
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { action, subId, subIds, subject, body: emailBody, scheduledAt, recipientType } = body
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

  if (action === "send_bulk_email") {
    if (!subIds || !subject || !emailBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get all subscription details
    const { data: subs } = await supabase
      .from("mgm_subscriptions")
      .select("*")
      .in("id", subIds)

    if (!subs || subs.length === 0) {
      return NextResponse.json({ error: "No subscriptions found" }, { status: 404 })
    }

    // If scheduled, store in database for later processing
    if (scheduledAt) {
      const { error: insertError } = await supabase.from("scheduled_emails").insert({
        subject,
        html_body: emailBody,
        text_body: emailBody.replace(/<[^>]*>/g, ""), // Strip HTML for text version
        scheduled_at: scheduledAt,
        subscription_ids: subIds,
        status: "pending",
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("[MGM] Failed to schedule email:", insertError)
        return NextResponse.json({ error: "Failed to schedule email" }, { status: 500 })
      }

      return NextResponse.json({ success: true, scheduled: true })
    }

    // Helper to replace personalization tags
    function personalizeContent(content: string, sub: any, recipientEmail: string) {
      const isHusband = recipientEmail === sub.husband_email
      const firstName = isHusband ? sub.husband_first_name : sub.wife_first_name
      const coupleName = `${sub.husband_first_name} & ${sub.wife_first_name}`

      return content
        .replace(/\{\{first_name\}\}/g, firstName || "")
        .replace(/\{\{husband_name\}\}/g, sub.husband_first_name || "")
        .replace(/\{\{wife_name\}\}/g, sub.wife_first_name || "")
        .replace(/\{\{couple_name\}\}/g, coupleName)
        .replace(/\{\{email\}\}/g, recipientEmail)
    }

    // Build recipient list with subscription context for personalization
    const recipientList: { email: string; sub: any }[] = []
    for (const sub of subs) {
      if (recipientType === "men" || recipientType === "all") {
        recipientList.push({ email: sub.husband_email, sub })
      }
      if (recipientType === "women" || recipientType === "all") {
        recipientList.push({ email: sub.wife_email, sub })
      }
    }

    // Send personalized emails to each recipient individually
    let successCount = 0
    let failCount = 0

    for (const recipient of recipientList) {
      const personalizedBody = personalizeContent(emailBody, recipient.sub, recipient.email)
      const personalizedSubject = personalizeContent(subject, recipient.sub, recipient.email)

      const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #8B2B3E; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">My Great Marriage</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              ${personalizedBody}
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">The Fatherhood Foundation - Strengthening marriages, building families.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

      const textBody = personalizedBody.replace(/<[^>]*>/g, "")

      const result = await sendMgmEmail({
        to: [recipient.email],
        subject: personalizedSubject,
        html: fullHtml,
        text: textBody,
      })

      if (result.success) successCount++
      else failCount++

      // Log the email
      await supabase.from("mgm_email_log").insert({
        subscription_id: recipient.sub.id,
        recipient_email: recipient.email,
        stream_type: "ADMIN",
        subject: personalizedSubject,
        status: result.success ? "sent" : "failed",
      })
    }

    return NextResponse.json({ success: successCount > 0, sent: successCount, failed: failCount })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
