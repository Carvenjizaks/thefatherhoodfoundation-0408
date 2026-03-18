import { NextResponse } from "next/server"

// SMTP.com API Configuration
const SMTP_API_KEY = process.env.SMTP_API_KEY
const SMTP_SENDER_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org"
const SMTP_SENDER_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation"
const SMTP_CHANNEL = process.env.SMTP_CHANNEL

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

    // Check configuration
    const configStatus = {
      SMTP_API_KEY: !!SMTP_API_KEY,
      SMTP_USERNAME: !!process.env.SMTP_USERNAME,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      SMTP_SENDER_EMAIL,
      SMTP_SENDER_NAME,
      SMTP_CHANNEL: SMTP_CHANNEL || "not set",
    }

    console.log("[v0] Email config status:", configStatus)

    const testSubject = "Test Email from The Fatherhood Foundation"
    const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background: #8B2B3E; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">The Fatherhood Foundation</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #8B2B3E;">Email Test Successful!</h2>
      <p>This is a test email to verify that the email system is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      <p><strong>Sent to:</strong> ${email}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 14px;">If you received this email, the email configuration is working properly.</p>
    </div>
  </div>
</body>
</html>
`
    const testText = `Test Email from The Fatherhood Foundation\n\nThis is a test email to verify that the email system is working correctly.\n\nTimestamp: ${new Date().toISOString()}\nSent to: ${email}\n\nIf you received this email, the email configuration is working properly.`

    // Try SMTP.com API first
    if (SMTP_API_KEY) {
      console.log("[v0] Testing email via SMTP.com API...")
      
      const apiUrl = "https://api.smtp.com/v4/messages"
      const body = {
        channel: SMTP_CHANNEL || "default",
        recipients: {
          to: [{ address: email, name: email }],
        },
        originator: {
          from: {
            address: SMTP_SENDER_EMAIL,
            name: SMTP_SENDER_NAME,
          },
        },
        subject: testSubject,
        body: {
          parts: [
            { type: "text/plain", content: testText },
            { type: "text/html", content: testHtml },
          ],
        },
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SMTP_API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()
      console.log("[v0] SMTP.com API response:", result)

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          method: "SMTP.com API",
          error: result.error?.message || result.message || "API request failed",
          config: configStatus,
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        method: "SMTP.com API",
        message: `Test email sent to ${email}`,
        messageId: result.message_id,
        config: configStatus,
      })
    }

    // Fallback to nodemailer
    if (process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD) {
      console.log("[v0] Testing email via Nodemailer SMTP...")
      
      const nodemailer = await import("nodemailer")
      
      const transporter = nodemailer.default.createTransport({
        host: "send.smtp.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      const info = await transporter.sendMail({
        from: `"${SMTP_SENDER_NAME}" <${SMTP_SENDER_EMAIL}>`,
        to: email,
        subject: testSubject,
        text: testText,
        html: testHtml,
      })

      console.log("[v0] Nodemailer response:", info)

      return NextResponse.json({
        success: true,
        method: "Nodemailer SMTP",
        message: `Test email sent to ${email}`,
        messageId: info.messageId,
        config: configStatus,
      })
    }

    // No credentials configured
    return NextResponse.json({
      success: false,
      error: "No email credentials configured",
      config: configStatus,
      hint: "Set either SMTP_API_KEY for SMTP.com API, or SMTP_USERNAME and SMTP_PASSWORD for Nodemailer",
    }, { status: 500 })

  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error("[v0] Test email error:", err)
    return NextResponse.json({
      success: false,
      error: err.message || "Unknown error",
    }, { status: 500 })
  }
}

export async function GET() {
  // Return configuration status (without exposing secrets)
  return NextResponse.json({
    configured: {
      SMTP_API_KEY: !!process.env.SMTP_API_KEY,
      SMTP_USERNAME: !!process.env.SMTP_USERNAME,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
      SMTP_SENDER_NAME: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
      SMTP_CHANNEL: process.env.SMTP_CHANNEL || "not set",
    },
    methods: {
      "SMTP.com API": !!process.env.SMTP_API_KEY,
      "Nodemailer SMTP": !!(process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD),
    },
  })
}
