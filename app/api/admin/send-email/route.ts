import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"
import { createAdminClient } from "@/lib/supabase/server"

function getSmtpConfig() {
  return {
    apiKey: process.env.SMTP_API_KEY,
    senderEmail: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    senderName: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
    channel: process.env.SMTP_CHANNEL,
  }
}

async function sendEmailSMTP(to: string, toName: string, subject: string, html: string, text: string) {
  const { apiKey, senderEmail, senderName, channel } = getSmtpConfig()
  if (!apiKey) throw new Error("SMTP_API_KEY not set")

  const response = await fetch("https://api.smtp.com/v4/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      channel: channel || "default",
      recipients: { to: [{ address: to, name: toName }] },
      originator: { from: { address: senderEmail, name: senderName } },
      subject,
      body: {
        parts: [
          { type: "text/plain", content: text },
          { type: "text/html", content: html },
        ],
      },
    }),
  })

  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.error?.message || "Failed to send email")
  }

  return await response.json()
}

// Wraps all <a href="..."> links to go through click tracker
function wrapLinksForTracking(html: string, openToken: string, appUrl: string): string {
  return html.replace(
    /<a\s+([^>]*?)href="([^"]+)"([^>]*?)>/gi,
    (match, before, href, after) => {
      // Skip tracking for unsubscribe links and anchor links
      if (href.includes("/unsubscribe") || href.startsWith("#") || href.startsWith("mailto:")) {
        return match
      }
      const tracked = `${appUrl}/api/track/click?t=${openToken}&url=${encodeURIComponent(href)}`
      return `<a ${before}href="${tracked}"${after}>`
    }
  )
}

