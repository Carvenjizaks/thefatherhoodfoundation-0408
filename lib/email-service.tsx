import { createAdminClient } from "@/lib/supabase/server"

// Create admin client for server-side operations - called lazily to ensure env vars are loaded
function getSupabaseAdmin() {
  return createAdminClient()
}

export type ContactSource = "newsletter" | "event_registration" | "volunteer" | "partnership"

export interface CreateContactParams {
  firstName: string
  lastName: string
  email: string
  cellphone?: string
  source: ContactSource
  sourceDetails?: string
  spouseFirstName?: string
  spouseEmail?: string
  spouseCellphone?: string
}

export async function createContact(params: CreateContactParams) {
  const {
    firstName,
    lastName,
    email,
    cellphone,
    source,
    sourceDetails,
    spouseFirstName,
    spouseEmail,
    spouseCellphone,
  } = params

  // Check if contact already exists
  const { data: existingContact } = await getSupabaseAdmin()
    .from("contacts")
    .select("id, email_confirmed")
    .eq("email", email.toLowerCase())
    .single()

  let contactId: string
  let isNewContact = false

  if (existingContact) {
    contactId = existingContact.id
    // Update source details if registering for new event
    await getSupabaseAdmin()
      .from("contacts")
      .update({
        source_details: sourceDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contactId)
  } else {
    // Create new contact
    const { data: newContact, error } = await getSupabaseAdmin()
      .from("contacts")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        cellphone,
        source,
        source_details: sourceDetails,
      })
      .select()
      .single()

    if (error) throw error
    contactId = newContact.id
    isNewContact = true
  }

  // Add spouse if provided
  if (spouseFirstName) {
    await getSupabaseAdmin().from("contact_spouses").insert({
      contact_id: contactId,
      first_name: spouseFirstName,
      email: spouseEmail?.toLowerCase(),
      cellphone: spouseCellphone,
    })
  }

  // Get the contact with confirmation token
  const { data: contact } = await getSupabaseAdmin()
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  return { contact, isNewContact }
}

// SMTP Configuration
const SMTP_API_KEY = process.env.SMTP_API_KEY
const SMTP_CHANNEL = process.env.SMTP_CHANNEL || "default"
const SMTP_HOST = "send.smtp.com"
const SMTP_PORT = 587
const SMTP_USER = process.env.SMTP_USERNAME
const SMTP_PASS = process.env.SMTP_PASSWORD
const FROM_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org"
const FROM_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "carvenjizaks@gmail.com"

