'use client'

import { Crown, Zap, Shield } from 'lucide-react'

export type RankingKind = 'kings_of_reach' | 'machine_gun' | 'champion'

const META: Record<
  RankingKind,
  { Icon: typeof Crown; color: string; glow: string }
> = {
  kings_of_reach: { Icon: Crown,  color: '#9146FF', glow: 'rgba(145,70,255,0.55)' },
  machine_gun:    { Icon: Zap,    color: '#00E5A0', glow: 'rgba(0,229,160,0.55)' },
  champion:       { Icon: Shield, color: '#DEFF9A', glow: 'rgba(222,255,154,0.55)' },
}

// Flat-top hexagon, matches AchievementIcon language
const HEX = 'M22,8 L58,8 L76,40 L58,72 L22,72 L4,40 Z'

interface RankingIconProps {
  kind: RankingKind
  size?: number
  className?: string
}

export function RankingIcon({ kind, size = 48, className }: RankingIconProps) {
  const { Icon, color, glow } = META[kind]
  const innerSize = Math.round(size * 0.42)

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        filter: `drop-shadow(0 0 ${size * 0.12}px ${glow})`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
        <path d={HEX} fill="#0b0b0f" />
        <path d={HEX} fill={color} fillOpacity={0.08} />
        <path d={HEX} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={innerSize} color={color} strokeWidth={1.75} />
      </div>
    </div>
  )
}
