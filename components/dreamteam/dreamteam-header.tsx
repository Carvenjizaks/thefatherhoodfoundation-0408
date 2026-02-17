'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, UserPlus } from 'lucide-react'

interface DreamTeamHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DreamTeamHeader({ activeTab, onTabChange }: DreamTeamHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">
            DreamTeam
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your volunteer team and sign-ups
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          <TabsTrigger value="volunteers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Volunteers</span>
          </TabsTrigger>
          <TabsTrigger value="signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Up</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
