// Test SMTP.com email integration
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST || 'send.smtp.com'
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMTP_FROM = process.env.SMTP_FROM_EMAIL || 'noreply@nexiumbi.com'

console.log('=== SMTP.com Email Test ===')
console.log('Host:', SMTP_HOST)
console.log('Port:', SMTP_PORT)
console.log('User:', SMTP_USER ? SMTP_USER.substring(0, 4) + '...' : 'NOT SET')
console.log('Password:', SMTP_PASSWORD ? '****' : 'NOT SET')
console.log('From:', SMTP_FROM)

if (!SMTP_USER || !SMTP_PASSWORD) {
  console.error('\nERROR: SMTP_USER or SMTP_PASSWORD not set.')
  console.error('Please add them in the Vars section of the v0 sidebar.')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
})

// Step 1: Verify connection
console.log('\n--- Step 1: Verifying SMTP connection ---')
try {
  await transporter.verify()
  console.log('SMTP connection verified successfully!')
} catch (err) {
  console.error('SMTP connection FAILED:', err.message)
  console.error('\nPossible causes:')
  console.error('  - Wrong SMTP_HOST (should be your SMTP.com server)')
  console.error('  - Wrong SMTP_PORT (try 587, 2525, or 465)')
  console.error('  - Wrong SMTP_USER or SMTP_PASSWORD')
  console.error('  - Firewall blocking outbound SMTP')
  process.exit(1)
}

// Step 2: Send a test email
const TEST_EMAIL = process.env.TEST_EMAIL || 'carven@nexiumbi.com'
console.log(`\n--- Step 2: Sending test email to ${TEST_EMAIL} ---`)

try {
  const info = await transporter.sendMail({
    from: SMTP_FROM,
    to: TEST_EMAIL,
    subject: 'Powerhouse SMTP Test',
    html: `
    <div style="max-width:500px;margin:0 auto;padding:20px;font-family:sans-serif;">
      <div style="background:linear-gradient(135deg,hsl(225,73%,40%),hsl(150,40%,55%));border-radius:12px 12px 0 0;padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">SMTP Test Successful</h1>
      </div>
      <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:0;">
        <p style="color:#4a4a68;font-size:15px;line-height:1.6;">
          This confirms your SMTP.com integration is working correctly with Powerhouse.
        </p>
        <p style="color:#9ca3af;font-size:12px;margin-top:16px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    </div>`,
  })

  console.log('Email sent successfully!')
  console.log('Message ID:', info.messageId)
  console.log('Response:', info.response)
} catch (err) {
  console.error('Send FAILED:', err.message)
}