async function sendEmailViaSMTP(
  to: string,
  toName: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  // Try SMTP.com API first (preferred method)
  if (SMTP_API_KEY) {
    try {
      const apiUrl = "https://api.smtp.com/v4/messages"
      const body = {
        channel: SMTP_CHANNEL,
        recipients: {
          to: [{ address: to, name: toName }],
        },
        originator: {
          from: {
            address: FROM_EMAIL,
            name: FROM_NAME,
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
          Authorization: `Bearer ${SMTP_API_KEY}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("[v0] SMTP.com API error:", errorData)
        return false
      }

      return true
    } catch (error) {
      console.error("[v0] SMTP.com API error:", error)
      return false
    }
  }

  // Fallback to nodemailer
  if (!SMTP_USER || !SMTP_PASS) {
    console.error("[v0] No email credentials configured (SMTP_API_KEY or SMTP_USERNAME/SMTP_PASSWORD)")
    return false
  }

  try {
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

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: `"${toName}" <${to}>`,
      subject,
      text,
      html,
    })

    return true
  } catch (error) {
    console.error("[v0] Nodemailer error:", error)
    return false
  }
}

// Send admin notification when someone registers
export async function sendAdminNotification(params: {
  eventName: string
  registrantName: string
  registrantEmail: string
  registrantPhone?: string
  spouseName?: string
  paymentAmount: string
  registrationCode: string
}): Promise<boolean> {
  const { eventName, registrantName, registrantEmail, registrantPhone, spouseName, paymentAmount, registrationCode } = params

  const subject = `New Registration: ${eventName} - ${registrantName}`

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
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Registration Alert</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #8B2B3E; margin: 0 0 20px 0; font-size: 20px;">${eventName}</h2>
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f8f8; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${registrantName}</p>
                    <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${registrantEmail}</p>
                    ${registrantPhone ? `<p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${registrantPhone}</p>` : ''}
                    ${spouseName ? `<p style="margin: 0 0 10px 0;"><strong>Spouse:</strong> ${spouseName}</p>` : ''}
                    <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> ${paymentAmount}</p>
                    <p style="margin: 0;"><strong>Registration Code:</strong> <span style="font-weight: bold; color: #8B2B3E;">${registrationCode}</span></p>
                  </td>
                </tr>
              </table>
              <p style="color: #666666; font-size: 14px; margin: 20px 0 0 0;">
                Registered at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
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

  const text = `
New Registration: ${eventName}

Name: ${registrantName}
Email: ${registrantEmail}
${registrantPhone ? `Phone: ${registrantPhone}` : ''}
${spouseName ? `Spouse: ${spouseName}` : ''}
Amount: ${paymentAmount}
Registration Code: ${registrationCode}

Registered at: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
`

  return await sendEmailViaSMTP(ADMIN_EMAIL, "Admin", subject, html, text)
}

function generateWelcomeEmailHTML(firstName: string, confirmationUrl: string, source: string, sourceDetails?: string): string {
  const isEventRegistration = source === "event_registration"
  const eventName = sourceDetails || "our event"

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #8B2B3E; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">The Fatherhood Foundation</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #8B2B3E; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${firstName}!</h2>
              ${isEventRegistration ? `
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering for <strong>${eventName}</strong>. We are excited to have you join us!
              </p>
              ` : `
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for subscribing to The Fatherhood Foundation newsletter. You are now part of a community dedicated to empowering fathers and building strong families.
              </p>
              `}
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Please confirm your email address by clicking the button below:
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto 30px auto;">
                <tr>
                  <td style="background-color: #8B2B3E; border-radius: 8px;">
                    <a href="${confirmationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                      Confirm Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                If the button does not work, copy and paste this link into your browser:
              </p>
              <p style="color: #8B2B3E; font-size: 14px; word-break: break-all; margin: 0 0 30px 0;">
                ${confirmationUrl}
              </p>
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                If you did not sign up for this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">The Fatherhood Foundation</p>
              <p style="color: #999999; font-size: 12px; margin: 0;">Empowering fathers. Strengthening families. Building communities.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

export async function sendWelcomeEmail(contactId: string) {
  const { data: contact } = await getSupabaseAdmin()
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  if (!contact) throw new Error("Contact not found")

  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefatherhoodfoundation.org"}/confirm-email?token=${contact.confirmation_token}`
  
  const subject = contact.source === "event_registration"
    ? `Welcome! Please Confirm Your Registration for ${contact.source_details || "our event"}`
    : `Welcome to The Fatherhood Foundation, ${contact.first_name}!`

  const html = generateWelcomeEmailHTML(
    contact.first_name,
    confirmationUrl,
    contact.source,
    contact.source_details
  )

  const text = contact.source === "event_registration"
    ? `Welcome, ${contact.first_name}!\n\nThank you for registering for ${contact.source_details || "our event"}.\n\nPlease confirm your email by visiting: ${confirmationUrl}\n\nThe Fatherhood Foundation`
    : `Welcome, ${contact.first_name}!\n\nThank you for subscribing to The Fatherhood Foundation newsletter.\n\nPlease confirm your email by visiting: ${confirmationUrl}\n\nThe Fatherhood Foundation`

  // Send email via SMTP.com
  const emailSent = await sendEmailViaSMTP(
    contact.email,
    contact.first_name,
    subject,
    html,
    text
  )

  // Update contact as welcome email sent
  await getSupabaseAdmin()
    .from("contacts")
    .update({
      welcome_email_sent: true,
      welcome_email_sent_at: new Date().toISOString(),
      confirmation_sent_at: new Date().toISOString(),
    })
    .eq("id", contactId)

  // Log the email
  await getSupabaseAdmin().from("email_logs").insert({
    contact_id: contactId,
    email_type: "welcome",
    subject,
    status: emailSent ? "sent" : "failed",
  })

  return { success: emailSent, confirmationUrl }
}

export async function confirmEmail(token: string) {
  const { data: contact, error } = await getSupabaseAdmin()
    .from("contacts")
    .update({
      email_confirmed: true,
      confirmed_at: new Date().toISOString(),
    })
    .eq("confirmation_token", token)
    .select()
    .single()

  if (error || !contact) {
    return { success: false, error: "Invalid or expired confirmation token" }
  }

  return { success: true, contact }
}

export async function getContactByToken(token: string) {
  const { data: contact } = await getSupabaseAdmin()
    .from("contacts")
    .select("*")
    .eq("confirmation_token", token)
    .single()

  return contact
}

// Send registration confirmation email with event details and dynamic code
export async function sendRegistrationConfirmationEmail(params: {
  email: string
  firstName: string
  lastName: string
  eventName: string
  sessionDate: string
  sessionTime: string
  location: string
  dynamicCode: string
  paymentAmount: string
}): Promise<boolean> {
  const {
    email,
    firstName,
    lastName,
    eventName,
    sessionDate,
    sessionTime,
    location,
    dynamicCode,
    paymentAmount,
  } = params

  const subject = `Registration Confirmed: ${eventName} - ${sessionDate}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="background-color: #8B2B3E; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">The Fatherhood Foundation</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #8B2B3E; margin: 0 0 20px 0; font-size: 24px;">Registration Confirmed!</h2>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear <strong>${firstName} ${lastName}</strong>,
              </p>
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Thank you for registering for <strong>${eventName}</strong>. Your registration has been received successfully.
              </p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f8f8; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="color: #8B2B3E; margin: 0 0 15px 0; font-size: 18px;">Event Details</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">Event:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">${eventName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">Date:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">${sessionDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">Time:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">${sessionTime}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee;">Location:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">${location}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; padding: 8px 0;">Registration Fee:</td>
                        <td style="color: #333333; font-size: 14px; padding: 8px 0; text-align: right; font-weight: bold;">${paymentAmount}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #8B2B3E; border-radius: 8px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px; text-align: center;">
                    <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Registration Code</p>
                    <p style="color: #ffffff; font-size: 32px; margin: 0; font-weight: bold; letter-spacing: 3px;">${dynamicCode}</p>
                    <p style="color: rgba(255,255,255,0.8); font-size: 12px; margin: 10px 0 0 0;">Present this code at check-in</p>
                  </td>
                </tr>
              </table>

              <h3 style="color: #8B2B3E; margin: 0 0 15px 0; font-size: 18px;">Payment Instructions</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f8f8; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Bank:</strong> FNB</p>
                    <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Account Name:</strong> The FATHERHOOD FOUNDATION</p>
                    <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Account Number:</strong> 64279664451</p>
                    <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;"><strong>Branch Code:</strong> 282273</p>
                    <p style="color: #333333; font-size: 14px; margin: 0;"><strong>Reference:</strong> Your Name + Cellphone</p>
                  </td>
                </tr>
              </table>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0; text-align: center;">
                Or pay online via <a href="https://site.paytoday.com.na" style="color: #8B2B3E; font-weight: bold;">PayToday</a>
              </p>

              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
                We look forward to seeing you! If you have any questions, please contact us at info@thefathersfoundations.org
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f8f8; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0 0 10px 0;">The Fatherhood Foundation</p>
              <p style="color: #999999; font-size: 12px; margin: 0;">Empowering fathers. Strengthening families. Building communities.</p>
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
Registration Confirmed: ${eventName}

Dear ${firstName} ${lastName},

Thank you for registering for ${eventName}. Your registration has been received successfully.

EVENT DETAILS
-------------
Event: ${eventName}
Date: ${sessionDate}
Time: ${sessionTime}
Location: ${location}
Registration Fee: ${paymentAmount}

YOUR REGISTRATION CODE: ${dynamicCode}
(Present this code at check-in)

PAYMENT INSTRUCTIONS
--------------------
Bank: FNB
Account Name: The FATHERHOOD FOUNDATION
Account Number: 64279664451
Branch Code: 282273
Reference: Your Name + Cellphone

Or pay online via PayToday: https://site.paytoday.com.na

We look forward to seeing you!

The Fatherhood Foundation
Empowering fathers. Strengthening families. Building communities.
`

  return await sendEmailViaSMTP(email, `${firstName} ${lastName}`, subject, html, text)
}
