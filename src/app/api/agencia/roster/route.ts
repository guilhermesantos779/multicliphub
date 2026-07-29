import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const [agencyProfileId] = await getAgencyProfileIdsForUser(supabase, user.id)
  if (!agencyProfileId) {
    return NextResponse.json({ error: 'Nenhuma agência encontrada' }, { status: 404 })
  }

  const { data: members, error } = await supabase
    .from('agency_clipper_members')
    .select('*')
    .eq('agency_profile_id', agencyProfileId)
    .order('invited_at', { ascending: false })

  if (error) {
    console.error('Roster list error:', error)
    return NextResponse.json({ error: 'Erro ao carregar time' }, { status: 500 })
  }

  const userIds = (members ?? []).map(m => m.user_id)
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, username, full_name, avatar_url').in('id', userIds)
    : { data: [] }

  const profileById = new Map((profiles ?? []).map(p => [p.id, p]))

  const roster = (members ?? []).map(m => {
    const profile = profileById.get(m.user_id)
    return {
      id: m.id,
      agencyProfileId: m.agency_profile_id,
      userId: m.user_id,
      status: m.status,
      invitedAt: m.invited_at,
      joinedAt: m.joined_at,
      removedAt: m.removed_at,
      username: profile?.username,
      fullName: profile?.full_name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
    }
  })

  return NextResponse.json({ roster })
}
