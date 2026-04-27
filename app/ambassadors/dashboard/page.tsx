'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface Ambassador {
  name: string
  email: string
  phone: string
  referralCode: string
  eventName: string
  targetCouples: number
}

interface Stats {
  totalInvited: number
  targetCouples: number
  remaining: number
  progress: number
}

interface Registration {
  id: string
  couple_name: string
  email: string
  phone: string
  created_at: string
}

export default function AmbassadorDashboardPage() {
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [inviteLink, setInviteLink] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (code) {
      fetchDashboardData(code)
    } else {
      setIsLoading(false)
    }
  }, [code])

  const fetchDashboardData = async (referralCode: string) => {
    try {
      const response = await fetch(`/api/ambassadors/dashboard?code=${referralCode}`)
      const data = await response.json()

      if (data.success) {
        setAmbassador(data.ambassador)
        setStats(data.stats)
        setRegistrations(data.registrations)
        setInviteLink(data.inviteLink)
      } else {
        toast.error(data.error || 'Failed to load dashboard')
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    toast.success('Invite link copied!')
  }

  const shareOnWhatsApp = () => {
    const message = `Hey! I'd love to invite you and your spouse to the MyGreatMarriage Conference (May 7-9 in Windhoek). It's going to be transformational for marriages. Here's the link to register: ${inviteLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!code) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Access Your Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-slate-600">
              Enter your referral code to access your ambassador dashboard
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const enteredCode = formData.get('code') as string
                if (enteredCode) {
                  window.location.href = `/ambassadors/dashboard?code=${enteredCode.toUpperCase()}`
                }
              }}
              className="space-y-4"
            >
              <input
                name="code"
                type="text"
                placeholder="Enter your code (e.g., AMB123ABC)"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-amber-500 to-orange-600">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ambassador) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Ambassador Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-600">
              We couldn't find an ambassador with that code. Please check and try again.
            </p>
            <Button 
              className="w-full mt-4" 
              variant="outline"
              onClick={() => window.location.href = '/ambassadors'}
            >
              Register as Ambassador
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {ambassador.name.split(' ')[0]}! 🎯</h1>
          <p className="text-white/80">{ambassador.eventName} Ambassador</p>
        </div>

        {/* Stats Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between text-sm text-slate-600">
              <span>{stats?.totalInvited} couples invited</span>
              <span>Goal: {stats?.targetCouples} couples</span>
            </div>
            <Progress value={stats?.progress || 0} className="h-3" />
            <div className="text-center">
              <span className="text-3xl font-bold text-amber-600">{stats?.progress}%</span>
              <p className="text-sm text-slate-500">of your goal reached</p>
            </div>
            {stats && stats.remaining > 0 && (
              <p className="text-center text-slate-600">
                You need <strong>{stats.remaining}</strong> more {stats.remaining === 1 ? 'couple' : 'couples'} to reach your goal!
              </p>
            )}
            {stats && stats.remaining === 0 && (
              <p className="text-center text-green-600 font-semibold">
                🎉 Congratulations! You've reached your goal!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Invite Link Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Your Unique Invite Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-lg break-all text-sm font-mono">
              {inviteLink}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={copyInviteLink}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600"
              >
                Copy Link
              </Button>
              <Button 
                onClick={shareOnWhatsApp}
                variant="outline"
                className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
              >
                Share on WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invited Couples */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Couples You've Invited</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p className="mb-2">No registrations yet</p>
                <p className="text-sm">Share your invite link to start inviting couples!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">{reg.couple_name}</p>
                      <p className="text-sm text-slate-500">{reg.email}</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Registered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <CardContent className="py-6">
            <h3 className="font-bold text-lg mb-3">💡 Tips for Inviting Couples</h3>
            <ul className="space-y-2 text-sm">
              <li>• Start with couples you know personally</li>
              <li>• Share why YOU'RE excited about the conference</li>
              <li>• Follow up within 48 hours if they don't register</li>
              <li>• Offer to answer any questions they have</li>
              <li>• Remind them: Early bird pricing ends soon!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
