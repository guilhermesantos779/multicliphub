'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { formatViews, formatDate } from '@/lib/utils'
import type { CampaignPlatform } from '@/types/campaigns.types'

const PLATFORM_LABELS: Record<CampaignPlatform, string> = {
  tiktok: 'TikTok',
  instagram: 'Instagram',
  youtube: 'YouTube',
}

interface LeaderboardRow {
  user_id: string | null
  position: number | null
  total_views: number | null
  total_posts: number | null
  profile: { full_name: string | null; username: string | null } | null
}

interface Post {
  id: string
  platform: CampaignPlatform
  external_post_id: string
  views_count: number
  created_at: string
}

export default function ParticipantProfilePage() {
  const { id: campaignId, user_id: userId } = useParams<{ id: string; user_id: string }>()

  const [entry, setEntry] = useState<LeaderboardRow | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      setLoading(true)
      const [leaderboardRes, postsRes] = await Promise.all([
        fetch(`/api/campaigns/${campaignId}/leaderboard`),
        fetch(`/api/campaigns/${campaignId}/posts/${userId}`),
      ])
      const leaderboardJson = await leaderboardRes.json()
      const postsJson = await postsRes.json()
      if (!active) return
      const found = (leaderboardJson.leaderboard ?? []).find((row: LeaderboardRow) => row.user_id === userId) ?? null
      setEntry(found)
      setPosts(postsJson.posts ?? [])
      setLoading(false)
    }
    run()
    return () => { active = false }
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

  if (!entry) {
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

  const displayName = entry.profile?.full_name || entry.profile?.username || 'Clipador'

  return (
    <div>
      <Topbar title={displayName} />
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
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[16px] font-semibold text-white">{displayName}</h1>
            <div className="mt-0.5 text-[12px] text-[#666666]">{entry.total_posts ?? 0} posts na campanha</div>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">Posição</div>
              <div className="text-[18px] font-bold text-[#00E5A0]">#{entry.position}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">Views totais</div>
              <div className="text-[18px] font-bold text-white">{formatViews(entry.total_views ?? 0)}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#111111]">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[14px] font-semibold text-white">Posts públicos</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {posts.length === 0 ? (
              <div className="px-5 py-8 text-center text-[13px] text-[#444444]">Nenhum post publicado ainda.</div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.04] text-[11px] font-semibold text-[#888888]">
                    {PLATFORM_LABELS[post.platform].slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] text-white">{PLATFORM_LABELS[post.platform]}</div>
                    <div className="text-[11px] text-[#555555]">{formatDate(post.created_at)}</div>
                  </div>
                  <div className="shrink-0 text-[12px] font-semibold text-[#00E5A0]">{formatViews(post.views_count)} views</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
