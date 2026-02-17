import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, serviceArea, organizationId } = await request.json()

    if (!email || !firstName || !serviceArea || !organizationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get organization details for the email
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', organizationId)
      .single()

    const orgName = org?.name || 'Powerhouse'
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://powerhouse.vercel.app'}/dashboard/preaching-schedule`

    // Build the welcome email HTML
    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
          <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px 0;font-weight:700;">Welcome to the DreamTeam!</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0;">${orgName}</p>
        </div>
        <div style="background:#ffffff;padding:32px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <p style="font-size:18px;color:#1a1a2e;margin:0 0 16px 0;">
            Hi <strong>${firstName}</strong>,
          </p>
          <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 16px 0;">
            We are thrilled to welcome you to the <strong>DreamTeam</strong> at ${orgName}! Your willingness to serve makes a real difference in our community.
          </p>
          <div style="background:#f0f4ff;border-left:4px solid hsl(225,73%,40%);border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 20px 0;">
            <p style="font-size:13px;color:#6b7280;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">Your Service Area</p>
            <p style="font-size:17px;color:hsl(225,73%,40%);font-weight:600;margin:0;">${serviceArea}</p>
          </div>
          <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 24px 0;">
            You can view your team schedules and stay updated by visiting the link below. We look forward to serving alongside you!
          </p>
          <div style="text-align:center;margin:0 0 24px 0;">
            <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
              View Schedules
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">
            With love, the ${orgName} Team
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Send the email using Supabase Edge Function or store the record
    // For now, we'll mark the welcome email as sent and log it
    const { error: updateError } = await supabase
      .from('dreamteam_volunteers')
      .update({ welcome_email_sent: true })
      .eq('email', email)
      .eq('organization_id', organizationId)

    if (updateError) {
      console.error('Error updating welcome_email_sent:', updateError)
    }

    const ADMIN_EMAIL = 'rodgerbeukes73@gmail.com'

    // Build admin notification email HTML
    const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:20px;">
        <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:32px 30px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px 0;font-weight:700;">New DreamTeam Sign-Up</h1>
          <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">${orgName}</p>
        </div>
        <div style="background:#ffffff;padding:28px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
          <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px 0;">
            A new volunteer has signed up for the <strong>DreamTeam</strong>:
          </p>
          <table style="width:100%;border-collapse:collapse;margin:0 0 20px 0;">
            <tr>
              <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;width:120px;">Name</td>
              <td style="padding:8px 12px;font-size:14px;color:#1a1a2e;font-weight:600;border-bottom:1px solid #f0f0f0;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Email</td>
              <td style="padding:8px 12px;font-size:14px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;"><a href="mailto:${email}" style="color:hsl(225,73%,40%);text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Service Area</td>
              <td style="padding:8px 12px;font-size:14px;color:hsl(225,73%,40%);font-weight:600;border-bottom:1px solid #f0f0f0;">${serviceArea}</td>
            </tr>
          </table>
          <div style="text-align:center;margin:0 0 16px 0;">
            <a href="${dashboardUrl.replace('preaching-schedule', 'dreamteam')}" style="display:inline-block;background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
              View in Dashboard
            </a>
          </div>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />
          <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0;">
            This is an automated notification from ${orgName} Powerhouse
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Resolve the correct API key and from email — handle swapped env vars
    const envApiKey = process.env.RESEND_API_KEY
    const envFromEmail = process.env.RESEND_FROM_EMAIL
    const looksLikeKey = (v: string | undefined) => v?.startsWith('re_')
    const looksLikeEmail = (v: string | undefined) => v ? v.includes('@') : false

    const resolvedApiKey = looksLikeKey(envApiKey)
      ? envApiKey
      : looksLikeKey(envFromEmail)
        ? envFromEmail
        : null

    const resolvedFromEmail = looksLikeEmail(envFromEmail)
      ? envFromEmail
      : looksLikeEmail(envApiKey)
        ? envApiKey
        : 'DreamTeam <onboarding@resend.dev>'

    // If Resend API key is available, send both emails
    if (resolvedApiKey) {
      const fromAddress = resolvedFromEmail

      // Send welcome email to volunteer
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resolvedApiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            subject: `Welcome to the DreamTeam, ${firstName}!`,
            html: emailHtml,
          }),
        })

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json()
          console.error('Resend error (volunteer):', errorData)
        }
      } catch (emailErr) {
        console.error('Email send error (volunteer):', emailErr)
      }

      // Send admin notification to rodgerbeukes73@gmail.com
      try {
        const adminResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resolvedApiKey}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [ADMIN_EMAIL],
            subject: `New DreamTeam Sign-Up: ${firstName} ${lastName} - ${serviceArea}`,
            html: adminEmailHtml,
          }),
        })

        if (!adminResponse.ok) {
          const errorData = await adminResponse.json()
          console.error('Resend error (admin):', errorData)
        }
      } catch (emailErr) {
        console.error('Email send error (admin):', emailErr)
      }
    } else {
      console.log(`[DreamTeam] Welcome email would be sent to ${email} (no RESEND_API_KEY configured)`)
      console.log(`[DreamTeam] Admin notification would be sent to ${ADMIN_EMAIL}`)
      console.log(`[DreamTeam] Volunteer: ${firstName} ${lastName} - Service Area: ${serviceArea}`)
    }

    return NextResponse.json({ success: true, message: 'Welcome email processed' })
  } catch (error) {
    console.error('Welcome email API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
