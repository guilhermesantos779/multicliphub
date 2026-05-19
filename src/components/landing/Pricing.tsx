'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FadeIn } from '@/components/shared/FadeIn'

const PLANS = [
  {
    id: 'clipper',
    icon: '⚡',
    name: 'Clipper',
    tagline: 'Para quem está começando',
    monthly: 27,
    annual: 19,
    featured: false,
    cta: 'Assinar Clipper',
    features: [
      'Até 200 posts por mês',
      '3 canais conectados',
      'Analytics básico',
      'Histórico de 30 dias',
      'Participação no ranking',
      'Relatório semanal por e-mail',
      'Suporte por e-mail',
    ],
  },
  {
    id: 'pro',
    icon: '🏆',
    name: 'Pro',
    tagline: 'Para clipadores sérios',
    monthly: 57,
    annual: 40,
    featured: true,
    cta: 'Assinar Pro',
    features: [
      'Posts ilimitados',
      'Até 3 contas por plataforma (9 canais)',
      'Analytics completo com gráficos',
      'Legendas inteligentes por IA',
      'Agendamento de posts',
      'Thumbnail automática',
      'Histórico ilimitado',
      'Badge Pro no ranking',
      'Suporte prioritário',
    ],
  },
  {
    id: 'king',
    icon: '👑',
    name: 'King',
    tagline: 'Para agências e managers',
    monthly: 97,
    annual: 68,
    featured: false,
    cta: 'Assinar King',
    features: [
      'Tudo do Pro',
      'Canais ilimitados',
      'Até 5 membros na equipe',
      'Relatórios exportáveis PDF/CSV',
      'API de integração',
      'Onboarding dedicado',
      'Badge King + cargo no Discord',
      'Suporte VIP',
    ],
  },
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="precos" className="bg-black py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="mb-14 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00E5A0]">
            Preços
          </span>
          <h2 className="mb-8 text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-[#FAFAFA] sm:text-[52px]">
            Comece a dominar.
            <br />
            <span className="text-[#888888]">Escale quando quiser.</span>
          </h2>

          {/* Toggle mensal / anual */}
          <div className="inline-flex items-center gap-3">
            <span className={cn('text-[13px]', !annual ? 'text-[#FAFAFA]' : 'text-[#888888]')}>
              Mensal
            </span>
            <button
              role="switch"
              aria-checked={annual}
              onClick={() => setAnnual((v) => !v)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00E5A0]',
                annual ? 'bg-[#00E5A0]' : 'bg-[#222222]',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300',
                  annual ? 'translate-x-4' : 'translate-x-0.5',
                )}
              />
            </button>
            <span className={cn('text-[13px]', annual ? 'text-[#FAFAFA]' : 'text-[#888888]')}>
              Anual
              <span className="ml-2 rounded-full bg-[#DEFF9A]/10 px-2 py-0.5 text-[10px] font-semibold text-[#DEFF9A]">
                −30%
              </span>
            </span>
          </div>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <FadeIn key={plan.id} delay={i * 0.1}>
              <motion.div
                className={cn(
                  'relative flex h-full flex-col rounded-2xl border bg-[#0a0a0a] p-6',
                  plan.featured
                    ? 'border-[#00E5A0]/50'
                    : 'border-white/[0.06]',
                )}
                whileHover={
                  plan.featured
                    ? { y: -4, boxShadow: '0 0 40px rgba(0,229,160,0.15)', borderColor: 'rgba(0,229,160,0.8)', transition: { duration: 0.2 } }
                    : { y: -4, borderColor: 'rgba(255,255,255,0.12)', transition: { duration: 0.2 } }
                }
              >
                {plan.featured && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2">
                    <div className="rounded-b-full bg-[#00E5A0] px-4 py-1">
                      <span className="text-[10px] font-semibold text-[#0B0F19]">Mais popular</span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="mb-3 text-2xl">{plan.icon}</div>
                  <h3 className="mb-0.5 text-[20px] font-bold text-[#FAFAFA]">{plan.name}</h3>
                  <p className="mb-5 text-[13px] text-[#888888]">{plan.tagline}</p>

                  <div className="flex items-end gap-1">
                    <span className="text-[14px] text-[#888888]">R$</span>
                    <span className="text-[48px] font-bold leading-none tracking-[-0.03em] text-[#FAFAFA]">
                      {annual ? plan.annual : plan.monthly}
                    </span>
                    <span className="mb-1 text-[13px] text-[#888888]">/mês</span>
                  </div>
                  {annual && (
                    <p className="mt-1 text-[11px] text-[#444444]">
                      Cobrado R$ {plan.annual * 12}/ano
                    </p>
                  )}
                </div>

                <hr className="mb-6 border-white/[0.06]" />

                <ul className="mb-8 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-px text-[12px] text-[#00E5A0]">✓</span>
                      <span className="text-[13px] text-[#888888]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={cn(
                    'block rounded-full py-2.5 text-center text-[14px] font-semibold transition-colors',
                    plan.featured
                      ? 'bg-[#00E5A0] text-[#0B0F19] hover:bg-[#00B584]'
                      : 'border border-white/[0.08] text-[#888888] hover:border-white/[0.16] hover:text-white',
                  )}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mt-8 text-center">
          <p className="text-[13px] text-[#444444]">
            7 dias grátis para testar · Cancele quando quiser · Sem taxa de setup
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
