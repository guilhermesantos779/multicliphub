import { Sidebar } from '@/components/dashboard/Sidebar'
import { ToastProvider } from '@/components/shared/Toast'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-56 flex-1 min-w-0">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
