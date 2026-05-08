"use server"

import { createClient } from "@/lib/supabase/server"
import { buildWelcomeEmail, buildAdminNotificationEmail } from "@/lib/mgm/email-templates"
import { sendMgmEmail } from "@/lib/mgm/send"
import { computeNextSendAt } from "@/lib/mgm/schedule"

export type SignupFormData = {
  husbandFirstName: string
  husbandLastName: string
  husbandEmail: string
  wifeFirstName: string
  wifeLastName: string
  wifeEmail: string
  country: string
  city?: string
  anniversaryMonth?: number
  receiveCoupleEmails: boolean
  receiveHusbandEmails: boolean
  receiveWifeEmails: boolean
}

export type SignupResult =
  | { success: true; alreadyExists?: boolean }
  | { success: false; error: string }

export async function submitMgmSignup(data: SignupFormData): Promise<SignupResult> {
  try {
    const supabase = await createClient()

    const hEmail = data.husbandEmail.toLowerCase().trim()
    const wEmail = data.wifeEmail.toLowerCase().trim()

    // Check for existing active subscription
    const { data: existing } = await supabase
      .from("mgm_subscriptions")
      .select("id, husband_preference_token, wife_preference_token")
      .eq("husband_email", hEmail)
      .eq("wife_email", wEmail)
      .eq("is_active", true)
      .maybeSingle()

    if (existing) {
      // Resend welcome email rather than creating a duplicate
      const welcomeEmail = buildWelcomeEmail({
        husbandFirstName: data.husbandFirstName,
        wifeFirstName: data.wifeFirstName,
        husbandToken: existing.husband_preference_token,
        wifeToken: existing.wife_preference_token,
      })
      await sendMgmEmail({ to: [hEmail, wEmail], ...welcomeEmail })
      return { success: true, alreadyExists: true }
    }

    // Create new subscription
    const nextSendAt = computeNextSendAt()

    const { data: newSub, error: insertError } = await supabase
      .from("mgm_subscriptions")
      .insert({
        husband_first_name: data.husbandFirstName.trim(),
        husband_last_name: data.husbandLastName.trim(),
        husband_email: hEmail,
        wife_first_name: data.wifeFirstName.trim(),
        wife_last_name: data.wifeLastName.trim(),
        wife_email: wEmail,
        country: data.country,
        city: data.city?.trim() || null,
        anniversary_month: data.anniversaryMonth || null,
        receive_couple_emails: data.receiveCoupleEmails,
        receive_husband_emails: data.receiveHusbandEmails,
        receive_wife_emails: data.receiveWifeEmails,
        current_month: 1,
        current_week_in_cycle: 1,
        next_send_at: nextSendAt.toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (insertError || !newSub) {
      console.error("[MGM Signup] Insert error:", insertError)
      return { success: false, error: "Failed to save your subscription. Please try again." }
    }

    // Send welcome email
    const welcomeEmail = buildWelcomeEmail({
      husbandFirstName: data.husbandFirstName,
      wifeFirstName: data.wifeFirstName,
      husbandToken: newSub.husband_preference_token,
      wifeToken: newSub.wife_preference_token,
    })

    await sendMgmEmail({ to: [hEmail, wEmail], ...welcomeEmail })

    // Log welcome email
    await supabase.from("mgm_email_logs").insert({
      subscription_id: newSub.id,
      stream_type: "WELCOME",
      recipient_type: "BOTH",
      recipient_email: `${hEmail}, ${wEmail}`,
      subject: welcomeEmail.subject,
      status: "sent",
    })

    // Admin notification
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "support@nexiumbi.com"
    const adminNotif = buildAdminNotificationEmail({
      husbandFirstName: data.husbandFirstName,
      husbandLastName: data.husbandLastName,
      husbandEmail: hEmail,
      wifeFirstName: data.wifeFirstName,
      wifeLastName: data.wifeLastName,
      wifeEmail: wEmail,
      country: data.country,
      city: data.city,
    })
    await sendMgmEmail({ to: adminEmail, ...adminNotif })

    return { success: true }
  } catch (err) {
    console.error("[MGM Signup] Unexpected error:", err)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}
