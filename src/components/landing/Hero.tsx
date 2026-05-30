'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BrowserFrame } from './BrowserFrame'
import type { ScreenId } from './AppDashboard'

const SCREEN_ORDER: ScreenId[] = ['dashboard', 'upload', 'analytics', 'ranking']

const AVATAR_COLORS    = ['#9146FF', '#00E5A0', '#f59e0b', '#ef4444', '#3b82f6']
const AVATAR_INITIALS  = ['FB', 'LC', 'AP', 'KR', 'MG']

const EASE = [0.25, 0.4, 0.25, 1] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard')

  const handleScreenChange = useCallback((screen: ScreenId) => {
    setActiveScreen(screen)
  }, [])

  // Scroll-driven screen switching without GSAP pin
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const sectionHeight = el.offsetHeight
      const scrolledPast = Math.max(0, -rect.top)
      const progress = Math.min(scrolledPast / sectionHeight, 1)
      const index = Math.min(
        Math.floor(progress * SCREEN_ORDER.length),
        SCREEN_ORDER.length - 1,
      )
      const target = SCREEN_ORDER[index]
      setActiveScreen((prev) => (prev !== target ? target : prev))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', overflow: 'hidden' }}
      className="pt-36 pb-24"
    >
      {/* Purple glow — top center */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 1200,
          height: 700,
          background: 'radial-gradient(ellipse, rgba(145,70,255,0.12) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Mint glow — bottom right */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: '-10%',
          top: '30%',
          width: 800,
          height: 800,
          background: 'radial-gradient(circle, rgba(0,229,160,0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* ── HEADLINE BLOCK ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-center text-center gap-6"
        >
          {/* Pill badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#00E5A0]"
              style={{ boxShadow: '0 0 6px rgba(0,229,160,0.8)' }}
            />
            <span className="text-[12px] text-white/70">
              ✨ Novo · Ranking gamificado disponível
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-display font-semibold leading-[1.05] tracking-[-0.045em]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', maxWidth: 840 }}
          >
            <span className="block text-white">Distribuição simultânea</span>
            <span className="block text-white/40">
              para TikTok, Reels e Shorts
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-white/50 leading-relaxed"
            style={{ fontSize: 16, maxWidth: 480 }}
          >
            Um upload publica nas 3 plataformas ao mesmo tempo.
            Zero trabalho braçal. Máximo alcance.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/register"
              className="rounded-full bg-[#9146FF] px-6 py-3 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#7c3aed]"
            >
              Começar grátis →
            </Link>
            <Link
              href="#como-funciona"
              className="rounded-full border border-white/[0.12] px-6 py-3 text-[14px] text-white/70 transition-all duration-200 hover:border-white/[0.25] hover:text-white"
            >
              Ver como funciona
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex">
              {AVATAR_COLORS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: c,
                    border: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 8,
                    fontWeight: 700,
                    color: '#fff',
                    marginLeft: i > 0 ? -8 : 0,
                    position: 'relative',
                    zIndex: 5 - i,
                  }}
                >
                  {AVATAR_INITIALS[i]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#00E5A0', fontWeight: 600 }}>
                ★★★★★ 4.9/5
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                +2.300 clipadores já usam
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── DASHBOARD MOCKUP ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
          className="mt-16 relative flex justify-center"
        >
          {/* Glow below the frame */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              bottom: -60,
              left: '10%',
              right: '10%',
              height: 150,
              background:
                'radial-gradient(ellipse, rgba(145,70,255,0.35) 0%, rgba(0,229,160,0.12) 45%, transparent 80%)',
              filter: 'blur(40px)',
              opacity: 0.35,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 900 }}>
            <BrowserFrame
              activeScreen={activeScreen}
              onScreenChange={handleScreenChange}
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 inset-x-0 h-24"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
      />
    </section>
  )
}
