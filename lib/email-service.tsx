import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
  const { data: existingContact } = await supabaseAdmin
    .from("contacts")
    .select("id, email_confirmed")
    .eq("email", email.toLowerCase())
    .single()

  let contactId: string
  let isNewContact = false

  if (existingContact) {
    contactId = existingContact.id
    // Update source details if registering for new event
    await supabaseAdmin
      .from("contacts")
      .update({
        source_details: sourceDetails,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contactId)
  } else {
    // Create new contact
    const { data: newContact, error } = await supabaseAdmin
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
    await supabaseAdmin.from("contact_spouses").insert({
      contact_id: contactId,
      first_name: spouseFirstName,
      email: spouseEmail?.toLowerCase(),
      cellphone: spouseCellphone,
    })
  }

  // Get the contact with confirmation token
  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  return { contact, isNewContact }
}

// SMTP.com API Configuration
const SMTP_API_KEY = process.env.SMTP_COM_API_KEY
const SMTP_API_URL = "https://api.smtp.com/v4/messages"
const FROM_EMAIL = "noreply@thefathersfoundations.org"
const FROM_NAME = "The Fatherhood Foundation"

async function sendEmailViaSMTP(
  to: string,
  toName: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  if (!SMTP_API_KEY) {
    console.error("[v0] SMTP_COM_API_KEY not configured")
    return false
  }

  try {
    const response = await fetch(SMTP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SMTP_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "email",
        recipients: {
          to: [{ address: to, name: toName }],
        },
        originator: {
          from: { address: FROM_EMAIL, name: FROM_NAME },
        },
        subject,
        body: {
          parts: [
            { type: "text/html", content: html },
            { type: "text/plain", content: text },
          ],
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] SMTP.com API error:", errorText)
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return false
  }
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
  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  if (!contact) throw new Error("Contact not found")

  const confirmationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://thefathersfoundations.org"}/confirm-email?token=${contact.confirmation_token}`
  
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
  await supabaseAdmin
    .from("contacts")
    .update({
      welcome_email_sent: true,
      welcome_email_sent_at: new Date().toISOString(),
      confirmation_sent_at: new Date().toISOString(),
    })
    .eq("id", contactId)

  // Log the email
  await supabaseAdmin.from("email_logs").insert({
    contact_id: contactId,
    email_type: "welcome",
    subject,
    status: emailSent ? "sent" : "failed",
  })

  return { success: emailSent, confirmationUrl }
}

export async function confirmEmail(token: string) {
  const { data: contact, error } = await supabaseAdmin
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
  const { data: contact } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .eq("confirmation_token", token)
    .single()

  return contact
}
