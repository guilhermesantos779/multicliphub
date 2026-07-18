'use client'
import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LeaderboardList } from '@/components/campaigns/LeaderboardList'
import { FinalReviewPanel } from '@/components/campaigns/agencia/FinalReviewPanel'
import {
  confirmMockReview,
  getCampaignReviewMeta,
  getMockCampaignById,
  getMockLeaderboard,
} from '@/lib/mocks/campaigns.mock'
import { CATEGORY_LABELS, CONTENT_TYPE_LABELS, type Campaign, type LeaderboardEntry } from '@/types/campaigns.types'

// Isoladas fora do componente: `Date.now()` é impuro e não pode ser chamado
// diretamente durante a renderização (regra react-hooks/purity).
function getDeadlineInfo(campaign: Campaign): { isPastDeadline: boolean; daysLabel: string } {
  if (!campaign.endsAt) {
    return { isPastDeadline: false, daysLabel: `${campaign.durationDays} dias de duração` }
  }
  const diffMs = new Date(campaign.endsAt).getTime() - Date.now()
  const isPastDeadline = diffMs < 0
  const daysLabel = isPastDeadline ? 'Prazo encerrado' : `${Math.ceil(diffMs / 86400000)} dias restantes`
  return { isPastDeadline, daysLabel }
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const campaignId = params.id

  const campaign = getMockCampaignById(campaignId)
  const leaderboard = useMemo(() => getMockLeaderboard(campaignId), [campaignId])
  const [reviewVersion, setReviewVersion] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reviewVersion força releitura do mock store após confirmar a revisão
  const reviewMeta = useMemo(() => getCampaignReviewMeta(campaignId), [campaignId, reviewVersion])

  if (!campaign) {
    return (
      <div>
        <Topbar title="Campanha" />
        <div className="p-6 text-[13px] text-[#666666]">Campanha não encontrada.</div>
      </div>
    )
  }

  const { isPastDeadline, daysLabel } = getDeadlineInfo(campaign)
  const needsReconfirmation =
    !!reviewMeta.confirmedAt &&
    !!reviewMeta.lastModifiedAt &&
    new Date(reviewMeta.lastModifiedAt).getTime() > new Date(reviewMeta.confirmedAt).getTime()

  const totalPrizeCents =
    campaign.modality === 'cpm'
      ? campaign.budgetCents ?? 0
      : campaign.leaderboardPrizes.reduce((sum, p) => sum + p.amountCents, 0)

  const goToProfile = (entry: LeaderboardEntry) => {
    router.push(`/agencia/dashboard/campanhas/${campaignId}/ranking/${entry.userId}`)
  }

  const handleConfirmReview = () => {
    // TODO: substituir por mutação real (`campaigns.status = 'reviewed'` +
    // disparo do payout via Asaas) quando o schema/pagamentos estiverem prontos.
    confirmMockReview(campaignId)
    setReviewVersion(v => v + 1)
  }

  return (
    <div>
      <Topbar title={campaign.title} />

      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <Link href="/agencia/dashboard" className="inline-block text-[12px] text-[#666666] hover:text-white">
          ← Voltar para campanhas
        </Link>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="review" disabled={!isPastDeadline}>
              Revisão Final
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5 pt-4">
            <div className="relative h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#35FDBC]/20 to-[#187D5B]/20">
              {campaign.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={campaign.coverImageUrl} alt="" className="h-full w-full object-cover" />
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
                  {CONTENT_TYPE_LABELS[campaign.contentType]}
                </span>
                <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[#888888]">
                  {CATEGORY_LABELS[campaign.category]}
                </span>
                <span className="text-[#555555]">{daysLabel}</span>
              </div>
            </div>

            <div className="rounded-lg border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-3 py-2 text-[13px] font-medium text-[#00E5A0]">
              {campaign.hashtag}
            </div>

            <div>
              <h2 className="mb-1.5 text-[13px] font-semibold text-white">Descrição</h2>
              <p className="text-[13px] leading-relaxed text-[#aaaaaa]">{campaign.description}</p>
            </div>

            <div>
              <h2 className="mb-1.5 text-[13px] font-semibold text-white">Regras</h2>
              <p className="whitespace-pre-line text-[13px] leading-relaxed text-[#aaaaaa]">{campaign.rules}</p>
            </div>

            {campaign.materials.length > 0 && (
              <div>
                <h2 className="mb-2 text-[13px] font-semibold text-white">Materiais de referência</h2>
                <div className="space-y-2">
                  {campaign.materials.map(material => (
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

          <TabsContent value="ranking" className="pt-4">
            <LeaderboardList entries={leaderboard} isAdminView onEntryClick={goToProfile} />
          </TabsContent>

          <TabsContent value="review" className="pt-4">
            {isPastDeadline ? (
              <FinalReviewPanel
                totalPrizeCents={totalPrizeCents}
                entries={leaderboard}
                onEntryClick={goToProfile}
                confirmedAt={reviewMeta.confirmedAt}
                needsReconfirmation={needsReconfirmation}
                onConfirm={handleConfirmReview}
              />
            ) : (
              <div className="py-8 text-center text-[13px] text-[#666666]">
                A revisão final é liberada quando o prazo da campanha terminar.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
