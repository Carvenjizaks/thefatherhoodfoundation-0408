'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Loader2,
  UserCheck,
  UserX,
  Filter,
  Download,
} from 'lucide-react'

interface Volunteer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  service_area: string
  service_area_label: string
  skills: string | null
  availability: string | null
  notes: string | null
  status: string
  welcome_email_sent: boolean
  created_at: string
}

const SERVICE_AREA_COLORS: Record<string, string> = {
  ushering_hospitality: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  media_sound: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  worship_team: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  childrens_church: 'bg-green-500/10 text-green-700 dark:text-green-400',
  youth_ministry: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
}

export function DreamTeamVolunteersList({ organizationId }: { organizationId: string }) {
  const supabase = createClient()
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterArea, setFilterArea] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchVolunteers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId])

  const fetchVolunteers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('dreamteam_volunteers')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVolunteers(data || [])
    } catch (err) {
      console.error('Error fetching volunteers:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      const { error } = await supabase
        .from('dreamteam_volunteers')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v))
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Service Area', 'Skills', 'Availability', 'Status', 'Date Joined']
    const rows = filteredVolunteers.map(v => [
      `${v.first_name} ${v.last_name}`,
      v.email,
      v.phone,
      v.service_area_label,
      v.skills || '',
      v.availability || '',
      v.status,
      new Date(v.created_at).toLocaleDateString(),
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dreamteam-volunteers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredVolunteers = volunteers.filter(v => {
    const matchSearch =
      `${v.first_name} ${v.last_name} ${v.email} ${v.phone}`.toLowerCase().includes(searchQuery.toLowerCase())
    const matchArea = filterArea === 'all' || v.service_area === filterArea
    const matchStatus = filterStatus === 'all' || v.status === filterStatus
    return matchSearch && matchArea && matchStatus
  })

  const stats = {
    total: volunteers.length,
    active: volunteers.filter(v => v.status === 'active').length,
    areas: new Set(volunteers.map(v => v.service_area)).size,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(225,73%,40%)]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[hsl(225,73%,40%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Volunteers</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[hsl(150,40%,55%)]/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-[hsl(150,40%,55%)]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Filter className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.areas}</p>
              <p className="text-xs text-muted-foreground">Service Areas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search volunteers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Areas</SelectItem>
                <SelectItem value="ushering_hospitality">Ushering & Hospitality</SelectItem>
                <SelectItem value="media_sound">Media & Sound</SelectItem>
                <SelectItem value="worship_team">Worship Team</SelectItem>
                <SelectItem value="childrens_church">{"Children's Church"}</SelectItem>
                <SelectItem value="youth_ministry">Youth Ministry</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Volunteers List */}
      {filteredVolunteers.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold mb-1">No volunteers found</h3>
            <p className="text-muted-foreground text-sm">
              {volunteers.length === 0
                ? 'No one has signed up yet. Share the DreamTeam page to get started.'
                : 'Try adjusting your search or filters.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredVolunteers.map((volunteer) => (
            <Card key={volunteer.id} className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {volunteer.first_name[0]}{volunteer.last_name[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {volunteer.first_name} {volunteer.last_name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          {volunteer.email}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          {volunteer.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service Area Badge */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className={SERVICE_AREA_COLORS[volunteer.service_area] || 'bg-muted text-muted-foreground'}
                    >
                      {volunteer.service_area_label}
                    </Badge>
                    <Badge variant={volunteer.status === 'active' ? 'default' : 'outline'} className={
                      volunteer.status === 'active'
                        ? 'bg-[hsl(150,40%,55%)]/10 text-[hsl(150,40%,40%)] dark:text-[hsl(150,40%,70%)] hover:bg-[hsl(150,40%,55%)]/20'
                        : ''
                    }>
                      {volunteer.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(volunteer.created_at).toLocaleDateString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(volunteer.id, volunteer.status)}
                      title={volunteer.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {volunteer.status === 'active' ? (
                        <UserX className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-[hsl(150,40%,55%)]" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expandable details */}
                {(volunteer.skills || volunteer.availability || volunteer.notes) && (
                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                    {volunteer.skills && (
                      <span><span className="font-medium text-foreground">Skills:</span> {volunteer.skills}</span>
                    )}
                    {volunteer.availability && (
                      <span><span className="font-medium text-foreground">Availability:</span> {volunteer.availability}</span>
                    )}
                    {volunteer.notes && (
                      <span><span className="font-medium text-foreground">Notes:</span> {volunteer.notes}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
