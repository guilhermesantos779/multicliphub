'use client'
import Link from 'next/link'
import type { Campaign } from '@/types/campaigns-clipper.types'
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_LABELS,
  MODALITY_LABELS,
  formatCurrency,
  formatDaysRemaining,
} from '@/lib/campaigns/labels'

export type CampaignCardData = Pick<
  Campaign,
  | 'id'
  | 'title'
  | 'agencyName'
  | 'agencyLogoUrl'
  | 'agencyVerified'
  | 'modality'
  | 'category'
  | 'contentType'
  | 'endsAt'
  | 'cpmRate'
  | 'totalBudget'
  | 'prizes'
  | 'participantsCount'
  | 'isParticipating'
>

interface CampaignCardProps {
  campaign: CampaignCardData
}

function highlightValue(campaign: CampaignCardData): string {
  if (campaign.modality === 'cpm') {
    return campaign.cpmRate ? `${formatCurrency(campaign.cpmRate)} / 1k views` : '—'
  }
  const first = campaign.prizes?.[0]
  return first ? `${formatCurrency(first.amount)} p/ 1º lugar` : '—'
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Link
      href={`/campanhas/${campaign.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111] transition-colors hover:border-white/[0.16]"
    >
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[#35FDBC] to-[#187D5B]">
        <span className="text-3xl font-bold text-[#0B0F19]/70">
          {campaign.agencyName.charAt(0).toUpperCase()}
        </span>
        {campaign.isParticipating && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-[#0B0F19]/70 px-2.5 py-1 text-[10px] font-semibold text-[#00E5A0] backdrop-blur-sm">
            Participando
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-medium text-[#888888]">{campaign.agencyName}</span>
            {campaign.agencyVerified && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#00E5A0" className="shrink-0">
                <path d="M12 2l2.4 2.1 3.2-.5 1 3.1 3.1 1-.5 3.2L23.3 13l-2.1 2.4.5 3.2-3.1 1-1 3.1-3.2-.5L12 24.4l-2.4-2.2-3.2.5-1-3.1-3.1-1 .5-3.2L.7 13l2.1-2.4-.5-3.2 3.1-1 1-3.1 3.2.5L12 2z" />
                <path d="M9.3 12.6l1.8 1.8 3.6-3.9" stroke="#0B0F19" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <h3 className="mt-0.5 truncate text-[15px] font-semibold text-white">{campaign.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-[#888888]">
            {MODALITY_LABELS[campaign.modality]}
          </span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-[#888888]">
            {CATEGORY_LABELS[campaign.category]}
          </span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] font-medium text-[#888888]">
            {CONTENT_TYPE_LABELS[campaign.contentType]}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <div className="text-[10px] uppercase tracking-[0.05em] text-[#444444]">Valor</div>
            <div className="text-[14px] font-semibold text-[#00E5A0]">{highlightValue(campaign)}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#666666]">{formatDaysRemaining(campaign.endsAt)}</div>
            <div className="text-[11px] text-[#444444]">{campaign.participantsCount} participantes</div>
          </div>
        </div>
      </div>
    </Link>
  )
}
