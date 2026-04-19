'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { RefreshCw, Mail, Download, AlertCircle, Lock, LogOut } from 'lucide-react'

interface FeedbackSummary {
  totalResponses: number
  last7Days: number
  categoryCounts: Record<string, number>
  urgencyDistribution: Array<{ range: string; count: number; color: string }>
  topChallenges: Array<{ challenge: string; count: number }>
  recentSubmissions: Array<{
    id: string
    challenge: string
    urgency: number
    category: string
    comments: string
    submitted_at: string
  }>
}

const categoryColors: Record<string, string> = {
  marriage: '#800000',
  parenting: '#660000',
  spiritual: '#990000',
  career: '#550000',
  health: '#770000',
  community: '#440000'
}

const categoryLabels: Record<string, string> = {
  marriage: 'Marriage & Relationships',
  parenting: 'Parenting & Fatherhood',
  spiritual: 'Spiritual Growth',
  career: 'Career & Finances',
  health: 'Health & Wellness',
  community: 'Community & Support'
}

// Admin PIN - only you should know this
const ADMIN_PIN = 'FF2026!'

export default function AdminFeedbackPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [summary, setSummary] = useState<FeedbackSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_feedback_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    } else {
      setLoading(false)
    }
  }, [])

  const handlePinSubmit = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('admin_feedback_auth', 'true')
      setIsAuthenticated(true)
      setPinError('')
    } else {
      setPinError('Invalid PIN. Access denied.')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_feedback_auth')
    setIsAuthenticated(false)
    setPin('')
  }

  const fetchSummary = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/feedback/summary')
      if (response.ok) {
        const data = await response.json()
        setSummary(data)
      } else {
        setError('Failed to fetch feedback data')
      }
    } catch (err) {
      setError('Error loading feedback data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchSummary()
    }
  }, [isAuthenticated])

  const handleExport = () => {
    if (!summary) return
    
    const csvContent = [
      ['Challenge', 'Category', 'Urgency', 'Comments', 'Submitted At'].join(','),
      ...summary.recentSubmissions.map(s => [
        `"${s.challenge}"`,
        categoryLabels[s.category] || s.category,
        s.urgency,
        `"${s.comments || ''}"`,
        new Date(s.submitted_at).toLocaleString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleSendReport = async () => {
    try {
      await fetch('/api/feedback/send-report', { method: 'POST' })
      alert('Report sent to Carvenjizaks@gmail.com')
    } catch (error) {
      alert('Failed to send report')
    }
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-maroon-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter PIN to access feedback dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                className="text-center text-2xl tracking-widest"
                maxLength={10}
              />
              {pinError && (
                <p className="text-red-500 text-sm text-center">{pinError}</p>
              )}
              <Button 
                onClick={handlePinSubmit}
                className="w-full bg-maroon-900 hover:bg-maroon-800"
              >
                Access Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/')}
                className="w-full"
              >
                Return to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-maroon-900" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-center text-red-600">{error}</p>
            <Button onClick={fetchSummary} className="w-full mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categoryData = summary ? Object.entries(summary.categoryCounts).map(([key, value]) => ({
    name: categoryLabels[key] || key,
    value,
    color: categoryColors[key] || '#800000'
  })) : []

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Feedback Dashboard</h1>
            <p className="text-slate-500">Anonymous survey responses and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchSummary}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleSendReport} className="bg-maroon-900 hover:bg-maroon-800">
              <Mail className="w-4 h-4 mr-2" />
              Send Report
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="text-slate-500">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Responses</CardDescription>
              <CardTitle className="text-3xl">{summary?.totalResponses || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Last 7 Days</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{summary?.last7Days || 0}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Critical Issues (8-10)</CardDescription>
              <CardTitle className="text-3xl text-red-600">
                {summary?.urgencyDistribution?.find(u => u.range.includes('Critical'))?.count || 0}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Top Category</CardDescription>
              <CardTitle className="text-lg">
                {categoryData.length > 0 
                  ? categoryData.sort((a, b) => b.value - a.value)[0].name 
                  : 'No data'}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Urgency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Urgency Distribution</CardTitle>
              <CardDescription>How urgent are the challenges?</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={summary?.urgencyDistribution || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, count }) => `${range}: ${count}`}
                    outerRadius={80}
                    fill="#800000"
                    dataKey="count"
                  >
                    {summary?.urgencyDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Challenge categories breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#800000" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Challenges</CardTitle>
            <CardDescription>Most frequently reported challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary?.topChallenges?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">{item.challenge}</span>
                  <span className="bg-maroon-900 text-white px-3 py-1 rounded-full text-sm">
                    {item.count} responses
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest anonymous feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {summary?.recentSubmissions?.map((submission) => (
                <div key={submission.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-800">{submission.challenge}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      submission.urgency >= 8 ? 'bg-red-100 text-red-800' :
                      submission.urgency >= 6 ? 'bg-orange-100 text-orange-800' :
                      submission.urgency >= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Urgency: {submission.urgency}/10
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">
                    Category: {categoryLabels[submission.category] || submission.category}
                  </p>
                  {submission.comments && (
                    <p className="text-sm text-slate-600 italic">"{submission.comments}"</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}