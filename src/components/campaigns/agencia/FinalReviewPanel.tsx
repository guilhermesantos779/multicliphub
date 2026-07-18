import { LeaderboardList } from '@/components/campaigns/LeaderboardList'
import { Button } from '@/components/ui/button'
import { formatCurrencyBRL, formatDate } from '@/lib/utils'
import type { LeaderboardEntry } from '@/types/campaigns.types'

const PLATFORM_FEE_RATE = 0.1

interface FinalReviewPanelProps {
  totalPrizeCents: number
  entries: LeaderboardEntry[]
  onEntryClick: (entry: LeaderboardEntry) => void
  confirmedAt: string | null
  needsReconfirmation: boolean
  onConfirm: () => void
}

export function FinalReviewPanel({
  totalPrizeCents,
  entries,
  onEntryClick,
  confirmedAt,
  needsReconfirmation,
  onConfirm,
}: FinalReviewPanelProps) {
  const feeCents = Math.round(totalPrizeCents * PLATFORM_FEE_RATE)
  const isConfirmedAndClean = !!confirmedAt && !needsReconfirmation

  return (
    <div className="space-y-5">
      {isConfirmedAndClean && (
        <div className="rounded-lg border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] px-4 py-3 text-[13px] text-[#00E5A0]">
          Revisão confirmada em {formatDate(confirmedAt!)} · pagamento liberado para os clippers.
        </div>
      )}

      {needsReconfirmation && (
        <div className="rounded-lg border border-[#f59e0b]/20 bg-[#f59e0b]/[0.06] px-4 py-3 text-[13px] text-[#f59e0b]">
          Você removeu posts depois de confirmar a revisão. Confirme novamente para liberar o pagamento com o ranking atualizado.
        </div>
      )}

      <div>
        <h3 className="mb-2 text-[13px] font-semibold text-white">Ranking final</h3>
        <p className="mb-3 text-[12px] text-[#666666]">
          Ainda é possível remover posts — clique em um clipper para abrir o perfil dele nesta campanha.
        </p>
        <LeaderboardList entries={entries} isAdminView onEntryClick={onEntryClick} />
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#111111] p-4">
        <h3 className="mb-3 text-[13px] font-semibold text-white">Resumo financeiro</h3>
        <div className="space-y-2 text-[13px]">
          <div className="flex justify-between text-[#aaaaaa]">
            <span>Total em prêmios distribuídos</span>
            <span>{formatCurrencyBRL(totalPrizeCents)}</span>
          </div>
          <div className="flex justify-between text-[#aaaaaa]">
            <span>Taxa da plataforma (10%)</span>
            <span>{formatCurrencyBRL(feeCents)}</span>
          </div>
          <div className="flex justify-between border-t border-white/[0.06] pt-2 text-[14px] font-semibold text-white">
            <span>Total</span>
            <span>{formatCurrencyBRL(totalPrizeCents + feeCents)}</span>
          </div>
        </div>
      </div>

      <Button onClick={onConfirm} disabled={isConfirmedAndClean} size="lg" className="w-full">
        {confirmedAt ? 'Confirmar revisão novamente e liberar pagamento' : 'Confirmar revisão e liberar pagamento'}
      </Button>
      <p className="text-center text-[11px] text-[#555555]">
        Se você remover algum post depois de confirmar, será necessário confirmar de novo para liberar o pagamento atualizado.
      </p>
    </div>
  )
}
