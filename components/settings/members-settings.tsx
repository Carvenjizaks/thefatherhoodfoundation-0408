'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, UserPlus, Shield, ShieldCheck, Crown, User } from 'lucide-react'
import { toast } from 'sonner'

interface MembersSettingsProps {
  organizationId: string
  role: string
}

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  avatar_url: string | null
  created_at: string
}

const roleConfig: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  admin: { label: 'Admin', icon: Crown, color: 'bg-primary text-primary-foreground' },
  manager: { label: 'Manager', icon: ShieldCheck, color: 'bg-secondary text-secondary-foreground' },
  leader: { label: 'Leader', icon: Shield, color: 'bg-chart-3 text-foreground' },
  user: { label: 'User', icon: User, color: 'bg-muted text-muted-foreground' },
}

export function MembersSettings({ organizationId, role }: MembersSettingsProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<Profile[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const isAdmin = role === 'admin' || role === 'manager'

  useEffect(() => {
    loadMembers()
  }, [organizationId])

  async function loadMembers() {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      setMembers(data || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load members'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function updateRole(memberId: string, newRole: string) {
    setUpdatingId(memberId)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', memberId)

      if (updateError) throw updateError
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      )
      toast.success('Role updated')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update role'
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-muted-foreground text-sm">Loading members...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage member roles and permissions for your organization.
              </CardDescription>
            </div>
            <Button size="sm" variant="outline" disabled>
              <UserPlus className="h-4 w-4 mr-1" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground text-sm">No team members found.</p>
              <p className="text-muted-foreground text-xs mt-1">
                Members will appear here once authentication is enabled.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const config = roleConfig[member.role] || roleConfig.user
                const RoleIcon = config.icon
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                        <span className="text-primary-foreground font-semibold text-sm">
                          {(member.full_name || member.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {member.full_name || 'Unnamed User'}
                          </h4>
                          <Badge className={`${config.color} text-xs gap-1`}>
                            <RoleIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined {formatDate(member.created_at)}
                        </p>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="ml-4 shrink-0">
                        <Select
                          value={member.role}
                          onValueChange={(val) => updateRole(member.id, val)}
                          disabled={updatingId === member.id}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/80">
        <CardHeader>
          <CardTitle className="text-sm">Role Permissions</CardTitle>
          <CardDescription>
            Overview of what each role can do in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(roleConfig).map(([key, config]) => {
              const RoleIcon = config.icon
              const permissions: Record<string, string> = {
                admin: 'Full access: manage organization, members, all data, and settings',
                manager: 'Manage contacts, groups, events, tasks, and view settings',
                leader: 'Manage assigned groups, contacts, events, and tasks',
                user: 'View contacts, groups, events, and update assigned tasks',
              }
              return (
                <div key={key} className="flex items-start gap-3 rounded-lg border border-border p-3 bg-muted/20">
                  <Badge className={`${config.color} gap-1 mt-0.5`}>
                    <RoleIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{permissions[key]}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
