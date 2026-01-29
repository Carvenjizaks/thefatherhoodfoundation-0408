import { TasksBoard } from '@/components/tasks/tasks-board'
import { TasksHeader } from '@/components/tasks/tasks-header'

export default function TasksPage() {
  // Auth disabled for development - using mock data
  console.log('[v0] Tasks page loaded without authentication')
  
  const mockOrgId = 'dev-org-id'
  const mockRole = 'admin'

  return (
    <div className="space-y-6">
      <TasksHeader 
        organizationId={mockOrgId} 
        role={mockRole}
      />
      <TasksBoard 
        tasks={[]} 
        projects={[]}
        role={mockRole}
      />
    </div>
  )
}
