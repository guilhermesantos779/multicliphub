import type { LeaderboardPrize } from '@/types/campaigns.types'

interface LeaderboardPositionsBuilderProps {
  prizes: LeaderboardPrize[]
  onChange: (prizes: LeaderboardPrize[]) => void
}

function renumber(prizes: LeaderboardPrize[]): LeaderboardPrize[] {
  return prizes.map((p, i) => ({ ...p, position: i + 1 }))
}

export function LeaderboardPositionsBuilder({ prizes, onChange }: LeaderboardPositionsBuilderProps) {
  const updateAmount = (id: string, reaisValue: string) => {
    const amountCents = Math.round(parseFloat(reaisValue.replace(',', '.') || '0') * 100)
    onChange(prizes.map(p => (p.id === id ? { ...p, amountCents: Number.isNaN(amountCents) ? 0 : amountCents } : p)))
  }

  const removePosition = (id: string) => {
    onChange(renumber(prizes.filter(p => p.id !== id)))
  }

  const addPosition = () => {
    onChange([...prizes, { id: crypto.randomUUID(), position: prizes.length + 1, amountCents: 0 }])
  }

  return (
    <div className="space-y-2.5">
      {prizes.map(prize => (
        <div key={prize.id} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#111111] p-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00E5A0]/10 text-[12px] font-semibold text-[#00E5A0]">
            {prize.position}º
          </div>
          <div className="flex-1">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#666666]">R$</span>
              <input
                inputMode="decimal"
                value={prize.amountCents === 0 ? '' : (prize.amountCents / 100).toFixed(2).replace('.', ',')}
                onChange={e => updateAmount(prize.id, e.target.value)}
                placeholder="0,00"
                className="w-full rounded-lg border border-white/[0.08] bg-black/30 py-2 pl-9 pr-3 text-[13px] text-white placeholder-[#444444] outline-none transition-colors focus:border-[#00E5A0]/50"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removePosition(prize.id)}
            className="shrink-0 text-[11px] text-[#666666] hover:text-[#ef4444]"
          >
            Remover
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addPosition}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.12] py-3 text-[13px] font-medium text-[#888888] transition-colors hover:border-[#00E5A0]/40 hover:text-[#00E5A0]"
      >
        <span className="text-base leading-none">+</span> Adicionar posição
      </button>
    </div>
  )
}
