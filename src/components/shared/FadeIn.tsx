'use client'
import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

const EASING = [0.21, 0.47, 0.32, 0.98] as const

const directionOffset = {
  up:    { y: 24, x: 0   },
  down:  { y: -24, x: 0  },
  left:  { y: 0,   x: 24 },
  right: { y: 0,   x: -24 },
  none:  { y: 0,   x: 0   },
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
  direction = 'up',
  duration = 0.5,
}: FadeInProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...directionOffset[direction] },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration, delay, ease: EASING },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
