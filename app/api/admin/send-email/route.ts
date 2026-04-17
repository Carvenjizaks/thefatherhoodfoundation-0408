import { NextResponse } from "next/server"
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/admin-auth"

function getSmtpConfig() {
  return {
    apiKey: process.env.SMTP_API_KEY,
    senderEmail: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    senderName: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
    channel: process.env.SMTP_CHANNEL,
  }
}

async function sendEmailSMTP(to: string, toName: string, subject: string, html: string, text: string) {
  const { apiKey: SMTP_API_KEY, senderEmail: SMTP_SENDER_EMAIL, senderName: SMTP_SENDER_NAME, channel: SMTP_CHANNEL } = getSmtpConfig()
  if (!SMTP_API_KEY) throw new Error("SMTP_API_KEY not set")

  const response = await fetch("https://api.smtp.com/v4/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SMTP_API_KEY}`,
    },
    body: JSON.stringify({
      channel: SMTP_CHANNEL || "default",
      recipients: { to: [{ address: to, name: toName }] },
      originator: {
        from: { address: SMTP_SENDER_EMAIL, name: SMTP_SENDER_NAME },
      },
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

function buildEmailHTML(subject: string, body: string, recipientName: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f5f5f5;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#1E3A5F;padding:25px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">The Fatherhood Foundation</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 15px 0;font-size:16px;color:#333333;">Dear ${recipientName},</p>
              <div style="font-size:15px;color:#444444;line-height:1.7;">
                ${body.split('\n').map(line => `<p style="margin:0 0 12px 0;">${line}</p>`).join('')}
              </div>
              <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />
              <p style="margin:0;font-size:13px;color:#999999;">
                Warm regards,<br/>
                <strong>The Fatherhood Foundation</strong><br/>
                Building Stronger Families
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const isAdmin = await verifyAdminRequest()
    if (!isAdmin) return unauthorizedResponse()

    const { recipients, subject, body } = await request.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 })
    }
    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body are required" }, { status: 400 })
    }

    const results: { email: string; success: boolean; error?: string }[] = []

    for (const recipient of recipients) {
      try {
        const recipientName = `${recipient.firstName} ${recipient.lastName}`.trim() || recipient.email
        const html = buildEmailHTML(subject, body, recipientName)
        const text = `Dear ${recipientName},\n\n${body}\n\nWarm regards,\nThe Fatherhood Foundation`

        await sendEmailSMTP(recipient.email, recipientName, subject, html, text)
        results.push({ email: recipient.email, success: true })
      } catch (err) {
        const error = err as Error
        results.push({ email: recipient.email, success: false, error: error.message })
      }
    }

    const sent = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `${sent} email(s) sent successfully${failed > 0 ? `, ${failed} failed` : ""}`,
      results,
    })
  } catch (error) {
    console.error("Admin send email error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
