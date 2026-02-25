'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Share2, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface DreamTeamHeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DreamTeamHeader({ activeTab, onTabChange }: DreamTeamHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleShareLink = async () => {
    const url = `${window.location.origin}/join/dreamteam`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Signup link copied to clipboard', {
        description: url,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for environments where clipboard API is not available
      toast.info('Share this link with volunteers:', {
        description: url,
        duration: 8000,
      })
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">
            DreamTeam
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your DT-Members team and sign-ups
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareLink}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="hidden sm:inline">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share Form</span>
            </>
          )}
        </Button>
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="volunteers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">DT-Members</span>
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}
