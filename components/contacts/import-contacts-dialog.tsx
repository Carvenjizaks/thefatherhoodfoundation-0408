'use client'

import React from "react"

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload } from 'lucide-react'

interface ImportContactsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
}

export function ImportContactsDialog({ open, onOpenChange, organizationId }: ImportContactsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setMessage(null)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('organizationId', organizationId)

      const response = await fetch('/api/contacts/import', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error)

      setMessage({
        type: 'success',
        text: `Successfully imported ${result.count} contacts!`,
      })
      setFile(null)
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to import contacts',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV file with contact information. Expected columns: first_name, last_name, email, phone, city.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
            </label>
          </div>

          <Button 
            onClick={handleImport} 
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? 'Importing...' : 'Import Contacts'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
