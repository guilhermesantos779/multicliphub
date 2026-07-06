import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/crypto'

// Checks the media container status and, when FINISHED, publishes it.
// container_id comes from the POST /api/publish/instagram response.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const containerId = searchParams.get('container_id')

  if (!containerId) {
    return NextResponse.json({ error: 'container_id obrigatório' }, { status: 400 })
  }

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const { data: channel } = await supabase
      .from('channels')
      .select('access_token, channel_id')
      .eq('user_id', user.id)
      .eq('platform', 'instagram')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!channel?.access_token || !channel?.channel_id) {
      return NextResponse.json({ error: 'Conta Instagram não encontrada' }, { status: 400 })
    }

    let accessToken: string
    try {
      accessToken = decrypt(channel.access_token)
    } catch {
      return NextResponse.json({ error: 'Falha ao ler token' }, { status: 500 })
    }

    const igUserId = channel.channel_id

    // Poll container status.
    const statusRes = await fetch(
      `https://graph.instagram.com/v21.0/${containerId}?fields=status_code,status&access_token=${accessToken}`
    )
    const statusData = await statusRes.json()
    console.log('[instagram-status] Container status:', JSON.stringify(statusData))

    const statusCode: string = statusData.status_code ?? ''

    if (statusCode === 'ERROR' || statusCode === 'EXPIRED') {
      return NextResponse.json({
        completed: false,
        failed: true,
        fail_reason: statusData.status ?? statusCode,
      })
    }

    if (statusCode === 'FINISHED') {
      // Container is ready — publish it.
      const publishRes = await fetch(
        `https://graph.instagram.com/v21.0/${igUserId}/media_publish`,
        {
          method: 'POST',
          body: new URLSearchParams({
            creation_id: containerId,
            access_token: accessToken,
          }),
        }
      )
      const publishData = await publishRes.json()
      console.log('[instagram-status] Publish response:', JSON.stringify(publishData))

      if (!publishData.id) {
        const igError = publishData.error
        console.error('[instagram-status] Publish failed:', igError)
        return NextResponse.json({
          completed: false,
          failed: true,
          fail_reason: igError?.message ?? 'Falha ao publicar o Reel',
        })
      }

      return NextResponse.json({
        completed: true,
        failed: false,
        ig_media_id: publishData.id,
      })
    }

    // IN_PROGRESS or unknown — still processing.
    return NextResponse.json({ completed: false, failed: false, status: statusCode || 'IN_PROGRESS' })
  } catch (err) {
    console.error('[instagram-status] Unexpected error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
