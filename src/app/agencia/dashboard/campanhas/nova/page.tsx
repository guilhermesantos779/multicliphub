'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Topbar } from '@/components/dashboard/Topbar'
import { Progress } from '@/components/ui/progress'
import { MaterialsField } from '@/components/campaigns/agencia/MaterialsField'
import { LeaderboardPositionsBuilder } from '@/components/campaigns/agencia/LeaderboardPositionsBuilder'
import { PixPaymentPanel } from '@/components/campaigns/agencia/PixPaymentPanel'
import { useToast } from '@/components/shared/Toast'
import { formatCurrencyBRL } from '@/lib/utils'
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_LABELS,
  type CampaignCategory,
  type CampaignContentType,
  type CampaignModality,
  type LeaderboardPrize,
  type ReferenceMaterial,
} from '@/types/campaigns.types'

const PLATFORM_FEE_RATE = 0.1
const DURATIONS: Array<7 | 20 | 30> = [7, 20, 30]

const STEPS = [
  { label: 'Capa' },
  { label: 'Categoria' },
  { label: 'Tipo de conteúdo' },
  { label: 'Detalhes' },
  { label: 'Materiais' },
  { label: 'Modalidade' },
  { label: 'Duração' },
  { label: 'Resumo' },
]

function reaisToCents(value: string): number {
  const parsed = parseFloat(value.replace(/\./g, '').replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : Math.round(parsed * 100)
}

export default function NewCampaignPage() {
  const { toast } = useToast()

  const [step, setStep] = useState(1)
  const [paymentPhase, setPaymentPhase] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [category, setCategory] = useState<CampaignCategory>('all')
  const [contentType, setContentType] = useState<CampaignContentType>('clipping')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [hashtag, setHashtag] = useState('')
  const [materials, setMaterials] = useState<ReferenceMaterial[]>([])
  const [modality, setModality] = useState<CampaignModality>('cpm')
  const [cpmRate, setCpmRate] = useState('')
  const [budget, setBudget] = useState('')
  const [leaderboardPrizes, setLeaderboardPrizes] = useState<LeaderboardPrize[]>([
    { id: crypto.randomUUID(), position: 1, amountCents: 0 },
  ])
  const [durationDays, setDurationDays] = useState<7 | 20 | 30>(7)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Usa data URL (não blob:) porque a CSP do projeto só libera `img-src` para 'self' | data: | https:
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleHashtagChange = (value: string) => {
    let clean = value.replace(/\s+/g, '')
    if (clean && !clean.startsWith('#')) clean = `#${clean}`
    setHashtag(clean)
  }

  const cpmRateCents = reaisToCents(cpmRate)
  const budgetCents = reaisToCents(budget)
  const leaderboardTotalCents = leaderboardPrizes.reduce((sum, p) => sum + p.amountCents, 0)

  const prizeOrBudgetCents = modality === 'cpm' ? budgetCents : leaderboardTotalCents
  const feeCents = Math.round(prizeOrBudgetCents * PLATFORM_FEE_RATE)
  const totalToPayCents = prizeOrBudgetCents + feeCents

  const canAdvance = useMemo(() => {
    switch (step) {
      case 1:
        return !!coverPreview
      case 4:
        return title.trim().length > 0 && description.trim().length > 0 && rules.trim().length > 0 && hashtag.trim().length > 1
      case 6:
        return modality === 'cpm'
          ? cpmRateCents > 0 && budgetCents > 0
          : leaderboardPrizes.length > 0 && leaderboardTotalCents > 0
      default:
        return true
    }
  }, [step, coverPreview, title, description, rules, hashtag, modality, cpmRateCents, budgetCents, leaderboardPrizes, leaderboardTotalCents])

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length))
  const goBack = () => setStep(s => Math.max(s - 1, 1))

  const handleConfirmSummary = () => {
    // TODO: substituir por chamada real — criar a campanha (status
    // `awaiting_payment`) via `app/api/campanhas` (Agente 1) e gerar a
    // cobrança Pix real via Asaas (Agente 4) antes de exibir o QR code.
    setPaymentPhase(true)
  }

  const handlePaymentConfirmed = () => {
    setPaymentConfirmed(true)
    toast('Pagamento confirmado! Sua campanha está ativa.', 'success')
  }

  if (paymentPhase) {
    return (
      <div>
        <Topbar title="Pagamento da campanha" />
        <div className="p-6">
          {paymentConfirmed ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
              <div className="text-4xl">🎉</div>
              <h2 className="text-[16px] font-semibold text-white">Campanha ativa!</h2>
              <p className="text-[13px] text-[#666666]">
                O pagamento foi confirmado e sua campanha já está visível para os clippers.
              </p>
              <Link
                href="/agencia/dashboard"
                className="rounded-xl bg-[#00E5A0] px-5 py-2.5 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
              >
                Ir para o dashboard
              </Link>
            </div>
          ) : (
            <PixPaymentPanel totalCents={totalToPayCents} onConfirmed={handlePaymentConfirmed} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title="Nova campanha" />

      <div className="mx-auto max-w-2xl p-6 space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between text-[12px] text-[#666666]">
            <span>
              Passo {step} de {STEPS.length}: {STEPS[step - 1].label}
            </span>
          </div>
          <Progress value={(step / STEPS.length) * 100} />
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6">
          {step === 1 && (
            <div>
              <h2 className="mb-1 text-[15px] font-semibold text-white">Imagem de capa</h2>
              <p className="mb-4 text-[12px] text-[#666666]">Essa imagem aparece no card da campanha para os clippers.</p>
              <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.16] bg-black/30 text-[#666666] transition-colors hover:border-[#00E5A0]/40">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverPreview} alt="Capa da campanha" className="h-full w-full rounded-xl object-cover" />
                ) : (
                  <>
                    <span className="text-2xl">🖼️</span>
                    <span className="text-[12px]">Clique para enviar uma imagem</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
              </label>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-1 text-[15px] font-semibold text-white">Categoria</h2>
              <p className="mb-4 text-[12px] text-[#666666]">Ajuda os clippers a encontrarem sua campanha.</p>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CampaignCategory)}
                className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#00E5A0]/50"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-1 text-[15px] font-semibold text-white">Tipo de conteúdo</h2>
              <p className="mb-4 text-[12px] text-[#666666]">Clipping reaproveita conteúdo já existente; UGC pede vídeo original.</p>
              <div className="grid grid-cols-2 gap-3">
                {(['clipping', 'ugc'] as CampaignContentType[]).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setContentType(t)}
                    className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                      contentType === t
                        ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                        : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold">{CONTENT_TYPE_LABELS[t]}</div>
                    <div className="mt-1 text-[11px] opacity-80">
                      {t === 'clipping' ? 'Clipes de conteúdo existente' : 'Vídeo original do clipper'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-semibold text-white">Detalhes da campanha</h2>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Título</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Lançamento Season 5"
                  className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-white placeholder-[#444444] outline-none focus:border-[#00E5A0]/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Descrição</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Do que se trata a campanha"
                  className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-white placeholder-[#444444] outline-none focus:border-[#00E5A0]/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Regras</label>
                <textarea
                  value={rules}
                  onChange={e => setRules(e.target.value)}
                  rows={3}
                  placeholder="O que é permitido e o que é proibido nos clipes"
                  className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-white placeholder-[#444444] outline-none focus:border-[#00E5A0]/50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#00E5A0]">
                  Hashtag obrigatória
                </label>
                <input
                  value={hashtag}
                  onChange={e => handleHashtagChange(e.target.value)}
                  placeholder="#NomeDaCampanha"
                  className="w-full rounded-lg border border-[#00E5A0]/30 bg-[#00E5A0]/[0.06] px-3 py-2.5 text-[13px] font-medium text-[#00E5A0] placeholder-[#00E5A0]/40 outline-none focus:border-[#00E5A0]/60"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-1 text-[15px] font-semibold text-white">Materiais de referência</h2>
              <p className="mb-4 text-[12px] text-[#666666]">Links ou imagens que ajudam os clippers a entender a campanha.</p>
              <MaterialsField materials={materials} onChange={setMaterials} />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-semibold text-white">Modalidade</h2>
              <div className="grid grid-cols-2 gap-3">
                {(['cpm', 'leaderboard'] as CampaignModality[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModality(m)}
                    className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                      modality === m
                        ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                        : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                    }`}
                  >
                    <div className="text-[13px] font-semibold">{m === 'cpm' ? 'CPM' : 'Leaderboard'}</div>
                    <div className="mt-1 text-[11px] opacity-80">
                      {m === 'cpm' ? 'Paga por mil views' : 'Premia as melhores posições'}
                    </div>
                  </button>
                ))}
              </div>

              {modality === 'cpm' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                      Valor por 1k views
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#666666]">R$</span>
                      <input
                        inputMode="decimal"
                        value={cpmRate}
                        onChange={e => setCpmRate(e.target.value)}
                        placeholder="8,00"
                        className="w-full rounded-lg border border-white/[0.08] bg-black/30 py-2.5 pl-9 pr-3 text-[13px] text-white placeholder-[#444444] outline-none focus:border-[#00E5A0]/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                      Budget total
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#666666]">R$</span>
                      <input
                        inputMode="decimal"
                        value={budget}
                        onChange={e => setBudget(e.target.value)}
                        placeholder="5000,00"
                        className="w-full rounded-lg border border-white/[0.08] bg-black/30 py-2.5 pl-9 pr-3 text-[13px] text-white placeholder-[#444444] outline-none focus:border-[#00E5A0]/50"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <LeaderboardPositionsBuilder prizes={leaderboardPrizes} onChange={setLeaderboardPrizes} />
              )}
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="mb-1 text-[15px] font-semibold text-white">Duração</h2>
              <p className="mb-4 text-[12px] text-[#666666]">Por quantos dias a campanha ficará ativa.</p>
              <div className="grid grid-cols-3 gap-3">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationDays(d)}
                    className={`rounded-xl border px-4 py-5 text-center transition-colors ${
                      durationDays === d
                        ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                        : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                    }`}
                  >
                    <div className="text-[18px] font-semibold">{d}</div>
                    <div className="text-[11px] opacity-80">dias</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-semibold text-white">Resumo</h2>

              <div className="space-y-1.5 text-[13px]">
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>{title || 'Sem título'}</span>
                  <span>{CONTENT_TYPE_LABELS[contentType]} · {CATEGORY_LABELS[category]}</span>
                </div>
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Modalidade</span>
                  <span>{modality === 'cpm' ? 'CPM' : 'Leaderboard'}</span>
                </div>
                <div className="flex justify-between text-[#aaaaaa]">
                  <span>Duração</span>
                  <span>{durationDays} dias</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-black/30 p-4">
                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-[#aaaaaa]">
                    <span>{modality === 'cpm' ? 'Budget total' : 'Total em prêmios'}</span>
                    <span>{formatCurrencyBRL(prizeOrBudgetCents)}</span>
                  </div>
                  <div className="flex justify-between text-[#aaaaaa]">
                    <span>Taxa da plataforma (10%)</span>
                    <span>{formatCurrencyBRL(feeCents)}</span>
                  </div>
                  <div className="flex justify-between border-t border-white/[0.06] pt-2 text-[14px] font-semibold text-white">
                    <span>Total a pagar via Pix</span>
                    <span>{formatCurrencyBRL(totalToPayCents)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="rounded-lg px-4 py-2.5 text-[13px] font-medium text-[#888888] transition-colors hover:text-white disabled:opacity-30"
          >
            Voltar
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className="rounded-xl bg-[#00E5A0] px-5 py-2.5 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-40"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmSummary}
              className="rounded-xl bg-[#00E5A0] px-5 py-2.5 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
            >
              Confirmar e ir para pagamento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
