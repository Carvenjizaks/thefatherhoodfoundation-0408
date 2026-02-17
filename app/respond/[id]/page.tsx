'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Calendar, Clock, User, MapPin } from 'lucide-react'

export default function ResponsePage() {
  const params = useParams()
  const responseId = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [responseData, setResponseData] = useState<any>(null)
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'confirmed' | 'unavailable' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResponseData()
  }, [responseId])

  const fetchResponseData = async () => {
    try {
      const { data, error } = await supabase
        .from('task_assignment_responses')
        .select(`
          id,
          response_status,
          responded_at,
          notes,
          program_item:event_program_items(
            id,
            title,
            description,
            start_time,
            end_time,
            item_type,
            event:events(
              id,
              title,
              event_date,
              location
            )
          ),
          contact:contacts(
            id,
            first_name,
            last_name,
            email
          ),
          assignment:event_program_assignments!program_item_id(
            role_name
          )
        `)
        .eq('id', responseId)
        .single()

      if (error) throw error
      
      setResponseData(data)
      if (data.response_status !== 'pending') {
        setStatus(data.response_status)
        setNotes(data.notes || '')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load assignment details')
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (responseStatus: 'confirmed' | 'unavailable') => {
    setSubmitting(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('task_assignment_responses')
        .update({
          response_status: responseStatus,
          responded_at: new Date().toISOString(),
          notes: notes
        })
        .eq('id', responseId)

      if (error) throw error

      setStatus(responseStatus)
      
      // Trigger participation stats update
      await supabase.rpc('update_contact_participation_stats', {
        p_contact_id: responseData.contact.id
      })

    } catch (err: any) {
      setError(err.message || 'Failed to submit response')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!responseData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8">
            <Alert variant="destructive">
              <AlertDescription>Assignment not found</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  const alreadyResponded = status !== null
  const event = responseData.program_item?.event
  const programItem = responseData.program_item
  const assignment = responseData.assignment?.[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[hsl(225,73%,40%)]/5 to-[hsl(150,40%,72%)]/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Task Assignment Response</CardTitle>
            {alreadyResponded && (
              <Badge 
                variant={status === 'confirmed' ? 'default' : 'secondary'}
                className="text-sm"
              >
                {status === 'confirmed' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Confirmed
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Unavailable
                  </>
                )}
              </Badge>
            )}
          </div>
          <CardDescription>
            {alreadyResponded 
              ? 'You have already responded to this assignment' 
              : 'Please confirm your availability for this task'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold text-lg">{event?.title}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{new Date(event?.event_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              {event?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Details */}
          <div className="space-y-3 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{programItem?.title}</h4>
              <Badge variant="outline">{programItem?.item_type}</Badge>
            </div>
            
            {programItem?.description && (
              <p className="text-sm text-muted-foreground">{programItem.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{programItem?.start_time} - {programItem?.end_time}</span>
              </div>
              
              {assignment?.role_name && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-secondary" />
                  <span className="font-medium">{assignment.role_name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-2 text-sm p-3 bg-muted/50 rounded-lg">
            <User className="h-4 w-4" />
            <span>Assigned to: {responseData.contact?.first_name} {responseData.contact?.last_name}</span>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or comments..."
              disabled={alreadyResponded || submitting}
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          {!alreadyResponded && (
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => handleResponse('confirmed')}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
                size="lg"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Confirm Availability
              </Button>
              
              <Button
                onClick={() => handleResponse('unavailable')}
                disabled={submitting}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                Mark Unavailable
              </Button>
            </div>
          )}

          {alreadyResponded && responseData.responded_at && (
            <p className="text-sm text-center text-muted-foreground">
              Responded on {new Date(responseData.responded_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
