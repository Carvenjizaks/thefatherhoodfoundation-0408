import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email-service"

// Manual trigger to send referral email to a specific email address
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Find the registration
    const { data: registration, error: fetchError } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", "goc26")
      .eq("email", email)
      .single()

    if (fetchError || !registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      )
    }

    // Generate referral token
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 8)
    const emailHash = email.split("@")[0].substring(0, 4).toLowerCase()
    const referralToken = `${emailHash}-${timestamp}-${randomPart}`

    // Build referral link
    const baseUrl = "https://thefatherhoodfoundation.org"
    const referralLink = `${baseUrl}/events/goc26/refer?token=${referralToken}`

    // Build email
    const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invite 3 Men to GOC26</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:40px 20px;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background:linear-gradient(135deg, #3D2314 0%, #5a3a28 100%);padding:40px;text-align:center;">
                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#D4A574;text-transform:uppercase;">The Fatherhood Foundation</p>
                        <h1 style="color:#f5ede4;font-size:28px;margin:0;">Gathering of Champions 2026</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <p style="font-size:20px;color:#3D2314;margin:0 0 25px 0;">Hey ${registration.first_name},</p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            Thank you for registering for <strong>Gathering of Champions 2026</strong>. 
                            We're excited to have you join us on July 17-18 in Windhoek.
                        </p>
                        
                        <div style="background:#f5ede4;border-radius:12px;padding:25px;margin:25px 0;border-left:4px solid #D4A574;">
                            <h2 style="color:#3D2314;font-size:22px;margin:0 0 15px 0;">Think of 3 men who need this.</h2>
                            <p style="font-size:16px;color:#5a3a28;line-height:1.7;margin:0;">
                                A friend going through a tough time. A colleague who's searching for purpose. 
                                A brother who needs to step up. You know who they are.
                            </p>
                        </div>
                        
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
                            Your personal referral link: ${referralLink}
                        </p>
                        
                        <p style="font-size:15px;color:#3D2314;margin:0;">
                            See you there, Champion.
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#3D2314;padding:25px;text-align:center;">
                        <p style="font-size:13px;color:#D4A574;margin:0;"><strong>Gathering of Champions 2026</strong></p>
                        <p style="font-size:12px;color:#8B6B5A;margin:0;">July 17-18, 2026 | Windhoek, Namibia</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`

    // Send email
    await sendEmail({
      to: email,
      toName: `${registration.first_name} ${registration.last_name}`,
      subject: `${registration.first_name}, bring 3 men with you to GOC26`,
      html: emailHtml,
    })

    // Update registration
    await supabase
      .from("event_registrations")
      .update({
        referral_email_sent: true,
        referral_token: referralToken,
        referral_email_sent_at: new Date().toISOString()
      })
      .eq("id", registration.id)

    return NextResponse.json({
      success: true,
      message: "Referral email sent",
      referralLink,
      referralToken
    })

  } catch (error) {
    console.error("[Send Referral Now] Error:", error)
    return NextResponse.json(
      { error: "Failed to send referral email" },
      { status: 500 }
    )
  }
}
