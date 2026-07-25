import React from 'react'

interface GlowOrbProps {
  color: string
  size: number
  x: string
  y: string
  opacity: number
  blur?: number
}

export function GlowOrb({ color, size, x, y, opacity, blur = 80 }: GlowOrbProps) {
  return (
    <div
      style={{
        position:     'absolute',
        left:         x,
        top:          y,
        width:        size,
        height:       size,
        borderRadius: '50%',
        background:   color,
        filter:       `blur(${blur}px)`,
        opacity,
        transform:    'translate(-50%, -50%)',
        pointerEvents:'none',
      }}
    />
  )
}
