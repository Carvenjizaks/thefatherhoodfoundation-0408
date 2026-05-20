// Test script: Send referral request email (simulates the cron job)
// This sends the "Invite 3 Men" email to a registrant

import { sendEmail } from "./lib/email-service.tsx"

async function testReferralRequestEmail() {
  console.log("🧪 Testing Referral Request Email (Cron Job Simulation)")
  console.log("=" .repeat(60))

  // Test data - using Carven's email for testing
  const testRegistration = {
    firstName: "Carven",
    lastName: "Izaks",
    email: "carvenjizaks@gmail.com", // Change this to your test email
    dynamicCode: "GOC26-TEST-001",
    referralToken: "carn-1234567890-abcd12"
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thefatherhoodfoundation.org"
  const referralLink = `${baseUrl}/events/goc26/refer?token=${testRegistration.referralToken}`

  console.log("\n📧 Sending to:", testRegistration.email)
  console.log("👤 Name:", testRegistration.firstName)
  console.log("🔗 Referral Link:", referralLink)

  // Build the referral follow-up email HTML (same as cron job)
  const emailHtml = `
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
                <tr>
                    <td style="background:linear-gradient(135deg, #3D2314 0%, #5a3a28 100%);padding:40px;text-align:center;">
                        <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;color:#D4A574;text-transform:uppercase;">The Fatherhood Foundation</p>
                        <h1 style="color:#f5ede4;font-size:28px;margin:0;font-family:Georgia,serif;">Gathering of Champions 2026</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <p style="font-size:20px;color:#3D2314;line-height:1.5;margin:0 0 25px 0;">
                            Hey ${testRegistration.firstName},
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            Thank you again for registering for <strong>Gathering of Champions 2026</strong>. 
                            We're excited to have you join us on July 17-18 in Windhoek.
                        </p>
                        
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            Now here's a challenge for you...
                        </p>
                        
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
                            Your Registration Code: <strong style="color:#3D2314;">${testRegistration.dynamicCode}</strong>
                        </p>
                    </td>
                </tr>
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

  try {
    const result = await sendEmail({
      to: testRegistration.email,
      toName: `${testRegistration.firstName} ${testRegistration.lastName}`,
      subject: `${testRegistration.firstName}, bring 3 men with you to GOC26`,
      html: emailHtml,
    })

    if (result) {
      console.log("\n✅ Referral Request Email sent successfully!")
      console.log("   Check your inbox (and spam folder)")
    } else {
      console.log("\n❌ Failed to send email")
    }
  } catch (error) {
    console.error("\n❌ Error sending email:", error)
  }
}

testReferralRequestEmail()
