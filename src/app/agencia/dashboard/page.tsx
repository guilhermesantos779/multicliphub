'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/dashboard/Topbar'
import { CampaignCard, type CampaignCardData } from '@/components/campaigns/CampaignCard'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import { MOCK_CAMPAIGNS } from '@/lib/mocks/campaigns.mock'
import type { Campaign } from '@/types/campaigns.types'
import { formatCurrencyBRL, formatViews } from '@/lib/utils'

function toCardData(campaign: Campaign): CampaignCardData {
  const totalPrizes = campaign.leaderboardPrizes.reduce((sum, p) => sum + p.amountCents, 0)
  return {
    id: campaign.id,
    title: campaign.title,
    coverImageUrl: campaign.coverImageUrl,
    agencyName: campaign.agencyName,
    agencyLogoUrl: campaign.agencyLogoUrl,
    agencyVerified: campaign.agencyVerified,
    modality: campaign.modality,
    status: campaign.status,
    endsAt: campaign.endsAt,
    durationDays: campaign.durationDays,
    highlightValueCents: campaign.modality === 'cpm' ? campaign.budgetCents ?? 0 : totalPrizes,
    newPostsSinceLastVisit: campaign.newPostsSinceLastVisit,
    awaitingFinalReview: campaign.awaitingFinalReview,
  }
}

function CampaignCardSkeleton() {
  return <div className="h-[300px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
}

interface RosterSummaryData {
  activeCount: number
  pendingCount: number
  totalViews: number
  totalEarnings: number
}

function RosterSummaryCard() {
  const [summary, setSummary] = useState<RosterSummaryData | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      const [rosterRes, metricsRes] = await Promise.all([
        fetch('/api/agencia/roster'),
        fetch('/api/agencia/roster/metrics'),
      ])
      const [rosterJson, metricsJson] = await Promise.all([rosterRes.json(), metricsRes.json()])
      if (cancelled) return
      const roster = rosterJson.roster ?? []
      setSummary({
        activeCount: roster.filter((m: { status: string }) => m.status === 'ativo').length,
        pendingCount: roster.filter((m: { status: string }) => m.status === 'pendente').length,
        totalViews: metricsJson.totals?.totalViews ?? 0,
        totalEarnings: metricsJson.totals?.totalEarnings ?? 0,
      })
    }
    run()
    return () => { cancelled = true }
  }, [])

  return (
    <Link
      href="/agencia/dashboard/equipe"
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#111111] p-5 transition-colors hover:border-[#00E5A0]/30"
    >
      <div>
        <h2 className="text-[14px] font-semibold text-white">Seu time</h2>
        <p className="mt-0.5 text-[12px] text-[#666666]">
          {summary ? `${summary.activeCount} ${summary.activeCount === 1 ? 'membro ativo' : 'membros ativos'}` : 'Carregando...'}
          {summary && summary.pendingCount > 0 && ` · ${summary.pendingCount} pendente${summary.pendingCount === 1 ? '' : 's'}`}
        </p>
      </div>
      {summary && (
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#444444]">Views</div>
            <div className="text-[15px] font-semibold text-white">{formatViews(summary.totalViews)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#444444]">Ganhos</div>
            <div className="text-[15px] font-semibold text-[#00E5A0]">{formatCurrencyBRL(summary.totalEarnings * 100)}</div>
          </div>
        </div>
      )}
    </Link>
  )
}

export default function AgencyDashboardPage() {
  const router = useRouter()
  const { agencyProfile, loading: profileLoading } = useAgencyProfile()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(true)

  useEffect(() => {
    if (!profileLoading && !agencyProfile) {
      router.replace('/agencia/onboarding')
    }
  }, [profileLoading, agencyProfile, router])

  useEffect(() => {
    if (!agencyProfile) return
    // TODO: substituir por chamada real ao Supabase
    // (`.from('campaigns').select('*').eq('agency_id', agencyProfile.id)`)
    // quando o schema do Agente 1 estiver disponível neste worktree.
    const timer = setTimeout(() => {
      setCampaigns(MOCK_CAMPAIGNS)
      setCampaignsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [agencyProfile])

  return (
    <div>
      <Topbar title="Campanhas" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-semibold text-white">Suas campanhas</h1>
            <p className="text-[12px] text-[#555555]">Gerencie as campanhas ativas e acompanhe os resultados</p>
          </div>
          <Link
            href="/agencia/dashboard/campanhas/nova"
            className="flex items-center gap-2 rounded-xl bg-[#00E5A0] px-4 py-2.5 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova campanha
          </Link>
        </div>

        {agencyProfile?.kind === 'clipadores' && <RosterSummaryCard />}

        {profileLoading || campaignsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CampaignCardSkeleton key={i} />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 text-4xl">📢</div>
            <div className="mb-1 text-[14px] font-medium text-white">Nenhuma campanha criada ainda</div>
            <div className="mb-4 text-[12px] text-[#444444]">Crie sua primeira campanha para engajar clippers</div>
            <Link
              href="/agencia/dashboard/campanhas/nova"
              className="rounded-lg bg-[#00E5A0] px-4 py-2 text-[13px] font-semibold text-[#0B0F19] hover:bg-[#00B584] transition-colors"
            >
              Criar campanha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                campaign={toCardData(campaign)}
                href={`/agencia/dashboard/campanhas/${campaign.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
