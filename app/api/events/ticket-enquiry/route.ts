import { NextResponse } from "next/server"
import { sendEmail } from "@/app/api/send-email/route"

interface TicketEnquiryRequest {
  name: string
  email: string
  phone: string
  message?: string
  eventName: string
}

// SMTP Configuration - read at runtime to ensure env vars are loaded
function getEmailConfig() {
  return {
    SMTP_API_KEY: process.env.SMTP_API_KEY,
    SMTP_CHANNEL: process.env.SMTP_CHANNEL || "default",
    SMTP_HOST: "send.smtp.com",
    SMTP_PORT: 587,
    SMTP_USER: process.env.SMTP_USERNAME,
    SMTP_PASS: process.env.SMTP_PASSWORD,
    FROM_EMAIL: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    FROM_NAME: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
  }
}

async function sendEmailViaSMTP(
  to: string,
  toName: string,
  subject: string,
  html: string,
  text: string,
  replyTo?: string
): Promise<boolean> {
  const config = getEmailConfig()
  
  console.log("[v0] ========== TICKET ENQUIRY EMAIL ATTEMPT ==========")
  console.log("[v0] To:", to)
  console.log("[v0] Subject:", subject)
  console.log("[v0] SMTP_API_KEY exists:", !!config.SMTP_API_KEY)
  console.log("[v0] SMTP_CHANNEL:", config.SMTP_CHANNEL)
  
  // Try SMTP.com API first (preferred method)
  // Only use SMTP.com API if we have a valid channel name (not the host URL)
  const hasValidChannel = config.SMTP_API_KEY && config.SMTP_CHANNEL && config.SMTP_CHANNEL !== "send.smtp.com" && config.SMTP_CHANNEL !== "default"
  if (hasValidChannel && config.SMTP_API_KEY) {
    console.log("[v0] Using SMTP.com API to send email...")
    try {
      const apiUrl = "https://api.smtp.com/v4/messages"
      const body: Record<string, unknown> = {
        channel: config.SMTP_CHANNEL,
        recipients: {
          to: [{ address: to, name: toName }],
        },
        originator: {
          from: {
            address: config.FROM_EMAIL,
            name: config.FROM_NAME,
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

      // Add reply-to if provided
      if (replyTo) {
        (body.originator as Record<string, unknown>).reply_to = { address: replyTo }
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.SMTP_API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      const responseText = await response.text()
      console.log("[v0] SMTP.com API response status:", response.status)
      console.log("[v0] SMTP.com API response body:", responseText)

      if (!response.ok) {
        console.error("[v0] SMTP.com API FAILED - falling back to nodemailer")
        // Fall through to nodemailer
      } else {
        console.log("[v0] EMAIL SENT SUCCESSFULLY via SMTP.com API to:", to)
        return true
      }
    } catch (error) {
      console.error("[v0] SMTP.com API EXCEPTION:", error)
      // Fall through to nodemailer
    }
  }

  // Fallback to nodemailer
  if (!config.SMTP_USER || !config.SMTP_PASS) {
    console.error("[v0] No email credentials configured (SMTP_API_KEY or SMTP_USERNAME/SMTP_PASSWORD)")
    return false
  }

  try {
    console.log("[v0] Falling back to Nodemailer SMTP...")
    const nodemailer = await import("nodemailer")
    
    const transporter = nodemailer.default.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    })

    const info = await transporter.sendMail({
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
      to: `"${toName}" <${to}>`,
      subject,
      text,
      html,
      replyTo,
    })

    console.log("[v0] EMAIL SENT SUCCESSFULLY via Nodemailer. MessageId:", info.messageId)
    return true
  } catch (error) {
    console.error("[v0] Nodemailer EXCEPTION:", error)
    return false
  }
}

export async function POST(request: Request) {
  console.log("[v0] ========== TICKET ENQUIRY REQUEST ==========")
  
  try {
    const body: TicketEnquiryRequest = await request.json()
    const { name, email, phone, message, eventName } = body

    console.log("[v0] Enquiry from:", name, email, phone)
    console.log("[v0] Event:", eventName)

    // Validate required fields
    if (!name || !email || !phone) {
      console.log("[v0] Missing required fields")
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("[v0] Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

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

    // Confirmation email sent back to the requestant
    const confirmationSubject = `We received your ticket enquiry – ${eventName}`

    const confirmationHtml = `
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
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Ticket Enquiry Received</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p style="color: #333333; font-size: 16px; margin: 0 0 16px 0;">Dear ${name},</p>
              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                Thank you for reaching out regarding <strong>${eventName}</strong>. We have received your ticket enquiry and will get back to you as soon as possible.
              </p>
              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                Please note that our team is quite busy with preparations at the moment, so we kindly ask that you be a little patient with us. We appreciate your understanding and look forward to connecting with you soon.
              </p>
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f4f5; border-left: 4px solid #8B2B3E; border-radius: 4px; margin: 20px 0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px 0; color: #555555; font-size: 13px;"><strong>Your Enquiry Details</strong></p>
                    <p style="margin: 0 0 4px 0; color: #555555; font-size: 13px;"><strong>Name:</strong> ${name}</p>
                    <p style="margin: 0 0 4px 0; color: #555555; font-size: 13px;"><strong>Email:</strong> ${email}</p>
                    <p style="margin: 0 0 4px 0; color: #555555; font-size: 13px;"><strong>Phone:</strong> ${phone}</p>
                    ${message ? `<p style="margin: 0; color: #555555; font-size: 13px;"><strong>Message:</strong> ${message.replace(/\n/g, '<br>')}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f4f5; padding: 16px 30px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">The Fatherhood Foundation@2026 - 18 Liliencron street, Eros, Windhoek, NA</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

    const confirmationText = `
Dear ${name},

Thank you for reaching out regarding ${eventName}. We have received your ticket enquiry and will get back to you as soon as possible.

Please note that our team is quite busy with preparations at the moment, so we kindly ask that you be a little patient with us. We appreciate your understanding and look forward to connecting with you soon.

Your Enquiry Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
${message ? `Message: ${message}` : ''}

The Fatherhood Foundation@2026 - 18 Liliencron street, Eros, Windhoek, NA
`

    // Recipients for ticket enquiries
    const recipients = [
      { email: "rodgerbeukes73@gmail.com", name: "Rodger Beukes" },
      { email: "support@nexiumbi.com", name: "Carven Izaks" },
    ]

    console.log("[v0] Sending to recipients:", recipients.map(r => r.email).join(", "))

    // Send email to both internal recipients and a confirmation to the requestant
    const [results, confirmationResult] = await Promise.all([
      Promise.all(
        recipients.map(recipient =>
          sendEmailViaSMTP(recipient.email, recipient.name, subject, html, text, email)
        )
      ),
      sendEmailViaSMTP(email, name, confirmationSubject, confirmationHtml, confirmationText),
    ])

    if (!confirmationResult) {
      console.warn("[v0] Confirmation email to requestant failed, but continuing...")
    } else {
      console.log("[v0] Confirmation email sent to requestant:", email)
    }

    const succeeded = results.filter(r => r.status === "fulfilled")
    const failed = results.filter(r => r.status === "rejected")

    console.log("[v0] Results - Succeeded:", succeeded.length, "Failed:", failed.length)

    if (succeeded.length === 0) {
      console.error("[v0] Failed to send ticket enquiry to any recipient")
      return NextResponse.json(
        { error: "Failed to send enquiry. Please try again or contact us directly." },
        { status: 500 }
      )
    }

    console.log("[v0] ========== TICKET ENQUIRY SENT ==========")

    return NextResponse.json({
      success: true,
      message: succeeded.length === recipients.length 
        ? "Enquiry sent to all recipients" 
        : "Enquiry sent to some recipients",
      sentTo: succeeded.length,
      totalRecipients: recipients.length,
    })
  } catch (error: unknown) {
    const err = error as { message?: string }
    console.error("[v0] Error processing ticket enquiry:", err.message)
    return NextResponse.json(
      { error: "Failed to send enquiry", details: err.message },
      { status: 500 }
    )
  }
}
