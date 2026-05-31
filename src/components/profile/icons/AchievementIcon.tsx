'use client'

import {
  Eye, Flame, Zap, Crown, Scissors, Target, Cpu, Star, Calendar,
  Trophy, TrendingUp, Medal, Link2, Rocket, Gem, Award, Lock,
  type LucideIcon,
} from 'lucide-react'
import { TIER_META, type AchievementTier } from '@/lib/profile'

// Maps achievements.icon_type → Lucide symbol
const ICONS: Record<string, LucideIcon> = {
  eye: Eye,
  flame: Flame,
  zap: Zap,
  crown: Crown,
  scissors: Scissors,
  target: Target,
  cpu: Cpu,
  star: Star,
  calendar: Calendar,
  trophy: Trophy,
  'trending-up': TrendingUp,
  medal: Medal,
  link: Link2,
  rocket: Rocket,
  gem: Gem,
}

// Flat-top hexagon path within an 80x80 viewBox
const HEX = 'M22,8 L58,8 L76,40 L58,72 L22,72 L4,40 Z'

interface AchievementIconProps {
  iconType: string
  tier: AchievementTier
  size?: number
  locked?: boolean
  className?: string
}

export function AchievementIcon({
  iconType,
  tier,
  size = 64,
  locked = false,
  className,
}: AchievementIconProps) {
  const Inner = ICONS[iconType] ?? Award
  const meta = TIER_META[tier]
  const gradientId = `tier-grad-${tier}`
  const isSpecial = tier === 'special' && meta.gradient

  // Lucide icon scaled to ~42% of the badge
  const innerSize = Math.round(size * 0.42)

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        filter: locked ? 'none' : `drop-shadow(0 0 ${size * 0.12}px ${meta.glow})`,
        opacity: locked ? 0.3 : 1,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        style={{ filter: locked ? 'grayscale(1)' : 'none' }}
      >
        {isSpecial && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={meta.gradient![0]} />
              <stop offset="100%" stopColor={meta.gradient![1]} />
            </linearGradient>
          </defs>
        )}
        {/* Dark inner fill */}
        <path d={HEX} fill="#0b0b0f" />
        {/* Tier-colored rim */}
        <path
          d={HEX}
          fill="none"
          stroke={isSpecial ? `url(#${gradientId})` : meta.color}
          strokeWidth={3}
          strokeLinejoin="round"
        />
        {/* Subtle inner tint */}
        <path d={HEX} fill={meta.color} fillOpacity={0.08} />
      </svg>

      {/* Centered Lucide icon */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {locked ? (
          <Lock size={innerSize} className="text-white/60" strokeWidth={1.75} />
        ) : isSpecial ? (
          <Inner size={innerSize} color={meta.gradient![1]} strokeWidth={1.75} />
        ) : (
          <Inner size={innerSize} color={meta.color} strokeWidth={1.75} />
        )}
      </div>
    </div>
  )
}
