'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { RemovePostDialog } from '@/components/campaigns/agencia/RemovePostDialog'
import { useToast } from '@/components/shared/Toast'
import {
  getMockCampaignById,
  getMockCampaignPosts,
  getMockClipperByUserId,
  removeMockPost,
} from '@/lib/mocks/campaigns.mock'
import { formatDate, formatViews } from '@/lib/utils'
import type { CampaignPost } from '@/types/campaigns.types'

export default function CampaignClipperProfilePage() {
  const params = useParams<{ id: string; user_id: string }>()
  const { toast } = useToast()
  const campaignId = params.id
  const userId = params.user_id

  const campaign = getMockCampaignById(campaignId)
  const clipper = getMockClipperByUserId(campaignId, userId)
  const [posts, setPosts] = useState<CampaignPost[]>(() => getMockCampaignPosts(campaignId, userId))
  const [postToRemove, setPostToRemove] = useState<CampaignPost | null>(null)

  if (!campaign || !clipper) {
    return (
      <div>
        <Topbar title="Perfil do clipper" />
        <div className="p-6 text-[13px] text-[#666666]">Clipper não encontrado nesta campanha.</div>
      </div>
    )
  }

  const handleRemove = (reason: string) => {
    if (!postToRemove) return
    // TODO: substituir por mutação real em `campaign_posts` quando o
    // schema do Agente 1 estiver disponível.
    removeMockPost(campaignId, userId, postToRemove.id, reason)
    setPosts(prev => prev.map(p => (p.id === postToRemove.id ? { ...p, removed: true, removedReason: reason } : p)))
    setPostToRemove(null)
    toast('Post removido da campanha.', 'success')
  }

  return (
    <div>
      <Topbar title={clipper.displayName} />

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <Link
          href={`/agencia/dashboard/campanhas/${campaignId}`}
          className="inline-block text-[12px] text-[#666666] hover:text-white"
        >
          ← Voltar para o ranking
        </Link>

        <div className="flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#111111] p-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-[#0B0F19]"
            style={{ background: 'linear-gradient(135deg, #35FDBC, #187D5B)' }}
          >
            {clipper.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-white">{clipper.displayName}</div>
            <div className="text-[12px] text-[#666666]">
              #{clipper.rank} no ranking · {formatViews(clipper.totalViews)} views · {clipper.postsCount}{' '}
              {clipper.postsCount === 1 ? 'post' : 'posts'}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-[13px] font-semibold text-white">Posts nesta campanha</h2>
          <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-3 px-4 py-3.5">
                <PlatformIcon platform={post.platform} size={28} />
                <div className="min-w-0 flex-1">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-[13px] text-white hover:underline"
                  >
                    {post.url}
                  </a>
                  <div className="mt-0.5 text-[11px] text-[#555555]">
                    {formatViews(post.views)} views · {formatDate(post.createdAt)}
                  </div>
                  {post.removed && post.removedReason && (
                    <div className="mt-1 text-[11px] text-[#ef4444]">Motivo: {post.removedReason}</div>
                  )}
                </div>
                {post.removed ? (
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
            ))}
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
