import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Get campaign error:', error)
    return NextResponse.json({ error: 'Erro ao buscar campanha' }, { status: 500 })
  }

  if (!campaign) {
    return NextResponse.json({ error: 'Campanha não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ campaign })
}
