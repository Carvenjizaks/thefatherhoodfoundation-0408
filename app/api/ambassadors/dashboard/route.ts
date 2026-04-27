import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Referral code required' },
        { status: 400 }
      )
    }

    // Get ambassador data
    const { data: ambassador, error: ambassadorError } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('referral_code', code.toUpperCase())
      .single()

    if (ambassadorError || !ambassador) {
      return NextResponse.json(
        { error: 'Ambassador not found' },
        { status: 404 }
      )
    }

    // Get registrations made through this ambassador
    const { data: registrations, error: regError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('referral_code', code.toUpperCase())
      .order('created_at', { ascending: false })

    if (regError) {
      console.error('Error fetching registrations:', regError)
    }

    // Calculate stats
    const totalInvited = registrations?.length || 0
    const targetCouples = ambassador.target_couples || 5
    const progress = Math.min((totalInvited / targetCouples) * 100, 100)

    return NextResponse.json({
      success: true,
      ambassador: {
        id: ambassador.id,
        name: `${ambassador.first_name} ${ambassador.last_name}`,
        email: ambassador.email,
        phone: ambassador.phone,
        referralCode: ambassador.referral_code,
        eventCode: ambassador.event_code,
        eventName: ambassador.event_name,
        targetCouples,
        progress,
        status: ambassador.status
      },
      stats: {
        totalInvited,
        targetCouples,
        remaining: Math.max(targetCouples - totalInvited, 0),
        progress: Math.round(progress)
      },
      registrations: registrations || [],
      inviteLink: `https://thefatherhoodfoundation.org/mgm26?ref=${ambassador.referral_code}`
    })

  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
