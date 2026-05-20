// Simple test using Node.js fetch
const SMTP_API_KEY = process.env.SMTP_API_KEY;
const SMTP_CHANNEL = process.env.SMTP_CHANNEL || "default";
const FROM_EMAIL = process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org";
const FROM_NAME = process.env.SMTP_SENDER_NAME || "The Fatherhood Foundation";

async function sendEmail(to, toName, subject, html, text) {
  console.log("[Email Test] Sending to:", to);
  
  if (!SMTP_API_KEY) {
    console.error("[Email Test] ERROR: SMTP_API_KEY not set!");
    return false;
  }

  try {
    const apiUrl = "https://api.smtp.com/v4/messages";
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
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMTP_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log("[Email Test] SMTP response:", response.status, responseText);

    if (!response.ok) {
      console.error("[Email Test] Failed:", responseText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email Test] Exception:", error);
    return false;
  }
}

// Test 1: Referral Request Email (Cron Job)
async function testReferralRequestEmail() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST 1: Referral Request Email (Cron Job Simulation)");
  console.log("=".repeat(60));

  const testData = {
    firstName: "Carven",
    lastName: "Izaks",
    email: "carvenjizaks@gmail.com",
    dynamicCode: "GOC26-TEST-001",
    referralToken: "carn-1234567890-abcd12"
  };

  const baseUrl = "https://thefatherhoodfoundation.org";
  const referralLink = `${baseUrl}/events/goc26/refer?token=${testData.referralToken}`;

  console.log("\n📧 To:", testData.email);
  console.log("👤 Name:", testData.firstName);
  console.log("🔗 Referral Link:", referralLink);

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
                        <h1 style="color:#f5ede4;font-size:28px;margin:0;font-family:Georgia,serif;">Gathering of Champions 2026</h1>
                    </td>
                </tr>
                <tr>
                    <td style="padding:40px;">
                        <p style="font-size:20px;color:#3D2314;line-height:1.5;margin:0 0 25px 0;">Hey ${testData.firstName},</p>
                        
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
                            Your Registration Code: <strong style="color:#3D2314;">${testData.dynamicCode}</strong>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="background:#3D2314;padding:25px;text-align:center;">
                        <p style="font-size:13px;color:#D4A574;margin:0 0 5px 0;"><strong>Gathering of Champions 2026</strong></p>
                        <p style="font-size:12px;color:#8B6B5A;margin:0;">July 17-18, 2026 | Windhoek, Namibia</p>
                        <p style="font-size:11px;color:#8B6B5A;margin:10px 0 0 0;font-style:italic;">The Fatherhood Foundation — Building champions, one man at a time.</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

  const text = `Hey ${testData.firstName}!\n\nThank you for registering for Gathering of Champions 2026. We're excited to have you join us on July 17-18 in Windhoek.\n\nNow here's a challenge for you... Think of 3 men who need this.\n\nINVITE 3 MEN: ${referralLink}\n\nSee you there, Champion!\n\nThe Fatherhood Foundation`;

  const result = await sendEmail(
    testData.email,
    `${testData.firstName} ${testData.lastName}`,
    `${testData.firstName}, bring 3 men with you to GOC26`,
    emailHtml,
    text
  );

  if (result) {
    console.log("\n✅ TEST 1 PASSED: Referral Request Email sent!");
  } else {
    console.log("\n❌ TEST 1 FAILED: Could not send email");
  }
}

// Test 2: Friend Invitation Email
async function testFriendInvitationEmail() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TEST 2: Friend Invitation Email");
  console.log("=".repeat(60));

  const referrer = { name: "Carven Izaks", email: "carvenjizaks@gmail.com" };
  const friend = { name: "John Smith", email: "carvenjizaks@gmail.com" };
  const personalNote = "Hey bro, this event changed my life last year. I think you need to be there.";

  console.log("\n📧 From:", referrer.name);
  console.log("📧 To:", friend.name, "(", friend.email, ")");
  console.log("💬 Personal Note:", personalNote);

  const firstName = friend.name.split(" ")[0];
  const personalNoteHtml = `<div style="background:#f5ede4;border-left:4px solid #D4A574;padding:20px;border-radius:0 8px 8px 0;margin:20px 0;">
    <p style="font-size:16px;color:#5a3a28;font-style:italic;margin:0 0 10px 0;line-height:1.6;">"${personalNote}"</p>
    <p style="font-size:14px;color:#8B6B5A;margin:0;">— <strong>${referrer.name}</strong></p>
  </div>`;

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${referrer.name} invited you to GOC2026</title>
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
                            <strong>${referrer.name}</strong> registered for <strong>Gathering of Champions 2026</strong> — 
                            a men's conference happening July 17-18 in Windhoek — and thought of you.
                        </p>
                        ${personalNoteHtml}
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 20px 0;">
                            This isn't just another event. It's for men who are serious about stepping up.
                        </p>
                        <p style="font-size:16px;color:#3D2314;line-height:1.7;margin:0 0 25px 0;">
                            ${referrer.name} thinks you'd get a lot out of it.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin:30px 0;">
                            <tr>
                                <td align="center">
                                    <a href="https://thefatherhoodfoundation.org/events/goc26" style="display:inline-block;background:#3D2314;color:#f5ede4;text-decoration:none;padding:16px 36px;border-radius:6px;font-size:16px;font-weight:bold;">
                                        Learn More & Register
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="font-size:15px;color:#3D2314;line-height:1.7;margin:25px 0 0 0;">
                            Hope to see you there,<br/><strong>${referrer.name}</strong>
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
                        <p style="font-size:12px;color:#D4A574;margin:0 0 5px 0;">The Fatherhood Foundation | Windhoek, Namibia</p>
                        <p style="font-size:11px;color:#8B6B5A;margin:0;font-style:italic;">Building champions, one man at a time.</p>
                    </td>
                </tr>
            </table>
        </td></tr>
    </table>
</body>
</html>`;

  const text = `Hey ${firstName},\n\n${referrer.name} registered for Gathering of Champions 2026 and thought of you.\n\n"${personalNote}"\n\nLearn more: https://thefatherhoodfoundation.org/events/goc26\n\nHope to see you there,\n${referrer.name}`;

  const result = await sendEmail(
    friend.email,
    friend.name,
    `${referrer.name} thinks you should join him at GOC2026`,
    emailHtml,
    text
  );

  if (result) {
    console.log("\n✅ TEST 2 PASSED: Friend Invitation Email sent!");
  } else {
    console.log("\n❌ TEST 2 FAILED: Could not send email");
  }
}

// Run both tests
async function runTests() {
  console.log("\n🚀 Starting Email Tests for GOC26 Referral System");
  console.log("Environment check:");
  console.log("  SMTP_API_KEY exists:", !!process.env.SMTP_API_KEY);
  console.log("  SMTP_CHANNEL:", process.env.SMTP_CHANNEL || "default");
  console.log("  FROM_EMAIL:", process.env.SMTP_SENDER_EMAIL || "noreply@thefathersfoundations.org");

  await testReferralRequestEmail();
  await testFriendInvitationEmail();

  console.log("\n" + "=".repeat(60));
  console.log("🏁 All tests complete!");
  console.log("=".repeat(60));
}

runTests().catch(console.error);
