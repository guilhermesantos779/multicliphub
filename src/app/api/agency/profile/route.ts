import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'
import { VIEW_AS_COOKIE } from '@/lib/admin/view-as'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Mirrors the proxy's "view as clipper" override: an admin previewing the
  // clipper experience shouldn't see their own real agency data leak through
  // here even though it still exists in the DB.
  const viewAsMode = (await cookies()).get(VIEW_AS_COOKIE)?.value
  if (viewAsMode === 'clipper') {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin') {
      return NextResponse.json({ agencyProfile: null })
    }
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
