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

const fromAddress = process.env.SMTP_FROM_EMAIL || 'noreply@nexiumbi.com'

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
  try {
    await transporter.sendMail({
      from: from || fromAddress,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    })
    return { success: true }
  } catch (err: any) {
    console.error('[Email] Send error:', err?.message || err)
    return { success: false, error: err?.message || 'Failed to send email' }
  }
}

export { fromAddress }
