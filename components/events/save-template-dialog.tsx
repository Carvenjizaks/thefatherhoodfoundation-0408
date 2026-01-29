'use client'

import React from "react"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2 } from 'lucide-react'

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  programItems: any[]
}

export function SaveTemplateDialog({ open, onOpenChange, eventId, programItems }: SaveTemplateDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Create template
      const { data: template, error: templateError } = await supabase
        .from('event_program_templates')
        .insert({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          organization_id: '00000000-0000-0000-0000-000000000000', // Auth disabled
          created_by: null
        })
        .select()
        .single()

      if (templateError) throw templateError

      // Copy program items to template
      const templateItems = programItems.map(item => ({
        template_id: template.id,
        title: item.title,
        description: item.description,
        item_type: item.item_type,
        duration_minutes: item.duration_minutes,
        sequence_order: item.sequence_order,
        notes: item.notes,
        default_roles: item.assignments?.map((a: any) => a.role_name).join(', ') || null
      }))

      const { error: itemsError } = await supabase
        .from('event_program_template_items')
        .insert(templateItems)

      if (itemsError) throw itemsError

      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setFormData({ name: '', description: '', category: 'general' })
      }, 2000)
    } catch (err: any) {
      console.error('[v0] Error saving template:', err)
      setError(err.message || 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            Save this event program as a reusable template with {programItems.length} items
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="font-medium">Template saved successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sunday Service Program, Youth Event"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe when to use this template"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Template'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
