import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.multicliphub.com.br'

// Instagram API with Instagram Login (Business Login) callback:
// code -> short-lived token -> long-lived token (60d) -> profile -> save.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')

  const redirect = (query: string) =>
    NextResponse.redirect(`${APP_URL}/canais?${query}`)

  if (error) {
    console.error('[instagram-oauth] Denied:', error, searchParams.get('error_description'))
    return redirect('error=instagram_denied')
  }
  if (!code) {
    return redirect('error=instagram_invalid')
  }

  // CSRF: missing cookie is logged but not blocked; mismatch is a hard block.
  const cookieStore = await cookies()
  const storedState = cookieStore.get('instagram_oauth_state')?.value
  if (!storedState) {
    console.warn('[instagram-oauth] State cookie missing — proceeding with caution')
  } else if (storedState !== stateParam) {
    console.error('[instagram-oauth] State mismatch')
    return redirect('error=instagram_state')
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.redirect(`${APP_URL}/login?redirect=/canais`)
    }

    const APP_ID = process.env.INSTAGRAM_CLIENT_ID!
    const APP_SECRET = process.env.INSTAGRAM_CLIENT_SECRET!
    const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI!

    // 1) Exchange code for a short-lived token.
    const shortRes = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: APP_ID,
        client_secret: APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code,
      }),
    })
    const shortData = await shortRes.json()
    console.log('[instagram-oauth] Short token status:', shortRes.status)
    if (!shortData.access_token) {
      console.error('[instagram-oauth] Short token failed:', shortData)
      return redirect('error=instagram_token')
    }

    // 2) Exchange for a long-lived token (~60 days).
    const longRes = await fetch(
      'https://graph.instagram.com/access_token?' +
        new URLSearchParams({
          grant_type: 'ig_exchange_token',
          client_secret: APP_SECRET,
          access_token: shortData.access_token,
        }).toString()
    )
    const longData = await longRes.json()
    console.log('[instagram-oauth] Long token status:', longRes.status)

    const accessToken: string = longData.access_token ?? shortData.access_token
    const expiresIn: number = longData.expires_in ?? 3600

    // 3) Fetch the Instagram account profile.
    const meRes = await fetch(
      'https://graph.instagram.com/me?' +
        new URLSearchParams({ fields: 'user_id,username', access_token: accessToken }).toString()
    )
    const meData = await meRes.json()
    console.log('[instagram-oauth] Profile:', JSON.stringify(meData))
    const igUserId: string | undefined = meData.user_id ?? String(shortData.user_id ?? '')
    const igUsername: string | null = meData.username ?? null
    if (!igUserId) {
      console.error('[instagram-oauth] No Instagram user id:', meData)
      return redirect('error=instagram_no_account')
    }

    // 4) Persist into `channels` with the token encrypted at rest. No unique
    // (user_id, platform) constraint, so upsert manually by channel_id.
    const row = {
      user_id: user.id,
      platform: 'instagram' as const,
      channel_name: igUsername ?? `Instagram (${igUserId.slice(0, 8)})`,
      channel_id: igUserId,
      access_token: encrypt(accessToken),
      refresh_token: null,
      expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
      is_active: true,
    }

    const { data: existing } = await supabase
      .from('channels')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', 'instagram')
      .eq('channel_id', igUserId)
      .maybeSingle()

    const dbError = existing
      ? (await supabase.from('channels').update(row).eq('id', existing.id)).error
      : (await supabase.from('channels').insert(row)).error

    if (dbError) {
      console.error('[instagram-oauth] DB upsert failed:', dbError)
      return redirect('error=instagram_db')
    }

    console.log('[instagram-oauth] Account saved:', igUsername, 'for user', user.id)

    const res = redirect('success=instagram')
    res.cookies.delete('instagram_oauth_state')
    return res
  } catch (err) {
    console.error('[instagram-oauth] Unexpected error:', err)
    return redirect('error=instagram_unexpected')
  }
}
