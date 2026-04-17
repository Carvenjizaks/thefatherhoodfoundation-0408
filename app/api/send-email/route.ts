import { NextResponse } from "next/server"

// SMTP.com API Configuration - read at runtime to work in serverless
function getSmtpConfig() {
  return {
    apiKey: process.env.SMTP_API_KEY,
    senderEmail: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    senderName: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
    channel: process.env.SMTP_CHANNEL,
  }
}

interface SendEmailRequest {
  to: string
  toName?: string
  subject: string
  html?: string
  text?: string
  replyTo?: string
}

interface SMTPApiResponse {
  status: string
  message_id?: string
  error?: string
}

async function sendViaSMTPApi(params: SendEmailRequest): Promise<SMTPApiResponse> {
  const { apiKey, senderEmail, senderName, channel } = getSmtpConfig()
  if (!apiKey) {
    throw new Error("SMTP_API_KEY environment variable is not set")
  }

  const { to, toName, subject, html, text, replyTo } = params

  // SMTP.com API endpoint
  const apiUrl = "https://api.smtp.com/v4/messages"

  const recipients = {
    to: [
      {
        address: to,
        name: toName || to,
      },
    ],
  }

  const body: Record<string, unknown> = {
    channel: channel || "default",
    recipients,
    originator: {
      from: {
        address: senderEmail,
        name: senderName,
      },
    },
    subject,
    body: {
      parts: [] as Array<{ type: string; content: string }>,
    },
  }

  // Add content parts
  if (text) {
    (body.body as { parts: Array<{ type: string; content: string }> }).parts.push({
      type: "text/plain",
      content: text,
    })
  }
  if (html) {
    (body.body as { parts: Array<{ type: string; content: string }> }).parts.push({
      type: "text/html",
      content: html,
    })
  }

  // Add reply-to if provided
  if (replyTo) {
    ;(body.originator as Record<string, unknown>).reply_to = {
      address: replyTo,
    }
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const result = await response.json()

  if (!response.ok) {
    console.error("[v0] SMTP.com API error:", result)
    throw new Error(result.error?.message || result.message || "Failed to send email via SMTP.com API")
  }

  return {
    status: "sent",
    message_id: result.message_id,
  }
}

// Fallback to nodemailer SMTP if API key not available
async function sendViaSMTPNodemailer(params: SendEmailRequest): Promise<SMTPApiResponse> {
  const { senderEmail, senderName } = getSmtpConfig()
  const SMTP_HOST = "send.smtp.com"
  const SMTP_PORT = 587
  const SMTP_USER = process.env.SMTP_USERNAME
  const SMTP_PASS = process.env.SMTP_PASSWORD

  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP credentials not configured (SMTP_USERNAME, SMTP_PASSWORD)")
  }

  const nodemailer = await import("nodemailer")

  const transporter = nodemailer.default.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const { to, toName, subject, html, text, replyTo } = params

  const info = await transporter.sendMail({
    from: `"${senderName}" <${senderEmail}>`,
    to: toName ? `"${toName}" <${to}>` : to,
    subject,
    text,
    html,
    replyTo,
  })

  return {
    status: "sent",
    message_id: info.messageId,
  }
}

export async function POST(request: Request) {
  try {
    const body: SendEmailRequest = await request.json()

    // Validate required fields
    if (!body.to || !body.subject) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject" },
        { status: 400 }
      )
    }

    if (!body.html && !body.text) {
      return NextResponse.json(
        { error: "Either html or text content is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.to)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    let result: SMTPApiResponse

    // Try SMTP.com API first, fallback to nodemailer
    const { apiKey } = getSmtpConfig()
    if (apiKey) {
      console.log("[v0] Sending email via SMTP.com API")
      result = await sendViaSMTPApi(body)
    } else {
      console.log("[v0] Sending email via SMTP nodemailer")
      result = await sendViaSMTPNodemailer(body)
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      messageId: result.message_id,
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error("[v0] Error sending email:", err.message)
    return NextResponse.json(
      { error: "Failed to send email", details: err.message },
      { status: 500 }
    )
  }
}

// Export helper function for internal use
export async function sendEmail(params: SendEmailRequest): Promise<SMTPApiResponse> {
  const { apiKey } = getSmtpConfig()
  if (apiKey) {
    return sendViaSMTPApi(params)
  }
  return sendViaSMTPNodemailer(params)
}
