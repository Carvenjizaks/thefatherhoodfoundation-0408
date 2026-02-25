import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { upsertContact } from '@/lib/contacts/upsert-contact'
import { sendEmail } from '@/lib/email'

const SERVICE_AREAS: Record<string, string> = {
  ushering_hospitality: 'Ushering & Hospitality',
  media_sound: 'Media & Sound',
  worship_team: 'Worship Team',
  childrens_church: "Children's Church",
  youth_ministry: 'Youth Ministry',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      phone,
      membershipStatus,
      disciplesClassCompleted,
      serviceArea,
      otherServiceArea,
      skills,
      availability,
      notes,
      organizationSlug,
    } = body

    // --- Server-side validation ---
    const errors: Record<string, string> = {}

    if (!firstName?.trim()) errors.firstName = 'First name is required'
    if (!lastName?.trim()) errors.lastName = 'Last name is required'
    if (!email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email'
    }
    if (!phone?.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[+]?[\d\s()-]{7,15}$/.test(phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }
    if (!membershipStatus) errors.membershipStatus = 'Please select your membership status'
    if (!disciplesClassCompleted) errors.disciplesClassCompleted = 'Please answer this question'
    if (!serviceArea) errors.serviceArea = 'Please select a service area'
    if (serviceArea === 'other' && !otherServiceArea?.trim()) {
      errors.otherServiceArea = 'Please specify your service area'
    }
    if (!organizationSlug) errors.organization = 'Organization is required'

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const supabase = await createClient()

    // --- Look up the organization by slug ---
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('slug', organizationSlug)
      .single()

    if (orgError || !org) {
      return NextResponse.json(
        { errors: { organization: 'Organization not found' } },
        { status: 404 }
      )
    }

    // --- Prepare insert data ---
    const finalServiceArea = serviceArea === 'other' ? otherServiceArea.trim() : serviceArea
    const serviceLabel = serviceArea === 'other'
      ? otherServiceArea.trim()
      : SERVICE_AREAS[serviceArea] || serviceArea

    // --- Insert volunteer record ---
    const { error: insertError } = await supabase
      .from('dreamteam_volunteers')
      .insert({
        organization_id: org.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        service_area: finalServiceArea,
        service_area_label: serviceLabel,
        skills: skills?.trim() || null,
        availability: availability?.trim() || null,
        notes: notes?.trim() || null,
        membership_status: membershipStatus || 'guest',
        disciples_class_completed: disciplesClassCompleted === 'yes',
        status: 'active',
        welcome_email_sent: false,
      })

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          { errors: { email: 'You have already signed up with this email address.' } },
          { status: 409 }
        )
      }
      console.error('Supabase insert error:', insertError)
      return NextResponse.json(
        { errors: { form: 'Something went wrong. Please try again.' } },
        { status: 500 }
      )
    }

    // --- Upsert into unified contacts table ---
    try {
      const { contactId } = await upsertContact({
        organizationId: org.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        tags: ['DreamTeam'],
        involvement: { dreamteam: true },
      })

      // Link the volunteer record to the contact
      await supabase
        .from('dreamteam_volunteers')
        .update({ contact_id: contactId })
        .eq('organization_id', org.id)
        .eq('email', email.trim().toLowerCase())
    } catch (contactErr) {
      console.error('Contact upsert failed (non-blocking):', contactErr)
    }

    // --- Send welcome email directly via SMTP ---
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://powerhouse.vercel.app'}/dashboard/preaching-schedule`
    const ADMIN_EMAIL = 'rodgerbeukes73@gmail.com'

    try {
      console.log('[v0] SMTP config check:', { host: process.env.SMTP_HOST, user: process.env.SMTP_USER ? 'SET' : 'MISSING', pass: process.env.SMTP_PASSWORD ? 'SET' : 'MISSING', from: process.env.SMTP_FROM_EMAIL })

      // Welcome email to volunteer
      const volunteerResult = await sendEmail({
        to: email.trim().toLowerCase(),
        subject: `Welcome to the DreamTeam, ${firstName.trim()}!`,
        html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;font-size:28px;margin:0 0 8px 0;font-weight:700;">Welcome to the DreamTeam!</h1>
              <p style="color:rgba(255,255,255,0.9);font-size:16px;margin:0;">${org.name}</p>
            </div>
            <div style="background:#ffffff;padding:32px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
              <p style="font-size:18px;color:#1a1a2e;margin:0 0 16px 0;">Hi <strong>${firstName.trim()}</strong>,</p>
              <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 16px 0;">
                We are thrilled to welcome you to the <strong>DreamTeam</strong> at ${org.name}! Your willingness to serve makes a real difference in our community.
              </p>
              <div style="background:#f0f4ff;border-left:4px solid hsl(225,73%,40%);border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 20px 0;">
                <p style="font-size:13px;color:#6b7280;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">Your Service Area</p>
                <p style="font-size:17px;color:hsl(225,73%,40%);font-weight:600;margin:0;">${serviceLabel}</p>
              </div>
              <p style="font-size:15px;color:#4a4a68;line-height:1.6;margin:0 0 24px 0;">
                You can view your team schedules and stay updated by visiting the link below. We look forward to serving alongside you!
              </p>
              <div style="text-align:center;margin:0 0 24px 0;">
                <a href="${dashboardUrl}" style="display:inline-block;background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">View Schedules</a>
              </div>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="font-size:13px;color:#9ca3af;text-align:center;margin:0;">With love, the ${org.name} Team</p>
            </div>
          </div>
        </body>
        </html>`,
      })
      if (!volunteerResult.success) {
        console.error('Welcome email failed:', volunteerResult.error)
      }

      // Admin notification
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New DreamTeam Sign-Up: ${firstName.trim()} ${lastName.trim()} - ${serviceLabel}`,
        html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:20px;">
            <div style="background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);border-radius:16px 16px 0 0;padding:32px 30px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px 0;font-weight:700;">New DreamTeam Sign-Up</h1>
              <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:0;">${org.name}</p>
            </div>
            <div style="background:#ffffff;padding:28px 30px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
              <p style="font-size:16px;color:#1a1a2e;margin:0 0 16px 0;">A new volunteer has signed up:</p>
              <table style="width:100%;border-collapse:collapse;margin:0 0 20px 0;">
                <tr><td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;width:160px;">Name</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;font-weight:600;border-bottom:1px solid #f0f0f0;">${firstName.trim()} ${lastName.trim()}</td></tr>
                <tr><td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Email</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${email.trim().toLowerCase()}</td></tr>
                <tr><td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Membership</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;text-transform:capitalize;border-bottom:1px solid #f0f0f0;">${membershipStatus || 'Guest'}</td></tr>
                <tr><td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Disciples Classes</td><td style="padding:8px 12px;font-size:14px;color:#1a1a2e;border-bottom:1px solid #f0f0f0;">${disciplesClassCompleted === 'yes' ? 'Yes - Completed' : 'No - Not yet'}</td></tr>
                <tr><td style="padding:8px 12px;font-size:13px;color:#6b7280;border-bottom:1px solid #f0f0f0;">Service Area</td><td style="padding:8px 12px;font-size:14px;color:hsl(225,73%,40%);font-weight:600;border-bottom:1px solid #f0f0f0;">${serviceLabel}</td></tr>
              </table>
              <div style="text-align:center;margin:0 0 16px 0;">
                <a href="${dashboardUrl.replace('preaching-schedule', 'dreamteam')}" style="display:inline-block;background:linear-gradient(135deg,hsl(225,73%,40%) 0%,hsl(150,40%,55%) 100%);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View in Dashboard</a>
              </div>
            </div>
          </div>
        </body>
        </html>`,
      })

      // Mark welcome email as sent
      await supabase
        .from('dreamteam_volunteers')
        .update({ welcome_email_sent: true })
        .eq('email', email.trim().toLowerCase())
        .eq('organization_id', org.id)
    } catch (emailErr) {
      console.error('Welcome email error (non-blocking):', emailErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to the DreamTeam!',
      volunteer: {
        firstName: firstName.trim(),
        email: email.trim().toLowerCase(),
        serviceArea: serviceLabel,
      },
    })
  } catch (error) {
    console.error('DreamTeam public signup error:', error)
    return NextResponse.json(
      { errors: { form: 'Internal server error' } },
      { status: 500 }
    )
  }
}
