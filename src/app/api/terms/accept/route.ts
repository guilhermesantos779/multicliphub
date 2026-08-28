import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'

// Used by the blocking "terms updated" gate for already-authenticated users.
// (The register flow's own acceptance is captured at signup time — see
// /api/terms/status for how that gets reconciled into this same table.)
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const termsVersionId = body.terms_version_id as string | undefined

  if (!termsVersionId) {
    return NextResponse.json({ error: 'Versão dos termos não informada' }, { status: 400 })
  }

  // Re-validate against the DB instead of trusting the client blindly: only
  // let someone accept the version that's actually current for their tipo.
  const agencyProfileIds = await getAgencyProfileIdsForUser(supabase, user.id)
  const tipo = agencyProfileIds.length > 0 ? 'agencia' : 'clipador'

  const { data: latest } = await supabase
    .from('terms_versions')
    .select('id')
    .eq('tipo', tipo)
    .lte('vigente_a_partir', new Date().toISOString())
    .order('vigente_a_partir', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!latest || latest.id !== termsVersionId) {
    return NextResponse.json({ error: 'Essa não é a versão vigente dos termos' }, { status: 409 })
  }

  const { error } = await supabase
    .from('user_terms_acceptance')
    .upsert({ user_id: user.id, terms_version_id: termsVersionId, aceito_em: new Date().toISOString() }, { onConflict: 'user_id,terms_version_id' })

  if (error) {
    console.error('Accept terms error:', error)
    return NextResponse.json({ error: 'Erro ao registrar aceite' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
