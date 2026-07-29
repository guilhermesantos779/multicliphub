import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Self-service "sair da agência" from the clipper's own profile — doesn't
// need to know the agency_clipper_members row id. RLS already permits a
// user to move their OWN row to 'removido' (see migration), so this is a
// plain update scoped by user_id.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: updated, error } = await supabase
    .from('agency_clipper_members')
    .update({ status: 'removido', removed_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('status', 'ativo')
    .select('*')
    .maybeSingle()

  if (error) {
    console.error('Roster leave error:', error)
    return NextResponse.json({ error: 'Erro ao sair da agência' }, { status: 500 })
  }
  if (!updated) {
    return NextResponse.json({ error: 'Você não faz parte de nenhuma agência' }, { status: 404 })
  }

  return NextResponse.json({ member: updated })
}
