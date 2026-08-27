import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { campaignsListQuerySchema } from '@/lib/campaigns/schemas'

export async function GET(req: NextRequest) {
  const parsed = campaignsListQuerySchema.safeParse({
    category: req.nextUrl.searchParams.get('category') ?? undefined,
    content_type: req.nextUrl.searchParams.get('content_type') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (parsed.data.category) {
    query = query.eq('category', parsed.data.category)
  }
  if (parsed.data.content_type) {
    query = query.eq('content_type', parsed.data.content_type)
  }

  const { data: campaigns, error } = await query

  if (error) {
    console.error('List campaigns error:', error)
    return NextResponse.json({ error: 'Erro ao listar campanhas' }, { status: 500 })
  }

  // RLS on `campaigns` (campaigns_select_active_or_staff) already restricts
  // which 'fechada_agencia' rows come back to non-roster users — no extra
  // visibility filter needed here, just enrichment for the card/list UI.
  const campaignIds = (campaigns ?? []).map(c => c.id)
  const agencyIds = Array.from(new Set((campaigns ?? []).map(c => c.agency_profile_id)))

  const [agenciesResult, participantsResult, myParticipationResult] = await Promise.all([
    agencyIds.length
      ? supabase.from('agency_profiles').select('id, display_name, logo_url, verified').in('id', agencyIds)
      : Promise.resolve({ data: [] }),
    campaignIds.length
      ? supabase.from('campaign_participants').select('campaign_id').in('campaign_id', campaignIds)
      : Promise.resolve({ data: [] }),
    user && campaignIds.length
      ? supabase.from('campaign_participants').select('campaign_id').eq('user_id', user.id).in('campaign_id', campaignIds)
      : Promise.resolve({ data: [] }),
  ])

  const agencyById = new Map((agenciesResult.data ?? []).map(a => [a.id, a]))
  const participantCounts = new Map<string, number>()
  for (const row of participantsResult.data ?? []) {
    participantCounts.set(row.campaign_id, (participantCounts.get(row.campaign_id) ?? 0) + 1)
  }
  const myParticipatingIds = new Set((myParticipationResult.data ?? []).map(row => row.campaign_id))

  const enriched = (campaigns ?? []).map(campaign => {
    const agency = agencyById.get(campaign.agency_profile_id)
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      rules: campaign.rules,
      hashtag: campaign.required_hashtag,
      coverImageUrl: campaign.cover_image_url,
      agencyId: campaign.agency_profile_id,
      agencyName: agency?.display_name ?? 'Agência',
      agencyLogoUrl: agency?.logo_url ?? null,
      agencyVerified: agency?.verified ?? false,
      modality: campaign.modality,
      category: campaign.category,
      contentType: campaign.content_type,
      status: campaign.status,
      createdAt: campaign.created_at,
      endsAt: campaign.ends_at,
      cpmRate: campaign.cpm_rate,
      totalBudget: campaign.budget_total,
      prizes: campaign.prize_structure,
      referenceMaterials: [],
      participantsCount: participantCounts.get(campaign.id) ?? 0,
      isParticipating: myParticipatingIds.has(campaign.id),
    }
  })

  return NextResponse.json({ campaigns: enriched })
}
