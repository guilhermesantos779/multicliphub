import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// ─── GET — Meta webhook verification challenge ───────────────
// Meta sends a GET with hub.challenge when you click
// "Verificar e salvar" in the developer dashboard.
// We must echo back hub.challenge as plain text if the token matches.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN

  if (mode === 'subscribe' && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    console.log('[instagram-webhook] Verification successful')
    return new NextResponse(challenge ?? '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  console.warn('[instagram-webhook] Verification failed', {
    mode,
    tokenMatch: token === VERIFY_TOKEN,
    hasVerifyToken: Boolean(VERIFY_TOKEN),
  })
  return new NextResponse('Forbidden', { status: 403 })
}

// ─── POST — Receive real-time events from Meta ────────────────
// Meta sends POST requests for events like media publish status,
// comments, or story mentions. For now we validate the signature
// and log; full processing comes after OAuth + App Review.
export async function POST(request: NextRequest) {
  // The Meta "App Secret" in this project is stored as INSTAGRAM_CLIENT_SECRET
  // (INSTAGRAM_CLIENT_ID is the Meta App ID). Fall back to META_APP_SECRET in
  // case it is ever configured under that name.
  const APP_SECRET =
    process.env.INSTAGRAM_CLIENT_SECRET ?? process.env.META_APP_SECRET
  const body = await request.text()

  // Validate Meta's X-Hub-Signature-256 header (HMAC-SHA256 of the raw body).
  const signature = request.headers.get('x-hub-signature-256')

  if (APP_SECRET && signature) {
    const expected =
      'sha256=' +
      crypto.createHmac('sha256', APP_SECRET).update(body).digest('hex')

    // Constant-time comparison to avoid timing attacks.
    const sigBuf = Buffer.from(signature)
    const expBuf = Buffer.from(expected)
    const valid =
      sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)

    if (!valid) {
      console.warn('[instagram-webhook] Invalid signature')
      return new NextResponse('Invalid signature', { status: 401 })
    }
  }

  try {
    const payload = JSON.parse(body)
    console.log('[instagram-webhook] Event received:', {
      object: payload.object,
      entries: payload.entry?.length ?? 0,
    })

    // TODO: handle specific events once OAuth is active, e.g.
    //   payload.object === 'instagram'
    //   payload.entry[].changes[].field === 'media' (publish status)
  } catch (e) {
    console.error('[instagram-webhook] Parse error:', e)
  }

  // Always return 200 quickly — Meta retries on non-2xx responses.
  return new NextResponse('OK', { status: 200 })
}
