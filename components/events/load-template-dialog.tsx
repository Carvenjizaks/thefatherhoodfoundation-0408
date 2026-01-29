'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Clock, CheckCircle2 } from 'lucide-react'

interface LoadTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
  onSuccess: () => void
}

export function LoadTemplateDialog({ open, onOpenChange, eventId, onSuccess }: LoadTemplateDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    try {
      const { data } = await supabase
        .from('event_program_templates')
        .select(`
          *,
          template_items:event_program_template_items(count)
        `)
        .order('created_at', { ascending: false })

      setTemplates(data || [])
    } catch (error) {
      console.error('[v0] Error fetching templates:', error)
    }
  }

  const handleLoadTemplate = async (template: any) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch template items
      const { data: templateItems } = await supabase
        .from('event_program_template_items')
        .select('*')
        .eq('template_id', template.id)
        .order('sequence_order', { ascending: true })

      if (!templateItems || templateItems.length === 0) {
        throw new Error('No items found in template')
      }

      // Create program items from template
      const programItems = templateItems.map(item => ({
        event_id: eventId,
        title: item.title,
        description: item.description,
        item_type: item.item_type,
        duration_minutes: item.duration_minutes,
        sequence_order: item.sequence_order,
        notes: item.notes,
        start_time: null, // Will be set manually by user
        end_time: null,
        created_by: null
      }))

      const { error: insertError } = await supabase
        .from('event_program_items')
        .insert(programItems)

      if (insertError) throw insertError

      // Update template usage count
      await supabase
        .from('event_program_templates')
        .update({ usage_count: (template.usage_count || 0) + 1 })
        .eq('id', template.id)

      onSuccess()
    } catch (err: any) {
      console.error('[v0] Error loading template:', err)
      setError(err.message || 'Failed to load template')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Load from Template</DialogTitle>
          <DialogDescription>
            Choose a saved template to quickly build your event program
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {templates.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No templates available yet</p>
            <p className="text-sm">Create your first template by saving an event program</p>
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{template.name}</h4>
                      {template.category && (
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      )}
                    </div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.template_items?.[0]?.count || 0} items
                      </div>
                      {template.usage_count > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Used {template.usage_count} times
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleLoadTemplate(template)
                    }}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? 'Loading...' : 'Load'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
