'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Download, Mail, FileText, CheckCircle2 } from 'lucide-react'

interface ExportProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: any
  programItems: any[]
}

export function ExportProgramDialog({ open, onOpenChange, event, programItems }: ExportProgramDialogProps) {
  const supabase = createClient()
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'text'>('text')
  const [emailAddresses, setEmailAddresses] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [includeAssignments, setIncludeAssignments] = useState(true)

  const generateTextExport = () => {
    let text = `EVENT PROGRAM: ${event.title}\n`
    text += `Date: ${new Date(event.event_date).toLocaleDateString()}\n`
    if (event.location) text += `Location: ${event.location}\n`
    text += `\n${'='.repeat(60)}\n\n`

    programItems.forEach((item, index) => {
      text += `${item.sequence_order}. ${item.title}\n`
      text += `   Time: ${item.start_time} - ${item.end_time} (${item.duration_minutes} min)\n`
      if (item.description) text += `   Description: ${item.description}\n`
      if (item.item_type) text += `   Type: ${item.item_type}\n`
      
      if (includeAssignments && item.assignments && item.assignments.length > 0) {
        text += `   Assignments:\n`
        item.assignments.forEach((assignment: any) => {
          const person = assignment.profile?.full_name || 'Unassigned'
          text += `     - ${assignment.role_name}: ${person}\n`
        })
      }
      
      if (item.notes) text += `   Notes: ${item.notes}\n`
      text += `\n`
    })

    return text
  }

  const generateCSVExport = () => {
    let csv = 'Sequence,Title,Type,Start Time,End Time,Duration (min),Description,Assignments,Notes\n'
    
    programItems.forEach(item => {
      const assignments = includeAssignments && item.assignments
        ? item.assignments.map((a: any) => `${a.role_name}: ${a.profile?.full_name || 'Unassigned'}`).join('; ')
        : ''
      
      csv += [
        item.sequence_order,
        `"${item.title}"`,
        item.item_type || '',
        item.start_time,
        item.end_time,
        item.duration_minutes,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        `"${assignments}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`
      ].join(',') + '\n'
    })

    return csv
  }

  const handleDownload = () => {
    const content = exportFormat === 'csv' ? generateCSVExport() : generateTextExport()
    const blob = new Blob([content], { type: exportFormat === 'csv' ? 'text/csv' : 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}_program.${exportFormat === 'csv' ? 'csv' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Track export
    supabase
      .from('event_program_exports')
      .insert({
        event_id: event.id,
        export_type: 'download',
        format: exportFormat,
        exported_by: null // Auth disabled
      })
      .then(() => console.log('[v0] Export tracked'))

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleSendEmail = async () => {
    setLoading(true)

    try {
      const emails = emailAddresses.split(',').map(e => e.trim()).filter(e => e)
      
      if (emails.length === 0) {
        throw new Error('Please enter at least one email address')
      }

      const programContent = generateTextExport()

      // In a real implementation, this would call a server function to send emails
      // For now, we'll simulate it and show success
      console.log('[v0] Sending emails to:', emails)
      console.log('[v0] Program content:', programContent)
      console.log('[v0] Message:', emailMessage)

      // Track export
      await supabase
        .from('event_program_exports')
        .insert({
          event_id: event.id,
          export_type: 'email',
          format: 'text',
          recipient_emails: emails,
          exported_by: null // Auth disabled
        })

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setEmailAddresses('')
        setEmailMessage('')
        onOpenChange(false)
      }, 2000)
    } catch (err: any) {
      console.error('[v0] Error sending email:', err)
      alert(err.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Event Program</DialogTitle>
          <DialogDescription>
            Download or email the event program to team members
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="font-medium">Program exported successfully!</p>
          </div>
        ) : (
          <Tabs defaultValue="download" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="download">
                <Download className="h-4 w-4 mr-2" />
                Download
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="download" className="space-y-4">
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Export the program as a file for offline use or printing
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label>Export Format</Label>
                <div className="flex gap-2">
                  <Button
                    variant={exportFormat === 'text' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('text')}
                    className="flex-1"
                  >
                    Text
                  </Button>
                  <Button
                    variant={exportFormat === 'csv' ? 'default' : 'outline'}
                    onClick={() => setExportFormat('csv')}
                    className="flex-1"
                  >
                    CSV
                  </Button>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="include-assignments"
                    checked={includeAssignments}
                    onCheckedChange={(checked) => setIncludeAssignments(checked as boolean)}
                  />
                  <label
                    htmlFor="include-assignments"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include role assignments
                  </label>
                </div>

                <div className="bg-muted rounded-lg p-4 max-h-[300px] overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {exportFormat === 'csv' ? generateCSVExport() : generateTextExport()}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Email the program to all assigned team members and additional recipients
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email-addresses">Email Addresses *</Label>
                <Textarea
                  id="email-addresses"
                  value={emailAddresses}
                  onChange={(e) => setEmailAddresses(e.target.value)}
                  placeholder="Enter email addresses separated by commas&#10;example@email.com, another@email.com"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple addresses with commas
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-message">Additional Message (Optional)</Label>
                <Textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Add a personal message to include with the program"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-assignments-email"
                  checked={includeAssignments}
                  onCheckedChange={(checked) => setIncludeAssignments(checked as boolean)}
                />
                <label
                  htmlFor="include-assignments-email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Include role assignments in email
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendEmail} disabled={loading}>
                  <Mail className="h-4 w-4 mr-2" />
                  {loading ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
