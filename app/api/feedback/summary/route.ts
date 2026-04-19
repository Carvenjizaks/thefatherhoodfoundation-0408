// app/api/feedback/summary/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all feedback
    const { data: feedback, error } = await supabase
      .from('feedback_responses')
      .select('*')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    // Calculate summary statistics
    const totalResponses = feedback?.length || 0
    
    // Group by category
    const categoryCounts: Record<string, number> = {}
    feedback?.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
    })

    // Group by urgency level
    const urgencyDistribution = [
      { range: 'Critical (8-10)', count: 0, color: '#dc2626' },
      { range: 'High (6-7)', count: 0, color: '#ea580c' },
      { range: 'Medium (4-5)', count: 0, color: '#ca8a04' },
      { range: 'Low (1-3)', count: 0, color: '#16a34a' }
    ]

    feedback?.forEach((item) => {
      const urgency = parseInt(item.urgency)
      if (urgency >= 8) urgencyDistribution[0].count++
      else if (urgency >= 6) urgencyDistribution[1].count++
      else if (urgency >= 4) urgencyDistribution[2].count++
      else urgencyDistribution[3].count++
    })

    // Top challenges (most frequent)
    const challengeCounts: Record<string, number> = {}
    feedback?.forEach((item) => {
      challengeCounts[item.challenge] = (challengeCounts[item.challenge] || 0) + 1
    })

    const topChallenges = Object.entries(challengeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([challenge, count]) => ({ challenge, count }))

    // Recent submissions (last 7 days)
    const last7Days = feedback?.filter((item) => {
      const submittedDate = new Date(item.submitted_at)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      return submittedDate >= sevenDaysAgo
    }).length || 0

    return NextResponse.json({
      totalResponses,
      last7Days,
      categoryCounts,
      urgencyDistribution,
      topChallenges,
      recentSubmissions: feedback?.slice(0, 10) || []
    })
  } catch (error) {
    console.error('Summary API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}