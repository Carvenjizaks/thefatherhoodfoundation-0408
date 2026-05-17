import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendEmail } from "@/lib/email-service"

interface Friend {
  name: string
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const { referrerName, friends, refCode } = await request.json()

    if (!referrerName || !friends || !Array.isArray(friends) || friends.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const results = []

    for (const friend of friends) {
      if (!friend.name || !friend.email) continue

      // Store referral in database
      const { error: dbError } = await supabase
        .from("goc26_referrals")
        .insert({
          referrer_name: referrerName,
          referrer_code: refCode,
          friend_name: friend.name,
          friend_email: friend.email,
          sent_at: new Date().toISOString(),
          status: "sent"
        })

      if (dbError) {
        console.error("Database error:", dbError)
      }

      // Send invitation email
      const firstName = friend.name.split(" ")[0]
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${referrerName} invited you to GOC2026</title>
</head>
<body style="margin:0;padding:0;background:#f5ede4;font-family:Georgia,serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5ede4;padding:40px 20px;">
        <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
                <tr>
                    <td style="background:linear-gradient(135deg, #3D2314 0%, #5a3a28 100%);padding:40px;text-align:center;">
                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#D4A574;text-transform:uppercase;">The Fatherhood Foundation</p>
                        <h1 style="color:#f5ede4;font-size:26px;margin:0;font-family:Georgia,serif;">Gathering of Champions 2026</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <p style="font-size:18px;color:#1a0a0e;line-height:1.6;margin:0 0 20px 0;">Hey ${firstName},</p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            It's ${referrerName}. I just registered for <strong>Gathering of Champions 2026</strong> — 
                            a men's conference happening July 17-18 in Windhoek.
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            I immediately thought of you. This isn't just another event. It's for men who are serious 
                            about stepping up — in their homes, their work, their lives.
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 25px 0;">
                            I think you'd get a lot out of it. And honestly? I think you'd bring something to the room too.
                        </p>
                        
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                            <tr>
                                <td align="center">
                                    <a href="https://thefatherhoodfoundation.org/events" style="display:inline-block;background:#3D2314;color:#f5ede4;text-decoration:none;padding:16px 36px;border-radius:6px;font-size:16px;font-weight:bold;">
                                        Learn More & Register →
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="font-size:15px;color:#3D2314;line-height:1.7;margin:25px 0 0 0;">
                            Hope to see you there,<br/>
                            <strong>${referrerName}</strong>
                        </p>
                        
                        <hr style="border:none;border-top:1px solid #e5e5e5;margin:30px 0;" />
                        
                        <p style="font-size:13px;color:#8B6B5A;margin:0;">
                            <strong>Gathering of Champions 2026</strong><br/>
                            July 17-18, 2026 | Windhoek, Namibia<br/>
                            NAD 250 per person
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#3D2314;padding:25px;text-align:center;">
                        <p style="font-size:12px;color:#D4A574;margin:0 0 5px 0;">
                            The Fatherhood Foundation | Windhoek, Namibia
                        </p>
                        <p style="font-size:11px;color:#8B6B5A;margin:0;font-style:italic;">
                            Building champions, one man at a time.
                        </p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>
      `

      await sendEmail({
        to: friend.email,
        subject: `${referrerName} thinks you'd benefit from this...`,
        html: emailHtml,
      })

      results.push({ name: friend.name, email: friend.email, status: "sent" })
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${results.length} invitations`,
      results
    })

  } catch (error) {
    console.error("Referral send error:", error)
    return NextResponse.json(
      { error: "Failed to send invitations" },
      { status: 500 }
    )
  }
}
