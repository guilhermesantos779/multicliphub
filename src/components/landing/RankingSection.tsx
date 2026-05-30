'use client'

import { RaycastCard } from './raycast/RaycastCard'
import { AmbientGlow } from './raycast/AmbientGlow'
import { FadeIn } from '@/components/shared/FadeIn'

const KINGS_OF_REACH = [
  { pos: '1', name: 'clipLord',   views: '14,7M', accent: '#f59e0b' },
  { pos: '2', name: 'kingRafa',   views: '8,2M',  accent: '#94a3b8' },
  { pos: '3', name: 'zeroNine',   views: '6,1M',  accent: '#92400e' },
]

const MACHINE_GUN = [
  { pos: '1', name: 'postMaster', streak: '31 dias',  accent: '#f59e0b' },
  { pos: '2', name: 'rushClips',  streak: '28 dias',  accent: '#94a3b8' },
  { pos: '3', name: 'noStop_',    streak: '25 dias',  accent: '#92400e' },
]

function LeaderRow({
  pos,
  name,
  metric,
  accent,
}: {
  pos: string
  name: string
  metric: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5">
      <span className="w-4 text-[11px] font-bold" style={{ color: accent }}>
        {pos}
      </span>
      <span className="flex-1 text-[13px] text-white/80">{name}</span>
      <span className="text-[12px] text-white/40">{metric}</span>
    </div>
  )
}

export function RankingSection() {
  return (
    <section id="ranking" className="relative py-24 overflow-hidden">
      <AmbientGlow
        color="purple"
        size="md"
        position={{ top: '0', left: '0' }}
        opacity={0.08}
      />
      <AmbientGlow
        color="mint"
        size="md"
        position={{ bottom: '0', right: '0' }}
        opacity={0.06}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <FadeIn className="mb-14 text-center">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            ranking gamificado
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Compete.{' '}
            <span style={{ color: '#00E5A0' }}>Vence</span>
            . Recebe.
          </h2>
          <p className="mt-3 text-white/50 text-[15px]">
            Dois rankings mensais com premiação real.
          </p>
        </FadeIn>

        {/* Two cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Kings of Reach */}
          <FadeIn delay={0}>
            <RaycastCard cornerGlow="purple" cornerPosition="tl" className="h-full" padding="p-6">
              <div className="mb-1 text-[22px]">👑</div>
              <h3 className="font-display font-semibold text-[18px] text-white mb-1 tracking-[-0.02em]">
                Kings of Reach
              </h3>
              <p className="text-[13px] text-white/40 mb-5">
                Ranking por views totais no mês
              </p>

              <div className="flex flex-col gap-2">
                {KINGS_OF_REACH.map((r) => (
                  <LeaderRow
                    key={r.name}
                    pos={r.pos}
                    name={r.name}
                    metric={r.views + ' views'}
                    accent={r.accent}
                  />
                ))}
              </div>

              <div className="mt-5 inline-flex items-center rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-3 py-1">
                <span className="text-[11px] font-medium text-[#00E5A0]">
                  Top 3 = 3 meses grátis
                </span>
              </div>
            </RaycastCard>
          </FadeIn>

          {/* Machine Gun */}
          <FadeIn delay={0.08}>
            <RaycastCard cornerGlow="mint" cornerPosition="tr" className="h-full" padding="p-6">
              <div className="mb-1 text-[22px]">🔫</div>
              <h3 className="font-display font-semibold text-[18px] text-white mb-1 tracking-[-0.02em]">
                Machine Gun
              </h3>
              <p className="text-[13px] text-white/40 mb-5">
                Ranking por consistência de posts
              </p>

              <div className="flex flex-col gap-2">
                {MACHINE_GUN.map((r) => (
                  <LeaderRow
                    key={r.name}
                    pos={r.pos}
                    name={r.name}
                    metric={r.streak}
                    accent={r.accent}
                  />
                ))}
              </div>

              <div className="mt-5 inline-flex items-center rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-3 py-1">
                <span className="text-[11px] font-medium text-[#00E5A0]">
                  Top 3 = cargos exclusivos Discord
                </span>
              </div>
            </RaycastCard>
          </FadeIn>
        </div>

        {/* User position row */}
        <FadeIn delay={0.16} className="flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2.5">
            <span className="text-[13px] text-white/50">
              Sua posição atual:{' '}
              <span className="text-white font-medium">#8 · 1,2M views</span>
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ background: 'rgba(0,229,160,0.10)', color: '#00E5A0' }}
            >
              ↑ Subindo
            </span>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
