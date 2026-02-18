'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Bell } from 'lucide-react'

interface HeaderProps {
  profile?: any
}

export function DashboardHeader({ profile }: HeaderProps) {
  const router = useRouter()
  
  // Auth disabled for development
  const mockProfile = profile || {
    full_name: 'Development User',
    email: 'dev@powerhouse.local',
    role: 'admin'
  }

  const handleSignOut = () => {
    // Sign out logic here
    router.push('/auth/login')
  }

  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">
          Powerhouse Community <span className="text-xs font-medium text-muted-foreground ml-1">#WeCare</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {mockProfile.full_name?.charAt(0) || 'D'}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{mockProfile.full_name}</p>
                <p className="text-xs text-muted-foreground">{mockProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground" disabled>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out (Disabled)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
