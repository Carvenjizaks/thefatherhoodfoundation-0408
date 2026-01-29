'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Mail, UserPlus, CheckCircle, Calendar, BarChart3, MessageSquare } from 'lucide-react'
import { InviteMemberDialog } from './invite-member-dialog'
import { JoinRequestsDialog } from './join-requests-dialog'
import { GroupMessagingDialog } from './group-messaging-dialog'
import { AttendanceTrackerDialog } from './attendance-tracker-dialog'

interface GroupDetailViewProps {
  groupId: string
}

export function GroupDetailView({ groupId }: GroupDetailViewProps) {
  const supabase = createClient()
  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const [showInvite, setShowInvite] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [showMessaging, setShowMessaging] = useState(false)
  const [showAttendance, setShowAttendance] = useState(false)

  useEffect(() => {
    fetchGroupData()
  }, [groupId])

  const fetchGroupData = async () => {
    setLoading(true)
    
    // Fetch group details with leader profile
    const { data: groupData } = await supabase
      .from('groups')
      .select(`
        *,
        leader:leader_id(id, full_name, email, avatar_url),
        stats:group_stats(*)
      `)
      .eq('id', groupId)
      .single()

    if (groupData) {
      setGroup(groupData)
      if (groupData.stats && groupData.stats.length > 0) {
        setStats(groupData.stats[0])
      }
    }

    // Fetch members
    const { data: membersData } = await supabase
      .from('group_members')
      .select(`
        *,
        contact:contact_id(id, first_name, last_name, email, phone, avatar_url)
      `)
      .eq('group_id', groupId)
      .eq('status', 'active')

    if (membersData) {
      setMembers(membersData)
    }

    // Fetch pending join requests
    const { data: requestsData } = await supabase
      .from('group_join_requests')
      .select(`
        *,
        contact:contact_id(id, first_name, last_name, email)
      `)
      .eq('group_id', groupId)
      .eq('status', 'pending')

    if (requestsData) {
      setPendingRequests(requestsData)
    }

    setLoading(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!group) {
    return <div>Group not found</div>
  }

  const leaderInitials = group.leader?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'L'

  return (
    <div className="space-y-6">
      {/* Group Header with Leader Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={group.leader?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {leaderInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{group.name}</CardTitle>
                <CardDescription className="mt-1">
                  Led by <span className="font-semibold">{group.leader?.full_name || 'Unknown'}</span>
                </CardDescription>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-2">{group.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline">{group.group_type}</Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {members.length} members
                  </Badge>
                  {pendingRequests.length > 0 && (
                    <Badge variant="secondary">
                      {pendingRequests.length} pending requests
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInvite(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              {pendingRequests.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRequests(true)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Requests ({pendingRequests.length})
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowMessaging(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAttendance(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.contact?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.contact?.first_name?.[0]}{member.contact?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {member.contact?.first_name} {member.contact?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {member.contact?.email}
                      </p>
                      {member.role && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {member.role}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {stats ? (
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_members || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_meetings || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.average_attendance ? `${Math.round(stats.average_attendance)}%` : 'N/A'}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.active_member_percentage ? `${Math.round(stats.active_member_percentage)}%` : 'N/A'}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No statistics available yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        open={showInvite}
        onOpenChange={setShowInvite}
        groupId={groupId}
        groupName={group.name}
        onSuccess={fetchGroupData}
      />

      <JoinRequestsDialog
        open={showRequests}
        onOpenChange={setShowRequests}
        groupId={groupId}
        groupName={group.name}
        requests={pendingRequests}
        onSuccess={fetchGroupData}
      />

      <GroupMessagingDialog
        open={showMessaging}
        onOpenChange={setShowMessaging}
        groupId={groupId}
        groupName={group.name}
        members={members}
      />

      <AttendanceTrackerDialog
        open={showAttendance}
        onOpenChange={setShowAttendance}
        groupId={groupId}
        groupName={group.name}
        members={members}
        onSuccess={fetchGroupData}
      />
    </div>
  )
}
