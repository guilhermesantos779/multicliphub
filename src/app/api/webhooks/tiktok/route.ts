import { NextRequest, NextResponse } from 'next/server'

// GET — TikTok webhook verification.
// TikTok sends a `challenge` query param to confirm the endpoint is reachable
// and that we own it; we must echo it back as plain text with a 200.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const challenge = searchParams.get('challenge')

  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  return new NextResponse('OK', { status: 200 })
}

// POST — TikTok webhook events.
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Debug log while OAuth is not yet live; trim to avoid noisy output.
    console.log('[tiktok-webhook] Event received:', body.slice(0, 200))

    // TODO(oauth-milestone): process events once token persistence is live.
    // Event types include video.publish_complete and video.publish_failed.

    // Always respond 200 quickly — TikTok treats > 5s as a failure.
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[tiktok-webhook] Error:', error)
    // Return 200 even on error to avoid a retry storm.
    return new NextResponse('OK', { status: 200 })
  }
}
