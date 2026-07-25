'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
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
        if (entry?.isIntersecting) setVisible(true)
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
  return (
    <section className="border-y border-white/[0.06] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[4px] text-white/30">
          Comunidade MultiClip Hub
        </p>

        {/* Real numbers once views exist; a pre-launch teaser until then.
            We never render bare zeros — that would undercut credibility. */}
        {hasRealData ? (
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
        ) : (
          <PreLaunchTeaser />
        )}

        {/* Platform row below */}
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

// Shown before any real views exist: keeps the social-proof slot present
// without displaying zeros, and invites the first creators in.
function PreLaunchTeaser() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#00E5A0]">
        Em breve
      </span>
      <h3 className="mt-5 max-w-lg text-2xl font-black tracking-tight text-white sm:text-3xl">
        Os números da comunidade chegam em breve
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/50">
        Assim que os primeiros clipes forem publicados, as visualizações de toda a
        comunidade aparecem aqui em tempo real.
      </p>
      <Link
        href="/register"
        className="mt-6 rounded-full bg-[#9146FF] px-8 py-3.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#7c3aed]"
      >
        Seja um dos primeiros
      </Link>
    </div>
  )
}
