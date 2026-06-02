import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { ToastProvider } from '@/components/shared/Toast'
import { ProfileProvider } from '@/components/app/ProfileProvider'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Safety net for legacy accounts created before nicknames were enforced.
  // The handle_new_user() trigger now always sets one, but if a profile
  // somehow lacks a username, force the user to pick one before continuing.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    if (profile && (!profile.username || profile.username.trim() === '')) {
      redirect('/perfil/editar?setup=1')
    }
  }

  return (
    <ProfileProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-[#0a0a0a]">
          <Sidebar />
          <main className="ml-56 flex-1 min-w-0">
            {children}
          </main>
        </div>
      </ToastProvider>
    </ProfileProvider>
  )
}
