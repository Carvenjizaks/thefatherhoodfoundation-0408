import { NextResponse } from "next/server"

export async function GET() {
  // Check all email-related environment variables
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {
      SMTP_API_KEY: process.env.SMTP_API_KEY ? `Set (${process.env.SMTP_API_KEY.substring(0, 8)}...)` : "NOT SET",
      SMTP_CHANNEL: process.env.SMTP_CHANNEL || "NOT SET (will default to 'default')",
      SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL || "NOT SET (will default to 'noreply@thefathersfoundations.org')",
      SMTP_SENDER_NAME: process.env.SMTP_SENDER_NAME || "NOT SET (will default to 'The Fatherhood Foundation')",
      SMTP_USERNAME: process.env.SMTP_USERNAME ? "Set" : "NOT SET",
      SMTP_PASSWORD: process.env.SMTP_PASSWORD ? "Set" : "NOT SET",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || "NOT SET (will default to 'carvenjizaks@gmail.com')",
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "NOT SET",
      GC_WEBHOOK_URL: process.env.GC_WEBHOOK_URL || "NOT SET (will default to 'https://gc-sync-webhook.vercel.app/api/sync')",
    },
    emailMethods: {
      "SMTP.com API": !!process.env.SMTP_API_KEY,
      "Nodemailer Fallback": !!(process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD),
    },
    recommendations: [] as string[],
  }

  // Add recommendations based on configuration
  if (!process.env.SMTP_API_KEY && !process.env.SMTP_USERNAME) {
    diagnostics.recommendations.push("CRITICAL: No email credentials configured. Set SMTP_API_KEY for SMTP.com API or SMTP_USERNAME/SMTP_PASSWORD for Nodemailer.")
  }
  
  if (!process.env.SMTP_CHANNEL && process.env.SMTP_API_KEY) {
    diagnostics.recommendations.push("WARNING: SMTP_CHANNEL not set. Make sure 'default' is a valid channel in your SMTP.com account.")
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    diagnostics.recommendations.push("WARNING: NEXT_PUBLIC_SITE_URL not set. Email confirmation links may not work correctly.")
  }

  return NextResponse.json(diagnostics)
}

export async function POST(request: Request) {
  try {
    const { email, testType = "simple" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address required" }, { status: 400 })
    }

    const SMTP_API_KEY = process.env.SMTP_API_KEY
    const SMTP_CHANNEL = process.env.SMTP_CHANNEL || "default"
    const FROM_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org"
    const FROM_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation"

    if (!SMTP_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "SMTP_API_KEY is not configured",
        details: "Please add SMTP_API_KEY to your environment variables",
      }, { status: 500 })
    }

    console.log("[v0] ===== EMAIL DIAGNOSTIC TEST =====")
    console.log("[v0] Test type:", testType)
    console.log("[v0] To:", email)
    console.log("[v0] Channel:", SMTP_CHANNEL)
    console.log("[v0] From:", FROM_NAME, "<" + FROM_EMAIL + ">")

    const testSubject = `Email Diagnostic Test - ${new Date().toLocaleTimeString()}`
    const testHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #ddd;">
    <div style="background: #8B2B3E; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Email Diagnostic Test</h1>
    </div>
    <div style="padding: 20px;">
      <h2 style="color: #333;">Email System Working!</h2>
      <p>This confirms that your email configuration is correct and emails are being delivered.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Timestamp</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toISOString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>To</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
        </tr>
        <tr style="background: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>Channel</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${SMTP_CHANNEL}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;"><strong>From</strong></td>
          <td style="padding: 10px; border: 1px solid #ddd;">${FROM_NAME} &lt;${FROM_EMAIL}&gt;</td>
        </tr>
      </table>
      <p style="color: #666; font-size: 12px;">If you received this email, registration confirmation emails should also work.</p>
    </div>
  </div>
</body>
</html>`
    
    const testText = `Email Diagnostic Test\n\nTimestamp: ${new Date().toISOString()}\nTo: ${email}\nChannel: ${SMTP_CHANNEL}\nFrom: ${FROM_NAME} <${FROM_EMAIL}>\n\nIf you received this email, registration confirmation emails should also work.`

    const apiUrl = "https://api.smtp.com/v4/messages"
    const body = {
      channel: SMTP_CHANNEL,
      recipients: {
        to: [{ address: email, name: email }],
      },
      originator: {
        from: {
          address: FROM_EMAIL,
          name: FROM_NAME,
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

    console.log("[v0] Sending to SMTP.com API...")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries())))
    console.log("[v0] Response body:", responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { raw: responseText }
    }

    if (!response.ok) {
      console.log("[v0] ===== EMAIL DIAGNOSTIC FAILED =====")
      return NextResponse.json({
        success: false,
        status: response.status,
        error: responseData,
        request: {
          channel: body.channel,
          to: body.recipients.to,
          from: body.originator.from,
          subject: body.subject,
        },
        troubleshooting: [
          "Check if SMTP_CHANNEL matches a channel configured in your SMTP.com account",
          "Verify FROM_EMAIL is an authorized sender in SMTP.com",
          "Confirm SMTP_API_KEY has the correct permissions",
          "Check SMTP.com dashboard for any account issues or blocks",
        ],
      }, { status: 500 })
    }

    console.log("[v0] ===== EMAIL DIAGNOSTIC SUCCESS =====")
    return NextResponse.json({
      success: true,
      message: `Test email sent to ${email}`,
      messageId: responseData.message_id || responseData.id,
      response: responseData,
    })

  } catch (error) {
    console.error("[v0] Email diagnostic exception:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 })
  }
}
