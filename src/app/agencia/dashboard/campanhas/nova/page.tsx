'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'
import { CampaignCard, type CampaignCardData } from '@/components/campaigns/CampaignCard'
import { MaterialsField } from '@/components/campaigns/agencia/MaterialsField'
import { LeaderboardPositionsBuilder } from '@/components/campaigns/agencia/LeaderboardPositionsBuilder'
import { PixPaymentPanel } from '@/components/campaigns/agencia/PixPaymentPanel'
import { useToast } from '@/components/shared/Toast'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import { createClient } from '@/lib/supabase/client'
import { formatCurrencyBRL } from '@/lib/utils'
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_LABELS,
  type CampaignCategory,
  type CampaignContentType,
  type CampaignModality,
  type CampaignVisibility,
  type LeaderboardPrize,
  type ReferenceMaterial,
} from '@/types/campaigns.types'

const PLATFORM_FEE_RATE = 0.1
const DURATIONS: Array<7 | 20 | 30> = [7, 20, 30]

function reaisToCents(value: string): number {
  const parsed = parseFloat(value.replace(/\./g, '').replace(',', '.'))
  return Number.isNaN(parsed) ? 0 : Math.round(parsed * 100)
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6">
      <h2 className="text-[15px] font-semibold text-white">{title}</h2>
      {subtitle && <p className="mt-0.5 text-[12px] text-[#666666]">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function NewCampaignPage() {
  const { toast } = useToast()
  const { agencyProfile } = useAgencyProfile()

  const [paymentPhase, setPaymentPhase] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [creating, setCreating] = useState(false)
  const [activating, setActivating] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [category, setCategory] = useState<CampaignCategory>('geral')
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
  const [visibility, setVisibility] = useState<CampaignVisibility>('aberta')

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

  const canSubmit =
    !!coverPreview &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    rules.trim().length > 0 &&
    hashtag.trim().length > 1 &&
    (modality === 'cpm' ? cpmRateCents > 0 && budgetCents > 0 : leaderboardPrizes.length > 0 && leaderboardTotalCents > 0)

  // Preview usa o componente REAL da listagem pública — o que muda aqui é só
  // o `campaign` derivado do estado do formulário, nunca um mockup à parte.
  const previewData: CampaignCardData = {
    id: 'preview',
    title: title.trim() || 'Nome da campanha',
    coverImageUrl: coverPreview,
    agencyName: agencyProfile?.name ?? 'Sua agência',
    agencyLogoUrl: agencyProfile?.logoUrl ?? null,
    modality,
    status: 'active',
    endsAt: new Date(Date.now() + durationDays * 86400000).toISOString(),
    durationDays,
    highlightValueCents: modality === 'cpm' ? budgetCents : leaderboardTotalCents,
  }

  const handleConfirmSummary = async () => {
    if (!agencyProfile || creating || !canSubmit) return
    setCreating(true)

    const basePayload = {
      agency_profile_id: agencyProfile.id,
      title: title.trim(),
      description: description.trim() || undefined,
      rules: rules.trim() || undefined,
      required_hashtag: hashtag,
      category,
      content_type: contentType,
      duration_days: durationDays,
      visibility,
    }

    const payload =
      modality === 'cpm'
        ? { ...basePayload, modality: 'cpm' as const, cpm_rate: cpmRateCents / 100, budget_total: budgetCents / 100 }
        : {
            ...basePayload,
            modality: 'leaderboard' as const,
            prize_structure: leaderboardPrizes.map(p => ({ position: p.position, amount: p.amountCents / 100 })),
            ranking_metric: 'views',
          }

    const res = await fetch('/api/campaigns/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json = await res.json()

    if (!res.ok) {
      toast(json.error ?? 'Erro ao criar campanha', 'error')
      setCreating(false)
      return
    }

    if (materials.length > 0) {
      const supabase = createClient()
      const { error: materialsError } = await supabase.from('campaign_assets').insert(
        materials.map(m => ({ campaign_id: json.id, type: m.type, label: m.label || null, url: m.url }))
      )
      if (materialsError) {
        console.error('Save campaign materials error:', materialsError)
        toast('Campanha criada, mas os materiais de referência não foram salvos.', 'warning')
      }
    }

    setCampaignId(json.id)
    setCreating(false)
    toast('Campanha criada! Confirme o pagamento pra deixá-la ativa.', 'success')
    setPaymentPhase(true)
  }

  const handlePaymentConfirmed = async () => {
    if (!campaignId || activating) return
    setActivating(true)

    const res = await fetch(`/api/campaigns/${campaignId}/activate`, { method: 'POST' })
    const json = await res.json()

    if (!res.ok) {
      toast(json.error ?? 'Erro ao ativar campanha', 'error')
      setActivating(false)
      return
    }

    setActivating(false)
    setPaymentConfirmed(true)
    toast('Pagamento confirmado! Sua campanha está ativa.', 'success')
  }

  const Header = (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0B0F19]/90 px-4 backdrop-blur-xl md:px-6">
      <Logo height={24} variant="mint" />
      <Link
        href="/agencia/dashboard/campanhas"
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-[#888888] transition-colors hover:text-white"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        Cancelar
      </Link>
    </header>
  )

  if (paymentPhase) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white">
        {Header}
        <div className="flex min-h-[calc(100vh-56px)] items-center justify-center p-6">
          {paymentConfirmed ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
              <div className="text-4xl">🎉</div>
              <h2 className="text-[18px] font-bold text-white">Campanha ativa!</h2>
              <p className="text-[13px] text-[#666666]">
                O pagamento foi confirmado e sua campanha já está visível para os clippers.
              </p>
              <Link
                href={`/agencia/dashboard/campanhas/${campaignId}`}
                className="rounded-xl bg-[#00E5A0] px-5 py-2.5 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
              >
                Ver campanha
              </Link>
              <Link href="/agencia/dashboard/campanhas" className="text-[12px] text-[#666666] hover:text-white">
                Ver todas as campanhas
              </Link>
            </div>
          ) : (
            <PixPaymentPanel totalCents={totalToPayCents} onConfirmed={handlePaymentConfirmed} />
          )}
        </div>
      </div>
    )
  }

  const preview = (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/[0.08] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#00E5A0]">
          Prévia
        </span>
        <span className="text-[11px] text-[#555555]">Assim que a campanha estiver ativa</span>
      </div>
      <div className="pointer-events-none">
        <CampaignCard campaign={previewData} href="#" />
      </div>
      <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-[#555555]">
        <span>0 participantes</span>
        <span>{visibility === 'fechada_agencia' ? 'Fechada pro time' : 'Aberta'}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white">
      {Header}

      <div className="flex flex-col lg:flex-row">
        {/* Coluna esquerda — formulário */}
        <div className="flex-1 px-4 py-8 md:px-8 lg:overflow-y-auto lg:px-12 lg:py-10" style={{ maxHeight: 'calc(100vh - 56px)' }}>
          <div className="mx-auto max-w-xl space-y-6">
            <div>
              <h1 className="text-[22px] font-extrabold tracking-tight text-white">Criar campanha</h1>
              <p className="mt-1 text-[13px] font-light text-[#666666]">
                Preencha os detalhes — a prévia atualiza em tempo real conforme você digita.
              </p>
            </div>

            {/* Prévia colapsável — só em telas estreitas */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setPreviewOpen(v => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-[#111111] px-4 py-3 text-[13px] font-medium text-white"
              >
                Ver prévia da campanha
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`transition-transform ${previewOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {previewOpen && <div className="mt-3">{preview}</div>}
            </div>

            <Section title="Imagem de capa" subtitle="Essa imagem aparece no card da campanha para os clippers.">
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
            </Section>

            <Section title="Categoria e tipo de conteúdo">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as CampaignCategory)}
                    className="w-full rounded-lg border border-white/[0.08] bg-black/30 px-3 py-2.5 text-[13px] text-white outline-none focus:border-[#00E5A0]/50"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">Tipo de conteúdo</label>
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
              </div>
            </Section>

            <Section title="Detalhes da campanha">
              <div className="space-y-4">
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
            </Section>

            <Section title="Materiais de referência" subtitle="Links ou imagens que ajudam os clippers a entender a campanha.">
              <MaterialsField materials={materials} onChange={setMaterials} />
            </Section>

            <Section title="Modalidade e orçamento">
              <div className="space-y-4">
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

                {agencyProfile?.kind === 'clipadores' && (
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
                      Visibilidade
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setVisibility('aberta')}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          visibility === 'aberta'
                            ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                            : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                        }`}
                      >
                        <div className="text-[13px] font-semibold">Aberta</div>
                        <div className="mt-1 text-[11px] opacity-80">Qualquer clipador pode se inscrever</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVisibility('fechada_agencia')}
                        className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                          visibility === 'fechada_agencia'
                            ? 'border-[#00E5A0]/50 bg-[#00E5A0]/[0.08] text-[#00E5A0]'
                            : 'border-white/[0.08] text-[#888888] hover:border-white/[0.16]'
                        }`}
                      >
                        <div className="text-[13px] font-semibold">Fechada pro time</div>
                        <div className="mt-1 text-[11px] opacity-80">Só membros ativos do seu roster</div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Section>

            <Section title="Duração" subtitle="Por quantos dias a campanha ficará ativa.">
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
            </Section>

            <div className="rounded-2xl border border-white/[0.08] bg-black/30 p-5">
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

            <button
              type="button"
              onClick={handleConfirmSummary}
              disabled={!canSubmit || creating}
              className="w-full rounded-xl bg-[#00E5A0] py-3.5 text-[14px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-40"
            >
              {creating ? 'Criando campanha…' : 'Publicar campanha'}
            </button>
          </div>
        </div>

        {/* Coluna direita — prévia ao vivo, fixa enquanto rola o formulário */}
        <div className="hidden shrink-0 border-l border-white/[0.06] bg-[#080b12] lg:block lg:w-[380px]">
          <div className="sticky top-14 overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 56px)' }}>
            {preview}
          </div>
        </div>
      </div>
    </div>
  )
}
