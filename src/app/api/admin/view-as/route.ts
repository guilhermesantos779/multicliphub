import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { VIEW_AS_COOKIE, type ViewAsMode } from '@/lib/admin/view-as'

const VIEW_AS_MAX_AGE = 60 * 60 * 12 // 12h — auto-expires so it can't be forgotten on

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, status: 401, error: 'Não autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Só admins podem usar o modo de visualização' }

  return { ok: true as const, supabase, userId: user.id }
}

// Lets an admin preview the app as a clipper or as an agency without a
// second account. Never touches real data — just a short-lived cookie the
// proxy and a couple of API routes check to override the account-type
// branching for this one admin's own session.
export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const cookieStore = await cookies()
  const mode = (cookieStore.get(VIEW_AS_COOKIE)?.value as ViewAsMode | undefined) ?? null

  return NextResponse.json({ mode })
}

export async function POST(req: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const body = await req.json().catch(() => ({}))
  const mode = body.mode as ViewAsMode | null | undefined

  const cookieStore = await cookies()

  if (mode !== 'clipper' && mode !== 'agency') {
    cookieStore.delete(VIEW_AS_COOKIE)
    return NextResponse.json({ mode: null })
  }

  cookieStore.set(VIEW_AS_COOKIE, mode, {
    maxAge: VIEW_AS_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })

  return NextResponse.json({ mode })
}
