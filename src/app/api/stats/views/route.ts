import { NextResponse } from 'next/server'
import { getPlatformStats } from '@/lib/stats/platform'

// Public, cacheable aggregate stats endpoint. Not consumed by the landing page
// (which fetches server-side), but available for client polling / external use.
export const revalidate = 60

export async function GET() {
  // getPlatformStats already swallows errors and returns empty stats, so the
  // endpoint never 500s on the stats query.
  const stats = await getPlatformStats()

  return NextResponse.json(stats, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
