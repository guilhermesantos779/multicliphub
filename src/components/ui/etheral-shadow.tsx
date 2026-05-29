'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EtheralShadowProps {
  children?: ReactNode
  color?: string
  className?: string
}

// Not mounted on the landing — shader WebGL covers the page.
// Use inside a contained card/section if a localized halo is needed later.
export function EtheralShadow({
  children,
  color = 'rgba(145,70,255,0.5)',
  className,
}: EtheralShadowProps) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(ellipse at center, ${color} 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />
      {children}
    </div>
  )
}
