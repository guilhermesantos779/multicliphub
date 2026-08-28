'use client'
import { usePathname } from 'next/navigation'
import { AgencySidebar } from './AgencySidebar'
import { ViewAsBanner } from '@/components/admin/ViewAsBanner'
import { TermsGate } from '@/components/terms/TermsGate'

// Routes that get a dedicated full-screen shell instead of the usual
// sidebar + chrome — currently just the campaign-creation "editor".
const FULLSCREEN_ROUTES = ['/agencia/dashboard/campanhas/nova']

export function AgencyDashboardChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = FULLSCREEN_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-[#0B0F19]">
        <TermsGate />
        {children}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <AgencySidebar />
      <main className="ml-56 flex-1 min-w-0">
        <TermsGate />
        <ViewAsBanner />
        {children}
      </main>
    </div>
  )
}
