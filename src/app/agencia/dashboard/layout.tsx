import { ToastProvider } from '@/components/shared/Toast'
import { ProfileProvider } from '@/components/app/ProfileProvider'
import { AgencyDashboardChrome } from '@/components/campaigns/agencia/AgencyDashboardChrome'

export default function AgencyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <ToastProvider>
        <AgencyDashboardChrome>{children}</AgencyDashboardChrome>
      </ToastProvider>
    </ProfileProvider>
  )
}
