'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Topbar } from '@/components/dashboard/Topbar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HashtagBadge } from '@/components/campaigns/clipper/HashtagBadge'
import { ReferenceMaterialsList } from '@/components/campaigns/clipper/ReferenceMaterialsList'
import { SubmissionsPanel } from '@/components/campaigns/clipper/SubmissionsPanel'
import { LeaderboardList } from '@/components/campaigns/clipper/LeaderboardList'
import { useToast } from '@/components/shared/Toast'
import { useUser } from '@/hooks/useUser'
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_LABELS,
  MODALITY_LABELS,
  formatCurrency,
  formatDaysRemaining,
} from '@/lib/campaigns/labels'
import type { Campaign, CampaignSubmission, LeaderboardEntry } from '@/types/campaigns-clipper.types'

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>()
  const campaignId = params.id
  const { toast } = useToast()
  const { profile } = useUser()

  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFoundFlag, setNotFoundFlag] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [submissions, setSubmissions] = useState<CampaignSubmission[]>([])
  const [joining, setJoining] = useState(false)

  const loadCampaign = useCallback(async () => {
    const res = await fetch(`/api/campaigns/${campaignId}`)
    const json = await res.json()
    if (!res.ok) {
      setNotFoundFlag(true)
      setLoading(false)
      return
    }
    setCampaign(json.campaign)
    setLoading(false)
  }, [campaignId])

  const loadLeaderboard = useCallback(async () => {
    const res = await fetch(`/api/campaigns/${campaignId}/leaderboard`)
    const json = await res.json()
    setLeaderboard(
      (json.leaderboard ?? []).map((row: { user_id: string; position: number; total_views: number; total_posts: number; profile: { full_name: string | null; username: string | null; avatar_url: string | null } | null }) => ({
        userId: row.user_id,
        rank: row.position,
        fullName: row.profile?.full_name || row.profile?.username || 'Clipador',
        avatarUrl: row.profile?.avatar_url ?? null,
        totalViews: row.total_views,
        postsCount: row.total_posts,
        earnings: null,
      }))
    )
  }, [campaignId])

  const loadSubmissions = useCallback(async () => {
    if (!profile) return
    const res = await fetch(`/api/campaigns/${campaignId}/posts/${profile.id}`)
    const json = await res.json()
    setSubmissions(
      (json.posts ?? []).map((post: { id: string; platform: CampaignSubmission['platform']; external_post_id: string; views_count: number; created_at: string }) => ({
        id: post.id,
        campaignId,
        userId: profile.id,
        platform: post.platform,
        url: post.external_post_id,
        views: post.views_count,
        detectedAt: post.created_at,
      }))
    )
  }, [campaignId, profile])

  useEffect(() => {
    setLoading(true)
    loadCampaign()
    loadLeaderboard()
  }, [loadCampaign, loadLeaderboard])

  useEffect(() => {
    if (campaign?.isParticipating) loadSubmissions()
  }, [campaign?.isParticipating, loadSubmissions])

  const handleJoin = async () => {
    setJoining(true)
    const res = await fetch(`/api/campaigns/${campaignId}/join`, { method: 'POST' })
    const json = await res.json()
    setJoining(false)
    if (!res.ok) {
      toast(json.error ?? 'Erro ao entrar na campanha', 'error')
      return
    }
    toast('Você entrou na campanha! Publique com a hashtag para começar a pontuar.', 'success')
    loadCampaign()
  }

  if (loading) {
    return (
      <div>
        <Topbar title="Campanha" />
        <div className="space-y-4 p-6">
          <div className="h-40 animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-white/[0.04]" />
          <div className="h-24 animate-pulse rounded-xl bg-white/[0.04]" />
        </div>
      </div>
    )
  }

  if (notFoundFlag || !campaign) {
    return (
      <div>
        <Topbar title="Campanha" />
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="text-center">
            <div className="mb-3 text-4xl">🔍</div>
            <div className="mb-1 text-[15px] font-medium text-white">Campanha não encontrada</div>
            <div className="text-[13px] text-[#444444]">Ela pode ter sido encerrada ou removida.</div>
          </div>
        </div>
      </div>
    )
  }

  const canJoin = campaign.status === 'active' && !campaign.isParticipating

  return (
    <div>
      <Topbar title={campaign.title} />
      <div className="p-6">
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            {campaign.isParticipating && <TabsTrigger value="submissions">Meus envios</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]">
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#35FDBC] to-[#187D5B]">
                <span className="text-5xl font-bold text-[#0B0F19]/70">
                  {campaign.agencyName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-white">{campaign.agencyName}</span>
                    {campaign.agencyVerified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#00E5A0">
                        <path d="M12 2l2.4 2.1 3.2-.5 1 3.1 3.1 1-.5 3.2L23.3 13l-2.1 2.4.5 3.2-3.1 1-1 3.1-3.2-.5L12 24.4l-2.4-2.2-3.2.5-1-3.1-3.1-1 .5-3.2L.7 13l2.1-2.4-.5-3.2 3.1-1 1-3.1 3.2.5L12 2z" />
                        <path d="M9.3 12.6l1.8 1.8 3.6-3.9" stroke="#0B0F19" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-[#888888]">
                      {MODALITY_LABELS[campaign.modality]}
                    </span>
                  </div>
                  <span className="text-[13px] font-medium text-[#00E5A0]">
                    {formatDaysRemaining(campaign.endsAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] text-[#888888]">
                    {CATEGORY_LABELS[campaign.category]}
                  </span>
                  <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] text-[#888888]">
                    {CONTENT_TYPE_LABELS[campaign.contentType]}
                  </span>
                </div>

                <p className="text-[13px] leading-relaxed text-[#aaaaaa]">{campaign.description}</p>

                <HashtagBadge hashtag={campaign.hashtag} />

                <div>
                  <h3 className="mb-2 text-[13px] font-semibold text-white">Regras</h3>
                  <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#888888]">{campaign.rules}</p>
                </div>

                <div>
                  <h3 className="mb-2 text-[13px] font-semibold text-white">Materiais de referência</h3>
                  <ReferenceMaterialsList materials={campaign.referenceMaterials} />
                </div>

                <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">
                      {campaign.modality === 'cpm' ? 'CPM' : 'Premiação'}
                    </div>
                    <div className="text-[16px] font-semibold text-[#00E5A0]">
                      {campaign.modality === 'cpm'
                        ? campaign.cpmRate
                          ? `${formatCurrency(campaign.cpmRate)} / 1k views`
                          : '—'
                        : campaign.prizes?.map(p => `${p.position}º: ${formatCurrency(p.amount)}`).join(' · ')}
                    </div>
                  </div>
                  <div className="text-right text-[12px] text-[#666666]">
                    {campaign.participantsCount} participantes
                  </div>
                </div>

                {campaign.isParticipating ? (
                  <div className="rounded-lg bg-[#00E5A0]/[0.08] px-3 py-2.5 text-center text-[12px] font-medium text-[#00E5A0]">
                    Você já está participando — publique com a hashtag acima para pontuar.
                  </div>
                ) : canJoin ? (
                  <button
                    type="button"
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-60"
                  >
                    {joining ? 'Entrando...' : 'Participar da campanha'}
                  </button>
                ) : (
                  <div className="rounded-lg bg-white/[0.04] px-3 py-2.5 text-center text-[12px] text-[#666666]">
                    Essa campanha não está aceitando novos participantes no momento.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="mt-5">
            <LeaderboardList
              campaignId={campaign.id}
              entries={leaderboard}
              isAdminView={false}
              currentUserId={profile?.id}
            />
          </TabsContent>

          {campaign.isParticipating && (
            <TabsContent value="submissions" className="mt-5">
              <SubmissionsPanel hashtag={campaign.hashtag} submissions={submissions} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
