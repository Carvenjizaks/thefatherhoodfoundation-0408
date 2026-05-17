import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

// SMTP Configuration
function getEmailConfig() {
  return {
    SMTP_API_KEY: process.env.SMTP_API_KEY,
    SMTP_CHANNEL: process.env.SMTP_CHANNEL || "default",
    FROM_EMAIL: process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org",
    FROM_NAME: process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation",
  }
}

async function sendEmailViaSMTP(
  to: string,
  toName: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  const config = getEmailConfig()
  
  console.log("[Referral Request Email] Sending to:", to)
  
  if (!config.SMTP_API_KEY) {
    console.error("[Referral Request Email] No SMTP_API_KEY configured")
    return false
  }

  try {
    const apiUrl = "https://api.smtp.com/v4/messages"
    const body = {
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

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.SMTP_API_KEY}`,
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    console.log("[Referral Request Email] SMTP response:", response.status, responseText)

    if (!response.ok) {
      console.error("[Referral Request Email] Failed:", responseText)
      return false
    }

    return true
  } catch (error) {
    console.error("[Referral Request Email] Exception:", error)
    return false
  }
}

async function sendReferralRequestEmail(
  registrantEmail: string,
  registrantName: string,
  registrationId: string
): Promise<boolean> {
  // Read the referral request email template
  const templatePath = resolve(process.cwd(), "emails/goc2026-referral-request.html")
  let template = readFileSync(templatePath, "utf-8")

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thefatherhoodfoundation.org"
  const referralFormUrl = `${siteUrl}/events/goc26/refer?token=${registrationId}`

  // Replace template variables
  template = template
    .replace(/\{\{firstName\}\}/g, registrantName)
    .replace(/\{\{referralFormUrl\}\}/g, referralFormUrl)

  // Create plain text version
  const text = `
Hey ${registrantName}!

You registered for the Gathering of Champions 2026 — that's awesome! This is going to be a powerful weekend of brotherhood, teaching, and transformation.

But here's the thing: no man should walk this journey alone.

Who are the 3 men in your life who need to be at GOC2026? Your brother? Your friend from work? That guy you know is struggling but puts on a brave face?

INVITE 3 MEN: ${referralFormUrl}

EVENT DETAILS
-------------
Dates: 17-18 July 2026
Time: Friday 6:00pm - 9:00pm | Saturday 8:00am - 5:00pm
Location: Windhoek, Namibia

"Iron sharpens iron, and one man sharpens another." — Proverbs 27:17

Looking forward to seeing you there,
The Fatherhood Foundation Team
`

  const subject = "Invite Your Brothers to GOC2026"

  return await sendEmailViaSMTP(
    registrantEmail,
    registrantName,
    subject,
    template,
    text
  )
}

async function main() {
  console.log("[GOC26 Referral Trigger] Starting...")
  console.log("[GOC26 Referral Trigger] Current time:", new Date().toISOString())

  // Initialize Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[GOC26 Referral Trigger] Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Calculate the time window: registrations from 23-25 hours ago
  // This ensures we catch registrations that are ~24 hours old
  const now = new Date()
  const twentyFiveHoursAgo = new Date(now.getTime() - 25 * 60 * 60 * 1000)
  const twentyThreeHoursAgo = new Date(now.getTime() - 23 * 60 * 60 * 1000)

  console.log("[GOC26 Referral Trigger] Looking for registrations between:")
  console.log("  - 25 hours ago:", twentyFiveHoursAgo.toISOString())
  console.log("  - 23 hours ago:", twentyThreeHoursAgo.toISOString())

  // Find GOC2026 registrations from ~24 hours ago that haven't received referral email
  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("id, first_name, last_name, email, created_at")
    .eq("event_id", "goc26")
    .gte("created_at", twentyFiveHoursAgo.toISOString())
    .lte("created_at", twentyThreeHoursAgo.toISOString())
    .is("referral_email_sent", null)

  if (error) {
    console.error("[GOC26 Referral Trigger] Database error:", error)
    process.exit(1)
  }

  if (!registrations || registrations.length === 0) {
    console.log("[GOC26 Referral Trigger] No new registrations found in the time window")
    process.exit(0)
  }

  console.log(`[GOC26 Referral Trigger] Found ${registrations.length} registration(s) to process`)

  let successCount = 0
  let failCount = 0

  for (const registration of registrations) {
    try {
      const registrantName = registration.first_name
      console.log(`[GOC26 Referral Trigger] Processing: ${registration.email}`)

      const sent = await sendReferralRequestEmail(
        registration.email,
        registrantName,
        registration.id
      )

      if (sent) {
        // Mark referral email as sent
        const { error: updateError } = await supabase
          .from("event_registrations")
          .update({
            referral_email_sent: true,
            referral_email_sent_at: new Date().toISOString(),
          })
          .eq("id", registration.id)

        if (updateError) {
          console.error(`[GOC26 Referral Trigger] Failed to update record for ${registration.email}:`, updateError)
          failCount++
        } else {
          console.log(`[GOC26 Referral Trigger] Successfully sent to: ${registration.email}`)
          successCount++
        }
      } else {
        console.error(`[GOC26 Referral Trigger] Failed to send to: ${registration.email}`)
        failCount++
      }
    } catch (error) {
      console.error(`[GOC26 Referral Trigger] Error processing ${registration.email}:`, error)
      failCount++
    }
  }

  console.log("[GOC26 Referral Trigger] Complete!")
  console.log(`  - Successfully sent: ${successCount}`)
  console.log(`  - Failed: ${failCount}`)
  
  process.exit(failCount > 0 ? 1 : 0)
}

main()
