import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser, isAgencyStaff } from '@/lib/campaigns/auth'
import { generateInviteCode } from '@/lib/agency/roster'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const [agencyProfileId] = await getAgencyProfileIdsForUser(supabase, user.id)
  if (!agencyProfileId) {
    return NextResponse.json({ error: 'Nenhuma agência encontrada' }, { status: 404 })
  }

  const staff = await isAgencyStaff(supabase, user.id, agencyProfileId)
  if (!staff) {
    return NextResponse.json({ error: 'Você não tem permissão para gerenciar essa agência' }, { status: 403 })
  }

  const { data: agencyProfile } = await supabase
    .from('agency_profiles')
    .select('kind')
    .eq('id', agencyProfileId)
    .single()

  if (agencyProfile?.kind !== 'clipadores') {
    return NextResponse.json({ error: 'Links de convite só existem para agências de clipadores' }, { status: 400 })
  }

  // Reuse an existing active link if there's one, instead of piling up codes.
  const { data: existing } = await supabase
    .from('agency_invite_links')
    .select('*')
    .eq('agency_profile_id', agencyProfileId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ inviteLink: existing })
  }

  const { data: created, error } = await supabase
    .from('agency_invite_links')
    .insert({
      agency_profile_id: agencyProfileId,
      code: generateInviteCode(),
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Invite link create error:', error)
    return NextResponse.json({ error: 'Erro ao gerar link de convite' }, { status: 500 })
  }

  return NextResponse.json({ inviteLink: created })
}
