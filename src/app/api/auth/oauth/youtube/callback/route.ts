import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/lib/crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.multicliphub.com.br'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')

  const redirect = (query: string) =>
    NextResponse.redirect(`${APP_URL}/canais?${query}`)

  if (error) {
    console.error('[youtube-oauth] Denied:', error)
    return redirect('error=youtube_denied')
  }
  if (!code) {
    return redirect('error=youtube_invalid')
  }

  const cookieStore = await cookies()
  const storedState = cookieStore.get('youtube_oauth_state')?.value
  if (!storedState) {
    console.warn('[youtube-oauth] State cookie missing — proceeding with caution')
  } else if (storedState !== stateParam) {
    console.error('[youtube-oauth] State mismatch')
    return redirect('error=youtube_state')
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.redirect(`${APP_URL}/login?redirect=/canais`)
    }

    // Exchange authorization code for tokens.
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.YOUTUBE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })
    const tokenData = await tokenRes.json()
    console.log('[youtube-oauth] Token status:', tokenRes.status)

    if (tokenData.error || !tokenData.access_token) {
      console.error('[youtube-oauth] Token exchange failed:', tokenData.error)
      return redirect('error=youtube_token')
    }

    const { access_token, refresh_token, expires_in } = tokenData

    // Fetch the connected YouTube channel info.
    const channelRes = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=id,snippet&mine=true',
      { headers: { Authorization: `Bearer ${access_token}` } }
    )
    const channelData = await channelRes.json()
    const ytChannel = channelData?.items?.[0]

    if (!ytChannel) {
      console.error('[youtube-oauth] No YouTube channel found:', channelData)
      return redirect('error=youtube_no_channel')
    }

    const channelId: string = ytChannel.id
    const channelName: string = ytChannel.snippet?.title ?? `YouTube (${channelId.slice(0, 8)})`
    console.log('[youtube-oauth] Channel:', channelName, channelId)

    // Use admin client (service_role) to bypass RLS — identity already verified.
    const admin = createAdminClient()

    const row = {
      user_id: user.id,
      platform: 'youtube' as const,
      channel_name: channelName,
      channel_id: channelId,
      access_token: encrypt(access_token),
      refresh_token: refresh_token ? encrypt(refresh_token) : null,
      expires_at: new Date(Date.now() + (expires_in ?? 3600) * 1000).toISOString(),
      is_active: true,
    }

    const { data: existing } = await admin
      .from('channels')
      .select('id')
      .eq('user_id', user.id)
      .eq('platform', 'youtube')
      .eq('channel_id', channelId)
      .maybeSingle()

    const { error: dbError } = existing
      ? await admin.from('channels').update(row).eq('id', existing.id)
      : await admin.from('channels').insert(row)

    if (dbError) {
      console.error('[youtube-oauth] DB upsert failed:', dbError)
      return redirect('error=youtube_db')
    }

    console.log('[youtube-oauth] Channel saved:', channelName, 'for user', user.id)

    const res = redirect('success=youtube')
    res.cookies.delete('youtube_oauth_state')
    return res
  } catch (err) {
    console.error('[youtube-oauth] Unexpected error:', err)
    return redirect('error=youtube_unexpected')
  }
}
