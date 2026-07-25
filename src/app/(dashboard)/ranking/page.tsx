'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { Podium, type RankEntry } from '@/components/ranking/Podium'
import { RankAvatar } from '@/components/ranking/RankAvatar'
import { RankingCarousel } from '@/components/ranking/RankingCarousel'
import { SocialLinks } from '@/components/ranking/SocialLinks'
import { useUser } from '@/hooks/useUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { createClient } from '@/lib/supabase/client'
import { ACTIVE_METRIC_SOURCE, type MetricSource } from '@/lib/metrics/source'
import { normalizePlan, PLAN_META } from '@/lib/profile'
import { cn, formatViews } from '@/lib/utils'

interface ViewRow {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string | null
  platform: string
  source: string
  score: number | string
  rank_position: number | null
}

type PlatformFilter = 'all' | 'tiktok' | 'instagram' | 'youtube'

const SOURCE_TABS: { id: MetricSource; label: string; sub: string }[] = [
  { id: 'views', label: 'Kings of Reach', sub: 'Mais views' },
  { id: 'posts', label: 'Machine Gun', sub: 'Mais consistência' },
]

const PLATFORM_CHIPS: { id: PlatformFilter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
]

const UNIT: Record<MetricSource, string> = { views: 'views', posts: 'posts' }

function currentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function monthLabel() {
  const raw = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date())
  return raw.charAt(0).toUpperCase() + raw.slice(1) // "Junho de 2026"
}

function daysUntilReset() {
  const d = new Date()
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  return Math.max(1, Math.ceil((next.getTime() - d.getTime()) / 86_400_000))
}

