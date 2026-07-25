import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// /perfil → redirect to the logged-in user's own public profile
export default async function ProfileIndexPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/perfil')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (profile?.username) {
    redirect(`/perfil/${profile.username}`)
  }

  // No username yet (edge case) — send them to the editor to set one up
  redirect('/perfil/editar')
}
