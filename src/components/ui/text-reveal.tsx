'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WordProps {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
  isAccent: boolean
}

// Sub-componente para encapsular o hook useTransform fora do .map()
function Word({ word, progress, start, end, isAccent }: WordProps) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        'inline-block mr-[0.28em]',
        isAccent ? 'text-[#9146FF]' : 'text-white',
      )}
    >
      {word}
    </motion.span>
  )
}

interface TextRevealProps {
  text: string
  accentWords?: string[]
  className?: string
}

export function TextReveal({ text, accentWords = [], className }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.2'],
  })

  const words = text.split(' ')

  return (
    <div ref={containerRef} className={cn('py-16', className)}>
      <p
        className="font-display font-bold leading-tight tracking-[-0.03em] text-white/20"
        style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
      >
        {words.map((word, i) => {
          const start    = i / words.length
          const end      = (i + 1) / words.length
          const isAccent = accentWords.includes(word.replace(/[.,!?]/g, ''))

          return (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              start={start}
              end={end}
              isAccent={isAccent}
            />
          )
        })}
      </p>
    </div>
  )
}
