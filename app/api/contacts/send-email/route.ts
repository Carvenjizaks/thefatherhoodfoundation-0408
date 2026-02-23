import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { recipients, subject, body } = await request.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients provided' }, { status: 400 })
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
    }
    if (!body?.trim()) {
      return NextResponse.json({ error: 'Message body is required' }, { status: 400 })
    }

    // Resolve the correct API key and from email (handle swapped env vars)
    const envApiKey = process.env.RESEND_API_KEY
    const envFromEmail = process.env.RESEND_FROM_EMAIL
    const looksLikeKey = (v: string | undefined) => v?.startsWith('re_')
    const looksLikeEmail = (v: string | undefined) => (v ? v.includes('@') : false)

    const resolvedApiKey = looksLikeKey(envApiKey)
      ? envApiKey
      : looksLikeKey(envFromEmail)
        ? envFromEmail
        : null

    const resolvedFromEmail = looksLikeEmail(envFromEmail)
      ? envFromEmail
      : looksLikeEmail(envApiKey)
        ? envApiKey
        : 'Powerhouse <onboarding@resend.dev>'

    if (!resolvedApiKey) {
      console.log(`[Contacts Email] Would send to ${recipients.length} recipients (no RESEND_API_KEY)`)
      return NextResponse.json({ success: true, sent: 0, message: 'No API key configured' })
    }

    // Build branded HTML email
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:32px 30px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">${subject}</h1>
        </div>
        <div style="background:#ffffff;padding:32px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <div style="font-size:15px;color:#4a4a68;line-height:1.7;white-space:pre-wrap;">${body.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')}</div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
          <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
            Sent from Powerhouse
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Send emails individually for privacy
    let sent = 0
    const errors: string[] = []

    for (const recipient of recipients) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resolvedApiKey}`,
          },
          body: JSON.stringify({
            from: resolvedFromEmail,
            to: [recipient.email],
            subject,
            html: emailHtml,
          }),
        })

        if (res.ok) {
          sent++
        } else {
          const err = await res.json()
          console.error(`[Contacts Email] Failed for ${recipient.email}:`, err)
          errors.push(recipient.email)
        }
      } catch (err) {
        console.error(`[Contacts Email] Error for ${recipient.email}:`, err)
        errors.push(recipient.email)
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('[Contacts Email] API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
