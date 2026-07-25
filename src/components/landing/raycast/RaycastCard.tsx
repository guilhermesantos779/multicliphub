'use client'

import { type ReactNode } from 'react'

interface RaycastCardProps {
  children: ReactNode
  cornerGlow?: 'purple' | 'mint' | 'none'
  cornerPosition?: 'tl' | 'tr' | 'bl' | 'br'
  hover?: boolean
  className?: string
  padding?: string
}

const GLOW_COLORS = {
  purple: 'rgba(145,70,255,0.08)',
  mint:   'rgba(0,229,160,0.06)',
  none:   'transparent',
}

const CORNER_POS = {
  tl: { top: '-40%',    left: '-20%'  },
  tr: { top: '-40%',    right: '-20%' },
  bl: { bottom: '-40%', left: '-20%'  },
  br: { bottom: '-40%', right: '-20%' },
}

export function RaycastCard({
  children,
  cornerGlow = 'purple',
  cornerPosition = 'tr',
  hover = true,
  className = '',
  padding = 'p-6',
}: RaycastCardProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl',
        'border border-white/[0.06]',
        'bg-white/[0.02] backdrop-blur-md',
        padding,
        hover
          ? 'transition-all duration-300 ease-out hover:border-white/[0.15] hover:-translate-y-1'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {cornerGlow !== 'none' && (
        <div
          aria-hidden
          className="pointer-events-none absolute h-[180%] w-[140%]"
          style={{
            background: `radial-gradient(circle at center, ${GLOW_COLORS[cornerGlow]} 0%, transparent 50%)`,
            filter: 'blur(40px)',
            ...CORNER_POS[cornerPosition],
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
