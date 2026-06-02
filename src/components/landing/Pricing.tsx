'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { AmbientGlow } from './raycast/AmbientGlow'
import { FadeIn } from '@/components/shared/FadeIn'
import { AnimatedBorderButton } from '@/components/ui/animated-border-button'
import { PLAN_PRICES, formatPriceBRL, type PlanId } from '@/config/plans'

// Presentation only — prices come from the centralized PLAN_PRICES config.
const PLANS = [
  {
    id: 'clipper' as PlanId,
    corner: 'none' as const,
    featured: false,
    cta: 'Começar grátis',
    ctaStyle: 'outline' as const,
    features: [
      '200 posts por mês',
      '3 canais conectados',
      'Analytics básico',
      'Discord da comunidade',
    ],
  },
  {
    id: 'pro' as PlanId,
    corner: 'purple' as const,
    featured: true,
    cta: 'Começar grátis',
    ctaStyle: 'filled' as const,
    features: [
      'Posts ilimitados',
      '9 canais conectados',
      'IA de legendas + hashtags',
      'Agendamento inteligente',
      'Analytics avançado',
    ],
  },
  {
    id: 'king' as PlanId,
    corner: 'mint' as const,
    featured: false,
    cta: 'Assinar King',
    ctaStyle: 'outline' as const,
    features: [
      'Tudo do Pro +',
      'Canais ilimitados',
      'Até 5 membros na equipe',
      'API access',
      'Suporte prioritário',
    ],
  },
].map((p) => ({ ...p, ...PLAN_PRICES[p.id] }))

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="precos" className="relative py-24 overflow-hidden">
      <AmbientGlow
        color="purple"
        size="lg"
        position={{ top: '-5%', left: '50%' }}
        opacity={0.07}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <FadeIn className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            preços
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Comece grátis. Escale quando dominar.
          </h2>
          <p className="mt-3 mb-8 text-white/50 text-[15px]">
            7 dias grátis em qualquer plano. Sem cartão.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1">
            <button
              onClick={() => setAnnual(false)}
              className={[
                'rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200',
                !annual
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/70',
              ].join(' ')}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={[
                'flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-200',
                annual
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white/70',
              ].join(' ')}
            >
              Anual
              {annual && (
                <span className="rounded-full bg-[#00E5A0]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00E5A0]">
                  Economize até 30%
                </span>
              )}
            </button>
          </div>
        </FadeIn>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
                className={[
                  'relative flex h-full flex-col rounded-2xl border p-6',
                  'bg-white/[0.02] backdrop-blur-md',
                  'transition-colors duration-300',
                  plan.featured
                    ? 'border-[#9146FF]/30 hover:border-[#9146FF]/50'
                    : 'border-white/[0.06] hover:border-white/[0.15]',
                ].join(' ')}
              >
                {/* Corner glow */}
                {plan.corner !== 'none' && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute top-0 right-0 h-[200%] w-[160%] overflow-hidden rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at top right, ${
                        plan.corner === 'purple'
                          ? 'rgba(145,70,255,0.08)'
                          : 'rgba(0,229,160,0.06)'
                      } 0%, transparent 50%)`,
                      filter: 'blur(30px)',
                    }}
                  />
                )}

                {plan.featured && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div className="rounded-b-full bg-[#9146FF] px-4 py-1">
                      <span className="text-[10px] font-semibold text-white">
                        Mais popular
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col flex-1">
                  <p className="font-display font-semibold text-[20px] text-white mb-1 tracking-[-0.02em]">
                    {plan.name}
                  </p>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-[13px] text-white/40">R$</span>
                    <span className="font-display font-semibold text-[48px] leading-none tracking-[-0.04em] text-white">
                      {formatPriceBRL(annual ? plan.annualMonthlyPrice : plan.monthlyPrice)}
                    </span>
                    <span className="mb-1 text-[13px] text-white/40">/mês</span>
                  </div>
                  <p className="mb-6 text-[11px] text-white/35 h-4">
                    {annual ? `R$ ${formatPriceBRL(plan.annualTotal)} cobrados por ano` : ' '}
                  </p>

                  <hr className="border-white/[0.06] mb-5" />

                  <ul className="flex flex-col gap-3 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={14} className="mt-0.5 shrink-0 text-white/60" strokeWidth={2} />
                        <span className="text-[13px] text-white/60">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.featured ? (
                    /* Pro: borda animada purple→mint (único botão com AnimatedBorderButton) */
                    <AnimatedBorderButton href="/register" className="w-full justify-center py-2.5">
                      {plan.cta}
                    </AnimatedBorderButton>
                  ) : (
                    <Link
                      href="/register"
                      className={[
                        'block rounded-full py-2.5 text-center text-[13px] font-medium transition-colors duration-200',
                        plan.ctaStyle === 'filled'
                          ? 'bg-[#9146FF] text-white hover:bg-[#7c3aed]'
                          : 'border border-white/[0.08] text-white/60 hover:border-white/[0.20] hover:text-white',
                      ].join(' ')}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Fine print */}
        <p className="mt-8 text-center text-[12px] text-white/40">
          Todos os planos incluem 7 dias grátis · cancele quando quiser
        </p>
      </div>
    </section>
  )
}
