import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCampaignAgencyStaff } from '@/lib/campaigns/auth'

// Stand-in for the real Asaas payment-confirmation webhook (not built yet —
// see PixPaymentPanel's "Simular confirmação (mock)"). Moves a freshly
// created 'draft' campaign to 'active' and stamps starts_at/ends_at, which
// nothing else in the create flow sets today.
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

  const staff = await isCampaignAgencyStaff(supabase, user.id, id)
  if (!staff) {
    return NextResponse.json({ error: 'Você não tem permissão para ativar essa campanha' }, { status: 403 })
  }

  const { data: campaign, error: fetchError } = await supabase
    .from('campaigns')
    .select('status, duration_days')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) {
    console.error('Activate campaign lookup error:', fetchError)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }
  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }
  if (campaign.status !== 'draft') {
    return NextResponse.json({ error: 'Essa campanha já foi ativada' }, { status: 400 })
  }

  const startsAt = new Date()
  const endsAt = new Date(startsAt.getTime() + campaign.duration_days * 24 * 60 * 60 * 1000)

  const { error } = await supabase
    .from('campaigns')
    .update({
      status: 'active',
      payment_status: 'paid',
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Activate campaign error:', error)
    return NextResponse.json({ error: 'Erro ao ativar campanha' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
