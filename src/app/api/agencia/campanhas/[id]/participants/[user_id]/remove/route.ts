import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCampaignAgencyStaff } from '@/lib/campaigns/auth'
import { removePostSchema } from '@/lib/campaigns/schemas'

// Removes a participant's posts from a campaign (zeroes their counted
// views/ranking by marking every active post 'removed' — same field shape
// as the existing per-post /posts/[post_id]/remove route, applied to all of
// this user's active posts in this campaign at once). This intentionally
// never touches agency_clipper_members — removing someone from a campaign
// and removing them from the agency's roster are unrelated actions.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; user_id: string }> }
) {
  const { id, user_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const staff = await isCampaignAgencyStaff(supabase, user.id, id)
  if (!staff) {
    return NextResponse.json({ error: 'Apenas o admin/owner da agência pode remover participantes' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = removePostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: removedPosts, error } = await supabase
    .from('campaign_posts')
    .update({
      review_status: 'removed',
      removed_by: user.id,
      removed_at: new Date().toISOString(),
      removal_reason: parsed.data.reason ?? null,
    })
    .eq('campaign_id', id)
    .eq('user_id', user_id)
    .eq('review_status', 'active')
    .select('id')

  if (error) {
    console.error('Remove participant error:', error)
    return NextResponse.json({ error: 'Erro ao remover participante' }, { status: 500 })
  }

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('reviewed_at')
    .eq('id', id)
    .maybeSingle()

  if (campaign?.reviewed_at) {
    await supabase.from('campaigns').update({ reviewed_by: null, reviewed_at: null }).eq('id', id)
  }

  return NextResponse.json({ success: true, removedPosts: removedPosts?.length ?? 0 })
}
