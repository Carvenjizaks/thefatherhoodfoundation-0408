import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { upsertContact } from '@/lib/contacts/upsert-contact'

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

    // --- Trigger welcome email using the request origin for internal routing ---
    const origin = new URL(request.url).origin
    try {
      const emailRes = await fetch(`${origin}/api/dreamteam/welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          serviceArea: serviceLabel,
          organizationId: org.id,
        }),
      })
      if (!emailRes.ok) {
        const errBody = await emailRes.text()
        console.error('Welcome email API returned error:', emailRes.status, errBody)
      }
    } catch (emailErr) {
      console.error('Welcome email fetch failed:', emailErr)
      // Email failure should not block a successful signup
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
