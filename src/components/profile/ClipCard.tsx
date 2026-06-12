'use client'

import { useState } from 'react'
import { Eye } from 'lucide-react'
import type { ProfileClip } from '@/lib/profile/clips'
import { formatViews } from '@/lib/utils'
import { PLATFORM_META } from '@/lib/profile'
import { PlatformIcon } from './icons/PlatformIcon'

interface ClipCardProps {
  clip: ProfileClip
  index: number
}

type ClipPlatform = 'tiktok' | 'instagram' | 'youtube'

export function ClipCard({ clip, index }: ClipCardProps) {
  const [hovered, setHovered] = useState(false)

  // Which platforms this clip was published on, in display order.
  const platforms = (
    [
      ['tiktok', clip.tiktok_url, clip.tiktok_views],
      ['instagram', clip.instagram_url, clip.instagram_views],
      ['youtube', clip.youtube_url, clip.youtube_views],
    ] as const
  )
    .filter(([, url]) => Boolean(url))
    .map(([platform, , views]) => ({ platform: platform as ClipPlatform, views }))

  return (
    <div
      className="group relative aspect-[9/16] cursor-pointer overflow-hidden bg-white/5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      {clip.thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={clip.thumbnail_url}
          alt={clip.title ?? `Clipe ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        // Placeholder until a thumbnail exists (e.g. before OAuth sync).
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white/30" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hover overlay */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 transition-opacity duration-200 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-1.5 text-white">
          <Eye size={16} className="opacity-90" />
          <span className="text-[14px] font-bold">{formatViews(clip.total_views)}</span>
        </div>

        {platforms.length > 0 && (
          <div className="mt-1 flex flex-col items-center gap-1">
            {platforms.map((p) => (
              <div key={p.platform} className="flex items-center gap-1.5 text-white/70">
                <span className="flex" style={{ color: PLATFORM_META[p.platform].color }}>
                  <PlatformIcon platform={p.platform} size={10} />
                </span>
                <span className="text-[11px]">{formatViews(p.views)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom gradient with views — visible when not hovering */}
      {clip.total_views > 0 && !hovered && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
          <div className="flex items-center gap-1 text-white">
            <Eye size={11} className="opacity-70" />
            <span className="text-[11px] font-semibold">{formatViews(clip.total_views)}</span>
          </div>
        </div>
      )}

      {/* Platform indicator dots, top-right */}
      {platforms.length > 0 && (
        <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5">
          {platforms.slice(0, 3).map((p) => (
            <div
              key={p.platform}
              className="flex h-4 w-4 items-center justify-center rounded-full bg-black/60"
            >
              <PlatformIcon platform={p.platform} size={9} className="text-white" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
