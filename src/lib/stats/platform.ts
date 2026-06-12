// Aggregate, public, platform-wide stats for the landing page.
//
// Uses a cookieless Supabase client (plain anon key, no `next/headers`) on
// purpose: these numbers are public and identical for every visitor, so the
// landing page can stay statically rendered / ISR instead of being forced into
// per-request dynamic rendering. The underlying RPC is SECURITY DEFINER, so the
// anon role only needs EXECUTE on it (granted in the migration).

import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

export interface PlatformStats {
  total_views: number
  total_clips: number
  total_creators: number
  has_real_data: boolean
}

const EMPTY_STATS: PlatformStats = {
  total_views: 0,
  total_clips: 0,
  total_creators: 0,
  has_real_data: false,
}

// The app is globally dynamic (middleware/i18n), so the landing page can't be
// statically prerendered. Cache the aggregate query at the data layer instead,
// so high landing traffic hits the DB at most once per minute.
const fetchStats = unstable_cache(
  async (): Promise<PlatformStats> => {
    try {
      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
      )

      const { data, error } = await supabase.rpc('get_platform_stats')
      if (error || !data) return EMPTY_STATS

      // RPC returns a json_build_object; shape matches PlatformStats.
      return data as unknown as PlatformStats
    } catch {
      // Never let the landing page fail because of a stats query.
      return EMPTY_STATS
    }
  },
  ['platform-stats'],
  { revalidate: 60, tags: ['platform-stats'] }
)

export function getPlatformStats(): Promise<PlatformStats> {
  return fetchStats()
}
