'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { CampaignCard, type CampaignCardData } from '@/components/campaigns/CampaignCard'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import type { Database } from '@/types/database.types'
import type { CampaignModality, CampaignStatus } from '@/types/campaigns.types'

type CampaignRow = Database['public']['Tables']['campaigns']['Row'] & {
  total_participants: number
  active_posts_count: number
  total_views: number
  pending_final_review: boolean
}

type StatusFilter = 'all' | CampaignStatus
type SortKey = 'recent' | 'views'

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all: 'Todos os status',
  draft: 'Rascunho',
  aguardando_pagamento: 'Aguardando pagamento',
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Encerrada',
  cancelled: 'Cancelada',
}

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

export default function AgencyCampaignsListPage() {
  const { agencyProfile } = useAgencyProfile()
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('recent')

  useEffect(() => {
    let cancelled = false
    async function run() {
      const res = await fetch('/api/agency/dashboard')
      const json = await res.json()
      if (!cancelled) {
        setCampaigns(json.campaigns ?? [])
        setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  const filteredSorted = useMemo(() => {
    const filtered = statusFilter === 'all' ? campaigns : campaigns.filter(c => c.status === statusFilter)
    const sorted = [...filtered]
    if (sortKey === 'views') {
      sorted.sort((a, b) => b.total_views - a.total_views)
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    return sorted
  }, [campaigns, statusFilter, sortKey])

  return (
    <div>
      <Topbar title="Minhas Campanhas" />

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[16px] font-semibold text-white">Minhas campanhas</h1>
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

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2 text-[12px] text-white outline-none focus:border-[#00E5A0]/50"
          >
            {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map(key => (
              <option key={key} value={key}>{STATUS_FILTER_LABELS[key]}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2 text-[12px] text-white outline-none focus:border-[#00E5A0]/50"
          >
            <option value="recent">Mais recentes</option>
            <option value="views">Mais views</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <CampaignCardSkeleton key={i} />)}
          </div>
        ) : filteredSorted.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-3 text-4xl">📢</div>
            <div className="mb-1 text-[14px] font-medium text-white">
              {campaigns.length === 0 ? 'Nenhuma campanha criada ainda' : 'Nenhuma campanha com esse filtro'}
            </div>
            {campaigns.length === 0 && (
              <>
                <div className="mb-4 text-[12px] text-[#444444]">Crie sua primeira campanha para engajar clippers</div>
                <Link
                  href="/agencia/dashboard/campanhas/nova"
                  className="rounded-lg bg-[#00E5A0] px-4 py-2 text-[13px] font-semibold text-[#0B0F19] hover:bg-[#00B584] transition-colors"
                >
                  Criar campanha
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSorted.map(campaign => (
              <div key={campaign.id} className="space-y-2">
                <CampaignCard
                  campaign={toCardData(campaign, agencyProfile?.name ?? '')}
                  href={`/agencia/dashboard/campanhas/${campaign.id}`}
                />
                <div className="flex items-center justify-between px-1 text-[11px] text-[#555555]">
                  <span>{campaign.total_participants} participantes</span>
                  <span>{campaign.visibility === 'fechada_agencia' ? 'Fechada pro time' : 'Aberta'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
