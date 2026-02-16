'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AppearanceSettingsProps {
  organizationId: string
}

const accentColors = [
  { name: 'Purple', value: 'purple', hsl: '270 91% 65%' },
  { name: 'Blue', value: 'blue', hsl: '221 83% 53%' },
  { name: 'Green', value: 'green', hsl: '142 76% 36%' },
  { name: 'Rose', value: 'rose', hsl: '347 77% 50%' },
  { name: 'Amber', value: 'amber', hsl: '38 92% 50%' },
  { name: 'Teal', value: 'teal', hsl: '172 66% 50%' },
] as const

const colorSwatchMap: Record<string, string> = {
  purple: 'bg-[hsl(270,91%,65%)]',
  blue: 'bg-[hsl(221,83%,53%)]',
  green: 'bg-[hsl(142,76%,36%)]',
  rose: 'bg-[hsl(347,77%,50%)]',
  amber: 'bg-[hsl(38,92%,50%)]',
  teal: 'bg-[hsl(172,66%,50%)]',
}

export function AppearanceSettings({ organizationId }: AppearanceSettingsProps) {
  const supabase = createClient()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [accentColor, setAccentColor] = useState('purple')

  useEffect(() => {
    setMounted(true)
    loadAppearance()
  }, [organizationId])

  async function loadAppearance() {
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
        if (settings?.appearance) {
          const appearance = settings.appearance as Record<string, unknown>
          if (appearance.accent_color) {
            setAccentColor(appearance.accent_color as string)
            applyAccentColor(appearance.accent_color as string)
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load appearance'
      setError(message)
    }
  }

  function applyAccentColor(colorValue: string) {
    const colorDef = accentColors.find((c) => c.value === colorValue)
    if (!colorDef) return
    document.documentElement.style.setProperty('--primary', colorDef.hsl)
    document.documentElement.style.setProperty('--ring', colorDef.hsl)
    document.documentElement.style.setProperty('--chart-1', colorDef.hsl)
    document.documentElement.style.setProperty('--sidebar-primary', colorDef.hsl)
    document.documentElement.style.setProperty('--sidebar-ring', colorDef.hsl)
  }

  function handleAccentChange(colorValue: string) {
    setAccentColor(colorValue)
    applyAccentColor(colorValue)
  }

  async function handleSave() {
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
        appearance: {
          accent_color: accentColor,
        },
      }

      const { error: updateError } = await supabase
        .from('organizations')
        .update({ settings: updatedSettings })
        .eq('id', orgId)

      if (updateError) throw updateError
      toast.success('Appearance settings saved')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save'
      setError(message)
      toast.error('Failed to save appearance settings')
    } finally {
      setSaving(false)
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Theme Mode
          </CardTitle>
          <CardDescription>
            Choose between light, dark, or system theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const isActive = mounted && theme === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  )}
                  aria-label={`Set ${opt.label} theme`}
                >
                  <opt.icon className={cn('h-6 w-6', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('text-sm font-medium', isActive ? 'text-primary' : 'text-foreground')}>
                    {opt.label}
                  </span>
                  {isActive && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Accent Color
          </CardTitle>
          <CardDescription>
            Choose a primary accent color for your workspace. This applies across buttons, links, and active states.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {accentColors.map((color) => {
              const isActive = accentColor === color.value
              return (
                <button
                  key={color.value}
                  onClick={() => handleAccentChange(color.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  )}
                  aria-label={`Set ${color.name} accent color`}
                >
                  <div className={cn('h-8 w-8 rounded-full relative', colorSwatchMap[color.value])}>
                    {isActive && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground">{color.name}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving || !orgId}>
          {saving ? 'Saving...' : 'Save Appearance'}
        </Button>
      </div>
    </div>
  )
}
