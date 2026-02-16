'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2,
  MapPin,
  Users,
  Bell,
  Palette,
} from 'lucide-react'
import { GeneralSettings } from './general-settings'
import { CampusSettings } from './campus-settings'
import { MembersSettings } from './members-settings'
import { NotificationsSettings } from './notifications-settings'
import { AppearanceSettings } from './appearance-settings'

interface SettingsPageProps {
  organizationId: string
  role: string
}

const tabs = [
  { id: 'general', label: 'General', icon: Building2, description: 'Organization name, slug & logo' },
  { id: 'campuses', label: 'Campuses', icon: MapPin, description: 'Manage campus locations' },
  { id: 'members', label: 'Members & Roles', icon: Users, description: 'Manage team roles' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & SMS preferences' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme & accent color' },
] as const

type TabId = (typeof tabs)[number]['id']

export function SettingsPage({ organizationId, role }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('general')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">
          Manage your workspace configuration and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <nav className="lg:w-64 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                <div className="hidden lg:block">
                  <div>{tab.label}</div>
                  <div className={cn(
                    'text-xs font-normal',
                    activeTab === tab.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {tab.description}
                  </div>
                </div>
                <span className="lg:hidden">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content Pane */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <GeneralSettings organizationId={organizationId} />
          )}
          {activeTab === 'campuses' && (
            <CampusSettings organizationId={organizationId} />
          )}
          {activeTab === 'members' && (
            <MembersSettings organizationId={organizationId} role={role} />
          )}
          {activeTab === 'notifications' && (
            <NotificationsSettings organizationId={organizationId} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceSettings organizationId={organizationId} />
          )}
        </div>
      </div>
    </div>
  )
}
