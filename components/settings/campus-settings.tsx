'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CampusSettingsProps {
  organizationId: string
}

interface Campus {
  id: string
  name: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  latitude: number | null
  longitude: number | null
  is_active: boolean
  organization_id: string
  created_at: string
}

const emptyCampus = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  latitude: '',
  longitude: '',
}

export function CampusSettings({ organizationId }: CampusSettingsProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [campuses, setCampuses] = useState<Campus[]>([])
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingCampus, setEditingCampus] = useState<Campus | null>(null)
  const [deletingCampus, setDeletingCampus] = useState<Campus | null>(null)
  const [formData, setFormData] = useState(emptyCampus)

  useEffect(() => {
    loadCampuses()
  }, [organizationId])

  async function loadCampuses() {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('campuses')
        .select('*')
        .order('name')

      if (fetchError) throw fetchError
      setCampuses(data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load campuses'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  function openAddDialog() {
    setEditingCampus(null)
    setFormData(emptyCampus)
    setError(null)
    setDialogOpen(true)
  }

  function openEditDialog(campus: Campus) {
    setEditingCampus(campus)
    setFormData({
      name: campus.name,
      address: campus.address || '',
      city: campus.city || '',
      state: campus.state || '',
      zip_code: campus.zip_code || '',
      latitude: campus.latitude?.toString() || '',
      longitude: campus.longitude?.toString() || '',
    })
    setError(null)
    setDialogOpen(true)
  }

  function openDeleteDialog(campus: Campus) {
    setDeletingCampus(campus)
    setDeleteDialogOpen(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return
    setError(null)
    setSaving(true)

    try {
      const payload = {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        state: formData.state.trim() || null,
        zip_code: formData.zip_code.trim() || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        organization_id: organizationId,
      }

      if (editingCampus) {
        const { error: updateError } = await supabase
          .from('campuses')
          .update(payload)
          .eq('id', editingCampus.id)

        if (updateError) throw updateError
        toast.success('Campus updated')
      } else {
        const { error: insertError } = await supabase
          .from('campuses')
          .insert(payload)

        if (insertError) throw insertError
        toast.success('Campus added')
      }

      setDialogOpen(false)
      loadCampuses()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save campus'
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deletingCampus) return
    setSaving(true)

    try {
      const { error: deleteError } = await supabase
        .from('campuses')
        .delete()
        .eq('id', deletingCampus.id)

      if (deleteError) throw deleteError
      toast.success('Campus deleted')
      setDeleteDialogOpen(false)
      setDeletingCampus(null)
      loadCampuses()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete campus'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(campus: Campus) {
    try {
      const { error: updateError } = await supabase
        .from('campuses')
        .update({ is_active: !campus.is_active })
        .eq('id', campus.id)

      if (updateError) throw updateError
      setCampuses((prev) =>
        prev.map((c) => (c.id === campus.id ? { ...c, is_active: !c.is_active } : c))
      )
      toast.success(campus.is_active ? 'Campus deactivated' : 'Campus activated')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update'
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground text-sm">Loading campuses...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Campus Locations
                </CardTitle>
                <CardDescription>
                  Manage the physical locations for your organization.
                </CardDescription>
              </div>
              <Button onClick={openAddDialog} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Campus
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {campuses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground text-sm">No campuses configured yet.</p>
                <Button onClick={openAddDialog} variant="outline" size="sm" className="mt-3">
                  Add Your First Campus
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {campuses.map((campus) => (
                  <div
                    key={campus.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground">{campus.name}</h4>
                        <Badge variant={campus.is_active ? 'default' : 'secondary'} className="text-xs">
                          {campus.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {[campus.address, campus.city, campus.state, campus.zip_code]
                          .filter(Boolean)
                          .join(', ') || 'No address specified'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={campus.is_active}
                        onCheckedChange={() => toggleActive(campus)}
                        aria-label={`Toggle ${campus.name} active status`}
                      />
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(campus)} className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit {campus.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(campus)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete {campus.name}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCampus ? 'Edit Campus' : 'Add Campus'}</DialogTitle>
            <DialogDescription>
              {editingCampus ? 'Update campus details.' : 'Add a new campus location to your organization.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="campus-name">Name *</Label>
              <Input
                id="campus-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Main Campus"
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campus-address">Address</Label>
              <Input
                id="campus-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                disabled={saving}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="campus-city">City</Label>
                <Input
                  id="campus-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus-state">State</Label>
                <Input
                  id="campus-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus-zip">Zip Code</Label>
                <Input
                  id="campus-zip"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  disabled={saving}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="campus-lat">Latitude</Label>
                <Input
                  id="campus-lat"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="0.0"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus-lng">Longitude</Label>
                <Input
                  id="campus-lng"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="0.0"
                  disabled={saving}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : editingCampus ? 'Update Campus' : 'Add Campus'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campus</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCampus?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={saving} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {saving ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
