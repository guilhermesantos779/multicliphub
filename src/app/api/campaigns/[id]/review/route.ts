import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isCampaignAgencyStaff } from '@/lib/campaigns/auth'

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
    return NextResponse.json({ error: 'Apenas o admin/owner da agência pode revisar a campanha' }, { status: 403 })
  }

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .update({ reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, reviewed_by, reviewed_at')
    .single()

  if (error || !campaign) {
    console.error('Review campaign error:', error)
    return NextResponse.json({ error: 'Erro ao revisar campanha' }, { status: 500 })
  }

  return NextResponse.json({ campaign })
}
