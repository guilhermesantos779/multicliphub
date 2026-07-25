import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/crypto'

// Polls the status of a TikTok publish by publish_id and mirrors the terminal
// states into the publications row.
export async function GET(request: NextRequest) {
  const publishId = new URL(request.url).searchParams.get('publish_id')
  if (!publishId) {
    return NextResponse.json({ error: 'publish_id obrigatório' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: channel } = await supabase
      .from('channels')
      .select('access_token')
      .eq('user_id', user.id)
      .eq('platform', 'tiktok')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!channel?.access_token) {
      return NextResponse.json({ error: 'Conta TikTok não conectada' }, { status: 400 })
    }

    let accessToken: string
    try {
      accessToken = decrypt(channel.access_token)
    } catch {
      return NextResponse.json({ error: 'Falha ao ler o token da conta' }, { status: 500 })
    }

    const statusRes = await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ publish_id: publishId }),
    })
    const statusData = await statusRes.json()
    const status: string = statusData.data?.status ?? 'PROCESSING'
    console.log('[tiktok-status]', publishId, '→', status)

    // TikTok misspells this field as "publicaly_available_post_id".
    const postId: string | undefined =
      statusData.data?.publicaly_available_post_id?.[0] ?? statusData.data?.publicaly_available_post_id

    if (status === 'PUBLISH_COMPLETE') {
      await supabase
        .from('publications')
        .update({
          status: 'published',
          tiktok_url: postId ? `https://www.tiktok.com/video/${postId}` : null,
        })
        .eq('tiktok_publish_id', publishId)
        .eq('user_id', user.id)
    } else if (status === 'FAILED') {
      console.error('[tiktok-status] Failed:', statusData.data?.fail_reason)
      await supabase
        .from('publications')
        .update({ status: 'failed' })
        .eq('tiktok_publish_id', publishId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({
      publish_id: publishId,
      status,
      completed: status === 'PUBLISH_COMPLETE',
      failed: status === 'FAILED',
      fail_reason: statusData.data?.fail_reason ?? null,
      tiktok_post_id: postId ?? null,
    })
  } catch (err) {
    console.error('[tiktok-status] Error:', err)
    return NextResponse.json({ error: 'Erro ao verificar status' }, { status: 500 })
  }
}
