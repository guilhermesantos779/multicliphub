import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/crypto'
import { parseBody } from '@/lib/schemas'

// Instagram Reels publishing via Content Publishing API.
// Flow: create a media container (REELS type) → client polls /status until
// FINISHED → publishes. The video_url must be a publicly accessible HTTPS URL.
// Required scope: instagram_business_content_publish (already in OAuth flow).

const publishSchema = z.object({
  video_url: z.string().url('URL do vídeo inválida'),
  caption: z.string().max(2200).optional().default(''),
  hashtags: z.array(z.string()).max(30).optional().default([]),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const parsed = await parseBody(request, publishSchema)
    if (!parsed.success) return parsed.error
    const data = parsed.data

    const { data: channel } = await supabase
      .from('channels')
      .select('access_token, channel_id, expires_at')
      .eq('user_id', user.id)
      .eq('platform', 'instagram')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!channel?.access_token || !channel?.channel_id) {
      return NextResponse.json({ error: 'Conta Instagram não conectada' }, { status: 400 })
    }

    if (channel.expires_at && new Date(channel.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token Instagram expirado — reconecte a conta' }, { status: 401 })
    }

    let accessToken: string
    try {
      accessToken = decrypt(channel.access_token)
    } catch (e) {
      console.error('[instagram-publish] Token decrypt failed:', e)
      return NextResponse.json({ error: 'Falha ao ler o token da conta' }, { status: 500 })
    }

    const igUserId = channel.channel_id

    const hashtagsText = data.hashtags.length
      ? '\n\n' + data.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' ')
      : ''
    const fullCaption = (data.caption + hashtagsText).trim().slice(0, 2200)

    // Create the Reels media container.
    const containerBody = new URLSearchParams({
      media_type: 'REELS',
      video_url: data.video_url,
      caption: fullCaption,
      share_to_feed: 'true',
      access_token: accessToken,
    })

    console.log('[instagram-publish] Creating container for user:', igUserId)
    const containerRes = await fetch(
      `https://graph.instagram.com/v21.0/${igUserId}/media`,
      { method: 'POST', body: containerBody }
    )
    const containerData = await containerRes.json()
    console.log('[instagram-publish] Container response:', JSON.stringify(containerData))

    if (!containerData.id) {
      const igError = containerData.error
      console.error('[instagram-publish] Container creation failed:', igError)
      return NextResponse.json(
        { error: 'Falha ao criar container de mídia', details: igError },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      container_id: containerData.id,
    })
  } catch (err) {
    console.error('[instagram-publish] Unexpected error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
