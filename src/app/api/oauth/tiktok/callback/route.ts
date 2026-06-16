import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const redirect = (query: string) =>
    NextResponse.redirect(new URL(`/canais?${query}`, request.url))

  // TikTok denied / returned an error.
  if (error) {
    console.error('[tiktok-oauth] Error from TikTok:', error)
    return redirect('error=tiktok_denied')
  }

  if (!code || !state) {
    return redirect('error=tiktok_invalid')
  }

  // CSRF: state must match the cookie set when the flow started.
  const cookieStore = await cookies()
  const storedState = cookieStore.get('tiktok_oauth_state')?.value
  if (!storedState || storedState !== state) {
    console.warn('[tiktok-oauth] State mismatch (possible CSRF)')
    return redirect('error=tiktok_state')
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/canais', request.url))
    }

    // Exchange the authorization code for tokens.
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY!,
        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
      }),
    })
    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || tokenData.error) {
      console.error('[tiktok-oauth] Token exchange failed:', tokenData?.error ?? tokenResponse.status)
      return redirect('error=tiktok_token')
    }

    // NOTE: tokens are intentionally NOT persisted yet. Token storage +
    // AES-256-GCM encryption are part of the OAuth milestone. Writing plaintext
    // access/refresh tokens now is exactly the risk flagged in the audit, and the
    // destination table does not exist. The exchange above proves the flow works.
    // TODO(oauth-milestone): encrypt { access_token, refresh_token, open_id,
    //   expires_in } and upsert into the tokens table.

    const res = redirect('success=tiktok')
    res.cookies.delete('tiktok_oauth_state')
    return res
  } catch (err) {
    console.error('[tiktok-oauth] Unexpected error:', err)
    return redirect('error=tiktok_unexpected')
  }
}
