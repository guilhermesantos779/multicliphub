'use client'
import { useState } from 'react'
import { Topbar } from '@/components/dashboard/Topbar'
import { useUser } from '@/hooks/useUser'
import { useSubscription } from '@/hooks/useSubscription'
import type { PlanKey } from '@/lib/stripe'
import { PLAN_PRICES, formatPriceBRL } from '@/config/plans'
import { cn } from '@/lib/utils'

// Presentation only — prices come from the centralized PLAN_PRICES config.
const PLANS_CONFIG = [
  {
    id: 'clipper' as PlanKey,
    icon: '⚡',
    description: 'Para quem está começando',
    features: [
      'Até 200 posts/mês',
      '3 canais totais',
      '1 canal por plataforma',
      'Histórico 30 dias',
      'Suporte por e-mail',
    ],
    featured: false,
  },
  {
    id: 'pro' as PlanKey,
    icon: '🏆',
    description: 'Para creators sérios',
    features: [
      'Posts ilimitados',
      '9 canais totais',
      '3 por plataforma',
      'Analytics avançado',
      'Histórico ilimitado',
      'Suporte prioritário',
    ],
    featured: true,
  },
  {
    id: 'king' as PlanKey,
    icon: '👑',
    description: 'Para agências e profissionais',
    features: [
      'Tudo do Pro',
      'Canais ilimitados',
      'Relatório avançado',
      'API Access',
      'Onboarding dedicado',
      'Suporte VIP',
    ],
    featured: false,
  },
].map((p) => ({ ...p, ...PLAN_PRICES[p.id] }))

export default function ConfiguracoesPage() {
  const { profile } = useUser()
  const { subscribe, loading } = useSubscription()
  const [annual, setAnnual] = useState(false)

  return (
    <div>
      <Topbar title="Configurações" />

      <div className="p-6 space-y-8">
        {/* Planos */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-white">Plano atual</h2>
              <p className="mt-0.5 text-[13px] text-[#888888]">
                {profile?.plan
                  ? `Você está no plano ${profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}`
                  : 'Carregando...'}
              </p>
            </div>

            {/* Toggle mensal / anual */}
            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#111111] p-1">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                  !annual ? 'bg-white/[0.08] text-white' : 'text-[#888888] hover:text-white'
                )}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                  annual ? 'bg-white/[0.08] text-white' : 'text-[#888888] hover:text-white'
                )}
              >
                Anual
                <span className="rounded-full bg-[#00E5A0]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#00E5A0]">
                  −30%
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {PLANS_CONFIG.map(plan => {
              const isCurrent = profile?.plan === plan.id
              const price = annual ? plan.annualMonthlyPrice : plan.monthlyPrice

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl border p-6 transition-all duration-200',
                    plan.featured
                      ? 'border-[#00E5A0]/40 bg-[#00E5A0]/[0.04] hover:shadow-[0_0_30px_rgba(0,229,160,0.08)]'
                      : 'border-white/[0.08] bg-[#111111] hover:border-white/[0.14]'
                  )}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#00E5A0] px-3 py-0.5 text-[11px] font-bold text-[#0B0F19]">
                      MAIS POPULAR
                    </span>
                  )}

                  <div className="mb-4">
                    <span className="text-2xl">{plan.icon}</span>
                    <h3 className="mt-2 text-[16px] font-bold text-white">{plan.name}</h3>
                    <p className="text-[12px] text-[#888888]">{plan.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-[32px] font-bold leading-none text-white">
                        R$ {formatPriceBRL(price)}
                      </span>
                      <span className="mb-1 text-[13px] text-[#888888]">/mês</span>
                    </div>
                    {annual && (
                      <p className="mt-1 text-[11px] text-[#00E5A0]">
                        Cobrado R$ {formatPriceBRL(plan.annualTotal)} anualmente
                      </p>
                    )}
                  </div>

                  <ul className="mb-6 space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-[12px] text-[#888888]">
                        <span className="shrink-0 text-[#00E5A0]">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => subscribe(plan.id, annual ? 'annual' : 'monthly')}
                    disabled={isCurrent || loading}
                    className={cn(
                      'w-full rounded-xl py-2.5 text-[13px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50',
                      isCurrent
                        ? 'border border-white/[0.08] bg-transparent text-[#888888]'
                        : plan.featured
                        ? 'bg-[#00E5A0] text-[#0B0F19] hover:bg-[#00B584] hover:shadow-[0_0_20px_rgba(0,229,160,0.3)]'
                        : 'border border-[#00E5A0]/50 text-[#00E5A0] hover:bg-[#00E5A0]/10'
                    )}
                  >
                    {isCurrent ? 'Plano atual' : loading ? 'Aguarde...' : `Assinar ${plan.name}`}
                  </button>
                </div>
              )
            })}
          </div>
        </section>

        {/* Conta */}
        <section className="rounded-xl border border-white/[0.08] bg-[#111111] p-6">
          <h2 className="mb-4 text-[14px] font-semibold text-white">Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
              <div>
                <div className="text-[13px] text-white">
                  {profile?.full_name || 'Sem nome definido'}
                </div>
                <div className="text-[11px] text-[#888888]">{profile?.email || '—'}</div>
              </div>
              <span className="rounded-full border border-white/[0.08] px-2.5 py-0.5 text-[11px] text-[#888888]">
                {profile?.plan || 'trial'}
              </span>
            </div>
            <p className="text-[12px] text-[#444444]">
              Para cancelar ou solicitar exclusão de dados, entre em contato:{' '}
              <a href="mailto:suportemulticliphub@gmail.com" className="text-[#00E5A0] hover:underline">
                suportemulticliphub@gmail.com
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
