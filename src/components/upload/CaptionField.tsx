'use client'
import { useState } from 'react'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import type { Platform } from '@/types/api.types'

export type CaptionValue = string | Record<Platform, string>

interface CaptionFieldProps {
  platforms: Platform[]
  value: CaptionValue
  onChange: (v: CaptionValue) => void
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  tiktok:    2200,
  instagram: 2200,
  youtube:   5000,
}

const PLATFORM_LABELS: Record<Platform, string> = {
  tiktok:    'TikTok',
  instagram: 'Instagram Reels',
  youtube:   'YouTube Shorts',
}

export function CaptionField({ platforms, value, onChange }: CaptionFieldProps) {
  const [perPlatform, setPerPlatform] = useState(false)
  const [activeTab, setActiveTab] = useState<Platform>(platforms[0] ?? 'tiktok')

  const isString = typeof value === 'string'

  function handleToggle() {
    if (!perPlatform) {
      // Convert unified to per-platform (copy unified to all)
      const current = isString ? value : ''
      const perP = Object.fromEntries(
        platforms.map(p => [p, current])
      ) as Record<Platform, string>
      onChange(perP)
    } else {
      // Convert back to unified (use first platform's text)
      const firstPlatform = platforms[0]
      const first = (!isString && firstPlatform) ? value[firstPlatform] ?? '' : ''
      onChange(first)
    }
    setPerPlatform(!perPlatform)
  }

  function getCaption(platform: Platform): string {
    if (isString) return value
    return value[platform] ?? ''
  }

  function updatePlatformCaption(platform: Platform, text: string) {
    if (isString) return
    onChange({ ...value, [platform]: text })
  }

  const currentLimit = perPlatform ? PLATFORM_LIMITS[activeTab] : 2200
  const currentLength = perPlatform
    ? getCaption(activeTab).length
    : (isString ? value.length : 0)

  return (
    <div className="mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-[11px] font-bold tracking-widest
          uppercase text-white/40">
          Legenda / Caption
        </label>

        {/* Toggle per-platform */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-2 group"
        >
          <span className="text-[11px] text-white/30
            group-hover:text-white/50 transition">
            {perPlatform
              ? 'Usar legenda única'
              : 'Personalizar por plataforma'}
          </span>
          <div className={`w-8 h-4 rounded-full transition-colors
            relative ${perPlatform
              ? 'bg-[#00E5A0]'
              : 'bg-white/15'
            }`}>
            <div className={`absolute top-0.5 w-3 h-3
              bg-white rounded-full transition-transform
              ${perPlatform
                ? 'translate-x-4'
                : 'translate-x-0.5'
              }`} />
          </div>
        </button>
      </div>

      {/* Platform tabs (only when per-platform is on) */}
      {perPlatform && (
        <div className="flex flex-wrap gap-1 mb-2">
          {platforms.map(p => {
            const len = getCaption(p).length
            const over = len > PLATFORM_LIMITS[p]
            return (
              <button
                type="button"
                key={p}
                onClick={() => setActiveTab(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5
                  rounded-lg text-xs font-semibold transition-all
                  ${activeTab === p
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/35 hover:text-white/60'
                  } ${over ? 'text-red-400' : ''}`}
              >
                <PlatformIcon platform={p} size={14} />
                {PLATFORM_LABELS[p]}
                {over && (
                  <span className="text-red-400 font-bold">!</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={perPlatform ? getCaption(activeTab) : (isString ? value : '')}
          onChange={e => {
            if (perPlatform) {
              updatePlatformCaption(activeTab, e.target.value)
            } else {
              onChange(e.target.value)
            }
          }}
          placeholder={
            perPlatform
              ? `Legenda para ${PLATFORM_LABELS[activeTab]}...`
              : 'Escreva a legenda que será usada em todas as plataformas...'
          }
          rows={4}
          className="w-full bg-white/[0.04] border border-white/[0.08]
            rounded-xl px-4 py-3 text-sm text-white
            placeholder:text-white/20 outline-none resize-none
            focus:border-[#00E5A0]/30 transition"
        />

        {/* Character counter */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-[10px] font-mono ${
            currentLength > currentLimit
              ? 'text-red-400'
              : 'text-white/20'
          }`}>
            {currentLength}/{currentLimit}
          </span>
        </div>
      </div>

      {/* Per-platform hint */}
      {!perPlatform && platforms.length > 1 && (
        <p className="mt-1.5 text-[11px] text-white/25">
          Mesma legenda para todas as plataformas.
          Ative &quot;Personalizar por plataforma&quot; para
          escrever textos diferentes.
        </p>
      )}
    </div>
  )
}
