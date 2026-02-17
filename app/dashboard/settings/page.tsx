import { SettingsPage } from '@/components/settings/settings-page'

export default function SettingsRoute() {
  const mockOrgId = '00000000-0000-0000-0000-000000000000'
  const mockRole = 'admin'

  return (
    <SettingsPage organizationId={mockOrgId} role={mockRole} />
  )
}
