'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Download, Tags } from 'lucide-react'
import { AddContactDialog } from './add-contact-dialog'
import { ManageTagsDialog } from './manage-tags-dialog'
import { ImportContactsDialog } from './import-contacts-dialog'
import { useRouter } from 'next/navigation'

interface ContactsHeaderProps {
  organizationId: string
  role: string
}

export function ContactsHeader({ organizationId, role }: ContactsHeaderProps) {
  const router = useRouter()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showTagsDialog, setShowTagsDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  
  const canManage = ['admin', 'manager', 'leader'].includes(role)

  const handleExport = async () => {
    // Export contacts as CSV
    const response = await fetch('/api/contacts/export')
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Contacts</h2>
          <p className="text-muted-foreground mt-1">
            Manage your community contacts and relationships
          </p>
        </div>
        
        {canManage && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowTagsDialog(true)}>
              <Tags className="h-4 w-4 mr-2" />
              Manage Tags
            </Button>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] hover:opacity-90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        )}
      </div>

      <AddContactDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        organizationId={organizationId}
      />
      
      <ManageTagsDialog
        open={showTagsDialog}
        onOpenChange={setShowTagsDialog}
        organizationId={organizationId}
      />

      <ImportContactsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        organizationId={organizationId}
      />
    </>
  )
}
