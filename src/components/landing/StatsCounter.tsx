'use client'

import { useEffect, useRef, useState } from 'react'
import { formatNumber } from '@/lib/format'
import { PlatformIcon } from '@/components/profile/icons/PlatformIcon'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
}

// Counts up from 0 to value with easing.
function AnimatedNumber({ value, duration = 2000, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (value === 0) return

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
    }

    function animate(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplay(Math.floor(easeOutExpo(progress) * value))

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        setDisplay(value)
      }
    }

    rafId.current = requestAnimationFrame(animate)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [value, duration])

  return <span className={className}>{formatNumber(display)}</span>
}

interface StatItemProps {
  value: number
  label: string
  sublabel?: string
  highlight?: boolean
}

function StatItem({ value, label, sublabel, highlight }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Trigger the count-up only when scrolled into view.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div
        className={`text-3xl font-black tracking-tight sm:text-4xl ${
          highlight ? 'text-[#00E5A0]' : 'text-white'
        }`}
      >
        {visible ? <AnimatedNumber value={value} /> : <span>{formatNumber(0)}</span>}
      </div>
      <div className="text-sm font-medium text-white/50">{label}</div>
      {sublabel && <div className="text-xs text-white/25">{sublabel}</div>}
    </div>
  )
}

interface StatsCounterProps {
  totalViews: number
  totalClips: number
  totalCreators: number
  hasRealData: boolean
}

export function StatsCounter({
  totalViews,
  totalClips,
  totalCreators,
  hasRealData,
}: StatsCounterProps) {
  // No real data yet → render nothing. Never show zeros on the landing page.
  if (!hasRealData) return null

  return (
    <section className="border-y border-white/[0.06] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[4px] text-white/30">
          Comunidade MultiClip Hub
        </p>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <StatItem
            value={totalViews}
            label="Visualizações totais"
            sublabel="em todas as plataformas"
            highlight
          />
          <StatItem value={totalClips} label="Clipes publicados" />
          <StatItem value={totalCreators} label="Criadores ativos" />
        </div>

        {/* Platform row below the stats */}
        <div className="mt-10 flex items-center justify-center gap-6 text-white/20">
          <PlatformIcon platform="tiktok" size={18} />
          <div className="h-4 w-px bg-white/10" />
          <PlatformIcon platform="instagram" size={18} />
          <div className="h-4 w-px bg-white/10" />
          <PlatformIcon platform="youtube" size={18} />
        </div>
      </div>
    </section>
  )
}
