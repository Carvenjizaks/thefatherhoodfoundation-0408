import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      whatsapp,
      eventCode = 'MGM26',
      eventName = 'MyGreatMarriage Conference 2026'
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique referral code
    const referralCode = `AMB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`

    // Check if email already exists
    const { data: existing } = await supabase
      .from('ambassadors')
      .select('id, referral_code')
      .eq('email', email.toLowerCase())
      .eq('event_code', eventCode)
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'You are already registered as an ambassador!',
        referralCode: existing.referral_code,
        existing: true
      })
    }

    // Insert new ambassador
    const { data: ambassador, error } = await supabase
      .from('ambassadors')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase(),
        phone,
        whatsapp: whatsapp || phone,
        event_code: eventCode,
        event_name: eventName,
        referral_code: referralCode,
        target_couples: 5,
        status: 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create ambassador' },
        { status: 500 }
      )
    }

    // Sync to GlobalControl
    try {
      await syncToGlobalControl({
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        referralCode,
        eventCode,
        eventName
      })
    } catch (gcError) {
      console.error('GlobalControl sync error:', gcError)
      // Don't fail if GC sync fails
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome to the Ambassadors Program!',
      referralCode: ambassador.referral_code,
      dashboardUrl: `/ambassadors/dashboard?code=${ambassador.referral_code}`,
      ambassador: {
        id: ambassador.id,
        name: `${ambassador.first_name} ${ambassador.last_name}`,
        referralCode: ambassador.referral_code
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function syncToGlobalContact(data: any) {
  const gcApiKey = process.env.GLOBALCONTROL_API_KEY
  if (!gcApiKey) {
    console.log('GlobalControl API key not configured')
    return
  }

  const gcData = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    tag: `${data.eventCode}-Ambassador`,
    source: 'ambassador-program',
    type: 'ambassador',
    metadata: {
      referralCode: data.referralCode,
      eventCode: data.eventCode,
      eventName: data.eventName,
      targetCouples: 5
    }
  }

  const response = await fetch('https://api.globalcontrol.io/v1/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${gcApiKey}`
    },
    body: JSON.stringify(gcData)
  })

  if (!response.ok) {
    throw new Error(`GlobalControl API error: ${response.status}`)
  }

  return await response.json()
}
