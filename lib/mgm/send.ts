import { FROM_ADDRESS } from "./email-templates"

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendMgmEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text } = params
  const recipients = Array.isArray(to) ? to : [to]

  const smtpApiKey = process.env.SMTP_API_KEY
  const smtpChannel = process.env.SMTP_CHANNEL

  // Try SMTP.com first
  if (smtpApiKey && smtpChannel) {
    try {
      const payload = {
        key: smtpApiKey,
        message: {
          channel: smtpChannel,
          recipients: { to: recipients.map((email) => ({ address: { email } })) },
          originator: { from: { address: { email: FROM_ADDRESS } } },
          subject,
          body: { parts: [{ type: "text/html", content: html }, { type: "text/plain", content: text }] },
        },
      }

      const res = await fetch("https://api.smtp.com/v4/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data?.status === "success") {
        return { success: true, messageId: data?.data?.message_id }
      }

      console.error("[MGM Email] SMTP.com failed:", JSON.stringify(data))
    } catch (err) {
      console.error("[MGM Email] SMTP.com error:", err)
    }
  }

  // Fallback: nodemailer via internal send-email route
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: recipients.join(","), subject, html, text, from: FROM_ADDRESS }),
    })

    if (res.ok) {
      return { success: true }
    }

    const errData = await res.json().catch(() => ({}))
    console.error("[MGM Email] Fallback send failed:", errData)
    return { success: false, error: JSON.stringify(errData) }
  } catch (err) {
    console.error("[MGM Email] Fallback error:", err)
    return { success: false, error: String(err) }
  }
}
