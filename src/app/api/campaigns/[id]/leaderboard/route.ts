import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: rows, error } = await supabase
    .from('campaign_leaderboard')
    .select('*')
    .eq('campaign_id', id)
    .order('position', { ascending: true })

  if (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 })
  }

  const userIds = (rows ?? []).map((row) => row.user_id).filter((v): v is string => v !== null)

  const { data: profiles } = userIds.length
    ? await supabase
        .from('public_profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds)
    : { data: [] }

  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]))

  const leaderboard = (rows ?? []).map((row) => ({
    ...row,
    profile: row.user_id ? profileById.get(row.user_id) ?? null : null,
  }))

  return NextResponse.json({ leaderboard })
}
