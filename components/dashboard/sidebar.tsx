'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Users,
  UsersRound,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface SidebarProps {
  profile: any
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contacts', href: '/dashboard/contacts', icon: Users },
  { name: 'Groups', href: '/dashboard/groups', icon: UsersRound },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Preaching', href: '/dashboard/preaching-schedule', icon: BookOpen },
  { name: 'DreamTeam', href: '/dashboard/dreamteam', icon: Heart },
  { name: 'Tasks & Projects', href: '/dashboard/tasks', icon: CheckSquare },
]

const adminNavigation = [
  { name: 'Organization', href: '/dashboard/organization', icon: Building2 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const isAdmin = profile?.role === 'admin' || profile?.role === 'manager'

  return (
    <div
      className={cn(
        'relative flex flex-col border-r border-border bg-card/50 backdrop-blur-sm transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/images/logo.png"
                alt="PHFF Logo"
                width={40}
                height={40}
                className="object-contain opacity-85"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold bg-gradient-to-r from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] bg-clip-text text-transparent">Powerhouse</span>
              {profile?.organization && (
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {profile.organization.name}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="relative h-9 w-9 mx-auto">
            <Image
              src="/images/logo.png"
              alt="PHFF Logo"
              width={36}
              height={36}
              className="object-contain opacity-85"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn('h-8 w-8', collapsed && 'mx-auto')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {isAdmin && (
          <>
            <div className={cn('my-4 border-t border-border', collapsed && 'mx-2')} />
            <nav className="space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      collapsed && 'justify-center'
                    )}
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </>
        )}
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(225,73%,40%)] to-[hsl(150,40%,60%)] flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
