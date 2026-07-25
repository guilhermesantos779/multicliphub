import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Admin client (service role) — bypasses RLS to revoke tokens and write the
// audit log. Created lazily INSIDE the handler: instantiating it at module
// scope runs during `next build` page-data collection (where env may be
// absent) and throws "supabaseUrl is required", failing the build.
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://multicliphub.com.br'

// In this project the Meta "App Secret" is stored as INSTAGRAM_CLIENT_SECRET
// (INSTAGRAM_CLIENT_ID is the Meta App ID).
const APP_SECRET =
  process.env.INSTAGRAM_CLIENT_SECRET ?? process.env.META_APP_SECRET

// ─── POST — Meta sends a signed data-deletion request ─────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const params = new URLSearchParams(body)
    const signedRequest = params.get('signed_request')

    if (!signedRequest) {
      return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 })
    }

    const [encodedSig, payload] = signedRequest.split('.')
    if (!encodedSig || !payload || !APP_SECRET) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Verify Meta's signature (HMAC-SHA256, base64url).
    const expectedSig = crypto
      .createHmac('sha256', APP_SECRET)
      .update(payload)
      .digest('base64url')

    const sigBuf = Buffer.from(encodedSig)
    const expBuf = Buffer.from(expectedSig)
    const validSig =
      sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)

    if (!validSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const metaUserId: string | undefined = data.user_id

    const confirmationCode = crypto.randomBytes(16).toString('hex')

    const supabaseAdmin = getAdminClient()

    // Best-effort revoke: find the Instagram channel linked to this Meta user
    // and delete it. channel_id stores the platform account id.
    let resolvedUserId: string | null = null
    if (metaUserId) {
      const { data: channel } = await supabaseAdmin
        .from('channels')
        .select('user_id')
        .eq('platform', 'instagram')
        .eq('channel_id', metaUserId)
        .maybeSingle()

      resolvedUserId = channel?.user_id ?? null

      if (resolvedUserId) {
        await supabaseAdmin
          .from('channels')
          .delete()
          .eq('user_id', resolvedUserId)
          .eq('platform', 'instagram')
      }
    }

    await supabaseAdmin.from('data_deletion_requests').insert({
      platform: 'meta',
      platform_user_id: metaUserId ?? 'unknown',
      user_id: resolvedUserId,
      confirmation_code: confirmationCode,
      status: 'completed',
    })

    // Meta requires exactly this response shape.
    return NextResponse.json({
      url: `${APP_URL}/privacidade#exclusao-de-dados`,
      confirmation_code: confirmationCode,
    })
  } catch (error) {
    console.error('[data-deletion]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// ─── GET — human-readable status page (linked from the response) ──
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  // Meta validates this URL with a plain GET and expects a 200 — a redirect
  // (307) is rejected. Serve a human-readable info page instead of redirecting.
  if (!code) {
    return new NextResponse(
      `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Exclusão de dados — MultiClip Hub</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0B0F19; color: #fff;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 40px; max-width: 480px; text-align: center; }
    h1 { color: #00E5A0; font-size: 1.5rem; margin-bottom: 12px; }
    p { color: rgba(255,255,255,0.6); line-height: 1.6; }
    a { color: #00E5A0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Exclusão de dados</h1>
    <p>Este é o endpoint de exclusão de dados do MultiClip Hub. Para solicitar a
    remoção dos seus dados, remova o app nas configurações do Instagram/Meta ou
    escreva para <a href="mailto:privacidademulticliphub@gmail.com">privacidademulticliphub@gmail.com</a>.</p>
    <p style="margin-top:16px">Saiba mais na nossa <a href="/privacidade">Política de Privacidade</a>.</p>
  </div>
</body>
</html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Solicitação de exclusão — MultiClip Hub</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0B0F19; color: #fff;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px; padding: 40px; max-width: 480px; text-align: center; }
    h1 { color: #00E5A0; font-size: 1.5rem; margin-bottom: 12px; }
    p { color: rgba(255,255,255,0.6); line-height: 1.6; }
    code { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px;
      font-size: 0.9rem; color: #00E5A0; word-break: break-all; }
    a { color: #00E5A0; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Exclusão de dados processada</h1>
    <p>Seus dados vinculados ao Instagram foram removidos do MultiClip Hub.</p>
    <p style="margin-top:16px">Código de confirmação:<br /><code>${escapeHtml(code)}</code></p>
    <p style="margin-top:16px">Dúvidas? <a href="mailto:privacidademulticliphub@gmail.com">privacidademulticliphub@gmail.com</a></p>
  </div>
</body>
</html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

// Prevent reflected-XSS via the `code` query param in the HTML response.
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      default: return '&#39;'
    }
  })
}
