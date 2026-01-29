'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

interface ManageTagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'
]

export function ManageTagsDialog({ open, onOpenChange, organizationId }: ManageTagsDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [tagName, setTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)

  const handleAddTag = async () => {
    if (!tagName.trim()) return
    
    setLoading(true)
    try {
      const { error } = await supabase
        .from('contact_tags')
        .insert({
          organization_id: organizationId,
          name: tagName.trim(),
          color: selectedColor,
        })

      if (error) throw error

      setTagName('')
      router.refresh()
    } catch (err) {
      console.error('[v0] Error adding tag:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>Create and manage contact tags for better organization</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tagName">Tag Name</Label>
            <Input
              id="tagName"
              placeholder="Enter tag name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Tag Color</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="h-8 w-8 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid black' : '2px solid transparent',
                  }}
                />
              ))}
            </div>
          </div>

          <Button 
            onClick={handleAddTag} 
            disabled={loading || !tagName.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tag
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
