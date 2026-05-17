'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InvitationPreview } from './InvitationPreview'
import { ReferralSuccess } from './ReferralSuccess'
import { Loader2, Send, Eye, UserPlus } from 'lucide-react'

interface Referral {
  name: string
  email: string
}

interface ReferralFormProps {
  referrerName: string
  referrerEmail: string
  eventName?: string
  eventDate?: string
  eventLocation?: string
}

interface PreviewData {
  invitations: Array<{
    to: string
    toName: string
    subject: string
    body: string
    from: string
  }>
}

export function ReferralForm({
  referrerName,
  referrerEmail,
  eventName = 'Gathering of Champions 2026',
  eventDate = 'August 2026',
  eventLocation = 'Windhoek, Namibia',
}: ReferralFormProps) {
  const [referrals, setReferrals] = useState<Referral[]>([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [previewData, setPreviewData] = useState<PreviewData | null>(null)
  const [sentReferrals, setSentReferrals] = useState<Referral[] | null>(null)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    let hasValidReferral = false

    referrals.forEach((referral, index) => {
      if (referral.name.trim() || referral.email.trim()) {
        hasValidReferral = true
        if (!referral.name.trim()) {
          newErrors[`name-${index}`] = 'Name is required'
        }
        if (!referral.email.trim()) {
          newErrors[`email-${index}`] = 'Email is required'
        } else if (!validateEmail(referral.email)) {
          newErrors[`email-${index}`] = 'Please enter a valid email'
        }
      }
    })

    if (!hasValidReferral) {
      newErrors['general'] = 'Please add at least one referral'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = useCallback((index: number, field: keyof Referral, value: string) => {
    setReferrals((prev) => {
      const newReferrals = [...prev]
      newReferrals[index] = { ...newReferrals[index], [field]: value }
      return newReferrals
    })
    // Clear error when user types
    if (errors[`${field}-${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`${field}-${index}`]
        return newErrors
      })
    }
  }, [errors])

  const handlePreview = async () => {
    if (!validateForm()) return

    const validReferrals = referrals.filter((r) => r.name.trim() && r.email.trim())
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/goc26/referral/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerName,
          referrerEmail,
          referrals: validReferrals,
          eventName,
          eventDate,
          eventLocation,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch preview')
      }

      const data = await response.json()
      setPreviewData(data)
      setIsPreviewOpen(true)
    } catch (error) {
      console.error('Preview error:', error)
      setErrors({ general: 'Failed to load preview. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!previewData) return

    const validReferrals = referrals.filter((r) => r.name.trim() && r.email.trim())
    
    setIsSending(true)
    try {
      const response = await fetch('/api/goc26/referral/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrerName,
          referrerEmail,
          referrals: validReferrals,
          eventName,
          eventDate,
          eventLocation,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invitations')
      }

      setSentReferrals(validReferrals)
      setIsPreviewOpen(false)
    } catch (error) {
      console.error('Send error:', error)
      setErrors({ general: 'Failed to send invitations. Please try again.' })
    } finally {
      setIsSending(false)
    }
  }

  const handleReset = () => {
    setReferrals([
      { name: '', email: '' },
      { name: '', email: '' },
      { name: '', email: '' },
    ])
    setSentReferrals(null)
    setPreviewData(null)
    setErrors({})
  }

  if (sentReferrals) {
    return (
      <ReferralSuccess
        referrals={sentReferrals}
        onInviteMore={handleReset}
        onDone={() => window.location.href = '/events/goc26'}
      />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-[#e5e5e5] overflow-hidden">
        {/* Header */}
        <div className="bg-[#3D2314] px-6 py-5">
          <h2 className="text-xl font-semibold text-[#f5ede4] flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Fellow Champions
          </h2>
          <p className="text-[#f5ede4]/80 text-sm mt-1">
            Share {eventName} with men who need to be there
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg bg-[#f5ede4]/30 border border-[#e5e5e5]"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`name-${index}`}
                    className="text-sm font-medium text-[#3D2314]"
                  >
                    Friend {index + 1} Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    type="text"
                    placeholder="John Smith"
                    value={referral.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className={`bg-white border-[#e5e5e5] focus:border-[#3D2314] focus:ring-[#3D2314]/20 ${
                      errors[`name-${index}`] ? 'border-red-300 focus:border-red-300' : ''
                    }`}
                  />
                  {errors[`name-${index}`] && (
                    <p className="text-xs text-red-500">{errors[`name-${index}`]}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor={`email-${index}`}
                    className="text-sm font-medium text-[#3D2314]"
                  >
                    Friend {index + 1} Email
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="john@example.com"
                    value={referral.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className={`bg-white border-[#e5e5e5] focus:border-[#3D2314] focus:ring-[#3D2314]/20 ${
                      errors[`email-${index}`] ? 'border-red-300 focus:border-red-300' : ''
                    }`}
                  />
                  {errors[`email-${index}`] && (
                    <p className="text-xs text-red-500">{errors[`email-${index}`]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-lg bg-[#f5ede4] border border-[#3D2314]/10">
            <p className="text-sm text-[#3D2314]/80">
              <strong>From:</strong> {referrerName} ({referrerEmail})
            </p>
            <p className="text-xs text-[#3D2314]/60 mt-1">
              Your friends will receive a personalized invitation email from you.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handlePreview}
            disabled={isLoading}
            className="w-full h-12 bg-[#3D2314] hover:bg-[#2a180e] text-[#f5ede4] font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading Preview...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview Invitations
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <InvitationPreview
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          invitations={previewData.invitations}
          onSend={handleSend}
          isSending={isSending}
          onEdit={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  )
}
