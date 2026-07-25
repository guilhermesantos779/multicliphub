'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Upload,
  Sparkles,
  BarChart3,
  Clock,
  Trophy,
  Calendar,
  type LucideIcon,
} from 'lucide-react'
import { RaycastCard } from './raycast/RaycastCard'
import { AmbientGlow } from './raycast/AmbientGlow'

// ─── Types ─────────────────────────────────────────────────────────────────────

type CornerGlow = 'purple' | 'mint'

type FeatureCard = {
  id: string
  Icon: LucideIcon
  corner: CornerGlow
  hasBadge?: boolean
}

// ─── Data (text lives in messages/*.json under features.cards.{id}) ─────────────

const CARDS: FeatureCard[] = [
  { id: 'upload', Icon: Upload, corner: 'purple', hasBadge: true },
  { id: 'ai', Icon: Sparkles, corner: 'mint' },
  { id: 'analytics', Icon: BarChart3, corner: 'purple' },
  { id: 'timing', Icon: Clock, corner: 'mint' },
  { id: 'ranking', Icon: Trophy, corner: 'purple', hasBadge: true },
  { id: 'scheduling', Icon: Calendar, corner: 'mint' },
]

// ─── Animation variants ─────────────────────────────────────────────────────────

const EASE = [0.21, 0.47, 0.32, 0.98] as const

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// ─── Section ────────────────────────────────────────────────────────────────────

export function Features() {
  const t = useTranslations('features')
  return (
    <section
      id="funcionalidades"
      className="relative py-24 overflow-hidden"
    >
      <AmbientGlow
        color="purple"
        size="lg"
        position={{ top: '-10%', left: '0' }}
        opacity={0.08}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            {t('eyebrow')}
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: 700, margin: '0 auto 16px' }}
          >
            {t('title_main')}
            <span style={{ color: '#9146FF' }}>{t('title_accent')}</span>
            {t('title_end')}
          </h2>
          <p className="text-white/50 text-[15px]">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {CARDS.map((card) => {
            const { Icon } = card
            return (
              <motion.div key={card.id} variants={cardVariants}>
                <RaycastCard
                  cornerGlow={card.corner}
                  cornerPosition="tr"
                  padding="p-6"
                  className="h-full"
                >
                  <div className="mb-5 text-white/70">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>

                  <h3 className="font-display font-semibold text-[18px] text-white mb-2 tracking-[-0.01em]">
                    {t(`cards.${card.id}.title`)}
                  </h3>

                  <p className="text-[14px] text-white/50 leading-relaxed">
                    {t(`cards.${card.id}.description`)}
                  </p>

                  {card.hasBadge && (
                    <div className="mt-4 inline-flex items-center rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-2.5 py-1">
                      <span className="text-[11px] font-medium text-[#00E5A0]">
                        {t(`cards.${card.id}.badge`)}
                      </span>
                    </div>
                  )}
                </RaycastCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
