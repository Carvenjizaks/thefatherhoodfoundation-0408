'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
}

export function AddGroupDialog({ open, onOpenChange, organizationId }: AddGroupDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [customType, setCustomType] = useState('')
  const [showCustomType, setShowCustomType] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'cell',
    meeting_frequency: 'weekly',
    meeting_day: '',
    meeting_time: '',
    location: '',
    capacity: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('groups')
        .insert({
          ...formData,
          organization_id: organizationId,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
        })

      if (error) throw error

      onOpenChange(false)
      setFormData({
        name: '',
        description: '',
        type: 'cell',
        meeting_frequency: 'weekly',
        meeting_day: '',
        meeting_time: '',
        location: '',
        capacity: '',
      })
      setShowCustomType(false)
      setCustomType('')
      router.refresh()
    } catch (err) {
      console.error('[v0] Error creating group:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New LifeGroup</DialogTitle>
          <DialogDescription>Add a new LifeGroup, ministry, or team</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              {!showCustomType ? (
                <div className="flex gap-2">
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setShowCustomType(true)
                      } else {
                        setFormData({ ...formData, type: value })
                      }
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cell">LifeGroup</SelectItem>
                      <SelectItem value="ministry">Ministry</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="prayer">Prayer Group</SelectItem>
                      <SelectItem value="bible_study">Bible Study</SelectItem>
                      <SelectItem value="youth">Youth Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="custom">+ Add Custom Type</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    placeholder="Enter custom group type"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (customType.trim()) {
                        setFormData({ ...formData, type: customType.trim() })
                        setShowCustomType(false)
                        setCustomType('')
                      }
                    }}
                    disabled={loading || !customType.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCustomType(false)
                      setCustomType('')
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_frequency">Meeting Frequency</Label>
              <Select
                value={formData.meeting_frequency}
                onValueChange={(value) => setFormData({ ...formData, meeting_frequency: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_day">Meeting Day</Label>
              <Select
                value={formData.meeting_day}
                onValueChange={(value) => setFormData({ ...formData, meeting_day: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_time">Meeting Time</Label>
              <Input
                id="meeting_time"
                type="time"
                value={formData.meeting_time}
                onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                disabled={loading}
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
