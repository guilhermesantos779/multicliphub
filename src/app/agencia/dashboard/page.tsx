'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Topbar } from '@/components/dashboard/Topbar'
import { CampaignCard, type CampaignCardData } from '@/components/campaigns/CampaignCard'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import type { Database } from '@/types/database.types'
import type { CampaignModality, CampaignStatus } from '@/types/campaigns.types'
import { formatCurrencyBRL, formatViews } from '@/lib/utils'

type CampaignRow = Database['public']['Tables']['campaigns']['Row'] & {
  total_participants: number
  active_posts_count: number
  total_views: number
  pending_final_review: boolean
}

const RECENT_CAMPAIGNS_LIMIT = 4

function toCardData(campaign: CampaignRow, agencyName: string): CampaignCardData {
  const prizeTotal = Array.isArray(campaign.prize_structure)
    ? (campaign.prize_structure as { amount?: number }[]).reduce((sum, p) => sum + (p.amount ?? 0), 0)
    : 0
  const highlightValue = campaign.modality === 'cpm' ? (campaign.budget_total ?? 0) : prizeTotal

  return {
    id: campaign.id,
    title: campaign.title,
    coverImageUrl: campaign.cover_image_url,
    agencyName,
    agencyLogoUrl: null,
    modality: campaign.modality as CampaignModality,
    status: campaign.status as CampaignStatus,
    endsAt: campaign.ends_at,
    durationDays: campaign.duration_days as CampaignCardData['durationDays'],
    highlightValueCents: Math.round(highlightValue * 100),
    awaitingFinalReview: campaign.status === 'completed' && campaign.reviewed_at === null,
  }
}

function CampaignCardSkeleton() {
  return <div className="h-[300px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
}

function campaignBudget(campaign: CampaignRow): number {
  const prizeTotal = Array.isArray(campaign.prize_structure)
    ? (campaign.prize_structure as { amount?: number }[]).reduce((sum, p) => sum + (p.amount ?? 0), 0)
    : 0
  return campaign.modality === 'cpm' ? (campaign.budget_total ?? 0) : prizeTotal
}

interface SummaryStatCardProps {
  label: string
  value: string
  icon: string
}

function SummaryStatCard({ label, value, icon }: SummaryStatCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-[#555555]">
        <span>{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 text-[22px] font-semibold text-white">{value}</div>
    </div>
  )
}

function SummaryStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[76px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
      ))}
    </div>
  )
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
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-[#111111] p-5">
      <div>
        <h2 className="text-[14px] font-semibold text-white">Seu time</h2>
        <p className="mt-0.5 text-[12px] text-[#666666]">
          {summary ? `${summary.activeCount} ${summary.activeCount === 1 ? 'membro ativo' : 'membros ativos'}` : 'Carregando...'}
          {summary && summary.pendingCount > 0 && ` · ${summary.pendingCount} pendente${summary.pendingCount === 1 ? '' : 's'}`}
        </p>
      </div>
      <div className="flex items-center gap-6">
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
        <Link
          href="/agencia/dashboard/time"
          className="shrink-0 rounded-lg border border-white/[0.08] px-3 py-2 text-[12px] font-medium text-[#aaaaaa] transition-colors hover:border-[#00E5A0]/30 hover:text-white"
        >
          Ver time completo
        </Link>
      </div>
    </div>
  )
}

export default function AgencyDashboardPage() {
  const router = useRouter()
  const { agencyProfile, loading: profileLoading } = useAgencyProfile()
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
  const [campaignsLoading, setCampaignsLoading] = useState(true)

  useEffect(() => {
    if (!profileLoading && !agencyProfile) {
      router.replace('/agencia/onboarding')
    }
  }, [profileLoading, agencyProfile, router])

  useEffect(() => {
    if (!agencyProfile) return
    let cancelled = false
    async function run() {
      const res = await fetch('/api/agency/dashboard')
      const json = await res.json()
      if (!cancelled) {
        setCampaigns(json.campaigns ?? [])
        setCampaignsLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [agencyProfile])

  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, RECENT_CAMPAIGNS_LIMIT)

  const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length
  const totalParticipants = campaigns.reduce((sum, c) => sum + c.total_participants, 0)
  const totalViews = campaigns.reduce((sum, c) => sum + c.total_views, 0)
  const totalBudget = campaigns.reduce((sum, c) => sum + campaignBudget(c), 0)

  return (
    <div>
      <Topbar title="Campanhas" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[16px] font-semibold text-white">Visão geral</h1>
            <p className="text-[12px] text-[#555555]">Acompanhe as campanhas mais recentes da sua agência</p>
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

        {campaignsLoading ? (
          <SummaryStatsSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <SummaryStatCard icon="📢" label="Campanhas ativas" value={String(activeCampaignsCount)} />
            <SummaryStatCard icon="👥" label="Participantes" value={String(totalParticipants)} />
            <SummaryStatCard icon="👁️" label="Views totais" value={formatViews(totalViews)} />
            <SummaryStatCard icon="💰" label="Orçamento movimentado" value={formatCurrencyBRL(Math.round(totalBudget * 100))} />
          </div>
        )}

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
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentCampaigns.map(campaign => (
                <CampaignCard
                  key={campaign.id}
                  campaign={toCardData(campaign, agencyProfile?.name ?? '')}
                  href={`/agencia/dashboard/campanhas/${campaign.id}`}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href="/agencia/dashboard/campanhas"
                className="rounded-lg border border-white/[0.08] px-4 py-2 text-[12px] font-medium text-[#aaaaaa] transition-colors hover:border-[#00E5A0]/30 hover:text-white"
              >
                Ver todas as campanhas ({campaigns.length})
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
