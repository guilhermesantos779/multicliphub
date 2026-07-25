'use client'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/shared/FadeIn'

interface RankEntry { pos: number; avatar: string; name: string; value: string; badge: string | null }

const KINGS_OF_REACH: RankEntry[] = [
  { pos: 1, avatar: 'CL', name: 'ClipLord_BR',  value: '14.7M', badge: '👑' },
  { pos: 2, avatar: 'KR', name: 'KingRafa',      value: '8.2M',  badge: '🥈' },
  { pos: 3, avatar: 'AP', name: 'AlgoPhoenix',   value: '6.9M',  badge: '🥉' },
  { pos: 4, avatar: 'MG', name: 'MidnightGrind', value: '4.1M',  badge: null },
  { pos: 5, avatar: 'FB', name: 'FlashBoard99',  value: '3.7M',  badge: null },
]

const MACHINE_GUN: RankEntry[] = [
  { pos: 1, avatar: 'AP', name: 'AlgoPhoenix',  value: '31d', badge: '👑' },
  { pos: 2, avatar: 'DD', name: 'DailyDrop',     value: '28d', badge: '🥈' },
  { pos: 3, avatar: 'CL', name: 'ClipLord_BR',  value: '25d', badge: '🥉' },
  { pos: 4, avatar: 'FB', name: 'FlashBoard99', value: '21d', badge: null  },
  { pos: 5, avatar: 'KR', name: 'KingRafa',      value: '18d', badge: null  },
]

function RankRow({
  pos,
  avatar,
  name,
  value,
  badge,
  highlight,
  delay,
}: {
  pos: number
  avatar: string
  name: string
  value: string
  badge: string | null
  highlight?: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 ${
        highlight
          ? 'border border-[#00E5A0]/25 bg-[#00E5A0]/8'
          : 'border border-white/[0.04] bg-[#0d0d0d]'
      }`}
    >
      <span className="w-5 text-center text-[12px] font-bold text-[#333333]">{pos}</span>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          pos === 1
            ? 'bg-[#DEFF9A] text-[#0B0F19]'
            : pos <= 3
            ? 'bg-[#00E5A0]/20 text-[#00E5A0]'
            : 'bg-[#1a1a1a] text-[#555555]'
        }`}
      >
        {avatar}
      </div>
      <span
        className={`flex-1 truncate text-[13px] ${
          highlight ? 'font-semibold text-[#FAFAFA]' : 'text-[#888888]'
        }`}
      >
        {name}
      </span>
      {badge && <span className="text-[14px]">{badge}</span>}
      <span className={`text-[12px] tabular-nums ${highlight ? 'text-[#00E5A0]' : 'text-[#555555]'}`}>
        {value}
      </span>
    </motion.div>
  )
}

function RankingCard({
  title,
  subtitle,
  metric,
  rows,
  delay,
}: {
  title: string
  subtitle: string
  metric: string
  rows: RankEntry[]
  delay: number
}) {
  return (
    <FadeIn delay={delay}>
      <div className="h-full rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6">
        <div className="mb-5">
          <div className="mb-1 text-[16px] font-bold text-[#FAFAFA]">{title}</div>
          <div className="text-[12px] text-[#555555]">{subtitle}</div>
        </div>

        <div className="mb-2 flex items-center justify-between px-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#333333]">Clipador</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#333333]">{metric}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          {rows.map((r, i) => (
            <RankRow
              key={r.name}
              pos={r.pos}
              avatar={r.avatar}
              name={r.name}
              value={r.value}
              badge={r.badge}
              delay={delay + i * 0.06}
            />
          ))}
        </div>
      </div>
    </FadeIn>
  )
}

export default function RankingPreview() {
  return (
    <section id="ranking" className="bg-black py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="mb-16 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00E5A0]">
            Ranking Global
          </span>
          <h2 className="mb-4 text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-[#FAFAFA] sm:text-[52px]">
            Compita. Vença.
            <br />
            <span className="text-[#888888]">Ganhe 3 meses grátis.</span>
          </h2>
          <p className="mx-auto max-w-xl text-[16px] leading-[1.7] text-[#555555]">
            Dois rankings mensais renovados no dia 1°. Os 3 primeiros de cada categoria ganham cargos exclusivos no Discord e o plano upgradado por 3 meses.
          </p>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-2">
          <RankingCard
            title="👑 Kings of Reach"
            subtitle="Maior alcance total do mês (views somadas)"
            metric="Views"
            rows={KINGS_OF_REACH}
            delay={0.1}
          />
          <RankingCard
            title="🔫 Machine Gun"
            subtitle="Maior sequência de posts consecutivos"
            metric="Streak"
            rows={MACHINE_GUN}
            delay={0.2}
          />
        </div>

        {/* Regras rápidas */}
        <FadeIn delay={0.35} className="mt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              'Apenas posts feitos pelo MultiClip Hub contam',
              'Ranking atualizado em tempo real',
              'Compra de views = desclassificação automática',
              'Premiação no dia 5 do mês seguinte',
            ].map((rule) => (
              <span key={rule} className="flex items-center gap-2 text-[12px] text-[#444444]">
                <span className="text-[#00E5A0]">·</span>
                {rule}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
