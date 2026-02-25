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
  membershipStatus: string
  disciplesClassCompleted: string
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

const ORG_SLUG = 'powerhouse'

export default function JoinDreamTeamPage() {
  const [orgName, setOrgName] = useState<string>('')
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgError, setOrgError] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    membershipStatus: '', disciplesClassCompleted: '',
    serviceArea: '', otherServiceArea: '', skills: '', availability: '', notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`/api/organization/public?slug=${ORG_SLUG}`)
        if (res.ok) { const data = await res.json(); setOrgName(data.name) }
        else { setOrgError(true) }
      } catch { setOrgError(true) }
      finally { setOrgLoading(false) }
    }
    fetchOrg()
  }, [])

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName': return !value.trim() ? 'First name is required' : undefined
      case 'lastName': return !value.trim() ? 'Last name is required' : undefined
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        return undefined
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^[+]?[\d\s()-]{7,15}$/.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number'
        return undefined
      case 'membershipStatus': return !value ? 'Please select your membership status' : undefined
      case 'disciplesClassCompleted': return !value ? 'Please answer this question' : undefined
      case 'serviceArea': return !value ? 'Please select a service area' : undefined
      case 'otherServiceArea':
        if (formData.serviceArea === 'other' && !value.trim()) return 'Please specify your service area'
        return undefined
      default: return undefined
    }
  }, [formData.serviceArea])

  useEffect(() => {
    const newErrors: FormErrors = {}
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        const error = validateField(field, formData[field as keyof FormData])
        if (error) { (newErrors as Record<string, string>)[field] = error }
      }
    })
    setErrors(newErrors)
  }, [formData, touched, validateField])

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (!touched[name]) setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleBlur = (name: string) => setTouched((prev) => ({ ...prev, [name]: true }))

  const validateAll = (): boolean => {
    const fields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone', 'membershipStatus', 'disciplesClassCompleted', 'serviceArea']
    if (formData.serviceArea === 'other') fields.push('otherServiceArea')
    const newTouched: Record<string, boolean> = {}
    const newErrors: FormErrors = {}
    let valid = true
    fields.forEach((field) => {
      newTouched[field] = true
      const error = validateField(field, formData[field])
      if (error) { (newErrors as Record<string, string>)[field] = error; valid = false }
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
        body: JSON.stringify({ ...formData, organizationSlug: ORG_SLUG }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) { setErrors(data.errors); if (data.errors.form) setErrors((prev) => ({ ...prev, form: data.errors.form })) }
        else setErrors({ form: 'Something went wrong. Please try again.' })
        return
      }
      setIsSuccess(true)
    } catch { setErrors({ form: 'Something went wrong. Please try again.' }) }
    finally { setIsSubmitting(false) }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', membershipStatus: '', disciplesClassCompleted: '', serviceArea: '', otherServiceArea: '', skills: '', availability: '', notes: '' })
    setTouched({})
    setErrors({})
  }

  if (orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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

  // Welcome screen after signup - with banner image
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
          <div className="rounded-2xl border border-border/50 bg-card shadow-xl overflow-hidden">
            <div className="relative w-full h-40 md:h-52 overflow-hidden">
              <img
                src="/images/dreamteam-banner.jpg"
                alt="Powerhouse Community #WeCare volunteers"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
            </div>
            <div className="p-8 md:p-12 text-center -mt-8 relative">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
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
                {'Thank you, '}
                <span className="font-semibold text-foreground">{formData.firstName}</span>
                {'! You have been successfully registered.'}
              </p>
              <p className="text-muted-foreground mb-6 text-pretty">
                {'A personalized welcome email has been sent to '}
                <span className="font-medium text-foreground">{formData.email}</span>
                {' with details about your service area and schedule links.'}
              </p>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Heart className="h-4 w-4 mr-2" />
                {formData.serviceArea === 'other'
                  ? formData.otherServiceArea
                  : SERVICE_AREAS.find(s => s.value === formData.serviceArea)?.label}
              </div>
              <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  We will be in touch soon. God bless you!
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-8">
            {'Powered by '}<span className="font-semibold">{'Powerhouse Community #WeCare'}</span>
          </p>
        </div>
      </div>
    )
  }

  // Signup form - no banner
  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-5">
            <Users className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3 text-balance">
            {'Join the '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DreamTeam
            </span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto text-pretty">
            {'Sign up to serve at '}
            <span className="font-semibold text-foreground">{orgName}</span>
            {'. We would love to have you on the team!'}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-12 md:py-20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
          {errors.form && (
            <Alert variant="destructive"><AlertDescription>{errors.form}</AlertDescription></Alert>
          )}

          {/* Section 1: Personal Information */}
          <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-7">
            <div>
              <h2 className="text-base font-semibold text-foreground">Personal Information</h2>
              <p className="text-sm text-muted-foreground mt-1">Tell us a little about yourself</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstName" className="text-sm font-medium">{'First Name '}<span className="text-destructive">*</span></Label>
                <Input id="firstName" placeholder="e.g. John" value={formData.firstName} onChange={(e) => handleChange('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} className={`h-12 ${errors.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}`} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? 'firstName-error' : undefined} />
                {errors.firstName && <p id="firstName-error" className="text-xs text-destructive mt-1">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="lastName" className="text-sm font-medium">{'Last Name '}<span className="text-destructive">*</span></Label>
                <Input id="lastName" placeholder="e.g. Doe" value={formData.lastName} onChange={(e) => handleChange('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} className={`h-12 ${errors.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}`} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? 'lastName-error' : undefined} />
                {errors.lastName && <p id="lastName-error" className="text-xs text-destructive mt-1">{errors.lastName}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">{'Email Address '}<span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="e.g. john@example.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} className={`h-12 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p id="email-error" className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone" className="text-sm font-medium">{'Phone Number '}<span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" placeholder="e.g. 072 123 4567" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} className={`h-12 ${errors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                {errors.phone && <p id="phone-error" className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>
          </section>

          {/* Section 2: Church Membership */}
          <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-7">
            <div>
              <h2 className="text-base font-semibold text-foreground">Church Membership</h2>
              <p className="text-sm text-muted-foreground mt-1">Help us understand your journey with us</p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium">Are you a Powerhouse member or guest? <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Member', 'Guest'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange('membershipStatus', option.toLowerCase())}
                      className={`h-14 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.membershipStatus === option.toLowerCase()
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-accent hover:border-border/80'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.membershipStatus && <p className="text-xs text-destructive">{errors.membershipStatus}</p>}
              </div>

              <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium">Have you completed Disciples Classes? <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Yes', 'No'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleChange('disciplesClassCompleted', option.toLowerCase())}
                      className={`h-14 rounded-xl border-2 text-sm font-medium transition-all ${
                        formData.disciplesClassCompleted === option.toLowerCase()
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-background text-muted-foreground hover:bg-accent hover:border-border/80'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.disciplesClassCompleted && <p className="text-xs text-destructive">{errors.disciplesClassCompleted}</p>}
              </div>
            </div>
          </section>

          {/* Section 3: Service Area */}
          <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-7">
            <div>
              <h2 className="text-base font-semibold text-foreground">Service Area</h2>
              <p className="text-sm text-muted-foreground mt-1">Where would you like to serve?</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="serviceArea" className="text-sm font-medium">{'Ministry / Service Area '}<span className="text-destructive">*</span></Label>
                <Select value={formData.serviceArea} onValueChange={(value) => { handleChange('serviceArea', value); if (value !== 'other') setFormData(prev => ({ ...prev, otherServiceArea: '' })) }}>
                  <SelectTrigger id="serviceArea" className={`h-12 ${errors.serviceArea ? 'border-destructive focus:ring-destructive' : ''}`} aria-invalid={!!errors.serviceArea}>
                    <SelectValue placeholder="Select a ministry area..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_AREAS.map((area) => (<SelectItem key={area.value} value={area.value}>{area.label}</SelectItem>))}
                  </SelectContent>
                </Select>
                {errors.serviceArea && <p className="text-xs text-destructive mt-1">{errors.serviceArea}</p>}
              </div>

              {formData.serviceArea && formData.serviceArea !== 'other' && (
                <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  {SERVICE_AREAS.find(s => s.value === formData.serviceArea)?.description}
                </div>
              )}

              {formData.serviceArea === 'other' && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="otherServiceArea" className="text-sm font-medium">{'Specify Your Service Area '}<span className="text-destructive">*</span></Label>
                  <Input id="otherServiceArea" placeholder="e.g. Prayer Team, Outreach, Administration..." value={formData.otherServiceArea} onChange={(e) => handleChange('otherServiceArea', e.target.value)} onBlur={() => handleBlur('otherServiceArea')} className={`h-12 ${errors.otherServiceArea ? 'border-destructive focus-visible:ring-destructive' : ''}`} aria-invalid={!!errors.otherServiceArea} aria-describedby={errors.otherServiceArea ? 'otherServiceArea-error' : undefined} />
                  {errors.otherServiceArea && <p id="otherServiceArea-error" className="text-xs text-destructive mt-1">{errors.otherServiceArea}</p>}
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Additional Details */}
          <section className="rounded-2xl border border-border/50 bg-card p-6 md:p-8 flex flex-col gap-7">
            <div>
              <h2 className="text-base font-semibold text-foreground">Additional Details</h2>
              <p className="text-sm text-muted-foreground mt-1">Optional -- but helps us place you better</p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="skills" className="text-sm font-medium">Skills & Experience</Label>
                <Textarea id="skills" placeholder="e.g. I play the guitar, have experience with sound systems, good with children..." value={formData.skills} onChange={(e) => handleChange('skills', e.target.value)} rows={4} className="resize-none" />
                <p className="text-xs text-muted-foreground">Any relevant skills or experience you bring</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="availability" className="text-sm font-medium">Availability</Label>
                <Input id="availability" placeholder="e.g. Every Sunday, First Sunday of the month, Wednesday evenings..." value={formData.availability} onChange={(e) => handleChange('availability', e.target.value)} className="h-12" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="text-sm font-medium">Additional Notes</Label>
                <Textarea id="notes" placeholder="Anything else you would like us to know..." value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={3} className="resize-none" />
              </div>
            </div>
          </section>

          <div className="pt-2">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground h-14 text-base font-semibold rounded-xl">
              {isSubmitting ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />{'Signing up...'}</>) : (<><Heart className="h-5 w-5 mr-2" />{'Join the DreamTeam'}</>)}
            </Button>
          </div>
        </form>
        <p className="text-center text-xs text-muted-foreground mt-12">
          {'Powered by '}<span className="font-semibold">{'Powerhouse Community #WeCare'}</span>
        </p>
      </main>
    </div>
  )
}
