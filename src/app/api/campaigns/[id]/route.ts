import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Get campaign error:', error)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }

  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }

  const [agencyResult, assetsResult, participantsCountResult, myParticipationResult] = await Promise.all([
    supabase.from('agency_profiles').select('display_name, logo_url, verified').eq('id', campaign.agency_profile_id).maybeSingle(),
    supabase.from('campaign_assets').select('id, type, label, url').eq('campaign_id', id),
    supabase.from('campaign_participants').select('id', { count: 'exact', head: true }).eq('campaign_id', id),
    user
      ? supabase.from('campaign_participants').select('id').eq('campaign_id', id).eq('user_id', user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const agency = agencyResult.data

  return NextResponse.json({
    campaign: {
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
      referenceMaterials: (assetsResult.data ?? []).map(a => ({ id: a.id, type: a.type, label: a.label ?? '', url: a.url })),
      participantsCount: participantsCountResult.count ?? 0,
      isParticipating: !!myParticipationResult.data,
    },
  })
}
