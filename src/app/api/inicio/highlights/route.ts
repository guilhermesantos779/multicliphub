import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const RECENT_WINDOW_HOURS = 48
const TRENDING_LIMIT = 6
const WINNERS_LIMIT = 6

// "Em alta" isn't a stored column — there's no activity-delta table for
// campaigns yet, so it's computed here from recent campaign_posts/
// campaign_participants rows (last 48h) at request time. Fine at today's
// scale; revisit with a materialized view if campaign volume grows.
export async function GET() {
  const supabase = await createClient()
  const since = new Date(Date.now() - RECENT_WINDOW_HOURS * 60 * 60 * 1000).toISOString()

  const [campaignsResult, leaderboardResult] = await Promise.all([
    supabase
      .from('campaigns')
      .select('id, title, cover_image_url, modality, ends_at, agency_profile_id')
      .in('status', ['active', 'paused']),
    supabase.from('campaign_leaderboard').select('*'),
  ])

  const activeCampaigns = campaignsResult.data ?? []
  const leaderboard = leaderboardResult.data ?? []

  const agencyIds = Array.from(new Set(activeCampaigns.map(c => c.agency_profile_id)))
  const { data: agencies } = agencyIds.length
    ? await supabase.from('agency_profiles').select('id, display_name, logo_url').in('id', agencyIds)
    : { data: [] }
  const agencyById = new Map((agencies ?? []).map(a => [a.id, a]))

  const trending = await Promise.all(
    activeCampaigns.map(async campaign => {
      const [recentPostsResult, recentParticipantsResult] = await Promise.all([
        supabase
          .from('campaign_posts')
          .select('id', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .eq('review_status', 'active')
          .gte('created_at', since),
        supabase
          .from('campaign_participants')
          .select('id', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id)
          .gte('joined_at', since),
      ])

      const recentPosts = recentPostsResult.count ?? 0
      const recentParticipants = recentParticipantsResult.count ?? 0
      const totalViews = leaderboard
        .filter(row => row.campaign_id === campaign.id)
        .reduce((sum, row) => sum + (row.total_views ?? 0), 0)
      const agency = agencyById.get(campaign.agency_profile_id)

      return {
        id: campaign.id,
        title: campaign.title,
        coverImageUrl: campaign.cover_image_url,
        modality: campaign.modality,
        endsAt: campaign.ends_at,
        agencyName: agency?.display_name ?? 'Agência',
        agencyLogoUrl: agency?.logo_url ?? null,
        recentActivity: recentPosts + recentParticipants,
        totalViews,
      }
    })
  )

  trending.sort((a, b) => b.recentActivity - a.recentActivity || b.totalViews - a.totalViews)

  const { data: endedCampaigns } = await supabase
    .from('campaigns')
    .select('id, title, reviewed_at')
    .eq('status', 'completed')
    .not('reviewed_at', 'is', null)
    .order('reviewed_at', { ascending: false })
    .limit(WINNERS_LIMIT)

  const winnerCampaignIds = (endedCampaigns ?? []).map(c => c.id)
  const { data: winnerRows } = winnerCampaignIds.length
    ? await supabase
        .from('campaign_leaderboard')
        .select('*')
        .in('campaign_id', winnerCampaignIds)
        .eq('position', 1)
    : { data: [] }

  const winnerUserIds = (winnerRows ?? []).map(r => r.user_id).filter((id): id is string => !!id)
  const { data: winnerProfiles } = winnerUserIds.length
    ? await supabase.from('public_profiles').select('id, username, full_name, avatar_url').in('id', winnerUserIds)
    : { data: [] }
  const profileById = new Map((winnerProfiles ?? []).map(p => [p.id, p]))
  const winnerRowByCampaign = new Map((winnerRows ?? []).map(r => [r.campaign_id, r]))

  const winners = (endedCampaigns ?? [])
    .map(campaign => {
      const row = winnerRowByCampaign.get(campaign.id)
      if (!row || !row.user_id) return null
      const profile = profileById.get(row.user_id)
      return {
        campaignId: campaign.id,
        campaignTitle: campaign.title,
        winnerUserId: row.user_id,
        winnerName: profile?.full_name || profile?.username || 'Clipador',
        winnerUsername: profile?.username ?? null,
        winnerAvatarUrl: profile?.avatar_url ?? null,
        totalViews: row.total_views ?? 0,
      }
    })
    .filter((w): w is NonNullable<typeof w> => w !== null)

  return NextResponse.json({
    trending: trending.slice(0, TRENDING_LIMIT),
    winners,
  })
}
