import Link from 'next/link'
import { formatCurrencyBRL } from '@/lib/utils'
import type { CampaignModality, CampaignStatus } from '@/types/campaigns.types'

/**
 * Shape genérico o suficiente para ser preenchido tanto pelo lado da
 * agência (com campos de moderação) quanto pelo lado do clipper.
 */
export interface CampaignCardData {
  id: string
  title: string
  coverImageUrl: string | null
  agencyName: string
  agencyLogoUrl: string | null
  agencyVerified?: boolean
  modality: CampaignModality
  status: CampaignStatus
  endsAt: string | null
  durationDays: 7 | 20 | 30
  /** Budget total (CPM) ou soma dos prêmios (Leaderboard) */
  highlightValueCents: number
  /** Só relevante no dashboard da agência */
  newPostsSinceLastVisit?: number
  /** Só relevante no dashboard da agência */
  awaitingFinalReview?: boolean
}

interface CampaignCardProps {
  campaign: CampaignCardData
  href: string
}

const MODALITY_LABEL: Record<CampaignModality, string> = {
  cpm: 'CPM',
  leaderboard: 'Leaderboard',
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Rascunho', color: '#888888', bg: 'rgba(136,136,136,0.1)' },
  awaiting_payment: { label: 'Aguardando pagamento', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  active: { label: 'Ativa', color: '#00E5A0', bg: 'rgba(0,229,160,0.1)' },
  ended: { label: 'Encerrada', color: '#888888', bg: 'rgba(136,136,136,0.1)' },
  reviewed: { label: 'Revisada', color: '#3CFFB8', bg: 'rgba(60,255,184,0.1)' },
}

function daysRemainingLabel(endsAt: string | null): string | null {
  if (!endsAt) return null
  const diffMs = new Date(endsAt).getTime() - Date.now()
  const days = Math.ceil(diffMs / 86400000)
  if (days < 0) return 'Prazo encerrado'
  if (days === 0) return 'Encerra hoje'
  return `${days} ${days === 1 ? 'dia restante' : 'dias restantes'}`
}

export function CampaignCard({ campaign, href }: CampaignCardProps) {
  const status = STATUS_CONFIG[campaign.status]
  const deadline = daysRemainingLabel(campaign.endsAt) ?? `${campaign.durationDays} dias de duração`

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111] transition-colors hover:border-[#00E5A0]/30"
    >
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#35FDBC]/20 to-[#187D5B]/20">
        {campaign.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={campaign.coverImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl opacity-40">🎬</div>
        )}
        <span
          className="absolute right-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium backdrop-blur-sm"
          style={{ color: status.color, background: status.bg }}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-[#0B0F19]"
            style={{ background: 'linear-gradient(135deg, #35FDBC, #187D5B)' }}
          >
            {campaign.agencyName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate text-[12px] font-medium text-[#aaaaaa]">{campaign.agencyName}</span>
          {campaign.agencyVerified && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#00E5A0" className="shrink-0">
              <path d="M12 2l2.4 2.2 3.2-.5 1 3.1 3.1 1-0.5 3.2L23 12l-2.2 2.4.5 3.2-3.1 1-1 3.1-3.2-.5L12 23l-2.4-2.2-3.2.5-1-3.1-3.1-1 .5-3.2L1 12l2.2-2.4-.5-3.2 3.1-1 1-3.1 3.2.5L12 2z" />
              <path d="M9 12.5l2 2 4-4.5" stroke="#0B0F19" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <h3 className="text-[14px] font-semibold leading-snug text-white group-hover:text-[#00E5A0] transition-colors">
          {campaign.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/[0.08] px-2 py-0.5 text-[11px] font-medium text-[#00E5A0]">
            {MODALITY_LABEL[campaign.modality]}
          </span>
          <span className="text-[11px] text-[#555555]">{deadline}</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#444444]">
              {campaign.modality === 'cpm' ? 'Budget total' : 'Total em prêmios'}
            </div>
            <div className="text-[16px] font-semibold text-white">
              {formatCurrencyBRL(campaign.highlightValueCents)}
            </div>
          </div>
        </div>

        {campaign.newPostsSinceLastVisit != null && campaign.newPostsSinceLastVisit > 0 && (
          <div className="rounded-lg bg-[#00E5A0]/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-[#00E5A0]">
            {campaign.newPostsSinceLastVisit} {campaign.newPostsSinceLastVisit === 1 ? 'post novo' : 'posts novos'} desde sua última visita
          </div>
        )}
        {campaign.awaitingFinalReview && (
          <div className="rounded-lg bg-[#f59e0b]/[0.08] px-2.5 py-1.5 text-[11px] font-medium text-[#f59e0b]">
            Aguardando sua revisão final
          </div>
        )}
      </div>
    </Link>
  )
}
