import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { MobileNavProvider } from '@/components/dashboard/MobileNav'
import { ToastProvider } from '@/components/shared/Toast'
import { ProfileProvider } from '@/components/app/ProfileProvider'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'
import { OnboardingLayers } from '@/components/onboarding/OnboardingLayers'
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
        <OnboardingProvider>
          <MobileNavProvider>
            <div className="flex min-h-screen bg-[#0a0a0a]">
              <Sidebar />
              <main className="flex-1 min-w-0 md:ml-56">
                {children}
              </main>
            </div>
          </MobileNavProvider>
          <OnboardingLayers />
        </OnboardingProvider>
      </ToastProvider>
    </ProfileProvider>
  )
}
