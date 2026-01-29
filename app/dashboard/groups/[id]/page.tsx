import { GroupDetailView } from '@/components/groups/group-detail-view'

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <GroupDetailView groupId={params.id} />
    </div>
  )
}
