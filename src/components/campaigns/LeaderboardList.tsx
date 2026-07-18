'use client'
// TEMP: versão própria criada pelo Agente 3 (frontend clipper) porque o componente
// canônico `components/campaigns/LeaderboardList.tsx` do Agente 2 (frontend agência)
// ainda não existia neste worktree isolado. Props genéricas o suficiente pra reuso
// (`isAdminView` controla o botão de remover) — UNIFICAR na revisão manual do merge.
import Link from 'next/link'
import type { LeaderboardEntry } from '@/types/campaigns.types'
import { formatViews } from '@/lib/utils'
import { formatCurrency } from '@/lib/campaigns/labels'

interface LeaderboardListProps {
  campaignId: string
  entries: LeaderboardEntry[]
  isAdminView?: boolean
  currentUserId?: string
  onRemove?: (userId: string) => void
  getProfileHref?: (userId: string) => string
}

const medalColors: Record<number, string> = { 1: '#DEFF9A', 2: '#C7C7C7', 3: '#B8804D' }

export function LeaderboardList({
  campaignId,
  entries,
  isAdminView = false,
  currentUserId,
  onRemove,
  getProfileHref,
}: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-[#111111] py-12 text-center text-[13px] text-[#444444]">
        Ainda não há participantes no ranking.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]">
      <div className="divide-y divide-white/[0.04]">
        {entries.map(entry => {
          const isMe = currentUserId != null && entry.userId === currentUserId
          const href = getProfileHref
            ? getProfileHref(entry.userId)
            : `/campanhas/${campaignId}/ranking/${entry.userId}`
          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-3 px-4 py-3 ${isMe ? 'bg-[#00E5A0]/[0.04]' : ''}`}
            >
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold"
                style={{
                  color: medalColors[entry.rank] || '#666666',
                  background: medalColors[entry.rank] ? `${medalColors[entry.rank]}22` : 'rgba(255,255,255,0.04)',
                }}
              >
                {entry.rank}
              </div>

              <Link href={href} className="flex min-w-0 flex-1 items-center gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#35FDBC] to-[#187D5B] text-[11px] font-semibold text-[#0B0F19]">
                  {entry.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-white">
                    {entry.fullName}
                    {isMe && <span className="ml-1.5 text-[11px] font-normal text-[#00E5A0]">(você)</span>}
                  </div>
                  <div className="text-[11px] text-[#555555]">
                    {entry.postsCount} posts · {formatViews(entry.totalViews)} views
                  </div>
                </div>
              </Link>

              {entry.earnings != null && (
                <div className="text-[12px] font-semibold text-[#00E5A0]">{formatCurrency(entry.earnings)}</div>
              )}

              {isAdminView && onRemove && (
                <button
                  onClick={() => onRemove(entry.userId)}
                  className="rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#ef4444] transition-colors hover:bg-[#ef4444]/10"
                >
                  Remover
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
