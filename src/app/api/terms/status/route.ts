import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'

// "tipo" mirrors every other account-type branch in this app: does this user
// own/staff an agency_profiles row, or are they a plain clipper.
async function resolveTipo(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<'clipador' | 'agencia'> {
  const agencyProfileIds = await getAgencyProfileIdsForUser(supabase, userId)
  return agencyProfileIds.length > 0 ? 'agencia' : 'clipador'
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const tipo = await resolveTipo(supabase, user.id)

  const { data: latest, error: latestError } = await supabase
    .from('terms_versions')
    .select('id, tipo, versao, conteudo, vigente_a_partir')
    .eq('tipo', tipo)
    .lte('vigente_a_partir', new Date().toISOString())
    .order('vigente_a_partir', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError) {
    console.error('Terms status lookup error:', latestError)
    return NextResponse.json({ error: 'Erro ao verificar termos' }, { status: 500 })
  }

  // No terms row seeded for this tipo yet — don't dead-end the user over a
  // data-completeness gap, just let them through.
  if (!latest) {
    return NextResponse.json({ accepted: true, tipo, latestVersion: null })
  }

  const { data: existingAcceptance } = await supabase
    .from('user_terms_acceptance')
    .select('id')
    .eq('user_id', user.id)
    .eq('terms_version_id', latest.id)
    .maybeSingle()

  if (existingAcceptance) {
    return NextResponse.json({ accepted: true, tipo, latestVersion: latest })
  }

  // Signup already captured explicit acceptance of this exact version (email/
  // password via user_metadata set at signUp time, or Google OAuth via the
  // pending-terms cookie applied in /auth/callback) — the audit row just
  // couldn't be written until a real session existed. Write it now, silently,
  // instead of re-prompting someone who already agreed minutes ago.
  const metadataVersionId = user.user_metadata?.terms_version_id
  if (metadataVersionId === latest.id) {
    const { error: insertError } = await supabase.from('user_terms_acceptance').insert({
      user_id: user.id,
      terms_version_id: latest.id,
      aceito_em: user.user_metadata?.terms_accepted_at ?? new Date().toISOString(),
    })
    if (!insertError) {
      return NextResponse.json({ accepted: true, tipo, latestVersion: latest })
    }
    console.error('Auto-accept terms from signup metadata failed:', insertError)
  }

  return NextResponse.json({ accepted: false, tipo, latestVersion: latest })
}
