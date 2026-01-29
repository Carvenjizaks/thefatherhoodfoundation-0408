'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, CheckCircle2, XCircle, TrendingUp, Award } from 'lucide-react'

interface ParticipationStatsProps {
  stats: {
    total_assignments: number
    confirmed_count: number
    unavailable_count: number
    pending_count: number
    completed_count: number
    no_show_count: number
    availability_rate: number
    completion_rate: number
    reliability_score: number
    star_rating: number
    last_updated: string
  } | null
}

export function ContactParticipationStats({ stats }: ParticipationStatsProps) {
  if (!stats || stats.total_assignments === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Participation History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No participation history yet</p>
        </CardContent>
      </Card>
    )
  }

  const starRating = Math.round(stats.star_rating)
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Participation History</CardTitle>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-5 w-5 ${
                  i < starRating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Assignments</p>
            <p className="text-2xl font-bold">{stats.total_assignments}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-green-600">{stats.confirmed_count}</p>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Unavailable</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-orange-600">{stats.unavailable_count}</p>
              <XCircle className="h-4 w-4 text-orange-600" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Completed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-blue-600">{stats.completed_count}</p>
              <Award className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Availability Rate</span>
              <span className="font-medium">{stats.availability_rate}%</span>
            </div>
            <Progress value={stats.availability_rate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              How often they confirm when assigned
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">{stats.completion_rate}%</span>
            </div>
            <Progress value={stats.completion_rate} className="h-2" />
            <p className="text-xs text-muted-foreground">
              How often they complete confirmed tasks
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reliability Score</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{stats.reliability_score}%</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <Progress value={stats.reliability_score} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Overall reliability based on confirmations and completions
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {stats.reliability_score >= 90 && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500">
              <Award className="h-3 w-3 mr-1" />
              Highly Reliable
            </Badge>
          )}
          
          {stats.availability_rate >= 80 && (
            <Badge variant="secondary">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Very Available
            </Badge>
          )}
          
          {stats.completion_rate >= 95 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
              <Star className="h-3 w-3 mr-1" />
              Excellent Attendance
            </Badge>
          )}
          
          {stats.no_show_count > 0 && (
            <Badge variant="destructive">
              {stats.no_show_count} No-Show{stats.no_show_count > 1 ? 's' : ''}
            </Badge>
          )}
          
          {stats.pending_count > 0 && (
            <Badge variant="outline">
              {stats.pending_count} Pending Response{stats.pending_count > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-right">
          Last updated: {new Date(stats.last_updated).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  )
}
