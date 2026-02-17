'use client'

import { GroupsMainView } from '@/components/groups/groups-main-view'

export default function GroupsPage() {
  console.log('[v0] Groups page loaded')
  
  return (
    <div className="min-h-screen">
      <GroupsMainView />
    </div>
  )
}
