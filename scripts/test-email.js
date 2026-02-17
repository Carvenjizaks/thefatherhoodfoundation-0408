// Direct test: send a welcome email + admin notification via Resend API
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'DreamTeam <onboarding@resend.dev>'
const TEST_EMAIL = 'Rodgerbeukes73@gmail.com'

if (!RESEND_API_KEY) {
  console.error('ERROR: RESEND_API_KEY environment variable is not set.')
  console.error('Please add it in the Vars section of the v0 sidebar.')
  process.exit(1)
}

console.log('RESEND_API_KEY is set:', RESEND_API_KEY.substring(0, 8) + '...')
console.log('FROM_EMAIL:', FROM_EMAIL)
console.log('Sending test emails to:', TEST_EMAIL)

const welcomeHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
      <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px 0;font-weight:700;">Welcome to the DreamTeam!</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0;">Powerhouse Church</p>
    </div>
    <div style="background:#ffffff;padding:32px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <p style="font-size:18px;color:#1a1a2e;margin:0 0 16px 0;">Hi <strong>Rodger</strong>,</p>
      <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 16px 0;">
        We are thrilled to welcome you to the <strong>DreamTeam</strong> at Powerhouse Church! Your willingness to serve makes a real difference in our community.
      </p>
      <div style="background:#f0f4ff;border-left:4px solid hsl(225,73%,40%);border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 20px 0;">
        <p style="font-size:13px;color:#6b7280;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">Your Service Area</p>
        <p style="font-size:17px;color:hsl(225,73%,40%);font-weight:600;margin:0;">Worship & Music</p>
      </div>
      <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 24px 0;">
        We look forward to serving alongside you!
      </p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
      <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">With love, the Powerhouse Church Team</p>
    </div>
  </div>
</body>
</html>
`

const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:32px 30px;text-align:center;">
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px 0;font-weight:700;">New DreamTeam Sign-Up</h1>
      <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">Powerhouse Church</p>
    </div>
    <div style="background:#ffffff;padding:28px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px 0;">A new volunteer has signed up for the <strong>DreamTeam</strong>:</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px 0;">
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;width:120px;">Name</td>
          <td style="padding:8px 12px;font-size:14px;color:#1a1a2e;font-weight:600;border-bottom:1px solid #f0f0f0;">Rodger Beukes</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Email</td>
          <td style="padding:8px 12px;font-size:14px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;"><a href="mailto:Rodgerbeukes73@gmail.com" style="color:hsl(225,73%,40%);">Rodgerbeukes73@gmail.com</a></td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Service Area</td>
          <td style="padding:8px 12px;font-size:14px;color:hsl(225,73%,40%);font-weight:600;border-bottom:1px solid #f0f0f0;">Worship & Music</td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
      <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">This is an automated notification from Powerhouse Church</p>
    </div>
  </div>
</body>
</html>
`

async function sendEmails() {
  // 1. Send welcome email to volunteer
  console.log('\n--- Sending welcome email to volunteer ---')
  try {
    const res1 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TEST_EMAIL],
        subject: 'Welcome to the DreamTeam, Rodger!',
        html: welcomeHtml,
      }),
    })
    const data1 = await res1.json()
    console.log('Status:', res1.status)
    console.log('Response:', JSON.stringify(data1, null, 2))
  } catch (err) {
    console.error('Welcome email failed:', err.message)
  }

  // 2. Send admin notification
  console.log('\n--- Sending admin notification ---')
  try {
    const res2 = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TEST_EMAIL],
        subject: 'New DreamTeam Sign-Up: Rodger Beukes - Worship & Music',
        html: adminHtml,
      }),
    })
    const data2 = await res2.json()
    console.log('Status:', res2.status)
    console.log('Response:', JSON.stringify(data2, null, 2))
  } catch (err) {
    console.error('Admin email failed:', err.message)
  }
}

sendEmails()
