import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import {
  normalizeUsername, validateUsername, USERNAME_ERROR_MESSAGE,
} from '@/lib/username'

// Service-role client — used only to check username existence. RLS on
// `profiles` is own-only, so a cookie/anon client would never see another
// user's row (and report every taken nickname as free). This client never
// returns profile data to the caller; only a boolean leaves the route.
function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// Simple in-memory rate limit: 10 checks / 10s per IP.
// Note: per serverless instance (no shared Redis in this project), so it's a
// lightweight abuse guard, not a hard global limit. Swap for Upstash later.
const WINDOW_MS = 10_000
const MAX_HITS = 10
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // crude memory cap
  return recent.length > MAX_HITS
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  if (rateLimited(ip)) {
    return NextResponse.json(
      { available: false, reason: 'rate_limited', message: 'Muitas verificações. Aguarde um instante.' },
      { status: 429 },
    )
  }

  const raw = req.nextUrl.searchParams.get('username') ?? ''
  const username = normalizeUsername(raw)

  // Local validation first (no DB round-trip)
  const err = validateUsername(username)
  if (err) {
    return NextResponse.json({
      available: false,
      reason: err === 'reserved' ? 'reserved' : err === 'empty' ? 'empty' : 'format',
      message: USERNAME_ERROR_MESSAGE[err],
    })
  }

  // Identify the caller (cookie client) so they can keep their own nickname.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Existence check via service role (bypasses RLS). Both the input and stored
  // usernames are lowercase, so an exact match mirrors the unique index
  // `profiles_username_lower_key`. (Avoid ilike: `_` is a wildcard there and
  // underscores are valid in nicknames.)
  const admin = getSupabaseAdmin()
  let query = admin.from('profiles').select('id').eq('username', username)
  if (user) query = query.neq('id', user.id)
  const { data } = await query.maybeSingle()

  if (data) {
    return NextResponse.json({ available: false, reason: 'taken', message: 'Este nickname já está em uso' })
  }

  return NextResponse.json({ available: true, message: 'Nickname disponível!' })
}
