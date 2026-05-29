'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AmbientGlow } from './raycast/AmbientGlow'
import { FadeIn } from '@/components/shared/FadeIn'

const TRUST = [
  '2.300+ clipadores ativos',
  '+47M views distribuídos',
  '99,9% uptime',
]

export function CTASection() {
  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      {/* Shader is the bg here — only a subtle mint accent remains; removed xl purple (competed with shader) */}
      <AmbientGlow color="mint" size="lg" position={{ bottom: '-20%', left: '50%' }} opacity={0.08} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <FadeIn>
          {/* Pre-title */}
          <p className="mb-6 text-[14px] text-white/40">pronto para escalar?</p>

          {/* Massive headline */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-display font-bold leading-[0.95] tracking-[-0.045em] mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
          >
            <span className="text-white">distribua. multiplique. </span>
            <span style={{ color: '#9146FF' }}>escale</span>
            <span className="text-white">.</span>
          </motion.h2>

          {/* Subtitle */}
          <p
            className="text-white/50 leading-relaxed mb-10 mx-auto"
            style={{ fontSize: 16, maxWidth: 420 }}
          >
            comece a usar o MultiClipHub gratuitamente hoje.
            7 dias completos. sem cartão de crédito.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
            <Link
              href="/register"
              className="rounded-full bg-[#9146FF] px-8 py-3.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#7c3aed]"
            >
              criar conta grátis →
            </Link>
            <Link
              href="mailto:suportemulticliphub@gmail.com"
              className="rounded-full border border-white/[0.12] px-8 py-3.5 text-[14px] text-white/70 transition-all duration-200 hover:border-white/[0.25] hover:text-white"
            >
              falar com a gente
            </Link>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {TRUST.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[12px] text-white/35">
                <span style={{ color: '#00E5A0' }}>✓</span>
                {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
