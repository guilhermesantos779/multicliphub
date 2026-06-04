import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Short-lived HttpOnly cookie that carries the Discord link token across the
// login redirect. Keeping the token OUT of the URL avoids Google Safe Browsing
// flagging the login URL as a phishing/open-redirect pattern.
const LINK_COOKIE = 'mch_discord_link'

// Service-role client — bypasses RLS to read the one-time token and write
// discord_id to the profile.
function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/discord/link?token=...   (token may instead arrive via cookie after login)
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin
  const queryToken = req.nextUrl.searchParams.get('token')
  const cookieToken = req.cookies.get(LINK_COOKIE)?.value
  const token = queryToken ?? cookieToken

  if (!token) {
    return NextResponse.redirect(new URL('/configuracoes?error=missing_token', origin))
  }

  // Must be logged in to link an account.
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Stash the token in an HttpOnly cookie and bounce to a CLEAN login URL
    // (no token in the query string). After login the app redirects back to
    // this route, which then reads the token from the cookie.
    const res = NextResponse.redirect(
      new URL('/login?redirect=%2Fapi%2Fdiscord%2Flink', origin)
    )
    res.cookies.set(LINK_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600, // 10 min — matches the token TTL
      path: '/',
    })
    return res
  }

  const admin = getSupabaseAdmin()

  // Clears the link cookie on the way out.
  const finish = (path: string) => {
    const res = NextResponse.redirect(new URL(path, origin))
    res.cookies.set(LINK_COOKIE, '', { maxAge: 0, path: '/' })
    return res
  }

  // Validate the token: exists, unused, not expired.
  const { data: linkToken } = await admin
    .from('discord_link_tokens')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!linkToken) {
    return finish('/configuracoes?error=token_expired')
  }

  // Link Discord to the profile.
  const { error: updateError } = await admin
    .from('profiles')
    .update({
      discord_id: linkToken.discord_id,
      discord_username: linkToken.discord_username,
    })
    .eq('id', user.id)

  if (updateError) {
    // Most likely the discord_id is already linked to another account (UNIQUE).
    return finish('/configuracoes?error=discord_in_use')
  }

  // Mark the token as used.
  await admin
    .from('discord_link_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  return finish('/configuracoes?discord=linked')
}
