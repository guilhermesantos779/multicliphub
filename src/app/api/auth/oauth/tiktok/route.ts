import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Starts the TikTok OAuth flow: builds the authorize URL and stores a CSRF
// `state` in an httpOnly cookie that the callback verifies.
export async function GET(request: NextRequest) {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_ID ?? process.env.TIKTOK_CLIENT_KEY
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI

  if (!CLIENT_KEY || !REDIRECT_URI) {
    console.error('[tiktok-oauth] Missing env vars:', {
      hasClientKey: !!CLIENT_KEY,
      hasRedirectUri: !!REDIRECT_URI,
    })
    return NextResponse.redirect(new URL('/canais?error=tiktok_config', request.url))
  }

  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    client_key: CLIENT_KEY,
    scope: 'user.info.basic,video.upload,video.publish',
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state,
  })

  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`

  const response = NextResponse.redirect(authUrl)
  // SameSite=None + Secure: the cookie must survive the cross-site redirect
  // back from tiktok.com. With Lax it can be dropped on the return navigation,
  // which surfaced as a "state mismatch" in the callback.
  response.cookies.set('tiktok_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  })

  return response
}
