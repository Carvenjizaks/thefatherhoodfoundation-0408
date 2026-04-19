// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client only if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set up Supabase environment variables.' 
      }, { status: 503 })
    }

    const body = await request.json()
    const { challenge, urgency, category, comments } = body

    // Insert feedback into database
    const { data, error } = await supabase
      .from('feedback_responses')
      .insert([
        {
          challenge,
          urgency,
          category,
          comments,
          submitted_at: new Date().toISOString(),
          anonymous: true
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }

    // Send email notification to admin
    await sendEmailNotification(body)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function sendEmailNotification(feedback: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: 'Carvenjizaks@gmail.com',
        subject: 'New Anonymous Feedback Received',
        html: `
          <h2>New Feedback Submission</h2>
          <p><strong>Challenge:</strong> ${feedback.challenge}</p>
          <p><strong>Urgency Level:</strong> ${feedback.urgency}/10</p>
          <p><strong>Category:</strong> ${feedback.category}</p>
          <p><strong>Comments:</strong> ${feedback.comments || 'None'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p>View all feedback: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/feedback">Admin Dashboard</a></p>
        `
      })
    })
    
    if (!response.ok) {
      console.error('Failed to send email notification')
    }
  } catch (error) {
    console.error('Email notification error:', error)
  }
}

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set up Supabase environment variables.' 
      }, { status: 503 })
    }

    const { data, error } = await supabase
      .from('feedback_responses')
      .select('*')
      .order('submitted_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}