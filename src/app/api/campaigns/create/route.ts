import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCampaignSchema } from '@/lib/campaigns/schemas'
import { isAgencyStaff } from '@/lib/campaigns/auth'

const PLATFORM_FEE_PERCENTAGE = 10

function calculateCharge(valor: number): number {
  return Math.round(valor * (1 + PLATFORM_FEE_PERCENTAGE / 100) * 100) / 100
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = createCampaignSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const input = parsed.data

  const staff = await isAgencyStaff(supabase, user.id, input.agency_profile_id)
  if (!staff) {
    return NextResponse.json({ error: 'Você não tem permissão para criar campanhas nesta agência' }, { status: 403 })
  }

  if (input.visibility === 'fechada_agencia') {
    const { data: agencyProfile } = await supabase
      .from('agency_profiles')
      .select('kind')
      .eq('id', input.agency_profile_id)
      .single()

    if (agencyProfile?.kind !== 'clipadores') {
      return NextResponse.json(
        { error: 'Campanhas fechadas só existem para agências de clipadores' },
        { status: 400 }
      )
    }
  }

  const valor = input.modality === 'cpm'
    ? input.budget_total
    : input.prize_structure.reduce((sum, prize) => sum + prize.amount, 0)

  const totalCharged = calculateCharge(valor)

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      agency_profile_id: input.agency_profile_id,
      title: input.title,
      description: input.description ?? null,
      rules: input.rules ?? null,
      required_hashtag: input.required_hashtag,
      category: input.category,
      content_type: input.content_type,
      modality: input.modality,
      cpm_rate: input.modality === 'cpm' ? input.cpm_rate : null,
      budget_total: input.modality === 'cpm' ? input.budget_total : null,
      prize_structure: input.modality === 'leaderboard' ? input.prize_structure : null,
      ranking_metric: input.modality === 'leaderboard' ? input.ranking_metric : 'views',
      cover_image_url: input.cover_image_url ?? null,
      badge_label: input.badge_label,
      duration_days: input.duration_days,
      visibility: input.visibility,
      platform_fee_percentage: PLATFORM_FEE_PERCENTAGE,
      total_charged: totalCharged,
      payment_status: 'pending',
      status: 'draft',
    })
    .select('id')
    .single()

  if (error || !campaign) {
    console.error('Create campaign error:', error)
    return NextResponse.json({ error: 'Erro ao criar campanha' }, { status: 500 })
  }

  // TODO(agente-4): gerar cobrança Pix (Asaas) para `campaign.id` aqui (ou no endpoint
  // que dispara o checkout), gravando asaas_charge_id / pix_qr_code / pix_copy_paste
  // e avançando campaigns.status para 'aguardando_pagamento'.

  return NextResponse.json({ id: campaign.id }, { status: 201 })
}
