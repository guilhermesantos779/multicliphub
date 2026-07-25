import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/crypto'
import { parseBody } from '@/lib/schemas'

// Publishes a video to TikTok via the Content Posting API using FILE_UPLOAD:
// the server downloads the clip from Supabase Storage and streams the bytes
// straight to TikTok. PULL_FROM_URL is NOT usable here because TikTok requires
// the video URL's domain to be a verified property, and *.supabase.co is not.
// Unaudited sandbox apps can only post as SELF_ONLY (private, visible in Studio).

const MAX_SINGLE_CHUNK = 64 * 1024 * 1024 // 64MB — single-chunk upload limit

const publishSchema = z.object({
  video_url: z.string().url('URL do vídeo inválida'),
  title: z.string().max(150).optional().default(''),
  caption: z.string().max(2200).optional().default(''),
  hashtags: z.array(z.string()).max(30).optional().default([]),
  privacy_level: z
    .enum(['PUBLIC_TO_EVERYONE', 'MUTUAL_FOLLOW_FRIENDS', 'FOLLOWER_OF_CREATOR', 'SELF_ONLY'])
    .optional()
    .default('SELF_ONLY'),
  comment_disabled: z.boolean().optional().default(false),
  duet_disabled: z.boolean().optional().default(false),
  stitch_disabled: z.boolean().optional().default(false),
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

    // Most recent active TikTok channel for this user.
    const { data: channel } = await supabase
      .from('channels')
      .select('access_token, expires_at')
      .eq('user_id', user.id)
      .eq('platform', 'tiktok')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!channel?.access_token) {
      return NextResponse.json({ error: 'Conta TikTok não conectada' }, { status: 400 })
    }
    if (channel.expires_at && new Date(channel.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token TikTok expirado — reconecte a conta' }, { status: 401 })
    }

    let accessToken: string
    try {
      accessToken = decrypt(channel.access_token)
    } catch (e) {
      console.error('[tiktok-publish] Token decrypt failed:', e)
      return NextResponse.json({ error: 'Falha ao ler o token da conta' }, { status: 500 })
    }

    // Download the clip bytes from Storage (single-chunk upload only for now).
    const videoRes = await fetch(data.video_url)
    if (!videoRes.ok) {
      console.error('[tiktok-publish] Video download failed:', videoRes.status)
      return NextResponse.json({ error: 'Não foi possível baixar o vídeo' }, { status: 400 })
    }
    const videoBuffer = Buffer.from(await videoRes.arrayBuffer())
    const videoSize = videoBuffer.length

    if (videoSize > MAX_SINGLE_CHUNK) {
      return NextResponse.json(
        { error: 'Vídeo acima de 64MB ainda não suportado (upload em chunks pendente)' },
        { status: 413 }
      )
    }

    // Compose the description: caption + hashtags.
    const hashtagsText = data.hashtags.length
      ? '\n\n' + data.hashtags.map((h) => `#${h.replace(/^#/, '')}`).join(' ')
      : ''
    const fullCaption = (data.caption + hashtagsText).trim().slice(0, 2200)

    // 1) Initialize the upload.
    console.log('[tiktok-publish] Init FILE_UPLOAD, size:', videoSize)
    const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        post_info: {
          // TikTok uses `title` as the post caption — it must carry the
          // caption + hashtags (not the short internal title), up to 2200 chars.
          title: (fullCaption || data.title || 'MultiClip Hub').slice(0, 2200),
          privacy_level: data.privacy_level,
          disable_comment: data.comment_disabled,
          disable_duet: data.duet_disabled,
          disable_stitch: data.stitch_disabled,
          video_cover_timestamp_ms: 1000,
        },
        source_info: {
          source: 'FILE_UPLOAD',
          video_size: videoSize,
          chunk_size: videoSize,
          total_chunk_count: 1,
        },
      }),
    })
    const initData = await initRes.json()
    console.log('[tiktok-publish] Init response:', JSON.stringify(initData?.error ?? initData))

    if (initData.error?.code !== 'ok') {
      return NextResponse.json(
        { error: 'Falha ao iniciar publicação no TikTok', details: initData.error },
        { status: 400 }
      )
    }

    const publishId: string | undefined = initData.data?.publish_id
    const uploadUrl: string | undefined = initData.data?.upload_url
    if (!publishId || !uploadUrl) {
      return NextResponse.json({ error: 'Resposta de init incompleta do TikTok' }, { status: 400 })
    }
    console.log('[tiktok-publish] Publish ID:', publishId)

    // 2) Upload the bytes to the URL TikTok handed us.
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': String(videoSize),
        'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
      },
      body: videoBuffer,
    })
    if (!putRes.ok) {
      console.error('[tiktok-publish] Byte upload failed:', putRes.status)
      return NextResponse.json({ error: 'Falha ao enviar o vídeo para o TikTok' }, { status: 400 })
    }
    console.log('[tiktok-publish] Bytes uploaded, status:', putRes.status)

    // 3) Record the publication (non-blocking — the post is already in flight).
    const { error: dbError } = await supabase.from('publications').insert({
      user_id: user.id,
      title: (data.title || fullCaption || 'TikTok').slice(0, 200),
      description: fullCaption,
      status: 'publishing',
      tiktok_publish_id: publishId,
      published_at: new Date().toISOString(),
    })
    if (dbError) console.error('[tiktok-publish] DB insert failed (non-blocking):', dbError)

    return NextResponse.json({
      success: true,
      publish_id: publishId,
      message: 'Publicação iniciada — aguardando processamento do TikTok',
    })
  } catch (err) {
    console.error('[tiktok-publish] Unexpected error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
