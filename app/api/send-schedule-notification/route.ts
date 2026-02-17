import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { speakerName, speakerEmail, date, serviceType, entryId } = await request.json()

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin

    const confirmUrl = `${baseUrl}/schedule-response/${entryId}?action=confirm`
    const declineUrl = `${baseUrl}/schedule-response/${entryId}?action=decline`

    // For production, integrate with an email provider (Resend, SendGrid, etc.)
    // For now, log the notification and store it in the database
    console.log(`[Notification] Sending schedule notification to ${speakerName} (${speakerEmail})`)
    console.log(`[Notification] Date: ${date}, Service: ${serviceType}`)
    console.log(`[Notification] Confirm: ${confirmUrl}`)
    console.log(`[Notification] Decline: ${declineUrl}`)

    // Store the notification details
    const supabase = await createClient()
    await supabase.from('speaker_notifications').upsert({
      entry_id: entryId,
      speaker_id: null, // Will be set by the caller
      notification_type: 'schedule_assignment',
      status: 'sent',
      sent_at: new Date().toISOString(),
      message: JSON.stringify({
        to: speakerEmail,
        subject: `Preaching Schedule: You're scheduled for ${date}`,
        body: `
Dear ${speakerName},

You have been scheduled to speak at the ${serviceType} on ${date}.

Please confirm or decline this assignment:

Confirm: ${confirmUrl}
Decline: ${declineUrl}

If you have any questions, please reach out to the scheduling team.

Blessings,
Church Scheduling Team
        `.trim(),
      }),
    }, { onConflict: 'entry_id' })

    return NextResponse.json({ success: true, confirmUrl, declineUrl })
  } catch (error: any) {
    console.error('[Notification] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
