import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Starts the TikTok OAuth flow: builds the authorize URL and stores a CSRF
// `state` in an httpOnly cookie that the callback verifies.
export async function GET() {
  const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY!
  const REDIRECT_URI = process.env.TIKTOK_REDIRECT_URI!

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
  response.cookies.set('tiktok_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes
    path: '/',
  })

  return response
}
