import { TasksBoard } from '@/components/tasks/tasks-board'
import { TasksHeader } from '@/components/tasks/tasks-header'

export default function TasksPage() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
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
