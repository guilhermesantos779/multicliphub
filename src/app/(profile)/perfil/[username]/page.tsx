import { redirect, notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileLinks } from '@/components/profile/ProfileLinks'
import { AchievementGrid } from '@/components/profile/AchievementGrid'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('public_profiles')
    .select('username, full_name, avatar_url, bio')
    .eq('username', username)
    .single()

  if (!profile) {
    return { title: 'Perfil não encontrado — MultiClip Hub' }
  }

  const name = profile.full_name || `@${profile.username}`
  return {
    title: `${name} (@${profile.username}) — MultiClip Hub`,
    description: profile.bio || `Confira o perfil de ${name} no MultiClip Hub.`,
    openGraph: {
      title: `${name} — MultiClip Hub`,
      description: profile.bio || `Perfil de ${name} no MultiClip Hub.`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : undefined,
    },
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Viewing a profile requires login
  if (!user) {
    redirect(`/login?redirect=/perfil/${username}`)
  }

  const { data: profile } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile || !profile.id) {
    notFound()
  }

  const isOwnProfile = user.id === profile.id

  // When the owner views their own profile, grant any newly-earned achievements
  if (isOwnProfile) {
    await supabase.rpc('sync_my_achievements')
  }

  const [linksRes, userAchRes, allAchRes] = await Promise.all([
    supabase
      .from('profile_links')
      .select('*')
      .eq('user_id', profile.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('user_achievements')
      .select('achievement_slug, unlocked_at')
      .eq('user_id', profile.id),
    supabase.from('achievements').select('*'),
  ])

  const links = linksRes.data ?? []
  const achievements = allAchRes.data ?? []
  const unlockedMap: Record<string, string> = {}
  for (const ua of userAchRes.data ?? []) {
    unlockedMap[ua.achievement_slug] = ua.unlocked_at ?? ''
  }

  return (
    <div className="pb-20">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

      <div className="mx-auto mt-8 grid max-w-4xl gap-8 px-4">
        <ProfileLinks links={links} isOwnProfile={isOwnProfile} />
        <AchievementGrid
          achievements={achievements}
          unlockedMap={unlockedMap}
          featuredSlugs={profile.featured_achievements ?? []}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  )
}
