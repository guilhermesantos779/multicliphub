'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { AmbientGlow } from './raycast/AmbientGlow'
import { FadeIn } from '@/components/shared/FadeIn'

const STEP_NUMBERS = ['01', '02', '03'] as const

const EASE = [0.21, 0.47, 0.32, 0.98] as const

export function HowItWorks() {
  const t = useTranslations('howItWorks')
  const steps = STEP_NUMBERS.map((number, i) => ({
    number,
    title: t(`step${i + 1}_title`),
    desc: t(`step${i + 1}_desc`),
  }))
  return (
    <section id="como-funciona" className="relative py-24 overflow-hidden">
      <AmbientGlow
        color="mint"
        size="md"
        position={{ top: '20%', right: '0' }}
        opacity={0.07}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <FadeIn className="mb-16 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            {t('eyebrow')}
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-3 text-white/50 text-[15px]">
            {t('subtitle')}
          </p>
        </FadeIn>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Dotted connector — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[68px] left-[16.66%] right-[16.66%] h-px"
            style={{
              borderTop: '1px dashed rgba(255,255,255,0.08)',
            }}
          />

          {steps.map((step, i) => (
            <FadeIn key={step.number} delay={i * 0.12}>
              <motion.div
                whileInView={{ opacity: 1 }}
                className="relative flex flex-col items-start md:items-center md:text-center"
              >
                {/* Giant gradient number */}
                <div
                  className="font-display font-bold leading-none select-none mb-4"
                  style={{
                    fontSize: 'clamp(80px, 10vw, 120px)',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.04em',
                  }}
                >
                  {step.number}
                </div>

                <h3 className="font-display font-semibold text-[18px] text-white mb-2 tracking-[-0.02em]">
                  {step.title}
                </h3>
                <p className="text-[14px] text-white/50 leading-relaxed max-w-[240px]">
                  {step.desc}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Mini trust stat */}
        <FadeIn delay={0.4} className="mt-16 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-md px-6 py-3">
            <span
              className="h-2 w-2 rounded-full bg-[#00E5A0] animate-pulse"
              style={{ boxShadow: '0 0 6px rgba(0,229,160,0.6)' }}
            />
            <span className="text-[13px] text-white/50">
              {t('stat_label')}{' '}
              <span className="font-semibold text-white">{t('stat_value')}</span>
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
