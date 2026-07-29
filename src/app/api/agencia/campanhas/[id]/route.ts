import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCampaignAgencyStaff } from '@/lib/campaigns/auth'

// Agency-facing campaign detail: bundles the campaign row, the full
// participant list (from campaign_participants — includes people with zero
// posts yet, unlike campaign_leaderboard which is post-only), each
// participant's leaderboard stats when they have one, and total views.
// For 'fechada_agencia' campaigns, participants who are no longer an active
// member of the agency's roster (they may have left after joining) are
// filtered out of the display — roster status can change after the fact,
// this isn't redundant with the join-time RLS check.
export async function GET(
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
    return NextResponse.json({ error: 'Você não tem permissão para ver essa campanha' }, { status: 403 })
  }

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (campaignError) {
    console.error('Agency campaign detail error:', campaignError)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }
  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }

  const [participantsResult, leaderboardResult, assetsResult] = await Promise.all([
    supabase
      .from('campaign_participants')
      .select('id, user_id, joined_at, status')
      .eq('campaign_id', id),
    supabase
      .from('campaign_leaderboard')
      .select('*')
      .eq('campaign_id', id),
    supabase
      .from('campaign_assets')
      .select('id, type, label, url')
      .eq('campaign_id', id),
  ])

  const participants = participantsResult.data ?? []
  const leaderboardByUser = new Map((leaderboardResult.data ?? []).map(row => [row.user_id, row]))

  let visibleParticipants = participants

  if (campaign.visibility === 'fechada_agencia') {
    const { data: activeMembers } = await supabase
      .from('agency_clipper_members')
      .select('user_id')
      .eq('agency_profile_id', campaign.agency_profile_id)
      .eq('status', 'ativo')

    const activeMemberIds = new Set((activeMembers ?? []).map(m => m.user_id))
    visibleParticipants = participants.filter(p => activeMemberIds.has(p.user_id))
  }

  const userIds = visibleParticipants.map(p => p.user_id)
  const { data: profiles } = userIds.length
    ? await supabase.from('public_profiles').select('id, username, full_name, avatar_url').in('id', userIds)
    : { data: [] }
  const profileById = new Map((profiles ?? []).map(p => [p.id, p]))

  const enrichedParticipants = visibleParticipants
    .map(p => {
      const stats = leaderboardByUser.get(p.user_id)
      return {
        id: p.id,
        userId: p.user_id,
        joinedAt: p.joined_at,
        status: p.status,
        profile: profileById.get(p.user_id) ?? null,
        position: stats?.position ?? null,
        totalViews: stats?.total_views ?? 0,
        totalPosts: stats?.total_posts ?? 0,
      }
    })
    .sort((a, b) => (a.position ?? Infinity) - (b.position ?? Infinity))

  const totalViews = enrichedParticipants.reduce((sum, p) => sum + p.totalViews, 0)

  return NextResponse.json({
    campaign,
    participants: enrichedParticipants,
    participantCount: enrichedParticipants.length,
    totalViews,
    materials: assetsResult.data ?? [],
  })
}
