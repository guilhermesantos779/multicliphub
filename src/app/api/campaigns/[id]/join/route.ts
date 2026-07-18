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
    .select('id, status')
    .eq('id', id)
    .maybeSingle()

  if (campaignError) {
    console.error('Join campaign lookup error:', campaignError)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }

  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }

  if (campaign.status !== 'active') {
    return NextResponse.json({ error: 'Campanha não está ativa' }, { status: 400 })
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
