import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS so it can read the one-time link token
// and write discord_id to the profile regardless of row policies.
function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/discord/link?token=...
// Reached when a user clicks the button from the /vincular Discord command.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const origin = req.nextUrl.origin

  if (!token) {
    return NextResponse.redirect(new URL('/configuracoes?error=missing_token', origin))
  }

  // Must be logged in to link an account.
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const redirectTarget = `/api/discord/link?token=${token}`
    return NextResponse.redirect(
      new URL(`/login?redirect=${encodeURIComponent(redirectTarget)}`, origin)
    )
  }

  const admin = getSupabaseAdmin()

  // Validate the token: must exist, be unused, and not expired.
  const { data: linkToken } = await admin
    .from('discord_link_tokens')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!linkToken) {
    return NextResponse.redirect(new URL('/configuracoes?error=token_expired', origin))
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
    return NextResponse.redirect(new URL('/configuracoes?error=discord_in_use', origin))
  }

  // Mark the token as used.
  await admin
    .from('discord_link_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)

  return NextResponse.redirect(new URL('/configuracoes?discord=linked', origin))
}
