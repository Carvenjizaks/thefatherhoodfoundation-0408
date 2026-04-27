'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Ambassador {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  referral_code: string
  registrations: number
  progress: number
}

export default function AmbassadorAdminPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [stats, setStats] = useState({
    totalAmbassadors: 0,
    totalRegistrations: 0,
    avgProgress: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAmbassadors()
  }, [])

  const fetchAmbassadors = async () => {
    try {
      const response = await fetch('/api/ambassadors/admin?event=MGM26')
      const data = await response.json()

      if (data.success) {
        setAmbassadors(data.leaderboard)
        setStats({
          totalAmbassadors: data.totalAmbassadors,
          totalRegistrations: data.totalRegistrations,
          avgProgress: data.totalAmbassadors > 0 
            ? Math.round(data.leaderboard.reduce((acc: number, a: Ambassador) => acc + a.progress, 0) / data.totalAmbassadors)
            : 0
        })
      }
    } catch (error) {
      toast.error('Failed to load ambassadors')
    } finally {
      setIsLoading(false)
    }
  }

  const sendBroadcastMessage = () => {
    const message = prompt('Enter message to send to all ambassadors:')
    if (message) {
      // In a real implementation, this would send to all ambassadors
      toast.success(`Broadcast message prepared: "${message}"`)
      toast.info('In production, this would send via WhatsApp/email to all ambassadors')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading ambassadors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Ambassador Program Admin</h1>
            <p className="text-slate-600">MyGreatMarriage Conference 2026</p>
          </div>
          <Button 
            onClick={sendBroadcastMessage}
            className="bg-gradient-to-r from-amber-500 to-orange-600"
          >
            Message All Ambassadors
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600">{stats.totalAmbassadors}</p>
                <p className="text-slate-600">Total Ambassadors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{stats.totalRegistrations}</p>
                <p className="text-slate-600">Total Registrations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.avgProgress}%</p>
                <p className="text-slate-600">Avg. Progress</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Ambassador Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            {ambassadors.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No ambassadors yet</p>
            ) : (
              <div className="space-y-3">
                {ambassadors.map((ambassador, index) => (
                  <div 
                    key={ambassador.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-amber-50 border-2 border-amber-200' :
                      index === 1 ? 'bg-slate-100' :
                      index === 2 ? 'bg-orange-50' :
                      'bg-white border'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-amber-500 text-white' :
                        index === 1 ? 'bg-slate-400 text-white' :
                        index === 2 ? 'bg-orange-400 text-white' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{ambassador.first_name} {ambassador.last_name}</p>
                        <p className="text-sm text-slate-500">{ambassador.email}</p>
                        <p className="text-xs text-slate-400">Code: {ambassador.referral_code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">{ambassador.registrations}</p>
                      <p className="text-sm text-slate-500">couples invited</p>
                      <p className="text-xs text-slate-400">{Math.round(ambassador.progress)}% of goal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="w-full">
                Export Ambassador List
              </Button>
              <Button variant="outline" className="w-full">
                View Registration Details
              </Button>
              <Button variant="outline" className="w-full">
                Send Weekly Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration Link */}
        <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
          <CardContent className="py-6">
            <h3 className="font-bold text-lg mb-2">Ambassador Registration Link</h3>
            <p className="text-sm mb-3">Share this link with potential ambassadors:</p>
            <div className="bg-white/20 p-3 rounded-lg font-mono text-sm break-all">
              https://thefatherhoodfoundation.org/ambassadors
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
