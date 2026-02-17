'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, Calendar, Clock, User } from 'lucide-react'

export default function ScheduleResponsePage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const entryId = params.entryId as string
  const action = searchParams.get('action')

  const supabase = createClient()
  const [entry, setEntry] = useState<any>(null)
  const [speaker, setSpeaker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [responseStatus, setResponseStatus] = useState<'confirmed' | 'declined' | null>(null)
  const [declineReason, setDeclineReason] = useState('')
  const [showDeclineForm, setShowDeclineForm] = useState(false)

  useEffect(() => {
    loadEntry()
  }, [entryId])

  useEffect(() => {
    if (action === 'confirm' && entry && !submitted) {
      handleConfirm()
    } else if (action === 'decline' && entry && !submitted) {
      setShowDeclineForm(true)
    }
  }, [action, entry])

  const loadEntry = async () => {
    const { data } = await supabase
      .from('schedule_entries')
      .select('*')
      .eq('id', entryId)
      .single()

    if (data) {
      setEntry(data)
      if (data.speaker_id) {
        const { data: speakerData } = await supabase
          .from('contacts')
          .select('first_name, last_name, email')
          .eq('id', data.speaker_id)
          .single()
        if (speakerData) setSpeaker(speakerData)
      }

      if (data.confirmation_status !== 'pending') {
        setSubmitted(true)
        setResponseStatus(data.confirmation_status)
      }
    }
    setLoading(false)
  }

  const handleConfirm = async () => {
    const { error } = await supabase
      .from('schedule_entries')
      .update({ confirmation_status: 'confirmed' })
      .eq('id', entryId)

    if (!error) {
      setSubmitted(true)
      setResponseStatus('confirmed')

      await supabase.from('speaker_notifications').insert({
        entry_id: entryId,
        speaker_id: entry.speaker_id,
        notification_type: 'confirmation_response',
        status: 'received',
        sent_at: new Date().toISOString(),
        message: JSON.stringify({ response: 'confirmed' }),
      })
    }
  }

  const handleDecline = async () => {
    const { error } = await supabase
      .from('schedule_entries')
      .update({
        confirmation_status: 'declined',
        notes: entry.notes ? `${entry.notes}\n\nDecline reason: ${declineReason}` : `Decline reason: ${declineReason}`,
      })
      .eq('id', entryId)

    if (!error) {
      setSubmitted(true)
      setResponseStatus('declined')

      await supabase.from('speaker_notifications').insert({
        entry_id: entryId,
        speaker_id: entry.speaker_id,
        notification_type: 'confirmation_response',
        status: 'received',
        sent_at: new Date().toISOString(),
        message: JSON.stringify({ response: 'declined', reason: declineReason }),
      })
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <X className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-bold mb-2">Schedule Entry Not Found</h2>
            <p className="text-muted-foreground">
              This schedule entry may have been removed or the link is invalid.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[hsl(225,73%,40%)]/5 to-background p-4">
      <Card className="max-w-lg w-full border-border/50 shadow-lg">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Preaching Schedule</h1>
            <p className="text-muted-foreground mt-1">Confirmation Request</p>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/30 border border-border mb-6">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">Speaker:</span>
              <span className="text-sm font-medium text-foreground">
                {speaker ? `${speaker.first_name} ${speaker.last_name}` : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium text-foreground">
                {formatDate(entry.service_date)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">Service:</span>
              <span className="text-sm font-medium text-foreground capitalize">
                {entry.service_type} Service
              </span>
            </div>
            {entry.topic && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Topic:</span>
                <span className="text-sm font-medium text-foreground">{entry.topic}</span>
              </div>
            )}
          </div>

          {/* Response Section */}
          {submitted ? (
            <div className="text-center py-4">
              {responseStatus === 'confirmed' ? (
                <>
                  <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-7 w-7 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Confirmed</h2>
                  <p className="text-muted-foreground">
                    Thank you for confirming. You are scheduled to speak on{' '}
                    {formatDate(entry.service_date)}. We look forward to hearing from you.
                  </p>
                </>
              ) : (
                <>
                  <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <X className="h-7 w-7 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">Declined</h2>
                  <p className="text-muted-foreground">
                    Your response has been recorded. The scheduling team will find an alternative speaker. Thank you for letting us know.
                  </p>
                </>
              )}
            </div>
          ) : showDeclineForm ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Please let us know why you are unable to speak on this date:
              </p>
              <Textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Reason for declining (optional)..."
                rows={3}
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeclineForm(false)
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDecline}
                >
                  <X className="h-4 w-4 mr-2" />
                  Confirm Decline
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Please confirm whether you are available to speak:
              </p>
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConfirm}
              >
                <Check className="h-5 w-5 mr-2" />
                Yes, I Accept
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeclineForm(true)}
              >
                <X className="h-5 w-5 mr-2" />
                I'm Unable to Attend
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
