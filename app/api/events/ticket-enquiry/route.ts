import { NextResponse } from "next/server"

// SMTP.com API Configuration
function getSmtpConfig() {
  return {
    apiKey: process.env.SMTP_API_KEY,
    senderEmail: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    senderName: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
    channel: process.env.SMTP_CHANNEL,
  }
}

interface TicketEnquiryRequest {
  name: string
  email: string
  phone: string
  message?: string
  eventName: string
}

export async function POST(request: Request) {
  try {
    const body: TicketEnquiryRequest = await request.json()
    const { name, email, phone, message, eventName } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const { apiKey, senderEmail, senderName, channel } = getSmtpConfig()
    
    if (!apiKey) {
      console.error("[v0] SMTP_API_KEY not configured")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Email to Rodger (ticket coordinator)
    const recipientEmail = "rodgerbeukes73@gmail.com"
    const subject = `Ticket Enquiry: ${eventName} - ${name}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background-color: #8B2B3E; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Ticket Enquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #8B2B3E; margin: 0 0 20px 0; font-size: 20px;">${eventName}</h2>
              <p style="color: #333; font-size: 14px; margin: 0 0 20px 0;">
                Someone is enquiring about ticket availability:
              </p>
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f8f8; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #8B2B3E;">${email}</a></p>
                    <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #8B2B3E;">${phone}</a></p>
                    ${message ? `<p style="margin: 0;"><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
                  </td>
                </tr>
              </table>
              <p style="color: #666666; font-size: 14px; margin: 20px 0 0 0;">
                Received at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
              </p>
              <div style="margin-top: 20px;">
                <a href="mailto:${email}?subject=RE: ${eventName} - Ticket Enquiry" style="display: inline-block; background-color: #8B2B3E; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Reply to ${name}
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const text = `
Ticket Enquiry: ${eventName}

Name: ${name}
Email: ${email}
Phone: ${phone}
${message ? `Message: ${message}` : ''}

Received at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
`

    // Send via SMTP.com API
    const apiUrl = "https://api.smtp.com/v4/messages"
    const emailBody = {
      channel: channel || "default",
      recipients: {
        to: [{ address: recipientEmail, name: "Rodger Beukes" }],
      },
      originator: {
        from: {
          address: senderEmail,
          name: senderName,
        },
        reply_to: {
          address: email,
          name: name,
        },
      },
      subject,
      body: {
        parts: [
          { type: "text/plain", content: text },
          { type: "text/html", content: html },
        ],
      },
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(emailBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] SMTP.com API error:", errorText)
      return NextResponse.json(
        { error: "Failed to send enquiry" },
        { status: 500 }
      )
    }

    console.log("[v0] Ticket enquiry sent successfully to:", recipientEmail)

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully",
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error("[v0] Error sending ticket enquiry:", err.message)
    return NextResponse.json(
      { error: "Failed to send enquiry", details: err.message },
      { status: 500 }
    )
  }
}