function buildEmailHTML(
  body: string,
  recipientName: string,
  unsubscribeUrl: string,
  openPixelUrl: string,
  fontFamily = "Arial, sans-serif",
  fontSize = "14px",
  fontColor = "#1a0a0e",
  isBold = false,
  isItalic = false,
  isUnderline = false,
  textAlign = "left",
) {
  const fontStyle = [
    isBold ? "font-weight: bold;" : "",
    isItalic ? "font-style: italic;" : "",
    isUnderline ? "text-decoration: underline;" : "",
  ].filter(Boolean).join(" ")

  // If body contains HTML tags treat it as rich HTML, otherwise format as paragraphs
  const isHtml = /<[a-z][\s\S]*>/i.test(body)
  const formattedBody = isHtml
    ? body
    : body
        .split("\n")
        .map(line => `<p style="margin:0 0 12px 0;">${line || "&nbsp;"}</p>`)
        .join("")

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#8B2B3E;padding:28px 30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;font-family:Arial,sans-serif;">The Fatherhood Foundation</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 36px;">
            <p style="margin:0 0 18px 0;font-size:16px;font-family:${fontFamily};color:${fontColor};">Dear ${recipientName},</p>
            <div style="font-family:${fontFamily};font-size:${fontSize};color:${fontColor};line-height:1.7;text-align:${textAlign};${fontStyle}">
              ${formattedBody}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f8f8;padding:18px 36px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0 0 8px 0;font-size:11px;color:#999;font-family:Arial,sans-serif;">
              The Fatherhood Foundation &mdash; 18 Liliencron Street, Eros, Windhoek, Namibia
            </p>
            <p style="margin:0;font-size:11px;color:#bbb;font-family:Arial,sans-serif;">
              You received this email because you are subscribed to communications from The Fatherhood Foundation.<br/>
              <a href="${unsubscribeUrl}" style="color:#8B2B3E;text-decoration:underline;">Unsubscribe</a> from future emails.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
  <!-- Open tracking pixel -->
  <img src="${openPixelUrl}" width="1" height="1" style="display:none;" alt="" />
</body>
</html>`
}

type Recipient = {
  id?: string
  email: string
  firstName: string
  lastName: string
  unsubscribeToken?: string
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const body = await request.json()
    const {
      recipients,
      subject,
      body: emailBody,
      fontFamily = "Arial, sans-serif",
      fontSize = "14px",
      fontColor = "#1a0a0e",
      isBold = false,
      isItalic = false,
      isUnderline = false,
      textAlign = "left",
      campaignName,
      sendToType = "individual",
      sendToValue,
    } = body

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 })
    }
    if (!subject || !emailBody) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thefathersfoundations.org"

    // Enrich recipients with unsubscribe tokens, filter out unsubscribed
    const emails = recipients.map((r: Recipient) => r.email.toLowerCase())
    const { data: dbContacts } = await supabase
      .from("contacts")
      .select("id, email, unsubscribe_token, unsubscribed")
      .in("email", emails)

    const contactMap = new Map(
      (dbContacts || []).map((c) => [c.email.toLowerCase(), c])
    )

    const enrichedRecipients: Recipient[] = recipients
      .filter((r: Recipient) => {
        const contact = contactMap.get(r.email.toLowerCase())
        return !contact?.unsubscribed
      })
      .map((r: Recipient) => {
        const contact = contactMap.get(r.email.toLowerCase())
        return { ...r, id: contact?.id, unsubscribeToken: contact?.unsubscribe_token || null }
      })

    if (enrichedRecipients.length === 0) {
      return NextResponse.json({ error: "All recipients have unsubscribed" }, { status: 400 })
    }

    // Create campaign record
    const { data: campaign } = await supabase
      .from("email_campaigns")
      .insert({
        name: campaignName || subject,
        subject,
        body: emailBody,
        font_family: fontFamily,
        font_size: fontSize,
        font_color: fontColor,
        is_bold: isBold,
        is_italic: isItalic,
        is_underline: isUnderline,
        text_align: textAlign,
        send_to_type: sendToType,
        send_to_value: sendToValue || null,
        status: "sending",
        total_recipients: enrichedRecipients.length,
      })
      .select()
      .single()

    const results: { email: string; success: boolean; error?: string }[] = []

    for (const recipient of enrichedRecipients) {
      const recipientName = `${recipient.firstName} ${recipient.lastName}`.trim() || recipient.email
      const unsubscribeUrl = recipient.unsubscribeToken
        ? `${appUrl}/unsubscribe?token=${recipient.unsubscribeToken}`
        : `${appUrl}/unsubscribe`

      // Pre-create log entry so we have an open_token before sending
      let logEntry: { id: string; open_token: string } | null = null
      if (campaign) {
        const { data: log } = await supabase
          .from("email_campaign_logs")
          .insert({
            campaign_id: campaign.id,
            contact_id: recipient.id || null,
            email: recipient.email,
            first_name: recipient.firstName,
            status: "pending",
          })
          .select("id, open_token")
          .single()
        logEntry = log
      }

      const openPixelUrl = logEntry?.open_token
        ? `${appUrl}/api/track/open?t=${logEntry.open_token}`
        : `${appUrl}/api/track/open`

      const personalizedBody = emailBody
        .replace(/\{\{first_name\}\}/g, recipient.firstName || "")
        .replace(/\{\{last_name\}\}/g, recipient.lastName || "")
        .replace(/\{\{email\}\}/g, recipient.email || "")
        .replace(/\{firstName\}/g, recipient.firstName || "")
        .replace(/\{lastName\}/g, recipient.lastName || "")

      let html = buildEmailHTML(
        personalizedBody, recipientName, unsubscribeUrl, openPixelUrl,
        fontFamily, fontSize, fontColor, isBold, isItalic, isUnderline, textAlign
      )

      // Wrap all links in click tracker
      if (logEntry?.open_token) {
        html = wrapLinksForTracking(html, logEntry.open_token, appUrl)
      }

      const text = `Dear ${recipientName},\n\n${personalizedBody}\n\n---\nTo unsubscribe: ${unsubscribeUrl}`

      try {
        await sendEmailSMTP(recipient.email, recipientName, subject, html, text)
        results.push({ email: recipient.email, success: true })

        if (logEntry) {
          await supabase
            .from("email_campaign_logs")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", logEntry.id)
        }
      } catch (err) {
        const error = err as Error
        results.push({ email: recipient.email, success: false, error: error.message })

        if (logEntry) {
          await supabase
            .from("email_campaign_logs")
            .update({ status: "failed", error: error.message })
            .eq("id", logEntry.id)
        }
      }
    }

    const sent = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    // Update campaign status
    if (campaign) {
      await supabase
        .from("email_campaigns")
        .update({ status: "sent", sent_at: new Date().toISOString(), sent_count: sent })
        .eq("id", campaign.id)
    }

    return NextResponse.json({
      success: true,
      message: `${sent} email(s) sent successfully${failed > 0 ? `, ${failed} failed` : ""}`,
      results,
      campaignId: campaign?.id,
    })
  } catch (error) {
    console.error("Admin send email error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
