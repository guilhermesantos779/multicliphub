import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Starts the YouTube OAuth flow using Google OAuth 2.0.
// Requests offline access (refresh_token) so the token can be refreshed
// server-side without requiring the user to re-authorize.
// Required scope: youtube.upload (post videos) + youtube.readonly (channel info).
export async function GET(request: NextRequest) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const REDIRECT_URI = process.env.YOUTUBE_REDIRECT_URI

  if (!CLIENT_ID || !REDIRECT_URI) {
    console.error('[youtube-oauth] Missing env vars:', {
      hasClientId: !!CLIENT_ID,
      hasRedirectUri: !!REDIRECT_URI,
    })
    return NextResponse.redirect(new URL('/canais?error=youtube_config', request.url))
  }

  const state = crypto.randomBytes(16).toString('hex')

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  })

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  const response = NextResponse.redirect(authUrl)
  response.cookies.set('youtube_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 15,
    path: '/',
  })

  return response
}
