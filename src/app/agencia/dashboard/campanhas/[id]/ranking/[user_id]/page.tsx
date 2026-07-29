'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { RemovePostDialog } from '@/components/campaigns/agencia/RemovePostDialog'
import { useToast } from '@/components/shared/Toast'
import { formatDate, formatViews } from '@/lib/utils'
import type { Database } from '@/types/database.types'
import type { CampaignPlatform } from '@/types/campaigns.types'

type Post = Database['public']['Tables']['campaign_posts']['Row']

interface LeaderboardRow {
  user_id: string | null
  position: number | null
  total_views: number | null
  total_posts: number | null
  profile: { id: string; username: string; full_name: string | null; avatar_url: string | null } | null
}

export default function CampaignClipperProfilePage() {
  const { id, user_id: userId } = useParams<{ id: string; user_id: string }>()
  const { toast } = useToast()

  const [clipper, setClipper] = useState<LeaderboardRow | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [postToRemove, setPostToRemove] = useState<Post | null>(null)

  const load = useCallback(async () => {
    const [leaderboardRes, postsRes] = await Promise.all([
      fetch(`/api/campaigns/${id}/leaderboard`),
      fetch(`/api/campaigns/${id}/posts/${userId}`),
    ])
    const leaderboardJson = await leaderboardRes.json()
    const postsJson = await postsRes.json()
    const entry = (leaderboardJson.leaderboard ?? []).find((row: LeaderboardRow) => row.user_id === userId) ?? null
    setClipper(entry)
    setPosts(postsJson.posts ?? [])
    setLoading(false)
  }, [id, userId])

  useEffect(() => { load() }, [load])

  const handleRemove = async (reason: string) => {
    if (!postToRemove) return
    const res = await fetch(`/api/campaigns/${id}/posts/${postToRemove.id}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    const json = await res.json()
    if (!res.ok) {
      toast(json.error ?? 'Erro ao remover post', 'error')
      return
    }
    setPostToRemove(null)
    toast('Post removido da campanha.', 'success')
    load()
  }

  if (loading) {
    return (
      <div>
        <Topbar title="Perfil do clipper" />
        <div className="mx-auto max-w-2xl space-y-4 p-6">
          <div className="h-24 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
        </div>
      </div>
    )
  }

  if (!clipper) {
    return (
      <div>
        <Topbar title="Perfil do clipper" />
        <div className="p-6 text-[13px] text-[#666666]">Clipper não encontrado nesta campanha.</div>
      </div>
    )
  }

  const displayName = clipper.profile?.full_name || clipper.profile?.username || 'Sem nome'

  return (
    <div>
      <Topbar title={displayName} />

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Link
          href={`/agencia/dashboard/campanhas/${id}`}
          className="inline-block text-[12px] text-[#666666] hover:text-white"
        >
          ← Voltar para o ranking
        </Link>

        <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#111111] p-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-[#0B0F19]"
            style={{ background: 'linear-gradient(135deg, #35FDBC, #187D5B)' }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-white">{displayName}</div>
            <div className="text-[12px] text-[#666666]">
              {clipper.position != null ? `#${clipper.position} no ranking · ` : ''}
              {formatViews(clipper.total_views ?? 0)} views · {clipper.total_posts ?? 0}{' '}
              {clipper.total_posts === 1 ? 'post' : 'posts'}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-white">Posts nesta campanha</h2>
          <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
            {posts.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-[#444444]">Nenhum post enviado ainda.</div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="flex items-center gap-3 px-4 py-3.5">
                  <PlatformIcon platform={post.platform as CampaignPlatform} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="block truncate text-[13px] text-white">
                      {post.external_post_id}
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#555555]">
                      {formatViews(post.views_count)} views · {formatDate(post.created_at)}
                    </div>
                    {post.review_status === 'removed' && post.removal_reason && (
                      <div className="mt-1 text-[11px] text-[#ef4444]">Motivo: {post.removal_reason}</div>
                    )}
                  </div>
                  {post.review_status === 'removed' ? (
                    <span className="shrink-0 rounded-full bg-[#ef4444]/10 px-2.5 py-1 text-[11px] font-medium text-[#ef4444]">
                      Removido
                    </span>
                  ) : (
                    <button
                      onClick={() => setPostToRemove(post)}
                      className="shrink-0 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#888888] transition-colors hover:border-[#ef4444]/40 hover:text-[#ef4444]"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <RemovePostDialog
        open={!!postToRemove}
        onOpenChange={open => !open && setPostToRemove(null)}
        onConfirm={handleRemove}
      />
    </div>
  )
}
