// Data layer for the public-profile clips grid. Reads from the `publications`
// table (rich per-platform schema). Built so that, once OAuth sync starts
// writing real rows, the profile grid fills in with zero code changes here.

import { createClient } from '@/lib/supabase/server'

// NOTE: this module imports the server-only Supabase client (next/headers), so
// it must never be imported as a *value* from a Client Component. Client
// components import `ProfileClip` type-only and pull `formatViews` from
// '@/lib/utils' directly.

export interface ProfileClip {
  id: string
  title: string | null
  thumbnail_url: string | null
  total_views: number
  total_likes: number
  tiktok_url: string | null
  instagram_url: string | null
  youtube_url: string | null
  tiktok_views: number
  instagram_views: number
  youtube_views: number
  published_at: string | null
}

export async function getProfileClips(
  userId: string,
  limit = 18
): Promise<ProfileClip[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('publications')
    .select(
      `id, title, thumbnail_url, total_views, total_likes,
       tiktok_url, instagram_url, youtube_url,
       tiktok_views, instagram_views, youtube_views, published_at`
    )
    .eq('user_id', userId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getProfileClips]', error)
    return []
  }

  // Columns are nullable in the DB (defaults to 0); normalize to numbers so the
  // UI never has to guard against null counters.
  return (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    thumbnail_url: c.thumbnail_url,
    total_views: c.total_views ?? 0,
    total_likes: c.total_likes ?? 0,
    tiktok_url: c.tiktok_url,
    instagram_url: c.instagram_url,
    youtube_url: c.youtube_url,
    tiktok_views: c.tiktok_views ?? 0,
    instagram_views: c.instagram_views ?? 0,
    youtube_views: c.youtube_views ?? 0,
    published_at: c.published_at,
  }))
}

export function hasAnyClips(clips: ProfileClip[]): boolean {
  return clips.length > 0
}

export function hasPlatformConnected(clips: ProfileClip[]): boolean {
  return clips.some((c) => c.tiktok_url || c.instagram_url || c.youtube_url)
}
