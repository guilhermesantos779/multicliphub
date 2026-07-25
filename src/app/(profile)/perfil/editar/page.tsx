import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileEditor } from '@/components/profile/ProfileEditor'

export const metadata = {
  title: 'Editar perfil — MultiClip Hub',
}

export default async function ProfileEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>
}) {
  const { setup } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/perfil/editar')
  }

  const [profileRes, linksRes, achRes, userAchRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('profile_links')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true }),
    supabase.from('achievements').select('*'),
    supabase
      .from('user_achievements')
      .select('achievement_slug')
      .eq('user_id', user.id),
  ])

  if (!profileRes.data) {
    redirect('/dashboard')
  }

  return (
    <ProfileEditor
      initialProfile={profileRes.data}
      initialLinks={linksRes.data ?? []}
      achievements={achRes.data ?? []}
      unlockedSlugs={(userAchRes.data ?? []).map((u) => u.achievement_slug)}
      setupMode={setup === '1'}
    />
  )
}
