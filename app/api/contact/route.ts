import { NextRequest, NextResponse } from "next/server"
import { sendMgmEmail } from "@/lib/mgm/send"

const NOTIFICATION_EMAILS = [
  "carvenjizaks@gmail.com",
  "carven@fathersfound.org",
  "rodgerbeukes73@gmail.com",
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      )
    }

    // Build notification email
    const notificationSubject = `New Contact Request: ${subject || "General Inquiry"}`
    const notificationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:#8B6F47;padding:24px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:20px;">New Contact Request</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">From</p>
                          <p style="margin:0;font-size:16px;color:#333;font-weight:bold;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Email</p>
                          <p style="margin:0;font-size:16px;color:#333;"><a href="mailto:${email}" style="color:#8B6F47;">${email}</a></p>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Phone</p>
                          <p style="margin:0;font-size:16px;color:#333;"><a href="tel:${phone}" style="color:#8B6F47;">${phone}</a></p>
                        </td>
                      </tr>
                      ` : ""}
                      <tr>
                        <td style="padding-bottom:16px;">
                          <p style="margin:0 0 4px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Subject</p>
                          <p style="margin:0;font-size:16px;color:#333;">${subject || "General Inquiry"}</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Message</p>
                          <div style="background:#f9f9f9;border-radius:6px;padding:16px;border-left:4px solid #8B6F47;">
                            <p style="margin:0;font-size:15px;color:#333;line-height:1.6;white-space:pre-wrap;">${message}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#f5f5f5;padding:16px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#666;">
                      This message was sent via the Contact Form on The Fatherhood Foundation website.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    const notificationText = `
New Contact Request

From: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Subject: ${subject || "General Inquiry"}

Message:
${message}

---
This message was sent via the Contact Form on The Fatherhood Foundation website.
    `.trim()

    // Build confirmation email for the sender
    const confirmationSubject = "We received your message - The Fatherhood Foundation"
    const confirmationHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="background:#8B6F47;padding:24px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:20px;">Thank You for Contacting Us</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">
                      Hi ${name},
                    </p>
                    <p style="margin:0 0 16px;font-size:16px;color:#333;line-height:1.6;">
                      Thank you for reaching out to The Fatherhood Foundation. We have received your message and will get back to you as soon as possible.
                    </p>
                    <p style="margin:0 0 24px;font-size:16px;color:#333;line-height:1.6;">
                      Here is a copy of your message:
                    </p>
                    <div style="background:#f9f9f9;border-radius:6px;padding:16px;border-left:4px solid #8B6F47;margin-bottom:24px;">
                      <p style="margin:0 0 8px;font-size:12px;color:#666;text-transform:uppercase;letter-spacing:1px;">Subject: ${subject || "General Inquiry"}</p>
                      <p style="margin:0;font-size:15px;color:#333;line-height:1.6;white-space:pre-wrap;">${message}</p>
                    </div>
                    <p style="margin:0;font-size:16px;color:#333;line-height:1.6;">
                      With you for stronger homes,<br>
                      <strong>The Fatherhood Foundation</strong>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background:#8B6F47;padding:16px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#ffffff;">
                      The Fatherhood Foundation | Windhoek, Namibia
                    </p>
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
Hi ${name},

Thank you for reaching out to The Fatherhood Foundation. We have received your message and will get back to you as soon as possible.

Here is a copy of your message:
Subject: ${subject || "General Inquiry"}
${message}

With you for stronger homes,
The Fatherhood Foundation

---
The Fatherhood Foundation | Windhoek, Namibia
    `.trim()

    // Send notification emails to all recipients
    const notificationResults = await Promise.allSettled(
      NOTIFICATION_EMAILS.map((recipient) =>
        sendMgmEmail({
          to: recipient,
          subject: notificationSubject,
          html: notificationHtml,
          text: notificationText,
          replyTo: email,
        })
      )
    )

    // Send confirmation email to the sender
    const confirmationResult = await sendMgmEmail({
      to: email,
      subject: confirmationSubject,
      html: confirmationHtml,
      text: confirmationText,
    })

    // Check results
    const successfulNotifications = notificationResults.filter(
      (r) => r.status === "fulfilled"
    ).length

    if (successfulNotifications === 0) {
      console.error("All notification emails failed:", notificationResults)
      return NextResponse.json(
        { error: "Failed to send your message. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
      notificationsSent: successfulNotifications,
      confirmationSent: confirmationResult.success,
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
