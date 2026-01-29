'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Loader2 } from 'lucide-react'

interface JoinRequestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupName: string
  requests: any[]
  onSuccess: () => void
}

export function JoinRequestsDialog({ open, onOpenChange, groupId, groupName, requests, onSuccess }: JoinRequestsDialogProps) {
  const supabase = createClient()
  const [processing, setProcessing] = useState<string | null>(null)

  const handleAccept = async (request: any) => {
    setProcessing(request.id)

    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('group_join_requests')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString(),
          responded_by: null // Will be set when auth is enabled
        })
        .eq('id', request.id)

      if (updateError) throw updateError

      // Add member to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          contact_id: request.contact_id,
          role: 'member',
          status: 'active'
        })

      if (memberError) throw memberError

      // Send personalized welcome email
      const contact = request.contact
      const welcomeMessage = `Dear ${contact.first_name},\n\nWelcome to ${groupName}! We're thrilled to have you join our community. Your request to join has been approved, and we can't wait to get to know you better.\n\nYou're now officially part of our group, and we look forward to seeing you at our next meeting. If you have any questions or need anything, please don't hesitate to reach out.\n\nWarm regards,\nYour Group Leader`

      console.log('[v0] Sending welcome email to:', contact.email)
      console.log('[v0] Welcome message:', welcomeMessage)

      onSuccess()
    } catch (err) {
      console.error('[v0] Error accepting request:', err)
      alert('Failed to accept request. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (request: any) => {
    setProcessing(request.id)

    try {
      const { error } = await supabase
        .from('group_join_requests')
        .update({
          status: 'rejected',
          responded_at: new Date().toISOString(),
          responded_by: null
        })
        .eq('id', request.id)

      if (error) throw error

      onSuccess()
    } catch (err) {
      console.error('[v0] Error rejecting request:', err)
      alert('Failed to reject request. Please try again.')
    } finally {
      setProcessing(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Join Requests for {groupName}</DialogTitle>
          <DialogDescription>
            Review and respond to membership requests
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {requests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending requests
            </div>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={request.contact?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.contact?.first_name?.[0]}{request.contact?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {request.contact?.first_name} {request.contact?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.contact?.email}
                        </p>
                        {request.message && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            "{request.message}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(request)}
                        disabled={processing !== null}
                      >
                        {processing === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(request)}
                        disabled={processing !== null}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
