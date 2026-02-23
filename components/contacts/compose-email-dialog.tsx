'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Send, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export interface EmailRecipient {
  id: string
  first_name: string
  last_name: string
  email: string
}

interface ComposeEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipients: EmailRecipient[]
  onRemoveRecipient?: (id: string) => void
  groupLabel?: string
}

export function ComposeEmailDialog({
  open,
  onOpenChange,
  recipients,
  onRemoveRecipient,
  groupLabel,
}: ComposeEmailDialogProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)

  const validRecipients = recipients.filter((r) => r.email?.trim())
  const isBulk = validRecipients.length > 1

  const handleClose = () => {
    setSubject('')
    setBody('')
    setResult(null)
    setShowConfirm(false)
    setSending(false)
    onOpenChange(false)
  }

  const handleSendClick = () => {
    if (!subject.trim() || !body.trim() || validRecipients.length === 0) return
    setShowConfirm(true)
  }

  const handleConfirmSend = async () => {
    setShowConfirm(false)
    setSending(true)
    try {
      const res = await fetch('/api/contacts/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: validRecipients.map((r) => ({ email: r.email, name: `${r.first_name} ${r.last_name}` })),
          subject: subject.trim(),
          body: body.trim(),
        }),
      })
      const data = await res.json()
      setResult({ sent: data.sent ?? 0, failed: data.failed ?? 0 })
    } catch {
      setResult({ sent: 0, failed: validRecipients.length })
    } finally {
      setSending(false)
    }
  }

  // Result view
  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            {result.failed === 0 ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Emails Sent</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Successfully sent to {result.sent} {result.sent === 1 ? 'recipient' : 'recipients'}.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                  <AlertCircle className="h-7 w-7 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Partially Sent</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sent: {result.sent}, Failed: {result.failed}
                  </p>
                </div>
              </>
            )}
            <Button onClick={handleClose} className="mt-2">Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={open && !showConfirm} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {isBulk ? 'Send Bulk Email' : 'Send Email'}
            </DialogTitle>
            <DialogDescription>
              {groupLabel
                ? `Emailing ${validRecipients.length} contacts in "${groupLabel}"`
                : `Emailing ${validRecipients.length} ${validRecipients.length === 1 ? 'contact' : 'contacts'}`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1 overflow-y-auto py-2">
            {/* Recipients */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                To ({validRecipients.length})
              </Label>
              <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-muted/30 p-2.5 max-h-28 overflow-y-auto">
                {validRecipients.length === 0 && (
                  <p className="text-sm text-muted-foreground px-1">No recipients with email addresses</p>
                )}
                {validRecipients.map((r) => (
                  <span
                    key={r.id}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-2 py-1 text-xs font-medium"
                  >
                    {r.first_name} {r.last_name}
                    {onRemoveRecipient && (
                      <button
                        type="button"
                        onClick={() => onRemoveRecipient(r.id)}
                        className="ml-0.5 rounded hover:bg-primary/20 p-0.5 transition-colors"
                        aria-label={`Remove ${r.first_name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="email-subject" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Subject
              </Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            {/* Body */}
            <div className="space-y-2 flex-1">
              <Label htmlFor="email-body" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Message
              </Label>
              <Textarea
                id="email-body"
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[180px] resize-y"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendClick}
              disabled={!subject.trim() || !body.trim() || validRecipients.length === 0 || sending}
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send {isBulk ? `to ${validRecipients.length}` : 'Email'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Send</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to send an email to{' '}
              <span className="font-semibold text-foreground">{validRecipients.length}</span>{' '}
              {validRecipients.length === 1 ? 'recipient' : 'recipients'} with subject{' '}
              <span className="font-semibold text-foreground">{`"${subject}"`}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
