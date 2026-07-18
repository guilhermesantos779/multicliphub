import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; user_id: string }> }
) {
  const { id, user_id } = await params
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('campaign_posts')
    .select('*')
    .eq('campaign_id', id)
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('List campaign posts error:', error)
    return NextResponse.json({ error: 'Erro ao listar posts' }, { status: 500 })
  }

  return NextResponse.json({ posts })
}
