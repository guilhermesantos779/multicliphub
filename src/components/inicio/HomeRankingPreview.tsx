'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { RankAvatar } from '@/components/ranking/RankAvatar'
import { createClient } from '@/lib/supabase/client'
import { formatViews, cn } from '@/lib/utils'

interface ViewRow {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string | null
  source: string
  score: number | string
}

interface Entry {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string | null
  score: number
}

type Source = 'views' | 'posts'

const SOURCE_TABS: { id: Source; label: string; emoji: string; sub: string }[] = [
  { id: 'views', label: 'Kings of Reach', emoji: '👑', sub: 'Mais views' },
  { id: 'posts', label: 'Machine Gun', emoji: '🔫', sub: 'Mais consistência' },
]

const PREVIEW_LIMIT = 5

function currentPeriod() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

export function HomeRankingPreview() {
  const [source, setSource] = useState<Source>('views')
  const [rows, setRows] = useState<ViewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('platform_rankings_public')
        .select('id, username, full_name, avatar_url, plan, source, score')
        .eq('source', source)
        .eq('period_month', currentPeriod())
      if (!cancelled) {
        setRows((data as ViewRow[]) || [])
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [source])

  const entries = useMemo<Entry[]>(() => {
    const map = new Map<string, Entry>()
    for (const r of rows) {
      const cur = map.get(r.id)
      if (cur) cur.score += Number(r.score)
      else map.set(r.id, { id: r.id, username: r.username, full_name: r.full_name, avatar_url: r.avatar_url, plan: r.plan, score: Number(r.score) })
    }
    return [...map.values()].sort((a, b) => b.score - a.score).slice(0, PREVIEW_LIMIT)
  }, [rows])

  const unit = source === 'views' ? 'views' : 'posts'

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {SOURCE_TABS.map(tab => {
            const active = source === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSource(tab.id)}
                className={cn(
                  'rounded-xl border px-3.5 py-2 text-left text-[12px] font-bold transition-all',
                  active ? 'border-mint/40 bg-mint/[0.08] text-white' : 'border-white/[0.06] bg-white/[0.02] text-[#888888] hover:border-white/[0.12]'
                )}
              >
                {tab.emoji} {tab.label}
              </button>
            )
          })}
        </div>
        <Link href="/ranking" className="text-[12px] font-medium text-mint hover:underline">
          Ver ranking completo →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] py-8 text-center text-[13px] text-[#555555]">
          Ainda não há dados nesse ranking.
        </div>
      ) : (
        <div className="space-y-1.5">
          {entries.map((entry, i) => {
            const displayName = entry.full_name || (entry.username ? `@${entry.username}` : 'Anônimo')
            const inner = (
              <>
                <span className="w-6 shrink-0 text-center text-[15px] font-black text-[#555555]">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <RankAvatar fullName={entry.full_name} username={entry.username} avatarUrl={entry.avatar_url} plan={entry.plan} size={36} variant="compact" />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-white">{displayName}</span>
                <span className="shrink-0 text-[13px] font-bold text-white">
                  {formatViews(entry.score)} <span className="text-[10px] font-light text-[#777777]">{unit}</span>
                </span>
              </>
            )
            return entry.username ? (
              <Link key={entry.id} href={`/perfil/${entry.username}`} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-mint/20">
                {inner}
              </Link>
            ) : (
              <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
                {inner}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
