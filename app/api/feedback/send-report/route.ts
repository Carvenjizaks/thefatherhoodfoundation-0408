// app/api/feedback/send-report/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Get summary data
    const { data: feedback, error } = await supabase
      .from('feedback_responses')
      .select('*')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    const totalResponses = feedback?.length || 0
    
    // Calculate statistics
    const categoryCounts: Record<string, number> = {}
    const urgencyCounts = { critical: 0, high: 0, medium: 0, low: 0 }
    
    feedback?.forEach((item) => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
      
      const urgency = parseInt(item.urgency)
      if (urgency >= 8) urgencyCounts.critical++
      else if (urgency >= 6) urgencyCounts.high++
      else if (urgency >= 4) urgencyCounts.medium++
      else urgencyCounts.low++
    })

    // Generate HTML report
    const htmlReport = `
      <h1>Weekly Feedback Report - The Fatherhood Foundation</h1>
      <p>Report generated: ${new Date().toLocaleString()}</p>
      
      <h2>Summary</h2>
      <ul>
        <li>Total Responses: ${totalResponses}</li>
        <li>Critical Issues (8-10): ${urgencyCounts.critical}</li>
        <li>High Priority (6-7): ${urgencyCounts.high}</li>
        <li>Medium Priority (4-5): ${urgencyCounts.medium}</li>
        <li>Low Priority (1-3): ${urgencyCounts.low}</li>
      </ul>
      
      <h2>Categories</h2>
      <ul>
        ${Object.entries(categoryCounts).map(([cat, count]) => `
          <li>${cat}: ${count} responses</li>
        `).join('')}
      </ul>
      
      <h2>Recent Submissions</h2>
      ${feedback?.slice(0, 10).map((item) => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd;">
          <p><strong>Challenge:</strong> ${item.challenge}</p>
          <p><strong>Urgency:</strong> ${item.urgency}/10</p>
          <p><strong>Category:</strong> ${item.category}</p>
          ${item.comments ? `<p><strong>Comments:</strong> ${item.comments}</p>` : ''}
          <p><small>Submitted: ${new Date(item.submitted_at).toLocaleString()}</small></p>
        </div>
      `).join('')}
      
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/feedback">View Full Dashboard</a></p>
    `

    // Send email
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'Carvenjizaks@gmail.com',
        subject: `Weekly Feedback Report - ${totalResponses} Responses`,
        html: htmlReport
      })
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send report error:', error)
    return NextResponse.json({ error: 'Failed to send report' }, { status: 500 })
  }
}