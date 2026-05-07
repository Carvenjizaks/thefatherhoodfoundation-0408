import { NextResponse } from "next/server"
import { sendEmail } from "@/app/api/send-email/route"

interface TicketEnquiryRequest {
  name: string
  email: string
  phone: string
  message?: string
  eventName: string
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

    // Recipients for ticket enquiries
    const recipients = [
      { email: "rodgerbeukes73@gmail.com", name: "Rodger Beukes" },
      { email: "support@nexiumbi.com", name: "Carven Izaks" },
    ]

    console.log("[v0] Sending to recipients:", recipients.map(r => r.email).join(", "))

    // Send email to both recipients using the internal sendEmail function
    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        console.log("[v0] Sending to:", recipient.email)
        try {
          const result = await sendEmail({
            to: recipient.email,
            toName: recipient.name,
            subject,
            html,
            text,
            replyTo: email,
          })
          console.log("[v0] Success for", recipient.email, ":", result)
          return { recipient: recipient.email, success: true, result }
        } catch (error) {
          console.error("[v0] Failed for", recipient.email, ":", error)
          throw error
        }
      })
    )

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
