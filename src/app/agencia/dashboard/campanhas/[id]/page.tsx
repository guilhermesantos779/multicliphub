'use client'
import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LeaderboardList } from '@/components/campaigns/LeaderboardList'
import { FinalReviewPanel } from '@/components/campaigns/agencia/FinalReviewPanel'
import { useToast } from '@/components/shared/Toast'
import { formatViews } from '@/lib/utils'
import { CATEGORY_LABELS, CONTENT_TYPE_LABELS, type CampaignCategory, type CampaignContentType, type LeaderboardEntry } from '@/types/campaigns.types'
import type { Database } from '@/types/database.types'

type CampaignRow = Database['public']['Tables']['campaigns']['Row']

interface Participant {
  id: string
  userId: string
  joinedAt: string
  status: string
  profile: { id: string; username: string; full_name: string | null; avatar_url: string | null } | null
  position: number | null
  totalViews: number
  totalPosts: number
}

interface Material {
  id: string
  type: string
  label: string | null
  url: string
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Rascunho',
  aguardando_pagamento: 'Aguardando pagamento',
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Encerrada',
  cancelled: 'Cancelada',
}

function getDeadlineInfo(endsAt: string | null, durationDays: number): { isPastDeadline: boolean; daysLabel: string } {
  if (!endsAt) return { isPastDeadline: false, daysLabel: `${durationDays} dias de duração` }
  const diffMs = new Date(endsAt).getTime() - Date.now()
  const isPastDeadline = diffMs < 0
  const daysLabel = isPastDeadline ? 'Prazo encerrado' : `${Math.ceil(diffMs / 86400000)} dias restantes`
  return { isPastDeadline, daysLabel }
}

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const [campaign, setCampaign] = useState<CampaignRow | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch(`/api/agencia/campanhas/${id}`)
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Erro ao carregar campanha')
      setLoading(false)
      return
    }
    setCampaign(json.campaign)
    setParticipants(json.participants ?? [])
    setMaterials(json.materials ?? [])
    setTotalViews(json.totalViews ?? 0)
    setLoading(false)
  }, [id])

  useEffect(() => { load() }, [load])

  const handleRemoveParticipant = async (userId: string) => {
    if (!confirm('Remover esse participante? Os posts dele nessa campanha deixam de contar views.')) return
    const res = await fetch(`/api/agencia/campanhas/${id}/participants/${userId}/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const json = await res.json()
    if (!res.ok) {
      toast(json.error ?? 'Erro ao remover participante', 'error')
      return
    }
    toast('Participante removido da campanha', 'success')
    load()
  }

  const goToProfile = (entry: LeaderboardEntry) => {
    router.push(`/agencia/dashboard/campanhas/${id}/ranking/${entry.userId}`)
  }

  const handleConfirmReview = async () => {
    setConfirming(true)
    const res = await fetch(`/api/campaigns/${id}/review`, { method: 'POST' })
    const json = await res.json()
    setConfirming(false)
    if (!res.ok) {
      toast(json.error ?? 'Erro ao confirmar revisão', 'error')
      return
    }
    toast('Revisão confirmada — pagamento liberado para os clippers.', 'success')
    load()
  }

  if (loading) {
    return (
      <div>
        <Topbar title="Campanha" />
        <div className="mx-auto max-w-3xl space-y-4 p-6">
          <div className="h-44 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
          <div className="h-64 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div>
        <Topbar title="Campanha" />
        <div className="p-6 text-[13px] text-[#666666]">{error ?? 'Campanha não encontrada.'}</div>
      </div>
    )
  }

  const { isPastDeadline, daysLabel } = getDeadlineInfo(campaign.ends_at, campaign.duration_days)
  const reviewAvailable = isPastDeadline || campaign.status === 'completed'

  const prizeStructure = Array.isArray(campaign.prize_structure)
    ? (campaign.prize_structure as { amount?: number }[]).reduce((sum, p) => sum + (p.amount ?? 0), 0)
    : 0
  const totalPrizeReais = campaign.modality === 'cpm' ? campaign.budget_total ?? 0 : prizeStructure
  const totalPrizeCents = Math.round(totalPrizeReais * 100)

  const rankedEntries: LeaderboardEntry[] = participants
    .filter(p => p.position !== null)
    .map(p => ({
      userId: p.userId,
      rank: p.position as number,
      displayName: p.profile?.full_name || p.profile?.username || 'Sem nome',
      avatarUrl: p.profile?.avatar_url ?? null,
      totalViews: p.totalViews,
      postsCount: p.totalPosts,
      earningsCents: 0,
    }))

  return (
    <div>
      <Topbar title={campaign.title} />

      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Link href="/agencia/dashboard/campanhas" className="inline-block text-[12px] text-[#666666] hover:text-white">
          ← Voltar para campanhas
        </Link>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="review" disabled={!reviewAvailable}>
              Revisão Final
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5 pt-4">
            <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#35FDBC]/20 to-[#187D5B]/20">
              {campaign.cover_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={campaign.cover_image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl opacity-40">🎬</div>
              )}
            </div>

            <div>
              <h1 className="text-[18px] font-semibold text-white">{campaign.title}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/[0.08] px-2 py-0.5 font-medium text-[#00E5A0]">
                  {campaign.modality === 'cpm' ? 'CPM' : 'Leaderboard'}
                </span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[#888888]">
                  {CONTENT_TYPE_LABELS[campaign.content_type as CampaignContentType] ?? campaign.content_type}
                </span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[#888888]">
                  {CATEGORY_LABELS[campaign.category as CampaignCategory] ?? campaign.category}
                </span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[#888888]">
                  {STATUS_LABEL[campaign.status] ?? campaign.status}
                </span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[#888888]">
                  {campaign.visibility === 'fechada_agencia' ? 'Fechada pro time' : 'Aberta'}
                </span>
                <span className="text-[#555555]">{daysLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase tracking-wide text-[#444444]">Views totais</div>
                <div className="text-[16px] font-semibold text-white">{formatViews(totalViews)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wide text-[#444444]">Participantes</div>
                <div className="text-[16px] font-semibold text-white">{participants.length}</div>
              </div>
            </div>

            <div className="rounded-lg border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-3 py-2 text-[13px] font-medium text-[#00E5A0]">
              {campaign.required_hashtag}
            </div>

            {campaign.description && (
              <div>
                <h2 className="mb-1.5 text-[13px] font-semibold text-white">Descrição</h2>
                <p className="text-[13px] leading-relaxed text-[#aaaaaa]">{campaign.description}</p>
              </div>
            )}

            {campaign.rules && (
              <div>
                <h2 className="mb-1.5 text-[13px] font-semibold text-white">Regras</h2>
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#aaaaaa]">{campaign.rules}</p>
              </div>
            )}

            {materials.length > 0 && (
              <div>
                <h2 className="mb-2 text-[13px] font-semibold text-white">Materiais de referência</h2>
                <div className="space-y-2">
                  {materials.map(material => (
                    <a
                      key={material.id}
                      href={material.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2.5 text-[13px] text-[#aaaaaa] transition-colors hover:border-white/[0.16] hover:text-white"
                    >
                      <span>{material.type === 'link' ? '🔗' : '🖼️'}</span>
                      <span className="truncate">{material.label || material.url}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="participants" className="pt-4">
            {participants.length === 0 ? (
              <div className="rounded-xl border border-white/[0.06] bg-[#111111] py-10 text-center text-[13px] text-[#444444]">
                Ainda não há participantes nessa campanha.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-medium text-white">
                        {p.profile?.full_name || p.profile?.username || p.userId}
                      </div>
                      <div className="text-[11px] text-[#555555]">
                        {formatViews(p.totalViews)} views · {p.totalPosts} {p.totalPosts === 1 ? 'post' : 'posts'} · {p.status}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveParticipant(p.userId)}
                      className="shrink-0 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#888888] transition-colors hover:border-[#ef4444]/40 hover:text-[#ef4444]"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ranking" className="pt-4">
            <LeaderboardList entries={rankedEntries} isAdminView onEntryClick={goToProfile} showEarnings={false} />
          </TabsContent>

          <TabsContent value="review" className="pt-4">
            {reviewAvailable ? (
              <FinalReviewPanel
                totalPrizeCents={totalPrizeCents}
                entries={rankedEntries}
                onEntryClick={goToProfile}
                confirmedAt={campaign.reviewed_at}
                needsReconfirmation={false}
                onConfirm={handleConfirmReview}
              />
            ) : (
              <div className="py-8 text-center text-[13px] text-[#666666]">
                A revisão final é liberada quando o prazo da campanha terminar.
              </div>
            )}
            {confirming && <div className="mt-2 text-center text-[11px] text-[#555555]">Confirmando...</div>}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
