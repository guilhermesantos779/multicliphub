import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAgencyStaff } from '@/lib/campaigns/auth'

// Used both by agency staff removing a member and by a clipper removing
// themselves ("sair da agência") — the permission check below covers both.
export async function POST(_req: Request, { params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: member } = await supabase
    .from('agency_clipper_members')
    .select('id, agency_profile_id, user_id, status')
    .eq('id', memberId)
    .single()

  if (!member) {
    return NextResponse.json({ error: 'Membro não encontrado' }, { status: 404 })
  }

  const isSelf = member.user_id === user.id
  const staff = isSelf ? false : await isAgencyStaff(supabase, user.id, member.agency_profile_id)
  if (!isSelf && !staff) {
    return NextResponse.json({ error: 'Você não tem permissão para gerenciar esse time' }, { status: 403 })
  }

  const { data: updated, error } = await supabase
    .from('agency_clipper_members')
    .update({ status: 'removido', removed_at: new Date().toISOString() })
    .eq('id', memberId)
    .select('*')
    .single()

  if (error) {
    console.error('Roster remove error:', error)
    return NextResponse.json({ error: 'Erro ao remover membro' }, { status: 500 })
  }

  return NextResponse.json({ member: updated })
}
