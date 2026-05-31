'use client'

import type { ReactNode, CSSProperties } from 'react'
import { normalizePlan } from '@/lib/profile'

interface ProfileFrameProps {
  plan: string | null | undefined
  size?: number
  children: ReactNode // the avatar image / fallback
  className?: string
}

const OCTAGON =
  'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'

export function ProfileFrame({
  plan,
  size = 96,
  children,
  className,
}: ProfileFrameProps) {
  const tier = normalizePlan(plan)

  // ── trial / null: simple circle, no glow ────────────────────────────────
  if (tier === 'trial') {
    return (
      <div
        className={className}
        style={{ width: size, height: size, position: 'relative' }}
      >
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

  // ── clipper / pro / king: octagonal frame ───────────────────────────────
  const isKing = tier === 'king'
  const pad = isKing ? 3 : 2

  const borderStyle: CSSProperties = isKing
    ? {
        background:
          'linear-gradient(45deg, #9146FF, #00E5A0, #9146FF, #00E5A0)',
        backgroundSize: '400% 400%',
        animation: 'borderFlow 8s ease infinite',
      }
    : { background: '#9146FF' }

  const glow = isKing
    ? '0 0 20px rgba(145,70,255,0.6)'
    : '0 0 12px rgba(145,70,255,0.4)'

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative' }}
    >
      {/* Glow layer — box-shadow on a square sized like the frame; the octagon
          sits on top so the glow reads as an ambient halo. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: size * 0.12,
          boxShadow: glow,
          borderRadius: 8,
        }}
      />

      {/* Border layer (clipped octagon) */}
      <div
        style={{
          position: 'relative',
          width: size,
          height: size,
          clipPath: OCTAGON,
          padding: pad,
          ...borderStyle,
        }}
      >
        {/* Inner avatar (clipped octagon, black backdrop) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            clipPath: OCTAGON,
            overflow: 'hidden',
            background: '#000',
          }}
        >
          {children}
        </div>
      </div>

      {/* Plan badge — bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: -4,
          right: -4,
          zIndex: 2,
        }}
      >
        {isKing ? (
          <span
            className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold text-black"
            style={{
              background: 'linear-gradient(45deg, #9146FF, #00E5A0)',
              animation: 'kingPulse 2.2s ease-in-out infinite',
            }}
          >
            👑 KING
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-[#9146FF] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
            {tier === 'pro' ? 'Pro' : 'Clipper'}
          </span>
        )}
      </div>

      {/* Sparkle dots — King only */}
      {isKing && (
        <>
          <Sparkle style={{ top: -2, left: '32%' }} delay="0s" color="#00E5A0" />
          <Sparkle style={{ top: '32%', right: -2 }} delay="0.5s" color="#9146FF" />
          <Sparkle style={{ bottom: '32%', left: -2 }} delay="1s" color="#00E5A0" />
        </>
      )}
    </div>
  )
}

function Sparkle({
  style,
  delay,
  color,
}: {
  style: CSSProperties
  delay: string
  color: string
}) {
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
