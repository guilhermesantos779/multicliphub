'use client'
import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#9146FF', '#00E5A0', '#DEFF9A', '#FFFFFF', '#7c3aed']

interface ConfettiProps {
  count?: number
  /** Burst origin, defaults to center. */
  durationMs?: number
}

// Lightweight DOM/CSS particle burst — no canvas library. Pieces explode
// outward from the center and fall, fading out. Plays once on mount.
export function Confetti({ count = 80 }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
        const distance = 140 + Math.random() * 220
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 120, // bias upward, then gravity pulls down
          rotate: Math.random() * 720 - 360,
          color: COLORS[i % COLORS.length],
          size: 6 + Math.random() * 6,
          delay: Math.random() * 0.15,
          round: Math.random() > 0.5,
        }
      }),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: [p.y, p.y + 320], opacity: [1, 1, 0], rotate: p.rotate, scale: 0.6 }}
          transition={{ duration: 1.8, delay: p.delay, ease: [0.2, 0.6, 0.4, 1] }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? '9999px' : '2px',
          }}
        />
      ))}
    </div>
  )
}
