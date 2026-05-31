'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ACTIVE_METRIC_SOURCE, SOURCE_LABELS } from '@/lib/metrics/source'
import { formatNumber } from '@/lib/format'
import { PlatformIcon } from './icons/PlatformIcon'
import { PLATFORM_META } from '@/lib/profile'

interface PlatformRankingProps {
  userId: string // the profile being viewed
}

// Only the 3 platforms we distribute to
const PLATFORMS = ['instagram', 'youtube', 'tiktok'] as const
type RankedPlatform = (typeof PLATFORMS)[number]

const MONTHS_FULL_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const POS_COLOR: Record<number, string> = {
  1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32',
}

interface RankRow {
  user_id: string
  score: number
  rank_position: number | null
}
interface MiniProfile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export function PlatformRanking({ userId }: PlatformRankingProps) {
  const [byPlatform, setByPlatform] = useState<Record<RankedPlatform, RankRow[]>>({
    instagram: [], youtube: [], tiktok: [],
  })
  const [ownRank, setOwnRank] = useState<Record<RankedPlatform, number | null>>({
    instagram: null, youtube: null, tiktok: null,
  })
  const [profiles, setProfiles] = useState<Record<string, MiniProfile>>({})

  const now = new Date()
  const labels = SOURCE_LABELS[ACTIVE_METRIC_SOURCE]

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const mKey = monthKey(now)

      const { data: rows } = await supabase
        .from('platform_rankings')
        .select('user_id, platform, score, rank_position')
        .eq('period_month', mKey)
        .eq('source', ACTIVE_METRIC_SOURCE)
        .order('score', { ascending: false })
      if (cancelled) return

      const grouped: Record<RankedPlatform, RankRow[]> = { instagram: [], youtube: [], tiktok: [] }
      const own: Record<RankedPlatform, number | null> = { instagram: null, youtube: null, tiktok: null }
      for (const r of (rows ?? []) as (RankRow & { platform: RankedPlatform })[]) {
        if (!grouped[r.platform]) continue
        grouped[r.platform].push({ user_id: r.user_id, score: r.score, rank_position: r.rank_position })
        if (r.user_id === userId) own[r.platform] = r.rank_position
      }

      const top: Record<RankedPlatform, RankRow[]> = {
        instagram: grouped.instagram.slice(0, 5),
        youtube: grouped.youtube.slice(0, 5),
        tiktok: grouped.tiktok.slice(0, 5),
      }

      const ids = Array.from(new Set(PLATFORMS.flatMap((p) => top[p].map((r) => r.user_id))))
      const profMap: Record<string, MiniProfile> = {}
      if (ids.length > 0) {
        const { data: profs } = await supabase
          .from('public_profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', ids)
        for (const p of (profs ?? []) as MiniProfile[]) profMap[p.id] = p
      }

      if (cancelled) return
      setByPlatform(top)
      setOwnRank(own)
      setProfiles(profMap)
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <section>
      <h2 className="mb-1 font-display text-[15px] font-semibold text-white">Ranking Global</h2>
      <p className="mb-5 text-[12px] text-white/40">
        {MONTHS_FULL_PT[now.getMonth()]} de {now.getFullYear()} · Atualizado por{' '}
        {ACTIVE_METRIC_SOURCE === 'posts' ? 'posts publicados' : 'views'}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const meta = PLATFORM_META[platform]
          const rows = byPlatform[platform]
          const myRank = ownRank[platform]
          return (
            <div key={platform} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-md">
              {/* Column header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: `${meta.color}1A`, color: meta.color }}
                  >
                    <PlatformIcon platform={platform} size={16} />
                  </span>
                  <span className="text-[13px] font-semibold text-white">{meta.label}</span>
                </div>
                <span className="text-[11px] font-medium text-white/40">
                  {myRank ? `#${myRank}` : 'sem ranking'}
                </span>
              </div>

              {rows.length === 0 ? (
                <p className="py-6 text-center text-[12px] text-white/30">
                  Participe publicando para entrar no ranking!
                </p>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {rows.map((row, i) => {
                    const pos = i + 1
                    const prof = profiles[row.user_id]
                    const isOwner = row.user_id === userId
                    const initial = (prof?.full_name || prof?.username || 'U').charAt(0).toUpperCase()
                    return (
                      <li
                        key={row.user_id}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5"
                        style={isOwner ? { background: 'rgba(145,70,255,0.08)' } : undefined}
                      >
                        <span
                          className="w-4 shrink-0 text-center text-[12px] font-bold"
                          style={{ color: POS_COLOR[pos] ?? 'rgba(255,255,255,0.4)' }}
                        >
                          {pos}
                        </span>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1a1a1a] text-[10px] font-bold text-white/70">
                          {prof?.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={prof.avatar_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            initial
                          )}
                        </div>
                        {prof?.username ? (
                          <Link
                            href={`/perfil/${prof.username}`}
                            className="flex-1 truncate text-[12px] text-white/80 transition-colors hover:text-[#9146FF]"
                          >
                            @{prof.username}
                          </Link>
                        ) : (
                          <span className="flex-1 truncate text-[12px] text-white/60">Anônimo</span>
                        )}
                        <span className="shrink-0 text-[12px] font-semibold text-white">
                          {formatNumber(row.score)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-center text-[11px] text-white/40">
        Publique mais para subir no ranking! ({labels.rankingMetric})
      </p>
    </section>
  )
}
