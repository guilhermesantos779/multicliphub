import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { campaignsListQuerySchema } from '@/lib/campaigns/schemas'

export async function GET(req: NextRequest) {
  const parsed = campaignsListQuerySchema.safeParse({
    category: req.nextUrl.searchParams.get('category') ?? undefined,
    content_type: req.nextUrl.searchParams.get('content_type') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Parâmetros inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = await createClient()

  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (parsed.data.category) {
    query = query.eq('category', parsed.data.category)
  }
  if (parsed.data.content_type) {
    query = query.eq('content_type', parsed.data.content_type)
  }

  const { data, error } = await query

  if (error) {
    console.error('List campaigns error:', error)
    return NextResponse.json({ error: 'Erro ao listar campanhas' }, { status: 500 })
  }

  return NextResponse.json({ campaigns: data })
}
