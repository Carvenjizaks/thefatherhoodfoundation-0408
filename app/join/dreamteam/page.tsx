'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Loader2, Heart, Users, ChevronRight, Sparkles, Church } from 'lucide-react'

const SERVICE_AREAS = [
  { value: 'ushering_hospitality', label: 'Ushering & Hospitality', description: 'Welcome guests and create a warm atmosphere' },
  { value: 'media_sound', label: 'Media & Sound', description: 'Run sound, visuals, and live stream' },
  { value: 'worship_team', label: 'Worship Team', description: 'Lead worship through music and song' },
  { value: 'childrens_church', label: "Children's Church", description: 'Minister to and teach the younger generation' },
  { value: 'youth_ministry', label: 'Youth Ministry', description: 'Mentor and guide the youth' },
  { value: 'other', label: 'Other', description: 'Specify your own area of service' },
]

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  serviceArea: string
  otherServiceArea: string
  skills: string
  availability: string
  notes: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  serviceArea?: string
  otherServiceArea?: string
  form?: string
  organization?: string
}

// Default org slug — can later be made dynamic via URL params
const ORG_SLUG = 'powerhouse'

export default function JoinDreamTeamPage() {
  const [orgName, setOrgName] = useState<string>('')
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgError, setOrgError] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceArea: '',
    otherServiceArea: '',
    skills: '',
    availability: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Fetch org branding
  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`/api/organization/public?slug=${ORG_SLUG}`)
        if (res.ok) {
          const data = await res.json()
          setOrgName(data.name)
        } else {
          setOrgError(true)
        }
      } catch {
        setOrgError(true)
      } finally {
        setOrgLoading(false)
      }
    }
    fetchOrg()
  }, [])

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : undefined
      case 'lastName':
        return !value.trim() ? 'Last name is required' : undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return undefined
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^[+]?[\d\s()-]{7,15}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number'
        return undefined
      case 'serviceArea':
        return !value ? 'Please select a service area' : undefined
      case 'otherServiceArea':
        if (formData.serviceArea === 'other' && !value.trim()) return 'Please specify your service area'
        return undefined
      default:
        return undefined
    }
  }, [formData.serviceArea])

  useEffect(() => {
    const newErrors: FormErrors = {}
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        const error = validateField(field, formData[field as keyof FormData])
        if (error) {
          ;(newErrors as Record<string, string>)[field] = error
        }
      }
    })
    setErrors(newErrors)
  }, [formData, touched, validateField])

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const validateAll = (): boolean => {
    const fields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone', 'serviceArea']
    if (formData.serviceArea === 'other') fields.push('otherServiceArea')

    const newTouched: Record<string, boolean> = {}
    const newErrors: FormErrors = {}
    let valid = true

    fields.forEach((field) => {
      newTouched[field] = true
      const error = validateField(field, formData[field])
      if (error) {
        ;(newErrors as Record<string, string>)[field] = error
        valid = false
      }
    })

    setTouched((prev) => ({ ...prev, ...newTouched }))
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors((prev) => ({ ...prev, form: undefined }))

    if (!validateAll()) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/dreamteam/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationSlug: ORG_SLUG,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors)
          if (data.errors.form) {
            setErrors((prev) => ({ ...prev, form: data.errors.form }))
          }
        } else {
          setErrors({ form: 'Something went wrong. Please try again.' })
        }
        return
      }

      setIsSuccess(true)
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Organization not found
  if (orgError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Church className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Organization Not Found</h1>
          <p className="text-muted-foreground">
            This signup link may be invalid or the organization has not been set up yet.
          </p>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
          <div className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
            <div className="p-8 md:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-balance">
                Welcome to the DreamTeam!
              </h2>
              <p className="text-muted-foreground text-lg mb-4 text-pretty">
                Thank you, <span className="font-semibold text-foreground">{formData.firstName}</span>! You have been successfully registered.
              </p>
              <p className="text-muted-foreground mb-6 text-pretty">
                A personalized welcome email has been sent to{' '}
                <span className="font-medium text-foreground">{formData.email}</span> with
                details about your service area and schedule links.
              </p>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4 mr-2" />
                {formData.serviceArea === 'other'
                  ? formData.otherServiceArea
                  : SERVICE_AREAS.find(s => s.value === formData.serviceArea)?.label}
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSuccess(false)
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      serviceArea: '',
                      otherServiceArea: '',
                      skills: '',
                      availability: '',
                      notes: '',
                    })
                    setTouched({})
                    setErrors({})
                  }}
                >
                  Sign up another volunteer
                </Button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            Powered by <span className="font-semibold">Powerhouse Community #WeCare</span>
          </p>
        </div>
      </div>
    )
  }

  // Form
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto max-w-2xl px-4 py-12 md:py-16 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-5">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 text-balance">
            Join the{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DreamTeam
            </span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto text-pretty">
            Sign up to serve at <span className="font-semibold text-foreground">{orgName}</span>. We would love to have you on the team!
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-2xl px-4 py-8 md:py-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
          {errors.form && (
            <Alert variant="destructive">
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          {/* Section 1: Personal Information */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="h-px flex-1 bg-border" />
              Personal Information
              <span className="h-px flex-1 bg-border" />
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  className={errors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  className={errors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 072 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Service Area */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="h-px flex-1 bg-border" />
              Service Area
              <span className="h-px flex-1 bg-border" />
            </h2>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="serviceArea" className="text-sm font-medium">
                Ministry / Service Area <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.serviceArea}
                onValueChange={(value) => {
                  handleChange('serviceArea', value)
                  if (value !== 'other') {
                    setFormData(prev => ({ ...prev, otherServiceArea: '' }))
                  }
                }}
              >
                <SelectTrigger
                  id="serviceArea"
                  className={errors.serviceArea ? 'border-destructive focus:ring-destructive' : ''}
                  aria-invalid={!!errors.serviceArea}
                >
                  <SelectValue placeholder="Select a ministry area..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_AREAS.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceArea && (
                <p className="text-xs text-destructive">{errors.serviceArea}</p>
              )}

              {formData.serviceArea && formData.serviceArea !== 'other' && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                  <ChevronRight className="h-3.5 w-3.5 text-primary" />
                  {SERVICE_AREAS.find(s => s.value === formData.serviceArea)?.description}
                </div>
              )}
            </div>

            {formData.serviceArea === 'other' && (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                <Label htmlFor="otherServiceArea" className="text-sm font-medium">
                  Specify Your Service Area <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="otherServiceArea"
                  placeholder="e.g. Prayer Team, Outreach, Administration..."
                  value={formData.otherServiceArea}
                  onChange={(e) => handleChange('otherServiceArea', e.target.value)}
                  onBlur={() => handleBlur('otherServiceArea')}
                  className={errors.otherServiceArea ? 'border-destructive focus-visible:ring-destructive' : ''}
                  aria-invalid={!!errors.otherServiceArea}
                  aria-describedby={errors.otherServiceArea ? 'otherServiceArea-error' : undefined}
                />
                {errors.otherServiceArea && (
                  <p id="otherServiceArea-error" className="text-xs text-destructive">{errors.otherServiceArea}</p>
                )}
              </div>
            )}
          </section>

          {/* Section 3: Additional Details */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="h-px flex-1 bg-border" />
              Additional Details
              <span className="h-px flex-1 bg-border" />
            </h2>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skills" className="text-sm font-medium">Skills & Experience</Label>
              <Textarea
                id="skills"
                placeholder="e.g. I play the guitar, have experience with sound systems, good with children..."
                value={formData.skills}
                onChange={(e) => handleChange('skills', e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Any relevant skills or experience you bring</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="availability" className="text-sm font-medium">Availability</Label>
              <Input
                id="availability"
                placeholder="e.g. Every Sunday, First Sunday of the month, Wednesday evenings..."
                value={formData.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Anything else you would like us to know..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
              />
            </div>
          </section>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground h-12 text-base font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Signing up...
              </>
            ) : (
              <>
                <Heart className="h-5 w-5 mr-2" />
                Join the DreamTeam
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Powered by <span className="font-semibold">Powerhouse Community #WeCare</span>
        </p>
      </main>
    </div>
  )
}
