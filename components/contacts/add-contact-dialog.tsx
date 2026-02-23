'use client'

import React from 'react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AddContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  tags?: Array<{ id: string; name: string; color: string }>
  onRefresh?: () => void
}

export function AddContactDialog({ open, onOpenChange, organizationId, tags = [], onRefresh }: AddContactDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dupWarning, setDupWarning] = useState<string | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    date_of_birth: '',
    gender: '',
    status: 'active',
    notes: '',
  })

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  const checkDuplicate = async () => {
    setDupWarning(null)
    const email = formData.email.trim().toLowerCase()
    const phone = formData.phone.trim()

    if (email) {
      const { data } = await supabase
        .from('contacts')
        .select('id, first_name, last_name')
        .eq('organization_id', organizationId)
        .eq('email', email)
        .single()
      if (data) {
        setDupWarning(`A contact with this email already exists: ${data.first_name} ${data.last_name}`)
        return true
      }
    }
    if (phone) {
      const { data } = await supabase
        .from('contacts')
        .select('id, first_name, last_name')
        .eq('organization_id', organizationId)
        .eq('phone', phone)
        .single()
      if (data) {
        setDupWarning(`A contact with this phone already exists: ${data.first_name} ${data.last_name}`)
        return true
      }
    }
    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setDupWarning(null)
    setLoading(true)

    try {
      const isDup = await checkDuplicate()
      if (isDup) {
        setLoading(false)
        return
      }

      const { data: inserted, error: insertError } = await supabase
        .from('contacts')
        .insert({
          ...formData,
          organization_id: organizationId,
          created_by: null,
          date_of_birth: formData.date_of_birth || null,
          email: formData.email.trim().toLowerCase() || null,
          phone: formData.phone.trim() || null,
        })
        .select('id')
        .single()

      if (insertError) {
        if (insertError.code === '23505') {
          setDupWarning('A contact with this email or phone already exists.')
          return
        }
        throw insertError
      }

      // Assign tags
      if (inserted && selectedTagIds.size > 0) {
        await supabase.from('contact_tag_assignments').insert(
          [...selectedTagIds].map((tagId) => ({ contact_id: inserted.id, tag_id: tagId }))
        )
      }

      onOpenChange(false)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: '',
        date_of_birth: '',
        gender: '',
        status: 'active',
        notes: '',
      })
      setSelectedTagIds(new Set())
      onRefresh?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to your community database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {dupWarning && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                {dupWarning} -- Please review before adding.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="add_email">Email</Label>
              <Input
                id="add_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_phone">Phone</Label>
              <Input
                id="add_phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="add_address">Address</Label>
            <Input
              id="add_address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="add_city">City</Label>
              <Input
                id="add_city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_postal_code">Postal Code</Label>
              <Input
                id="add_postal_code"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_country">Country</Label>
              <Input
                id="add_country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="add_dob">Date of Birth</Label>
              <Input
                id="add_dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add_status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 rounded-lg border border-border p-3">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.has(tag.id)
                  return (
                    <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)} disabled={loading}>
                      <Badge
                        variant={isSelected ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors"
                        style={isSelected ? { backgroundColor: tag.color, borderColor: tag.color, color: '#fff' } : { borderColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="add_notes">Notes</Label>
            <Textarea
              id="add_notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
