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
    return NextResponse.json({ agencyProfile: null })
  }

  const { data: agencyProfile, error } = await supabase
    .from('agency_profiles')
    .select('*')
    .eq('id', agencyProfileId)
    .single()

  if (error) {
    console.error('Agency profile error:', error)
    return NextResponse.json({ error: 'Erro ao carregar perfil da agência' }, { status: 500 })
  }

  return NextResponse.json({ agencyProfile })
}
