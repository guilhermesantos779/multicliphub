import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, status, visibility, agency_profile_id')
    .eq('id', id)
    .maybeSingle()

  if (campaignError) {
    console.error('Join campaign lookup error:', campaignError)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }

  // A 'fechada_agencia' campaign is invisible to non-members at the RLS
  // level (see campaigns_select_active_or_staff), so an outsider gets a 404
  // here already — this route never confirms whether a closed campaign
  // exists to someone who can't join it, "nem via URL direta da API".
  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }

  if (campaign.status !== 'active') {
    return NextResponse.json({ error: 'Campanha não está ativa' }, { status: 400 })
  }

  // Reachable by agency staff who can see the campaign via
  // is_campaign_agency_staff but aren't necessarily on the clipper roster —
  // give them a clear message instead of a raw RLS insert failure. The
  // RLS check on campaign_participants_insert_own re-validates this
  // regardless, so this is a friendlier error, not the real enforcement.
  if (campaign.visibility === 'fechada_agencia') {
    const { data: isMember } = await supabase.rpc('is_agency_clipper_member', {
      uid: user.id,
      target_agency_id: campaign.agency_profile_id,
    })
    if (!isMember) {
      return NextResponse.json(
        { error: 'Essa campanha é fechada para o time da agência' },
        { status: 403 }
      )
    }
  }

  const { data: existing } = await supabase
    .from('campaign_participants')
    .select('id')
    .eq('campaign_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Você já participa desta campanha' }, { status: 409 })
  }

  const { data: participant, error } = await supabase
    .from('campaign_participants')
    .insert({ campaign_id: id, user_id: user.id })
    .select('id, joined_at, status')
    .single()

  if (error || !participant) {
    console.error('Join campaign error:', error)
    return NextResponse.json({ error: 'Erro ao entrar na campanha' }, { status: 500 })
  }

  return NextResponse.json({ participant }, { status: 201 })
}
