import { SettingsPage } from '@/components/settings/settings-page'

export default function SettingsRoute() {
  const mockOrgId = 'dev-org-id'
  const mockRole = 'admin'

  return (
    <SettingsPage organizationId={mockOrgId} role={mockRole} />
  )
}
