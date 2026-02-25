'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'

interface AttendanceTrackerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  groupId: string
  groupName: string
  members: any[]
  onSuccess: () => void
}

export function AttendanceTrackerDialog({ open, onOpenChange, groupId, groupName, members, onSuccess }: AttendanceTrackerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0])
  const [presentMembers, setPresentMembers] = useState<string[]>([])

  const toggleAttendance = (contactId: string) => {
    setPresentMembers(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    )
  }

  const markAllPresent = () => {
    setPresentMembers(members.map(m => m.contact_id))
  }

  const markAllAbsent = () => {
    setPresentMembers([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      // Create attendance records for all members
      const attendanceRecords = members.map(member => ({
        group_id: groupId,
        contact_id: member.contact_id,
        meeting_date: meetingDate,
        present: presentMembers.includes(member.contact_id),
        marked_by: null // Will be set when auth is enabled
      }))

      const { error } = await supabase
        .from('group_attendance')
        .insert(attendanceRecords)

      if (error) throw error

      alert(`Attendance marked: ${presentMembers.length} present, ${members.length - presentMembers.length} absent`)
      onOpenChange(false)
      setPresentMembers([])
      onSuccess()
    } catch (err) {
      console.error('[v0] Error marking attendance:', err)
      alert('Failed to mark attendance. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark Attendance - {groupName}</DialogTitle>
            <DialogDescription>
              Track who attended today's meeting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-date">Meeting Date *</Label>
              <Input
                id="meeting-date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Members ({presentMembers.length}/{members.length} present)</Label>
                <div className="space-x-2">
                  <Button type="button" variant="ghost" size="sm" onClick={markAllPresent}>
                    All Present
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={markAllAbsent}>
                    All Absent
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3 max-h-[400px] overflow-y-auto space-y-3">
                {members.map((member) => {
                  const isPresent = presentMembers.includes(member.contact_id)
                  
                  return (
                    <div
                      key={member.contact_id}
                      className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                        isPresent ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleAttendance(member.contact_id)}
                    >
                      <Checkbox
                        checked={isPresent}
                        onCheckedChange={() => toggleAttendance(member.contact_id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.contact?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {member.contact?.first_name?.[0]}{member.contact?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {member.contact?.first_name} {member.contact?.last_name}
                        </p>
                        {member.role && (
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        )}
                      </div>
                      {isPresent && (
                        <span className="text-xs font-medium text-primary">Present</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Attendance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
