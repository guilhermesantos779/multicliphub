import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCampaignAgencyStaff } from '@/lib/campaigns/auth'
import { removePostSchema } from '@/lib/campaigns/schemas'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; post_id: string }> }
) {
  const { id, post_id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const staff = await isCampaignAgencyStaff(supabase, user.id, id)
  if (!staff) {
    return NextResponse.json({ error: 'Apenas o admin/owner da agência pode remover posts' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = removePostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const { data: post, error: postError } = await supabase
    .from('campaign_posts')
    .select('id')
    .eq('id', post_id)
    .eq('campaign_id', id)
    .maybeSingle()

  if (postError) {
    console.error('Remove post lookup error:', postError)
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }

  if (!post) {
    return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
  }

  const { error: updateError } = await supabase
    .from('campaign_posts')
    .update({
      review_status: 'removed',
      removed_by: user.id,
      removed_at: new Date().toISOString(),
      removal_reason: parsed.data.reason ?? null,
    })
    .eq('id', post_id)

  if (updateError) {
    console.error('Remove post error:', updateError)
    return NextResponse.json({ error: 'Erro ao remover post' }, { status: 500 })
  }

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('reviewed_at')
    .eq('id', id)
    .maybeSingle()

  if (campaign?.reviewed_at) {
    await supabase
      .from('campaigns')
      .update({ reviewed_by: null, reviewed_at: null })
      .eq('id', id)
  }

  return NextResponse.json({ success: true })
}
