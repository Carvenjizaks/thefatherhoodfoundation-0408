'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { RefreshCw, Mail, Download, AlertCircle } from 'lucide-react'

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
  marriage: '#f43f5e',
  parenting: '#3b82f6',
  spiritual: '#a855f7',
  career: '#22c55e',
  health: '#f97316',
  community: '#14b8a6'
}

const categoryLabels: Record<string, string> = {
  marriage: 'Marriage & Relationships',
  parenting: 'Parenting & Fatherhood',
  spiritual: 'Spiritual Growth',
  career: 'Career & Finances',
  health: 'Health & Wellness',
  community: 'Community & Support'
}

export default function AdminFeedbackPage() {
  const [summary, setSummary] = useState<FeedbackSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
    fetchSummary()
  }, [])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#800000]" />
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
    color: categoryColors[key] || '#8884d8'
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
            <Button onClick={handleSendReport} className="bg-[#800000] hover:bg-[#660000]">
              <Mail className="w-4 h-4 mr-2" />
              Send Report
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
                    fill="#8884d8"
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
                  <span className="bg-[#800000] text-white px-3 py-1 rounded-full text-sm">
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