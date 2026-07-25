import { formatCurrencyBRL, formatViews } from '@/lib/utils'
import type { LeaderboardEntry } from '@/types/campaigns.types'

/**
 * Componente compartilhado entre o dashboard da agência e a área do
 * clipper. Mantém as props genéricas de propósito:
 * - `isAdminView` liga a affordance de moderação (linha clicável +
 *   botão de remover) usada hoje na aba Ranking da agência.
 * - `onEntryClick` / `onRemoveClick` são callbacks opcionais para o
 *   consumidor decidir o que acontece (navegação, modal, etc.) sem o
 *   componente precisar conhecer rotas ou regras de negócio.
 * - `highlightUserId` permite ao lado clipper destacar a própria linha.
 */
export interface LeaderboardListProps {
  entries: LeaderboardEntry[]
  isAdminView?: boolean
  onEntryClick?: (entry: LeaderboardEntry) => void
  onRemoveClick?: (entry: LeaderboardEntry) => void
  highlightUserId?: string
  showEarnings?: boolean
  emptyLabel?: string
}

const RANK_MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

export function LeaderboardList({
  entries,
  isAdminView = false,
  onEntryClick,
  onRemoveClick,
  highlightUserId,
  showEarnings = true,
  emptyLabel = 'Ainda não há participantes nesta campanha.',
}: LeaderboardListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-3 text-4xl">🏆</div>
        <div className="text-[13px] text-[#444444]">{emptyLabel}</div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
      {entries.map(entry => {
        const clickable = isAdminView && !!onEntryClick
        const isSelf = highlightUserId === entry.userId

        return (
          <div
            key={entry.userId}
            onClick={clickable ? () => onEntryClick?.(entry) : undefined}
            className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
              clickable ? 'cursor-pointer hover:bg-white/[0.03]' : ''
            } ${isSelf ? 'bg-[#00E5A0]/[0.05]' : ''}`}
          >
            <div className="flex w-8 shrink-0 items-center justify-center text-[13px] font-semibold text-[#666666]">
              {RANK_MEDAL[entry.rank] ?? `#${entry.rank}`}
            </div>

            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-[#0B0F19]"
              style={{ background: 'linear-gradient(135deg, #35FDBC, #187D5B)' }}
            >
              {entry.displayName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium text-white">
                {entry.displayName}
                {isSelf && <span className="ml-1.5 text-[11px] text-[#00E5A0]">(você)</span>}
              </div>
              <div className="text-[11px] text-[#555555]">
                {formatViews(entry.totalViews)} views · {entry.postsCount} {entry.postsCount === 1 ? 'post' : 'posts'}
              </div>
            </div>

            {showEarnings && (
              <div className="shrink-0 text-right text-[13px] font-semibold text-[#00E5A0]">
                {formatCurrencyBRL(entry.earningsCents)}
              </div>
            )}

            {isAdminView && onRemoveClick && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  onRemoveClick(entry)
                }}
                className="shrink-0 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#888888] transition-colors hover:border-[#ef4444]/40 hover:text-[#ef4444]"
              >
                Remover
              </button>
            )}

            {clickable && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#444444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
