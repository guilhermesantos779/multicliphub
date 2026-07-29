import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const agencyProfileIds = await getAgencyProfileIdsForUser(supabase, user.id)

  if (agencyProfileIds.length === 0) {
    return NextResponse.json({ campaigns: [] })
  }

  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .in('agency_profile_id', agencyProfileIds)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Agency dashboard error:', error)
    return NextResponse.json({ error: 'Erro ao carregar dashboard' }, { status: 500 })
  }

  const campaignsWithCounters = await Promise.all(
    (campaigns ?? []).map(async (campaign) => {
      const [participantsResult, activePostsResult] = await Promise.all([
        supabase
          .from('campaign_participants')
          .select('id', { count: 'exact', head: true })
          .eq('campaign_id', campaign.id),
        supabase
          .from('campaign_posts')
          .select('views_count')
          .eq('campaign_id', campaign.id)
          .eq('review_status', 'active'),
      ])

      const activePosts = activePostsResult.data ?? []
      const totalViews = activePosts.reduce((sum, post) => sum + (post.views_count ?? 0), 0)

      return {
        ...campaign,
        total_participants: participantsResult.count ?? 0,
        active_posts_count: activePosts.length,
        total_views: totalViews,
        pending_final_review: campaign.reviewed_at === null,
      }
    })
  )

  return NextResponse.json({ campaigns: campaignsWithCounters })
}
