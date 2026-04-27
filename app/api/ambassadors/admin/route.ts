import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventCode = searchParams.get('event') || 'MGM26'

    // Get all ambassadors for this event
    const { data: ambassadors, error } = await supabase
      .from('ambassadors')
      .select('*')
      .eq('event_code', eventCode)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching ambassadors:', error)
      return NextResponse.json(
        { error: 'Failed to fetch ambassadors' },
        { status: 500 }
      )
    }

    // Get registration counts for each ambassador
    const { data: registrations } = await supabase
      .from('event_registrations')
      .select('referral_code')
      .eq('event_code', eventCode)

    const registrationCounts: Record<string, number> = {}
    registrations?.forEach((reg: any) => {
      registrationCounts[reg.referral_code] = (registrationCounts[reg.referral_code] || 0) + 1
    })

    // Enrich ambassador data with stats
    const enrichedAmbassadors = ambassadors?.map((amb: any) => ({
      ...amb,
      registrations: registrationCounts[amb.referral_code] || 0,
      progress: Math.min(((registrationCounts[amb.referral_code] || 0) / (amb.target_couples || 5)) * 100, 100)
    }))

    // Sort by registrations (leaderboard)
    const leaderboard = enrichedAmbassadors?.sort((a: any, b: any) => b.registrations - a.registrations)

    return NextResponse.json({
      success: true,
      eventCode,
      totalAmbassadors: ambassadors?.length || 0,
      totalRegistrations: registrations?.length || 0,
      ambassadors: enrichedAmbassadors || [],
      leaderboard: leaderboard || []
    })

  } catch (error) {
    console.error('Admin error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
