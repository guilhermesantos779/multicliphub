import type { ReactNode } from 'react'
import type { ProfileClip } from '@/lib/profile/clips'
import { formatViews } from '@/lib/utils'
import { PLATFORM_META } from '@/lib/profile'
import { PlatformIcon } from './icons/PlatformIcon'
import { ClipCard } from './ClipCard'
import { ClipsEmptyState } from './ClipsEmptyState'

interface ClipsGridProps {
  clips: ProfileClip[]
  isOwnProfile: boolean
  username: string
}

export function ClipsGrid({ clips, isOwnProfile, username }: ClipsGridProps) {
  const tiktokViews = clips.reduce((s, c) => s + c.tiktok_views, 0)
  const instagramViews = clips.reduce((s, c) => s + c.instagram_views, 0)
  const youtubeViews = clips.reduce((s, c) => s + c.youtube_views, 0)

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-[15px] font-semibold text-white">Clipes</h2>
          {clips.length > 0 && (
            <span className="text-[13px] text-white/40">{clips.length}</span>
          )}
        </div>

        {/* Platform distribution pills — only when there's data */}
        {clips.length > 0 && (
          <div className="flex items-center gap-2">
            {tiktokViews > 0 && (
              <PlatformPill platform="tiktok" views={tiktokViews} />
            )}
            {instagramViews > 0 && (
              <PlatformPill platform="instagram" views={instagramViews} />
            )}
            {youtubeViews > 0 && (
              <PlatformPill platform="youtube" views={youtubeViews} />
            )}
          </div>
        )}
      </div>

      {/* Grid or empty state */}
      {clips.length === 0 ? (
        <ClipsEmptyState isOwnProfile={isOwnProfile} username={username} />
      ) : (
        <div className="grid grid-cols-3 gap-0.5 overflow-hidden rounded-xl sm:gap-1">
          {clips.map((clip, index) => (
            <ClipCard key={clip.id} clip={clip} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}

function PlatformPill({
  platform,
  views,
}: {
  platform: 'tiktok' | 'instagram' | 'youtube'
  views: number
}): ReactNode {
  const color = PLATFORM_META[platform].color
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
      <span className="flex shrink-0" style={{ color }}>
        <PlatformIcon platform={platform} size={12} />
      </span>
      <span className="text-[10px] font-medium text-white/50">{formatViews(views)}</span>
    </div>
  )
}
