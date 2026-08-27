import { AgencySidebar } from '@/components/campaigns/agencia/AgencySidebar'
import { ToastProvider } from '@/components/shared/Toast'
import { ProfileProvider } from '@/components/app/ProfileProvider'
import { ViewAsBanner } from '@/components/admin/ViewAsBanner'

export default function AgencyDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-[#0B0F19]">
          <AgencySidebar />
          <main className="ml-56 flex-1 min-w-0">
            <ViewAsBanner />
            {children}
          </main>
        </div>
      </ToastProvider>
    </ProfileProvider>
  )
}
