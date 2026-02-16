'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Building2 } from 'lucide-react'
import { toast } from 'sonner'

interface GeneralSettingsProps {
  organizationId: string
}

interface OrgData {
  id: string
  name: string
  slug: string
  settings: Record<string, unknown>
}

export function GeneralSettings({ organizationId }: GeneralSettingsProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [org, setOrg] = useState<OrgData | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    loadOrganization()
  }, [organizationId])

  async function loadOrganization() {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('organizations')
        .select('*')
        .limit(1)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (data) {
        setOrg(data)
        setName(data.name)
        setSlug(data.slug)
        const settings = data.settings as Record<string, unknown> | null
        if (settings?.logo_url) {
          setLogoPreview(settings.logo_url as string)
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load organization'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return
    setError(null)
    setSaving(true)

    try {
      const updatedSettings = {
        ...(org?.settings || {}),
        logo_url: logoPreview || null,
      }

      if (org) {
        const { error: updateError } = await supabase
          .from('organizations')
          .update({ name: name.trim(), slug: slug.trim(), settings: updatedSettings })
          .eq('id', org.id)

        if (updateError) throw updateError
      } else {
        const { data: newOrg, error: insertError } = await supabase
          .from('organizations')
          .insert({ name: name.trim(), slug: slug.trim(), settings: updatedSettings })
          .select()
          .single()

        if (insertError) throw insertError
        setOrg(newOrg)
      }

      toast.success('Organization settings saved')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setError(message)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground text-sm">Loading organization settings...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organization Details
          </CardTitle>
          <CardDescription>
            Basic information about your organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Community"
              required
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-slug">Slug / Subdomain</Label>
            <div className="flex items-center gap-2">
              <Input
                id="org-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="my-community"
                required
                disabled={saving}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">.tribu.app</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be used as your unique workspace URL.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>
            Upload your organization logo. Recommended size: 256x256px.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div
              className="h-20 w-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/50 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
              aria-label="Upload logo"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Organization logo" className="h-full w-full object-cover" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
              >
                Choose File
              </Button>
              {logoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setLogoPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                  disabled={saving}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || !name.trim() || !slug.trim()}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
