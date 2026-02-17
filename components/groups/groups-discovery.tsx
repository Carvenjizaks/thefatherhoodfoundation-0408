'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import { Search, MapPin, Calendar, Users, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function GroupsDiscovery() {
  const supabase = createClient()
  const [groups, setGroups] = useState<any[]>([])
  const [groupTypes, setGroupTypes] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [campuses, setCampuses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [selectedTag, setSelectedTag] = useState('all')
  const [onlyOpen, setOnlyOpen] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch groups with related data
    const { data: groupsData } = await supabase
      .from('groups')
      .select(`
        *,
        group_types (name, icon),
        campuses (name, city),
        group_tag_mappings (
          group_tags (name, color)
        ),
        group_members (id),
        group_statistics (total_members, total_meetings, avg_attendance)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    // Fetch filter options
    const { data: typesData } = await supabase
      .from('group_types')
      .select('*')
      .eq('is_active', true)

    const { data: tagsData } = await supabase
      .from('group_tags')
      .select('*')
      .eq('is_active', true)

    const { data: campusesData } = await supabase
      .from('campuses')
      .select('*')
      .eq('is_active', true)

    if (groupsData) setGroups(groupsData)
    if (typesData) setGroupTypes(typesData)
    if (tagsData) setTags(tagsData)
    if (campusesData) setCampuses(campusesData)
    
    setLoading(false)
  }

  const filteredGroups = groups.filter(group => {
    if (onlyOpen && !group.is_open) return false
    if (searchQuery && !group.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !group.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (selectedType !== 'all' && group.group_type_id !== selectedType) return false
    if (selectedStage !== 'all' && group.stage_of_life !== selectedStage) return false
    if (selectedDay !== 'all' && group.meeting_day !== selectedDay) return false
    if (selectedCampus !== 'all' && group.campus_id !== selectedCampus) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Discover Groups</h1>
        <p className="text-muted-foreground mt-1">
          Find a community that fits your stage of life and interests
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onlyOpen"
                checked={onlyOpen}
                onChange={(e) => setOnlyOpen(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="onlyOpen" className="text-sm">Open groups only</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Group Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {groupTypes.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Stage of Life" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="kids">Kids</SelectItem>
                <SelectItem value="teens">Teens</SelectItem>
                <SelectItem value="young_adults">Young Adults</SelectItem>
                <SelectItem value="adults">Adults</SelectItem>
                <SelectItem value="seniors">Seniors</SelectItem>
                <SelectItem value="all">All Ages</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Meeting Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Day</SelectItem>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCampus} onValueChange={setSelectedCampus}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {campuses.map(campus => (
                  <SelectItem key={campus.id} value={campus.id}>
                    {campus.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredGroups.length} of {groups.length} groups
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map(group => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              {group.image_url && (
                <img
                  src={group.image_url || "/placeholder.svg"}
                  alt={group.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    {group.is_open && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Open
                      </Badge>
                    )}
                  </div>
                  {group.group_types && (
                    <p className="text-sm text-muted-foreground">
                      {group.group_types.icon} {group.group_types.name}
                    </p>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {group.description}
                </p>

                <div className="space-y-2 text-sm">
                  {group.meeting_day && group.meeting_time && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{group.meeting_day}s at {group.meeting_time}</span>
                    </div>
                  )}
                  {group.campuses && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{group.campuses.name}</span>
                    </div>
                  )}
                  {group.group_members && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{group.group_members.length} members</span>
                    </div>
                  )}
                </div>

                {group.group_tag_mappings?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {group.group_tag_mappings.map((mapping: any, idx: number) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        style={{ borderColor: mapping.group_tags.color, color: mapping.group_tags.color }}
                      >
                        {mapping.group_tags.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <Link href={`/dashboard/groups/${group.id}`}>
                  <Button className="w-full">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGroups.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              No groups found matching your criteria. Try adjusting your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
