'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'

interface ManageTagsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  onRefresh?: () => void
}

interface TagWithCount {
  id: string
  name: string
  color: string
  contact_count: number
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#14b8a6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6'
]

export function ManageTagsDialog({ open, onOpenChange, organizationId, onRefresh }: ManageTagsDialogProps) {
  const supabase = createClient()
  const [tags, setTags] = useState<TagWithCount[]>([])
  const [tagName, setTagName] = useState('')
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('')
  const [deletingTag, setDeletingTag] = useState<TagWithCount | null>(null)

  const fetchTags = useCallback(async () => {
    setFetching(true)
    try {
      const { data } = await supabase
        .from('contact_tags')
        .select('id, name, color, contact_tag_assignments(count)')
        .eq('organization_id', organizationId)
        .order('name')

      const mapped = (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        color: t.color,
        contact_count: t.contact_tag_assignments?.[0]?.count ?? 0,
      }))
      setTags(mapped)
    } catch (err) {
      console.error('Error fetching tags:', err)
    } finally {
      setFetching(false)
    }
  }, [supabase, organizationId])

  useEffect(() => {
    if (open) fetchTags()
  }, [open, fetchTags])

  const handleAddTag = async () => {
    if (!tagName.trim()) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('contact_tags')
        .insert({ organization_id: organizationId, name: tagName.trim(), color: selectedColor })
      if (error) throw error
      setTagName('')
      await fetchTags()
      onRefresh?.()
    } catch (err) {
      console.error('Error adding tag:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTag = async (tagId: string) => {
    if (!editName.trim()) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('contact_tags')
        .update({ name: editName.trim(), color: editColor })
        .eq('id', tagId)
      if (error) throw error
      setEditingId(null)
      await fetchTags()
      onRefresh?.()
    } catch (err) {
      console.error('Error updating tag:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTag = async () => {
    if (!deletingTag) return
    setLoading(true)
    try {
      // Delete assignments first
      await supabase.from('contact_tag_assignments').delete().eq('tag_id', deletingTag.id)
      const { error } = await supabase.from('contact_tags').delete().eq('id', deletingTag.id)
      if (error) throw error
      setDeletingTag(null)
      await fetchTags()
      onRefresh?.()
    } catch (err) {
      console.error('Error deleting tag:', err)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (tag: TagWithCount) => {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditColor(tag.color)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>Create, edit, and delete contact tags for groups and categories</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Add new tag */}
            <div className="space-y-3 rounded-lg border border-border p-4">
              <Label className="text-sm font-medium">New Tag</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name..."
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1"
                />
                <Button onClick={handleAddTag} disabled={loading || !tagName.trim()} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: color,
                      border: selectedColor === color ? '3px solid hsl(var(--foreground))' : '2px solid transparent',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Existing tags list */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Existing Tags ({tags.length})</Label>
              {fetching ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : tags.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No tags yet. Create one above.</p>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 hover:bg-accent/30 transition-colors"
                    >
                      {editingId === tag.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 text-sm flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleEditTag(tag.id)}
                            autoFocus
                          />
                          <div className="flex gap-1">
                            {PRESET_COLORS.map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setEditColor(c)}
                                className="h-5 w-5 rounded-full"
                                style={{
                                  backgroundColor: c,
                                  border: editColor === c ? '2px solid hsl(var(--foreground))' : '1px solid transparent',
                                }}
                              />
                            ))}
                          </div>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditTag(tag.id)} disabled={loading}>
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                            <span className="text-sm font-medium">{tag.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {tag.contact_count} {tag.contact_count === 1 ? 'contact' : 'contacts'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(tag)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDeletingTag(tag)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingTag} onOpenChange={(open) => !open && setDeletingTag(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag &quot;{deletingTag?.name}&quot;? This will remove it from {deletingTag?.contact_count} contact(s). This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTag}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Deleting...' : 'Delete Tag'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
