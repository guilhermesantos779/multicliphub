'use client'
import { useState } from 'react'
import { Eye } from 'lucide-react'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import type { Platform } from '@/types/api.types'

interface PlatformPreviewProps {
  videoUrl: string | null
  thumbnailUrl: string | null
  title: string
  caption: string
  hashtags: string[]
  username: string
  platforms: Platform[]
}

const PLATFORM_CONFIG: Record<Platform, { label: string; bgColor: string }> = {
  tiktok: {
    label: 'TikTok',
    bgColor: '#000000',
  },
  instagram: {
    label: 'Instagram Reels',
    bgColor: '#000000',
  },
  youtube: {
    label: 'YouTube Shorts',
    bgColor: '#0F0F0F',
  },
}

export function PlatformPreview({
  videoUrl,
  thumbnailUrl,
  title,
  caption,
  hashtags,
  username,
  platforms,
}: PlatformPreviewProps) {
  const [active, setActive] = useState<Platform>(
    platforms[0] ?? 'tiktok'
  )
  const [open, setOpen] = useState(false)

  if (platforms.length === 0) return null

  // The active tab can become stale when its platform is deselected.
  // platforms is non-empty here (guarded above), so platforms[0] is defined.
  const activePlatform = platforms.includes(active) ? active : platforms[0]!
  const config = PLATFORM_CONFIG[activePlatform]

  // Build caption with hashtags
  const fullCaption = [
    caption,
    hashtags.length > 0
      ? hashtags.map(h => `#${h}`).join(' ')
      : '',
  ].filter(Boolean).join('\n\n')

  const truncatedCaption = fullCaption.length > 80
    ? fullCaption.slice(0, 80) + '...'
    : fullCaption

  return (
    <div className="mb-6">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-semibold
          text-white/40 hover:text-white/70 transition mb-4
          group"
      >
        <Eye size={16} className="group-hover:text-[#00E5A0]
          transition" />
        {open ? 'Ocultar pré-visualização' : 'Pré-visualização por plataforma'}
      </button>

      {!open ? null : (
        <div className="rounded-2xl border border-white/[0.07]
          bg-white/[0.02] p-5">

          {/* Platform tabs */}
          <div className="flex gap-1 mb-5 p-1 bg-white/[0.04]
            rounded-xl w-fit">
            {platforms.map(p => {
              const cfg = PLATFORM_CONFIG[p]
              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => setActive(p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5
                    rounded-lg text-xs font-semibold transition-all
                    ${activePlatform === p
                      ? 'bg-white/[0.08] text-white'
                      : 'text-white/35 hover:text-white/60'
                    }`}
                >
                  <PlatformIcon platform={p} size={12} />
                  {cfg.label}
                </button>
              )
            })}
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div
              className="relative w-[220px] rounded-[32px]
                overflow-hidden border-4 border-white/10"
              style={{ backgroundColor: config.bgColor,
                aspectRatio: '9/16' }}
            >
              {/* Video/thumbnail area */}
              <div className="absolute inset-0">
                {thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : videoUrl ? (
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-full bg-white/5
                    flex items-center justify-center">
                    <span className="text-xs text-white/20">
                      Sem preview
                    </span>
                  </div>
                )}
              </div>

              {/* Platform-specific overlay UI */}
              {activePlatform === 'tiktok' && (
                <TikTokOverlay
                  username={username}
                  caption={truncatedCaption}
                />
              )}
              {activePlatform === 'instagram' && (
                <InstagramOverlay
                  username={username}
                  caption={truncatedCaption}
                />
              )}
              {activePlatform === 'youtube' && (
                <YouTubeOverlay
                  title={title || 'Título do vídeo'}
                  username={username}
                />
              )}
            </div>
          </div>

          {/* Caption preview */}
          {fullCaption && (
            <div className="mt-4 p-3 bg-white/[0.03]
              rounded-xl border border-white/[0.06]">
              <p className="text-[11px] text-white/30
                font-semibold mb-1 uppercase tracking-widest">
                Legenda completa
              </p>
              <p className="text-xs text-white/50 leading-relaxed
                whitespace-pre-line">
                {fullCaption.slice(0, 200)}
                {fullCaption.length > 200 && (
                  <span className="text-white/25">
                    {' '}...{fullCaption.length} caracteres
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── TikTok overlay UI
function TikTokOverlay({
  username,
  caption,
}: {
  username: string
  caption: string
}) {
  return (
    <div className="absolute inset-0 flex flex-col
      justify-end p-3">
      {/* Right sidebar icons */}
      <div className="absolute right-2 bottom-20 flex
        flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/10
          flex items-center justify-center text-base">
          ❤️
        </div>
        <span className="text-[9px] text-white/60">0</span>
        <div className="w-8 h-8 rounded-full bg-white/10
          flex items-center justify-center text-base">
          💬
        </div>
        <span className="text-[9px] text-white/60">0</span>
      </div>

      {/* Bottom info */}
      <div className="pr-10">
        <p className="text-xs font-bold text-white mb-1">
          @{username}
        </p>
        <p className="text-[10px] text-white/70 leading-snug
          line-clamp-2">
          {caption || 'Sua legenda aparece aqui...'}
        </p>
      </div>
    </div>
  )
}

// ── Instagram overlay UI
function InstagramOverlay({
  username,
  caption,
}: {
  username: string
  caption: string
}) {
  return (
    <div className="absolute inset-0 flex flex-col
      justify-end">
      {/* Header */}
      <div className="absolute top-3 left-3 flex items-center
        gap-1.5">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br
          from-[#E1306C] to-[#F77737]" />
        <span className="text-[10px] font-bold text-white">
          {username}
        </span>
      </div>

      {/* Bottom gradient */}
      <div className="bg-gradient-to-t from-black/80
        to-transparent p-3 pt-8">
        <p className="text-[10px] text-white/70 leading-snug
          line-clamp-2 mb-2">
          <span className="font-bold text-white">{username} </span>
          {caption || 'Sua legenda aparece aqui...'}
        </p>
        {/* Action icons */}
        <div className="flex items-center gap-3">
          <span className="text-sm">❤️</span>
          <span className="text-sm">💬</span>
          <span className="text-sm">↗️</span>
        </div>
      </div>
    </div>
  )
}

// ── YouTube overlay UI
function YouTubeOverlay({
  title,
  username,
}: {
  title: string
  username: string
}) {
  return (
    <div className="absolute inset-0 flex flex-col
      justify-end">
      {/* Progress bar */}
      <div className="absolute bottom-14 left-0 right-0
        h-0.5 bg-white/20">
        <div className="h-full w-1/3 bg-[#FF0000]" />
      </div>

      {/* Bottom info */}
      <div className="bg-gradient-to-t from-black/90
        to-transparent p-3 pt-8">
        <p className="text-[10px] font-bold text-white
          line-clamp-2 mb-1">
          {title}
        </p>
        <p className="text-[9px] text-white/50">
          @{username} · 0 visualizações
        </p>
      </div>
    </div>
  )
}
