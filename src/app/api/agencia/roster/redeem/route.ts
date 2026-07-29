import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { INVITE_APPROVAL_MODE } from '@/lib/agency/roster'

const redeemSchema = z.object({ code: z.string().min(1) })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const parsed = redeemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Código inválido' }, { status: 400 })
  }

  // Resolves the code, enforces "one active agency at a time", and
  // inserts/reactivates the membership row — all atomically inside the
  // security-definer function (see migration), so there's no
  // read-then-write race and no need to touch agency_clipper_members'
  // regular RLS policies (which intentionally don't allow a clipper to
  // self-reactivate outside this validated path).
  const { data: member, error } = await supabase.rpc('redeem_agency_invite', {
    p_code: parsed.data.code,
    p_auto_approve: INVITE_APPROVAL_MODE === 'auto',
  })

  if (error) {
    if (error.message?.includes('invalid_or_expired_code')) {
      return NextResponse.json({ error: 'Código inválido ou expirado' }, { status: 404 })
    }
    if (error.message?.includes('already_active_elsewhere')) {
      return NextResponse.json(
        { error: 'Você já faz parte de outra agência. Saia dela antes de entrar em uma nova.' },
        { status: 409 }
      )
    }
    console.error('Roster redeem error:', error)
    return NextResponse.json({ error: 'Não foi possível entrar na agência' }, { status: 500 })
  }

  return NextResponse.json({ member })
}
