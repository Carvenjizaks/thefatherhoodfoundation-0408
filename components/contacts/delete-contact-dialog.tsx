'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
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

interface DeleteContactDialogProps {
  contact: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh?: () => void
}

export function DeleteContactDialog({ contact, open, onOpenChange, onRefresh }: DeleteContactDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete tag assignments first
      await supabase.from('contact_tag_assignments').delete().eq('contact_id', contact.id)
      // Delete contact
      const { error } = await supabase.from('contacts').delete().eq('id', contact.id)
      if (error) throw error
      onOpenChange(false)
      onRefresh?.()
    } catch (err) {
      console.error('Error deleting contact:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {contact.first_name} {contact.last_name}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
