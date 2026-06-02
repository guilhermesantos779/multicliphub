import React from 'react'
import { useCurrentFrame } from 'remotion'
import { interpolate } from 'remotion'
import { COLORS } from '../constants'

function seeded(s: number): number {
  const x = Math.sin(s + 1) * 10000
  return x - Math.floor(x)
}

interface ParticleFieldProps {
  count?: number
  originX?: string
  originY?: string
  startFrame?: number
  colors?: string[]
}

export function ParticleField({
  count = 24,
  originX = '50%',
  originY = '50%',
  startFrame = 0,
  colors = [COLORS.purple, COLORS.mint, '#ffffff88'],
}: ParticleFieldProps) {
  const frame = useCurrentFrame()
  const lf = frame - startFrame

  if (lf < 0) return null

  const particles = Array.from({ length: count }, (_, i) => {
    const angle    = seeded(i * 3.1)    * Math.PI * 2
    const speed    = 1.5 + seeded(i * 7.3) * 3.5
    const size     = 3  + seeded(i * 2.1) * 5
    const color    = colors[Math.floor(seeded(i * 5.9) * colors.length)]
    const delay    = Math.floor(seeded(i * 11.7) * 20)
    const lifetime = 120 + Math.floor(seeded(i * 4.3) * 80)

    const pf       = lf - delay
    if (pf < 0 || pf > lifetime) return null

    const progress = pf / lifetime
    const dist     = pf * speed
    const opacity  = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 0.8, 0], {
      extrapolateLeft:  'clamp',
      extrapolateRight: 'clamp',
    })
    const scale = interpolate(progress, [0, 0.3, 1], [0, 1, 0.3], {
      extrapolateLeft:  'clamp',
      extrapolateRight: 'clamp',
    })
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist

    return { i, tx, ty, size, color, opacity, scale }
  })

  return (
    <div
      style={{
        position:     'absolute',
        left:         originX,
        top:          originY,
        width:        0,
        height:       0,
        pointerEvents:'none',
        zIndex:       50,
      }}
    >
      {particles.map(p => {
        if (!p) return null
        return (
          <div
            key={p.i}
            style={{
              position:    'absolute',
              width:       p.size,
              height:      p.size,
              borderRadius:'50%',
              background:  p.color,
              opacity:     p.opacity,
              boxShadow:   `0 0 ${p.size * 2}px ${p.color}`,
              transform:   `translate(calc(-50% + ${p.tx}px), calc(-50% + ${p.ty}px)) scale(${p.scale})`,
            }}
          />
        )
      })}
    </div>
  )
}
