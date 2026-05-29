'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
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
  title: string
  description: ReactNode
  badge?: string
  corner: CornerGlow
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const CARDS: FeatureCard[] = [
  {
    id: 'upload',
    Icon: Upload,
    corner: 'purple',
    title: 'magic upload',
    description:
      'um clipe, uma legenda, publicado em TikTok, Reels e Shorts ao mesmo tempo. sem abrir três apps diferentes.',
    badge: '+40 min/dia economizados',
  },
  {
    id: 'ai',
    Icon: Sparkles,
    corner: 'mint',
    title: 'ia que fala cada algoritmo',
    description:
      'adapta legenda e hashtags automaticamente para maximizar o alcance em cada plataforma.',
  },
  {
    id: 'analytics',
    Icon: BarChart3,
    corner: 'purple',
    title: 'analytics unificado',
    description:
      'views do TikTok, Reels e Shorts em um único dashboard. veja seu crescimento real.',
  },
  {
    id: 'timing',
    Icon: Clock,
    corner: 'mint',
    title: 'best time to post',
    description:
      'saiba exatamente quando postar com base no seu histórico. sugestões personalizadas por plataforma.',
  },
  {
    id: 'ranking',
    Icon: Trophy,
    corner: 'purple',
    title: 'ranking gamificado',
    description:
      'dois rankings mensais. top 3 ganham 3 meses grátis e cargos exclusivos no discord.',
    badge: 'exclusivo MultiClipHub',
  },
  {
    id: 'scheduling',
    Icon: Calendar,
    corner: 'mint',
    title: 'agendamento inteligente',
    description:
      'programe seus posts e deixe o algoritmo trabalhar enquanto você dorme.',
  },
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
            funcionalidades
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', maxWidth: 700, margin: '0 auto 16px' }}
          >
            tudo que você precisa para{' '}
            <span style={{ color: '#9146FF' }}>dominar</span> o algoritmo
          </h2>
          <p className="text-white/50 text-[15px]">
            uma plataforma. todas as funcionalidades. feita por quem entende o jogo.
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
                    {card.title}
                  </h3>

                  <p className="text-[14px] text-white/50 leading-relaxed">
                    {card.description}
                  </p>

                  {card.badge && (
                    <div className="mt-4 inline-flex items-center rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-2.5 py-1">
                      <span className="text-[11px] font-medium text-[#00E5A0]">
                        {card.badge}
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
