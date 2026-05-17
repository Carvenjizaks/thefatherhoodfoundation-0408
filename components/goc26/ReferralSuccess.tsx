'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CheckCircle2, UserPlus, Home, Mail, Users } from 'lucide-react'

interface Referral {
  name: string
  email: string
}

interface ReferralSuccessProps {
  referrals: Referral[]
  onInviteMore: () => void
  onDone: () => void
}

export function ReferralSuccess({ referrals, onInviteMore, onDone }: ReferralSuccessProps) {
  const [showCheckmark, setShowCheckmark] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Staggered animation
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 100)
    const contentTimer = setTimeout(() => setShowContent(true), 400)
    return () => {
      clearTimeout(checkmarkTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="border-[#e5e5e5] shadow-lg overflow-hidden">
        {/* Success Header */}
        <CardHeader className="bg-[#3D2314] text-[#f5ede4] text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div
              className={`relative transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-[#f5ede4]/20 rounded-full animate-ping" />
              <div className="relative bg-[#f5ede4] rounded-full p-4">
                <CheckCircle2 className="w-12 h-12 text-[#3D2314]" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <CardTitle
            className={`text-2xl font-bold text-[#f5ede4] transition-all duration-500 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Invitations Sent!
          </CardTitle>
          <CardDescription
            className={`text-[#f5ede4]/80 text-base mt-2 transition-all duration-500 delay-100 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            Your friends will receive their invitations shortly
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Recipients List */}
          <div
            className={`transition-all duration-500 delay-200 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-[#3D2314]" />
              <h3 className="font-semibold text-[#3D2314]">Invited Champions</h3>
              <span className="ml-auto text-sm text-[#737373]">
                {referrals.length} sent
              </span>
            </div>

            <div className="space-y-2">
              {referrals.map((referral, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[#f5ede4]/50 border border-[#e5e5e5]"
                  style={{
                    transitionDelay: `${300 + index * 100}ms`,
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#3D2314] flex items-center justify-center shrink-0">
                    <span className="text-[#f5ede4] font-medium text-sm">
                      {referral.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1a1a1a] truncate">{referral.name}</p>
                    <p className="text-sm text-[#737373] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{referral.email}</span>
                    </p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* What's Next */}
          <div
            className={`p-4 rounded-lg bg-[#f5ede4] border border-[#3D2314]/10 transition-all duration-500 delay-500 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <h4 className="font-medium text-[#3D2314] mb-2">What happens next?</h4>
            <ul className="text-sm text-[#3D2314]/80 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-[#3D2314] mt-0.5">•</span>
                Your friends will receive a personalized email invitation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3D2314] mt-0.5">•</span>
                They can register directly through the link in the email
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#3D2314] mt-0.5">•</span>
                You&apos;ll be notified when they register
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 pt-2 transition-all duration-500 delay-600 ${
              showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <Button
              variant="outline"
              onClick={onInviteMore}
              className="flex-1 border-[#3D2314] text-[#3D2314] hover:bg-[#f5ede4] h-11"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite More Friends
            </Button>
            <Button
              onClick={onDone}
              className="flex-1 bg-[#3D2314] hover:bg-[#2a180e] text-[#f5ede4] h-11"
            >
              <Home className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
