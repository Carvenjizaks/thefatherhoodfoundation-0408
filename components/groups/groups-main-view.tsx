'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Search, Filter, MapPin, Calendar, Clock, Users, 
  Plus, Heart, MessageCircle, Share2, TrendingUp 
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'

interface Group {
  id: string
  name: string
  description: string
  type: string
  meeting_day: string
  meeting_time: string
  location: string
  is_open: boolean
  current_members: number
  max_members: number
  image_url?: string
  leader_name?: string
  tags?: string[]
  campus?: string
}

export function GroupsMainView() {
  const supabase = createClient()
  const [groups, setGroups] = useState<Group[]>([])
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [view, setView] = useState<'discover' | 'my-groups'>('discover')

  useEffect(() => {
    fetchGroups()
  }, [])

  useEffect(() => {
    filterGroups()
  }, [searchQuery, selectedType, selectedDay, selectedCampus, groups])

  const fetchGroups = async () => {
    console.log('[v0] Fetching groups...')
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('[v0] Error fetching groups:', error)
    } else {
      const mockGroups: Group[] = data?.map(g => ({
        ...g,
        current_members: Math.floor(Math.random() * 20) + 5,
        max_members: 25,
        is_open: true,
        image_url: `/placeholder-group-${Math.floor(Math.random() * 3) + 1}.jpg`,
        leader_name: 'John Smith',
        tags: ['Family Friendly', 'Newcomers Welcome'],
        campus: 'Main Campus'
      })) || []
      
      setGroups(mockGroups)
      setFilteredGroups(mockGroups)
    }
    setLoading(false)
  }

  const filterGroups = () => {
    let filtered = [...groups]

    if (searchQuery) {
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(g => g.type === selectedType)
    }

    if (selectedDay !== 'all') {
      filtered = filtered.filter(g => g.meeting_day?.toLowerCase() === selectedDay)
    }

    if (selectedCampus !== 'all') {
      filtered = filtered.filter(g => g.campus === selectedCampus)
    }

    setFilteredGroups(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover Groups
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your community and grow together
          </p>
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-sm text-muted-foreground">Active Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">325</p>
                <p className="text-sm text-muted-foreground">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Open to Join</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={view} onValueChange={(v: any) => setView(v)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Group Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cell">LifeGroup</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="bible_study">Bible Study</SelectItem>
                <SelectItem value="prayer">Prayer Group</SelectItem>
                <SelectItem value="youth">Youth Group</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Meeting Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Day</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="saturday">Saturday</SelectItem>
                <SelectItem value="sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Campus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campuses</SelectItem>
                <SelectItem value="Main Campus">Main Campus</SelectItem>
                <SelectItem value="North Campus">North Campus</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredGroups.length} of {groups.length} groups
            </p>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Groups Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery('')
                  setSelectedType('all')
                  setSelectedDay('all')
                  setSelectedCampus('all')
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="overflow-hidden group hover:shadow-lg transition-all border-border/50 bg-card/50 backdrop-blur">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {group.is_open && (
                      <Badge className="absolute top-3 right-3 z-20 bg-secondary">
                        Open
                      </Badge>
                    )}
                    <div className="absolute bottom-3 left-3 z-20">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {group.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <Link href={`/dashboard/groups/${group.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
                        {group.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {group.description || 'Join us for fellowship and growth'}
                    </p>

                    <div className="space-y-2 mb-4">
                      {group.meeting_day && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="capitalize">{group.meeting_day}s at {group.meeting_time || '7:00 PM'}</span>
                        </div>
                      )}
                      {group.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-secondary" />
                          <span className="line-clamp-1">{group.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        <span>{group.current_members} / {group.max_members} members</span>
                      </div>
                    </div>

                    {group.tags && group.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        Join Group
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-groups" className="space-y-6">
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">You haven't joined any groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Explore the Discover tab to find groups that match your interests
              </p>
              <Button onClick={() => setView('discover')}>
                Discover Groups
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
