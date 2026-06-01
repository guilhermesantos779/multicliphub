'use client'

import type { ReactNode, CSSProperties } from 'react'
import { normalizePlan } from '@/lib/profile'

interface ProfileFrameProps {
  plan: string | null | undefined
  size?: number
  // 'full' = profile page (sparkles, pulse, strong glow)
  // 'compact' = dashboard (calm: reduced glow, no sparkles/pulse/badge)
  variant?: 'full' | 'compact'
  children: ReactNode // the avatar image / fallback
  className?: string
}

// Flat-top hexagon — matches the achievement badge silhouette for cohesion
const HEX = 'polygon(27.5% 10%, 72.5% 10%, 95% 50%, 72.5% 90%, 27.5% 90%, 5% 50%)'

export function ProfileFrame({
  plan,
  size = 96,
  variant = 'full',
  children,
  className,
}: ProfileFrameProps) {
  const tier = normalizePlan(plan)
  const compact = variant === 'compact'

  // ── Free / trial: simple circle ring, no glow (same in both variants) ────
  if (tier === 'trial') {
    return (
      <div className={className} style={{ width: size, height: size, position: 'relative' }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.20)',
            background: '#000',
          }}
        >
          {children}
        </div>
      </div>
    )
  }

  const isKing = tier === 'king'
  const pad = isKing ? Math.max(3, size * 0.035) : Math.max(2, size * 0.026)

  const rimStyle: CSSProperties = isKing
    ? {
        background: 'linear-gradient(45deg, #9146FF, #00E5A0, #9146FF, #00E5A0)',
        backgroundSize: '400% 400%',
        // Calmer ring in compact: slower border flow
        animation: `borderFlow ${compact ? 12 : 8}s ease infinite`,
      }
    : { background: '#9146FF' }

  // Reduced glow in compact so it doesn't compete with the shader background
  const glow = compact
    ? isKing
      ? '0 0 8px rgba(145,70,255,0.4)'
      : '0 0 6px rgba(145,70,255,0.35)'
    : isKing
      ? `0 0 ${size * 0.22}px rgba(145,70,255,0.6)`
      : `0 0 ${size * 0.13}px rgba(145,70,255,0.45)`

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      {/* Hex rim (with glow that follows the clipped shape) */}
      <div style={{ width: size, height: size, clipPath: HEX, padding: pad, filter: `drop-shadow(${glow})`, ...rimStyle }}>
        <div style={{ position: 'relative', width: '100%', height: '100%', clipPath: HEX, overflow: 'hidden', background: '#000' }}>
          {children}
          {/* Inner vignette so the avatar pops */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
            }}
          />
        </div>
      </div>

      {/* Plan badge — full variant only (too small/noisy in compact) */}
      {!compact && (
        <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          {isKing ? (
            <span
              className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold text-black"
              style={{ background: 'linear-gradient(45deg, #9146FF, #00E5A0)', animation: 'kingPulse 2.2s ease-in-out infinite' }}
            >
              👑 KING
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[#9146FF] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              {tier === 'pro' ? 'Pro' : 'Clipper'}
            </span>
          )}
        </div>
      )}

      {/* Sparkles at hex points — King + full variant only */}
      {isKing && !compact && (
        <>
          <Sparkle style={{ top: '4%', left: '47%' }} delay="0s" color="#00E5A0" />
          <Sparkle style={{ top: '47%', right: '0%' }} delay="0.5s" color="#9146FF" />
          <Sparkle style={{ top: '47%', left: '0%' }} delay="1s" color="#00E5A0" />
          <Sparkle style={{ bottom: '14%', right: '20%' }} delay="1.5s" color="#9146FF" />
        </>
      )}
    </div>
  )
}

function Sparkle({ style, delay, color }: { style: CSSProperties; delay: string; color: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
        animation: `kingSparkle 1.8s ease-in-out ${delay} infinite`,
        ...style,
      }}
    />
  )
}
