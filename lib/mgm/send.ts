import { FROM_ADDRESS } from "./email-templates"

const SMTP_API_URL = "https://api.smtp.com/v4/messages"

function parseSender(from: string): { address: string; name: string } {
  // Parse "Name <email>" format
  const match = from.match(/^(.+?)\s*<([^>]+)>$/)
  if (match) return { name: match[1].trim(), address: match[2].trim() }
  return { name: from, address: from }
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text: string
  replyTo?: string
}

export async function sendMgmEmail(
  params: SendEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text, replyTo } = params
  const recipients = Array.isArray(to) ? to : [to]
  const sender = parseSender(FROM_ADDRESS)

  const apiKey = process.env.SMTP_API_KEY
  const channel = process.env.SMTP_CHANNEL

  // Try SMTP.com API first
  if (apiKey && channel) {
    try {
      const body: Record<string, unknown> = {
        channel,
        recipients: {
          to: recipients.map((email) => ({ address: email, name: email })),
        },
        originator: {
          from: sender,
          ...(replyTo ? { reply_to: { address: replyTo } } : {}),
        },
        subject,
        body: {
          parts: [
            { type: "text/plain", content: text },
            { type: "text/html", content: html },
          ],
        },
      }

      const res = await fetch(SMTP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (res.ok) {
        return { success: true, messageId: data?.message_id }
      }

      console.error("[MGM Email] SMTP.com failed:", JSON.stringify(data))
    } catch (err) {
      console.error("[MGM Email] SMTP.com error:", err)
    }
  }

  // Fallback: send one by one via internal /api/send-email (supports single address)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  let lastError = ""

  for (const email of recipients) {
    try {
      const res = await fetch(`${baseUrl}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, subject, html, text, replyTo }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        lastError = JSON.stringify(err)
        console.error(`[MGM Email] Fallback failed for ${email}:`, lastError)
      }
    } catch (err) {
      lastError = String(err)
      console.error(`[MGM Email] Fallback error for ${email}:`, lastError)
    }
  }

  return lastError
    ? { success: false, error: lastError }
    : { success: true }
}
