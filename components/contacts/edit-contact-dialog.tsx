'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface EditContactDialogProps {
  contact: any
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Array<{ id: string; name: string; color: string }>
  onRefresh?: () => void
}

export function EditContactDialog({ contact, open, onOpenChange, tags, onRefresh }: EditContactDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(contact)
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setFormData(contact)
    // Load current tag assignments
    const currentTagIds = new Set(
      (contact?.contact_tag_assignments || []).map((a: any) => a.tag?.id).filter(Boolean)
    )
    setSelectedTagIds(currentTagIds as Set<string>)
  }, [contact])

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) => {
      const next = new Set(prev)
      if (next.has(tagId)) next.delete(tagId)
      else next.add(tagId)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update contact fields
      const { error } = await supabase
        .from('contacts')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender,
          status: formData.status,
          notes: formData.notes,
        })
        .eq('id', contact.id)

      if (error) throw error

      // Sync tag assignments
      const currentTagIds = new Set(
        (contact?.contact_tag_assignments || []).map((a: any) => a.tag?.id).filter(Boolean)
      )

      // Tags to add
      const toAdd = [...selectedTagIds].filter((id) => !currentTagIds.has(id))
      // Tags to remove
      const toRemove = [...currentTagIds].filter((id) => !selectedTagIds.has(id))

      if (toAdd.length > 0) {
        await supabase.from('contact_tag_assignments').insert(
          toAdd.map((tagId) => ({ contact_id: contact.id, tag_id: tagId }))
        )
      }

      if (toRemove.length > 0) {
        for (const tagId of toRemove) {
          await supabase
            .from('contact_tag_assignments')
            .delete()
            .eq('contact_id', contact.id)
            .eq('tag_id', tagId)
        }
      }

      onOpenChange(false)
      onRefresh?.()
    } catch (err) {
      console.error('Error updating contact:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
          <DialogDescription>Update contact information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_first_name">First Name</Label>
              <Input
                id="edit_first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_last_name">Last Name</Label>
              <Input
                id="edit_last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_phone">Phone</Label>
              <Input
                id="edit_phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_city">City</Label>
            <Input
              id="edit_city"
              value={formData.city || ''}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit_status">Status</Label>
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

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 rounded-lg border border-border p-3">
                {tags.map((tag) => {
                  const isSelected = selectedTagIds.has(tag.id)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      disabled={loading}
                    >
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