export default function RankingPage() {
  const { profile } = useUser()
  const { markItem } = useOnboarding()
  const [rows, setRows] = useState<ViewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'ranking' | 'como'>('ranking')
  const [source, setSource] = useState<MetricSource>(ACTIVE_METRIC_SOURCE)
  const [platform, setPlatform] = useState<PlatformFilter>('all')

  // Visiting Ranking completes that onboarding step.
  useEffect(() => {
    if (profile) markItem('check_ranking')
  }, [profile, markItem])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('platform_rankings_public')
        .select('id, username, full_name, avatar_url, plan, platform, source, score, rank_position')
        .eq('source', source)
        .eq('period_month', currentPeriod())
      if (cancelled) return
      setRows((data as ViewRow[]) || [])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [source])

  // Filter by platform + aggregate score per user → ranked list.
  const entries = useMemo<RankEntry[]>(() => {
    const filtered = platform === 'all' ? rows : rows.filter(r => r.platform === platform)
    const map = new Map<string, RankEntry>()
    for (const r of filtered) {
      const cur = map.get(r.id)
      if (cur) cur.score += Number(r.score)
      else map.set(r.id, {
        id: r.id,
        username: r.username,
        full_name: r.full_name,
        avatar_url: r.avatar_url,
        plan: r.plan,
        score: Number(r.score),
      })
    }
    return [...map.values()].sort((a, b) => b.score - a.score)
  }, [rows, platform])

  const myId = profile?.id
  const myPosition = entries.findIndex(e => e.id === myId) + 1
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  const unit = UNIT[source]
  const days = daysUntilReset()

  return (
    <div>
      <Topbar title="Ranking" />
      <div className="p-4 space-y-5 md:p-6">

        {/* Top-level tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-[#111111] p-1 w-fit">
          {(['ranking', 'como'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors',
                tab === t ? 'bg-white/[0.08] text-white' : 'text-[#555555] hover:text-[#888888]'
              )}
            >
              {t === 'ranking' ? '🏆 Ranking' : '❓ Como funciona'}
            </button>
          ))}
        </div>

        {tab === 'como' ? (
          <div className="space-y-5">
            <RankingCarousel />
            <SocialLinks />
          </div>
        ) : (
          <>
            {/* Month + reset countdown */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[18px] font-bold text-white">{monthLabel()}</h2>
                <p className="text-[12px] text-[#888888]">Ranking mensal · todo mês zera</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#9146FF]/25 bg-[#9146FF]/[0.06] px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00E5A0] animate-pulse" style={{ boxShadow: '0 0 6px #00E5A0' }} />
                <span className="text-[12px] text-white/80">
                  Reseta em <span className="font-bold text-white">{days} {days === 1 ? 'dia' : 'dias'}</span>
                </span>
              </div>
            </div>

            {/* Source tabs */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:w-fit">
              {SOURCE_TABS.map(s => {
                const active = source === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setSource(s.id)}
                    className={cn(
                      'relative overflow-hidden rounded-xl border px-4 py-2.5 text-left transition-all sm:min-w-[160px]',
                      active
                        ? 'border-[#9146FF]/40 bg-[#9146FF]/[0.08]'
                        : 'border-white/[0.06] bg-[#111111] hover:border-white/[0.12]'
                    )}
                  >
                    <div className={cn('text-[13px] font-bold', active ? 'text-white' : 'text-[#999999]')}>
                      {s.id === 'views' ? '👑 ' : '🔫 '}{s.label}
                    </div>
                    <div className="text-[11px] text-[#777777]">{s.sub}</div>
                    {active && (
                      <motion.div layoutId="source-underline" className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#9146FF] to-[#00E5A0]" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Platform chips */}
            <div className="flex flex-wrap gap-2">
              {PLATFORM_CHIPS.map(c => {
                const active = platform === c.id
                return (
                  <button
                    key={c.id}
                    onClick={() => setPlatform(c.id)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors',
                      active
                        ? 'border-[#00E5A0]/40 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                        : 'border-white/[0.08] bg-[#111111] text-[#888888] hover:text-white'
                    )}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>

            {/* Sticky "Sua posição" bar */}
            <div className="sticky top-16 z-20 rounded-xl border border-[#9146FF]/25 bg-[#15101f]/90 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-[#aaaaaa]">Sua posição</span>
                {myPosition > 0 ? (
                  <span className="text-[15px] font-bold text-white">
                    #{myPosition}
                    <span className="ml-2 text-[12px] font-normal text-[#888888]">
                      {formatViews(entries[myPosition - 1]!.score)} {unit}
                    </span>
                  </span>
                ) : (
                  <Link href="/upload" className="text-[12px] font-semibold text-[#00E5A0] hover:underline">
                    Publique para entrar →
                  </Link>
                )}
              </div>
            </div>

            {loading ? (
              <PodiumSkeleton />
            ) : entries.length === 0 ? (
              <EmptyState source={source} />
            ) : (
              <>
                {/* Champion podium */}
                <div className="pt-2 pb-2">
                  <Podium top3={top3} myId={myId} unit={unit} />
                </div>

                {/* Big cards — positions 4+ */}
                {rest.length > 0 && (
                  <div className="space-y-2.5">
                    {rest.map((entry, i) => (
                      <RankRow key={entry.id} entry={entry} position={i + 4} isMe={entry.id === myId} unit={unit} />
                    ))}
                  </div>
                )}

                {/* Motivational nudge when outside the Top 10 (or unranked) */}
                {(myPosition === 0 || myPosition > 10) && (
                  <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#9146FF]/[0.06] to-transparent p-5 text-center">
                    <p className="text-[14px] font-semibold text-white">
                      {myPosition === 0 ? 'Você ainda não está no ranking' : 'Falta pouco para o Top 10!'}
                    </p>
                    <p className="mt-1 text-[12px] text-[#888888]">
                      Publique mais clipes para subir e brilhar entre os melhores do mês.
                    </p>
                    <Link
                      href="/upload"
                      className="mt-3 inline-block rounded-lg bg-[#9146FF] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
                    >
                      Publicar agora
                    </Link>
                  </div>
                )}

                <SocialLinks />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function RankRow({ entry, position, isMe, unit }: { entry: RankEntry; position: number; isMe: boolean; unit: string }) {
  const planMeta = PLAN_META[normalizePlan(entry.plan)]
  const displayName = entry.full_name || (entry.username ? `@${entry.username}` : 'Anônimo')

  const Inner = (
    <>
      <span className="w-8 shrink-0 text-center text-[18px] font-black text-[#555555]">{position}</span>
      <RankAvatar
        fullName={entry.full_name}
        username={entry.username}
        avatarUrl={entry.avatar_url}
        plan={entry.plan}
        size={44}
        variant="compact"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-semibold text-white">{displayName}</span>
          {isMe && <span className="rounded-full bg-[#9146FF]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#9146FF]">Você</span>}
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {entry.username && <span className="truncate text-[#777777]">@{entry.username}</span>}
          <span className="rounded-full px-1.5 py-0.5 font-semibold" style={{ color: planMeta.color, background: `${planMeta.color}1A` }}>
            {planMeta.label}
          </span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="text-[15px] font-bold text-white">{formatViews(entry.score)}</div>
        <div className="text-[10px] text-[#777777]">{unit}</div>
      </div>
    </>
  )

  const base = cn(
    'flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 hover:-translate-y-0.5',
    isMe
      ? 'border-[#9146FF]/50 bg-[#9146FF]/[0.06] shadow-[0_0_20px_rgba(145,70,255,0.15)]'
      : 'border-white/[0.06] bg-[#111111] hover:border-white/[0.14]'
  )

  return entry.username ? (
    <Link href={`/perfil/${entry.username}`} className={base}>{Inner}</Link>
  ) : (
    <div className={base}>{Inner}</div>
  )
}

function EmptyState({ source }: { source: MetricSource }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111111] py-14 text-center">
      <div className="mb-3 text-4xl">{source === 'views' ? '👑' : '🔫'}</div>
      <p className="text-[15px] font-semibold text-white">
        {source === 'views' ? 'Ranking de views chegando' : 'Ainda não há creators no ranking'}
      </p>
      <p className="mx-auto mt-1 max-w-xs text-[12px] text-[#888888]">
        {source === 'views'
          ? 'O ranking de views é liberado com a integração das plataformas. Por enquanto, dispute o Machine Gun!'
          : 'Seja o primeiro a publicar e dominar o ranking deste mês.'}
      </p>
      <Link
        href="/upload"
        className="mt-4 inline-block rounded-lg bg-[#00E5A0] px-4 py-2 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
      >
        Publicar clipe
      </Link>
    </div>
  )
}

function PodiumSkeleton() {
  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {[16, 24, 12].map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/[0.06]" />
          <div className="w-20 animate-pulse rounded-t-xl bg-white/[0.04]" style={{ height: h * 4 }} />
        </div>
      ))}
    </div>
  )
}
