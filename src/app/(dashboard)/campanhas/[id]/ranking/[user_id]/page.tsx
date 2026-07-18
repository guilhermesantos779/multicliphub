'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { fetchParticipantProfile } from '@/lib/mocks/campaigns'
import { formatViews, formatDate } from '@/lib/utils'
import type { LeaderboardEntry, PublicPost } from '@/types/campaigns.types'

const PLATFORM_LABELS: Record<PublicPost['platform'], string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
  kwai: 'Kwai',
}

export default function ParticipantProfilePage() {
  const params = useParams<{ id: string; user_id: string }>()
  const campaignId = params.id
  const userId = params.user_id

  const [entry, setEntry] = useState<LeaderboardEntry | null>(null)
  const [posts, setPosts] = useState<PublicPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundFlag, setNotFoundFlag] = useState(false)

  useEffect(() => {
    let active = true

    async function run() {
      setLoading(true)
      const result = await fetchParticipantProfile(campaignId, userId)
      if (!active) return
      if (!result) {
        setNotFoundFlag(true)
      } else {
        setEntry(result.entry)
        setPosts(result.posts)
      }
      setLoading(false)
    }
    run()

    return () => {
      active = false
    }
  }, [campaignId, userId])

  if (loading) {
    return (
      <div>
        <Topbar title="Participante" />
        <div className="space-y-4 p-6">
          <div className="h-24 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-40 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>
      </div>
    )
  }

  if (notFoundFlag || !entry) {
    return (
      <div>
        <Topbar title="Participante" />
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="text-center">
            <div className="mb-3 text-4xl">👤</div>
            <div className="mb-1 text-[15px] font-medium text-white">Participante não encontrado</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title={entry.fullName} />
      <div className="space-y-5 p-6">
        <Link
          href={`/campanhas/${campaignId}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-[#666666] transition-colors hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Voltar pra campanha
        </Link>

        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#35FDBC] to-[#187D5B] text-[18px] font-bold text-[#0B0F19]">
            {entry.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[16px] font-semibold text-white">{entry.fullName}</h1>
            <div className="mt-0.5 text-[12px] text-[#666666]">{entry.postsCount} posts na campanha</div>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">Posição</div>
              <div className="text-[18px] font-bold text-[#00E5A0]">#{entry.rank}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">Views totais</div>
              <div className="text-[18px] font-bold text-white">{formatViews(entry.totalViews)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111111]">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[14px] font-semibold text-white">Posts públicos</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {posts.map(post => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-[11px] font-semibold text-[#888888]">
                  {PLATFORM_LABELS[post.platform].slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] text-white">{PLATFORM_LABELS[post.platform]}</div>
                  <div className="text-[11px] text-[#555555]">{formatDate(post.postedAt)}</div>
                </div>
                <div className="shrink-0 text-[12px] font-semibold text-[#00E5A0]">{formatViews(post.views)} views</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
