'use client'

import type { CSSProperties } from 'react'
import { AchievementSymbol } from './AchievementSymbol'
import { TIER_META, type AchievementTier } from '@/lib/profile'

// Flat-top hexagon
const HEX_PATH = 'M22,8 L58,8 L76,40 L58,72 L22,72 L4,40 Z'
const HEX_CLIP = 'polygon(27.5% 10%, 72.5% 10%, 95% 50%, 72.5% 90%, 27.5% 90%, 5% 50%)'

interface AchievementIconProps {
  iconType: string
  tier: AchievementTier
  size?: number
  locked?: boolean
  className?: string
}

function LockGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="10" width="14" height="10" rx="2" fill={color} />
      <path d="M8 10 V7 a4 4 0 0 1 8 0 V10" stroke={color} strokeWidth="2" fill="none" />
    </svg>
  )
}

export function AchievementIcon({
  iconType,
  tier,
  size = 64,
  locked = false,
  className,
}: AchievementIconProps) {
  const meta = TIER_META[tier]
  const symbolSize = Math.round(size * 0.44)
  const isSpecial = tier === 'special'

  // ── Locked: greyscale, dimmed, padlock ──────────────────────────────────
  if (locked) {
    return (
      <div className={className} style={{ width: size, height: size, position: 'relative', opacity: 0.3 }}>
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ filter: 'grayscale(1)' }}>
          <path d={HEX_PATH} fill="#0b0b0f" />
          <path d={HEX_PATH} fill="none" stroke="#666" strokeWidth={3} strokeLinejoin="round" />
        </svg>
        <Center>
          <LockGlyph size={Math.round(size * 0.4)} color="rgba(255,255,255,0.7)" />
        </Center>
      </div>
    )
  }

  // ── Special tier: animated purple→mint gradient rim + sparkles ────────────
  if (isSpecial) {
    return (
      <div
        className={className}
        style={{ width: size, height: size, position: 'relative', filter: `drop-shadow(0 0 ${size * 0.12}px ${meta.glow})` }}
      >
        {/* Animated gradient rim */}
        <div
          style={{
            width: size,
            height: size,
            clipPath: HEX_CLIP,
            padding: Math.max(2, size * 0.045),
            background: 'linear-gradient(45deg, #9146FF, #00E5A0, #9146FF, #00E5A0)',
            backgroundSize: '400% 400%',
            animation: 'borderFlow 8s ease infinite',
          }}
        >
          <div style={{ width: '100%', height: '100%', clipPath: HEX_CLIP, background: '#0b0b0f' }} />
        </div>
        <Center>
          <AchievementSymbol name={iconType} color="#00E5A0" size={symbolSize} />
        </Center>
        {/* Sparkle accents */}
        <Sparkle style={{ top: '6%', left: '47%' }} delay="0s" />
        <Sparkle style={{ top: '47%', right: '2%' }} delay="0.6s" />
        <Sparkle style={{ bottom: '6%', left: '47%' }} delay="1.2s" />
      </div>
    )
  }

  // ── Bronze / silver / gold / diamond: tier rim + glow ─────────────────────
  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', filter: `drop-shadow(0 0 ${size * 0.12}px ${meta.glow})` }}
    >
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path d={HEX_PATH} fill="#0b0b0f" />
        <path d={HEX_PATH} fill={meta.color} fillOpacity={0.1} />
        <path d={HEX_PATH} fill="none" stroke={meta.color} strokeWidth={3} strokeLinejoin="round" />
        {/* Diamond facet hint */}
        {tier === 'diamond' && (
          <g stroke={meta.color} strokeOpacity="0.5" strokeWidth="1.2" fill="none">
            <path d="M40 8 L40 72 M22 8 L58 72 M58 8 L22 72" />
          </g>
        )}
      </svg>
      <Center>
        <AchievementSymbol name={iconType} color={meta.color} size={symbolSize} />
      </Center>
    </div>
  )
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  )
}

function Sparkle({ style, delay }: { style: CSSProperties; delay: string }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'absolute',
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 0 5px #00E5A0',
        animation: `kingSparkle 1.8s ease-in-out ${delay} infinite`,
        ...style,
      }}
    />
  )
}
