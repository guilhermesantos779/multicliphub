import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const [agencyProfileId] = await getAgencyProfileIdsForUser(supabase, user.id)
  if (!agencyProfileId) {
    return NextResponse.json({ error: 'Nenhuma agência encontrada' }, { status: 404 })
  }

  const { data: rows, error } = await supabase
    .from('agency_clipper_metrics')
    .select('*')
    .eq('agency_profile_id', agencyProfileId)

  if (error) {
    console.error('Roster metrics error:', error)
    return NextResponse.json({ error: 'Erro ao carregar métricas' }, { status: 500 })
  }

  const totals = (rows ?? []).reduce(
    (acc, row) => ({
      totalViews: acc.totalViews + Number(row.total_views ?? 0),
      totalEarnings: acc.totalEarnings + Number(row.total_earnings ?? 0),
    }),
    { totalViews: 0, totalEarnings: 0 }
  )

  return NextResponse.json({
    totals,
    perMember: (rows ?? []).map(row => ({
      userId: row.user_id,
      totalViews: Number(row.total_views ?? 0),
      totalEarnings: Number(row.total_earnings ?? 0),
    })),
  })
}
