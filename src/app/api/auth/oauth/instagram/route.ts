import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Starts the Instagram OAuth flow using "Instagram API with Instagram Login"
// (Business Login). Scopes instagram_business_basic / _content_publish belong to
// this flow — it does NOT use facebook.com/dialog/oauth or Facebook Pages.
// Project convention (see data-deletion route): INSTAGRAM_CLIENT_ID is the app
// id and INSTAGRAM_CLIENT_SECRET the app secret.
export async function GET(request: NextRequest) {
  const APP_ID = process.env.INSTAGRAM_CLIENT_ID
  const REDIRECT_URI = process.env.INSTAGRAM_REDIRECT_URI

  if (!APP_ID || !REDIRECT_URI) {
    console.error('[instagram-oauth] Missing env vars:', {
      hasAppId: !!APP_ID,
      hasRedirectUri: !!REDIRECT_URI,
    })
    return NextResponse.redirect(new URL('/canais?error=instagram_config', request.url))
  }

  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    client_id: APP_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'instagram_business_basic,instagram_business_content_publish',
    state,
  })

  const authUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`

  const response = NextResponse.redirect(authUrl)
  // SameSite=None + Secure so the CSRF state cookie survives the cross-site
  // redirect back from instagram.com.
  response.cookies.set('instagram_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  })

  return response
}
