'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bell, Mail, Smartphone, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface NotificationsSettingsProps {
  organizationId: string
}

interface NotificationPrefs {
  email_enabled: boolean
  sms_enabled: boolean
  default_reminder_days: number
  default_reminder_time: string
}

const defaultPrefs: NotificationPrefs = {
  email_enabled: true,
  sms_enabled: false,
  default_reminder_days: 3,
  default_reminder_time: '09:00',
}

export function NotificationsSettings({ organizationId }: NotificationsSettingsProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs)

  useEffect(() => {
    loadPreferences()
  }, [organizationId])

  async function loadPreferences() {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('organizations')
        .select('id, settings')
        .limit(1)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (data) {
        setOrgId(data.id)
        const settings = data.settings as Record<string, unknown> | null
        if (settings?.notifications) {
          const saved = settings.notifications as Partial<NotificationPrefs>
          setPrefs({
            email_enabled: saved.email_enabled ?? defaultPrefs.email_enabled,
            sms_enabled: saved.sms_enabled ?? defaultPrefs.sms_enabled,
            default_reminder_days: saved.default_reminder_days ?? defaultPrefs.default_reminder_days,
            default_reminder_time: saved.default_reminder_time ?? defaultPrefs.default_reminder_time,
          })
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load preferences'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!orgId) {
      toast.error('No organization found. Please configure General settings first.')
      return
    }
    setError(null)
    setSaving(true)

    try {
      const { data: current } = await supabase
        .from('organizations')
        .select('settings')
        .eq('id', orgId)
        .single()

      const existingSettings = (current?.settings || {}) as Record<string, unknown>
      const updatedSettings = {
        ...existingSettings,
        notifications: prefs,
      }

      const { error: updateError } = await supabase
        .from('organizations')
        .update({ settings: updatedSettings })
        .eq('id', orgId)

      if (updateError) throw updateError
      toast.success('Notification preferences saved')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setError(message)
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground text-sm">Loading notification preferences...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Configure email notifications for your team and contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="email-toggle" className="text-sm font-medium cursor-pointer">
                Enable Email Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Send event reminders, group updates, and task notifications via email.
              </p>
            </div>
            <Switch
              id="email-toggle"
              checked={prefs.email_enabled}
              onCheckedChange={(val) => setPrefs({ ...prefs, email_enabled: val })}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
          <CardDescription>
            Configure SMS notifications for urgent updates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="sms-toggle" className="text-sm font-medium cursor-pointer">
                Enable SMS Notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Send event reminders and important alerts via SMS. Standard messaging rates may apply.
              </p>
            </div>
            <Switch
              id="sms-toggle"
              checked={prefs.sms_enabled}
              onCheckedChange={(val) => setPrefs({ ...prefs, sms_enabled: val })}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Reminder Defaults
          </CardTitle>
          <CardDescription>
            Set default reminder timing for events and tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-days">Days Before Event</Label>
              <Input
                id="reminder-days"
                type="number"
                min="0"
                max="30"
                value={prefs.default_reminder_days}
                onChange={(e) => setPrefs({ ...prefs, default_reminder_days: parseInt(e.target.value) || 0 })}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Number of days before an event to send reminders.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Default Send Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={prefs.default_reminder_time}
                onChange={(e) => setPrefs({ ...prefs, default_reminder_time: e.target.value })}
                disabled={saving}
              />
              <p className="text-xs text-muted-foreground">
                Time of day to send reminder notifications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || !orgId}>
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  )
}
