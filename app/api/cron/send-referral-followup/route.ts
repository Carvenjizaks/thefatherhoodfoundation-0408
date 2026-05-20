import { createAdminClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-service"

// This cron job runs daily and sends referral invitation emails to GOC26 registrants
// who registered the previous day and haven't received the referral email yet

export async function GET(request: Request) {
  try {
    // Verify cron secret for security (Vercel Cron or external scheduler)
    const authHeader = request.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClient()

    // SEND TO ALL: Find ALL GOC26 registrations that haven't received referral email yet
    // This will send to everyone already registered
    const { data: registrations, error: fetchError } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", "goc26")
      .or("referral_email_sent.is.null,referral_email_sent.eq.false")

    if (fetchError) {
      console.error("[Cron] Error fetching registrations:", fetchError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!registrations || registrations.length === 0) {
      console.log("[Cron] No new GOC26 registrations to send referral emails to")
      return NextResponse.json({ 
        success: true, 
        message: "No registrations to process",
        sent: 0 
      })
    }

    console.log(`[Cron] Found ${registrations.length} GOC26 registrations to send referral emails`)

    const results = []

    for (const registration of registrations) {
      try {
        // Generate unique referral token for this registrant
        const referralToken = generateReferralToken(registration.id, registration.email)

        // Build the private referral link with token
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thefatherhoodfoundation.org"
        const referralLink = `${baseUrl}/events/goc26/refer?token=${referralToken}`

        // Send the referral invitation email
        const emailHtml = buildReferralFollowupEmail(
          registration.first_name,
          registration.dynamic_code,
          referralLink
        )

        await sendEmail({
          to: registration.email,
          toName: `${registration.first_name} ${registration.last_name}`,
          subject: `${registration.first_name}, bring 3 men with you to GOC26`,
          html: emailHtml,
        })

        // Update registration to mark referral email as sent and store token
        await supabase
          .from("event_registrations")
          .update({ 
            referral_email_sent: true,
            referral_token: referralToken,
            referral_email_sent_at: new Date().toISOString()
          })
          .eq("id", registration.id)

        results.push({ 
          email: registration.email, 
          status: "sent",
          name: `${registration.first_name} ${registration.last_name}`
        })

        console.log(`[Cron] Referral email sent to ${registration.email}`)

      } catch (emailError) {
        console.error(`[Cron] Failed to send referral email to ${registration.email}:`, emailError)
        results.push({ 
          email: registration.email, 
          status: "failed",
          error: emailError instanceof Error ? emailError.message : "Unknown error"
        })
      }
    }

    const sentCount = results.filter(r => r.status === "sent").length
    console.log(`[Cron] Referral email job complete. Sent: ${sentCount}/${registrations.length}`)

    return NextResponse.json({
      success: true,
      message: `Processed ${registrations.length} registrations`,
      sent: sentCount,
      failed: registrations.length - sentCount,
      results
    })

  } catch (error) {
    console.error("[Cron] Referral email job error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Generate a unique referral token for the registrant
function generateReferralToken(registrationId: string, email: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  const emailHash = email.split("@")[0].substring(0, 4).toLowerCase()
  return `${emailHash}-${timestamp}-${randomPart}`
}

// Build the referral follow-up email HTML
function buildReferralFollowupEmail(
  firstName: string,
  registrationCode: string,
  referralLink: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invite 3 Men to GOC26</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:40px 20px;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <!-- Header -->
                <tr>
                    <td style="background:linear-gradient(135deg, #3D2314 0%, #5a3a28 100%);padding:40px;text-align:center;">
                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#D4A574;text-transform:uppercase;">The Fatherhood Foundation</p>
                        <h1 style="color:#f5ede4;font-size:28px;margin:0;font-family:Georgia,serif;">Gathering of Champions 2026</h1>
                    </td>
                </tr>
                
                <!-- Body -->
                <tr>
                    <td style="padding:40px;">
                        <p style="font-size:20px;color:#3D2314;line-height:1.5;margin:0 0 25px 0;">
                            Hey ${firstName},
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            Thank you again for registering for <strong>Gathering of Champions 2026</strong>. 
                            We're excited to have you join us on July 17-18 in Windhoek.
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            Now here's a challenge for you...
                        </p>
                        
                        <!-- Highlight Box -->
                        <div style="background:#f5ede4;border-radius:12px;padding:25px;margin:25px 0;border-left:4px solid #D4A574;">
                            <h2 style="color:#3D2314;font-size:22px;margin:0 0 15px 0;font-family:Georgia,serif;">
                                Think of 3 men who need this.
                            </h2>
                            <p style="font-size:16px;color:#5a3a28;line-height:1.7;margin:0;">
                                A friend going through a tough time. A colleague who's searching for purpose. 
                                A brother who needs to step up. You know who they are.
                            </p>
                        </div>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 25px 0;">
                            This isn't just about filling seats — it's about changing lives. 
                            Every man you invite is a man who might discover what it means to be a true champion.
                        </p>
                        
                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                            <tr>
                                <td align="center">
                                    <a href="${referralLink}" style="display:inline-block;background:#3D2314;color:#f5ede4;text-decoration:none;padding:18px 40px;border-radius:8px;font-size:18px;font-weight:bold;">
                                        Invite 3 Men Now
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="font-size:14px;color:#8B6B5A;text-align:center;margin:25px 0;">
                            Your personal referral link is private and unique to you.
                        </p>
                        
                        <hr style="border:none;border-top:1px solid #e5e5e5;margin:30px 0;" />
                        
                        <p style="font-size:15px;color:#3D2314;line-height:1.7;margin:0;">
                            See you there, Champion.
                        </p>
                        
                        <p style="font-size:14px;color:#8B6B5A;margin:20px 0 0 0;">
                            Your Registration Code: <strong style="color:#3D2314;">${registrationCode}</strong>
                        </p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background:#3D2314;padding:25px;text-align:center;">
                        <p style="font-size:13px;color:#D4A574;margin:0 0 5px 0;">
                            <strong>Gathering of Champions 2026</strong>
                        </p>
                        <p style="font-size:12px;color:#8B6B5A;margin:0;">
                            July 17-18, 2026 | Windhoek, Namibia
                        </p>
                        <p style="font-size:11px;color:#8B6B5A;margin:10px 0 0 0;font-style:italic;">
                            The Fatherhood Foundation — Building champions, one man at a time.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
  `
}
