// src/components/ui/brand/AnimatedNumber.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

// Counts up to `value` once it scrolls into view (IntersectionObserver via
// framer's useInView). Uses requestAnimationFrame with an exponential ease-out.
export function AnimatedNumber({
  value,
  duration = 1500,
  format = (n) => n.toLocaleString('pt-BR'),
  className,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!isInView) return
    startTime.current = null

    function tick(timestamp: number) {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.floor(easeOutExpo(progress) * value))

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick)
      } else {
        setDisplay(value)
      }
    }

    rafId.current = requestAnimationFrame(tick)
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current) }
  }, [value, duration, isInView])

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  )
}
