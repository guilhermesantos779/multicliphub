import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('campaign_participants')
    .select('id, joined_at, status, campaign:campaigns(*)')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  if (error) {
    console.error('My campaigns error:', error)
    return NextResponse.json({ error: 'Erro ao listar campanhas' }, { status: 500 })
  }

  return NextResponse.json({ participations: data })
}
