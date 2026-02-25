'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, UserCheck, X, Upload, ImageIcon } from 'lucide-react'

interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  profile_picture_url?: string
}

interface EditGroupDialogProps {
  group: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditGroupDialog({ group, open, onOpenChange, onSuccess }: EditGroupDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [leaderSearch, setLeaderSearch] = useState('')
  const [selectedLeader, setSelectedLeader] = useState<Contact | null>(null)
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'cell',
    meeting_frequency: 'weekly',
    meeting_day: '',
    meeting_time: '',
    location: '',
    is_active: true,
    leader_profile_picture: '',
    leader_bio: '',
  })

  // Populate form when group changes
  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        type: group.type || 'cell',
        meeting_frequency: group.meeting_frequency || 'weekly',
        meeting_day: group.meeting_day || '',
        meeting_time: group.meeting_time || '',
        location: group.location || '',
        is_active: group.is_active ?? true,
        leader_profile_picture: group.leader_profile_picture || '',
        leader_bio: group.leader_bio || '',
      })
      if (group.leader_profile_picture) {
        setPhotoPreview(group.leader_profile_picture)
      }
    }
  }, [group])

  // Fetch existing leader when dialog opens
  useEffect(() => {
    if (open && group?.leader_id) {
      fetchLeader(group.leader_id)
    }
  }, [open, group])

  const fetchLeader = async (leaderId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, profile_picture_url')
      .eq('id', leaderId)
      .single()
    if (data) setSelectedLeader(data)
  }

  const fetchContacts = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('contacts')
      .select('id, first_name, last_name, email, profile_picture_url')
      .eq('organization_id', group?.organization_id)
      .order('first_name')
    setContacts(data || [])
  }, [group?.organization_id])

  useEffect(() => {
    if (open && group?.organization_id) fetchContacts()
  }, [open, group?.organization_id, fetchContacts])

  const filteredContacts = contacts.filter((c) => {
    const q = leaderSearch.toLowerCase()
    return c.first_name.toLowerCase().includes(q) || c.last_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const uploadPhoto = async (): Promise<string> => {
    if (!photoFile) return formData.leader_profile_picture
    setUploadingPhoto(true)
    try {
      const fd = new FormData()
      fd.append('file', photoFile)
      const res = await fetch('/api/upload/leader-photo', { method: 'POST', body: fd })
      const data = await res.json()
      return data.url || ''
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const photoUrl = await uploadPhoto()
      const supabase = createClient()
      const { error } = await supabase
        .from('groups')
        .update({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          meeting_frequency: formData.meeting_frequency,
          meeting_day: formData.meeting_day,
          meeting_time: formData.meeting_time,
          location: formData.location,
          is_active: formData.is_active,
          leader_id: selectedLeader?.id ?? null,
          leader_profile_picture: photoUrl || null,
          leader_bio: formData.leader_bio || null,
        })
        .eq('id', group.id)

      if (error) throw error

      onOpenChange(false)
      onSuccess?.()
      router.refresh()
    } catch (err) {
      console.error('Error updating group:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Group Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required disabled={loading} />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} disabled={loading} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cell">LifeGroup</SelectItem>
                  <SelectItem value="ministry">Ministry</SelectItem>
                  <SelectItem value="team">Team</SelectItem>
                  <SelectItem value="prayer">Prayer Group</SelectItem>
                  <SelectItem value="bible_study">Bible Study</SelectItem>
                  <SelectItem value="youth">Youth Group</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Meeting Frequency</Label>
              <Select value={formData.meeting_frequency} onValueChange={(v) => setFormData({ ...formData, meeting_frequency: v })} disabled={loading}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Label>Meeting Day</Label>
              <Select value={formData.meeting_day} onValueChange={(v) => setFormData({ ...formData, meeting_day: v })} disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>
                  {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(d => (
                    <SelectItem key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Meeting Time</Label>
              <Input type="time" value={formData.meeting_time} onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })} disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} disabled={loading} />
          </div>

                <hr className="border-border" />

          {/* Leader Assignment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <Label className="text-base font-semibold">Group Leader</Label>
            </div>

            {selectedLeader ? (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={formData.leader_profile_picture || selectedLeader.profile_picture_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {selectedLeader.first_name[0]}{selectedLeader.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{selectedLeader.first_name} {selectedLeader.last_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{selectedLeader.email}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">Leader</Badge>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => { setSelectedLeader(null); setLeaderSearch('') }}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search contacts by name or email..."
                    value={leaderSearch}
                    onChange={(e) => { setLeaderSearch(e.target.value); setShowLeaderDropdown(true) }}
                    onFocus={() => setShowLeaderDropdown(true)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>
                {showLeaderDropdown && leaderSearch && (
                  <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {filteredContacts.length === 0 ? (
                      <p className="p-3 text-sm text-muted-foreground text-center">No contacts found</p>
                    ) : (
                      filteredContacts.slice(0, 8).map((contact) => (
                        <button
                          key={contact.id}
                          type="button"
                          className="w-full flex items-center gap-3 p-3 hover:bg-accent text-left transition-colors"
                          onClick={() => { setSelectedLeader(contact); setLeaderSearch(''); setShowLeaderDropdown(false) }}
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={contact.profile_picture_url || ''} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {contact.first_name[0]}{contact.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{contact.first_name} {contact.last_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{contact.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Leader Profile Photo</Label>
              <div className="flex items-center gap-3">
                {photoPreview ? (
                  <div className="relative h-16 w-16 shrink-0">
                    <img src={photoPreview} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-border" />
                    <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(''); setFormData({ ...formData, leader_profile_picture: '' }) }} className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/jpeg,image/jpg,image/png" className="sr-only" onChange={handlePhotoChange} disabled={loading || uploadingPhoto} />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
                    <Upload className="h-4 w-4" />
                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">JPEG or PNG, max 5MB</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Leader Bio</Label>
              <Textarea
                value={formData.leader_bio}
                onChange={(e) => setFormData({ ...formData, leader_bio: e.target.value })}
                rows={2}
                placeholder="Short bio shown on public Life Groups page..."
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] text-white hover:opacity-90">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
