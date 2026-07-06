import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.multicliphub.com.br'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')

  const redirect = (query: string) =>
    NextResponse.redirect(`${APP_URL}/canais?${query}`)

  // TikTok denied / returned an error.
  if (error) {
    console.error('[tiktok-oauth] Error from TikTok:', error)
    return redirect('error=tiktok_denied')
  }

  if (!code) {
    console.error('[tiktok-oauth] Missing code')
    return redirect('error=tiktok_invalid')
  }

  // CSRF: state must match the cookie set when the flow started.
  // A missing cookie is logged but not blocked (some browsers drop it across
  // the OAuth redirect); a present-but-mismatched cookie is a hard block.
  const cookieStore = await cookies()
  const storedState = cookieStore.get('tiktok_oauth_state')?.value
  if (!storedState) {
    console.warn('[tiktok-oauth] State cookie missing — proceeding with caution')
  } else if (storedState !== stateParam) {
    console.error('[tiktok-oauth] State mismatch', {
      stored: storedState.slice(0, 8) + '...',
      received: (stateParam ?? '').slice(0, 8) + '...',
    })
    return redirect('error=tiktok_state')
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[tiktok-oauth] User not authenticated:', authError)
      return NextResponse.redirect(`${APP_URL}/login?redirect=/canais`)
    }

    // Exchange the authorization code for tokens.
    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: (process.env.TIKTOK_CLIENT_ID ?? process.env.TIKTOK_CLIENT_KEY)!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      }),
    })
    const tokenData = await tokenRes.json()
    console.log('[tiktok-oauth] Token response status:', tokenRes.status)

    if (tokenData.error || !tokenData.access_token) {
      console.error('[tiktok-oauth] Token exchange failed:', tokenData?.error ?? tokenRes.status)
      return redirect('error=tiktok_token')
    }

    const { access_token, refresh_token, open_id, expires_in } = tokenData
    console.log('[tiktok-oauth] Token obtained for open_id:', open_id)

    // Fetch the display name for a friendly channel label (non-critical).
    let tiktokUsername: string | null = null
    try {
      const profileRes = await fetch(
        'https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url',
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      const profileData = await profileRes.json()
      tiktokUsername = profileData?.data?.user?.display_name ?? null
      console.log('[tiktok-oauth] Profile fetched:', tiktokUsername)
    } catch (e) {
      console.warn('[tiktok-oauth] Profile fetch failed (non-critical):', e)
    }

    // Persist into `channels` (the table the /canais page reads). Tokens are
    // encrypted at rest with AES-256-GCM. There is no unique (user_id, platform)
    // constraint — Pro plans allow several channels per platform — so we upsert
    // manually keyed by (user_id, platform, channel_id=open_id).
    const row = {
      user_id: user.id,
      platform: 'tiktok' as const,
      channel_name: tiktokUsername ?? `TikTok (${String(open_id).slice(0, 8)})`,
      channel_id: open_id,
      access_token: encrypt(access_token),
      refresh_token: refresh_token ? encrypt(refresh_token) : null,
      expires_at: new Date(Date.now() + (expires_in ?? 86400) * 1000).toISOString(),
      is_active: true,
    }

    const { data: existing } = await supabase
      .from('channels')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', 'tiktok')
      .eq('channel_id', open_id)
      .maybeSingle()

    const dbError = existing
      ? (await supabase.from('channels').update(row).eq('id', existing.id)).error
      : (await supabase.from('channels').insert(row)).error

    if (dbError) {
      console.error('[tiktok-oauth] DB upsert failed:', dbError)
      return redirect('error=tiktok_db')
    }

    console.log('[tiktok-oauth] Account saved successfully for user:', user.id)

    const res = redirect('success=tiktok')
    res.cookies.delete('tiktok_oauth_state')
    return res
  } catch (err) {
    console.error('[tiktok-oauth] Unexpected error:', err)
    return redirect('error=tiktok_unexpected')
  }
}
