'use client'

interface AmbientGlowProps {
  color: 'purple' | 'mint' | 'mixed'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  position?: {
    top?: string
    bottom?: string
    left?: string
    right?: string
  }
  opacity?: number
  className?: string
}

const SIZES = { sm: 300, md: 500, lg: 800, xl: 1200 }

export function AmbientGlow({
  color,
  size = 'md',
  position = { top: '0', left: '50%' },
  opacity = 0.15,
  className,
}: AmbientGlowProps) {
  const px = SIZES[size]

  let background: string
  if (color === 'mixed') {
    background = [
      `radial-gradient(circle at 30% 50%, rgba(145,70,255,${opacity}) 0%, transparent 50%)`,
      `radial-gradient(circle at 70% 50%, rgba(0,229,160,${opacity * 0.7}) 0%, transparent 50%)`,
    ].join(', ')
  } else {
    const hex = color === 'purple' ? '145,70,255' : '0,229,160'
    background = `radial-gradient(circle, rgba(${hex},${opacity}) 0%, transparent 60%)`
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 ${className ?? ''}`}
      style={{
        width: px,
        height: px,
        background,
        filter: `blur(${Math.round(px * 0.15)}px)`,
        transform: position.left === '50%' ? 'translateX(-50%)' : undefined,
        ...position,
      }}
    />
  )
}
