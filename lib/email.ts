import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'send.smtp.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

// Ensure from is a valid email, not just a domain
const rawFrom = process.env.SMTP_FROM_EMAIL || ''
const fromAddress = rawFrom.includes('@') ? rawFrom : (rawFrom ? `noreply@${rawFrom}` : 'noreply@nexiumbi.com')

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}): Promise<{ success: boolean; error?: string }> {
  const actualFrom = from || fromAddress
  const actualTo = Array.isArray(to) ? to.join(', ') : to
  console.log('[v0] Sending email:', { from: actualFrom, to: actualTo, subject })

  try {
    const info = await transporter.sendMail({
      from: actualFrom,
      to: actualTo,
      subject,
      html,
    })
    console.log('[v0] Email sent successfully:', { messageId: info.messageId, response: info.response })
    return { success: true }
  } catch (err: any) {
    console.error('[v0] Email send FAILED:', { error: err?.message, code: err?.code, responseCode: err?.responseCode, command: err?.command })
    return { success: false, error: err?.message || 'Failed to send email' }
  }
}

export { fromAddress }
