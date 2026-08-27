'use client'
import { useEffect, useState } from 'react'
import { Topbar } from '@/components/dashboard/Topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/shared/Toast'
import { useWalletBalance } from '@/hooks/useWalletBalance'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/campaigns/labels'
import { formatDate } from '@/lib/utils'

interface Earning {
  id: string
  campaignTitle: string
  amount: number
  status: string
  paidAt: string | null
}

const STEPS = [
  {
    title: 'Participe de campanhas',
    description: 'Entre em campanhas ativas e publique usando a hashtag obrigatória — sem precisar colar links.',
  },
  {
    title: 'Suba no ranking',
    description: 'Suas views contam pro ranking da campanha, seja por CPM ou por posição no Leaderboard.',
  },
  {
    title: 'Receba via Pix',
    description: 'Quando a agência confirma a revisão final, o valor cai na sua carteira e é liberado via Pix.',
  },
]

export default function PagamentosPage() {
  const { toast } = useToast()
  const { balance, loading: balanceLoading } = useWalletBalance()
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [loadingEarnings, setLoadingEarnings] = useState(true)

  const [configOpen, setConfigOpen] = useState(false)
  const [pixKey, setPixKey] = useState('')
  const [cpf, setCpf] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function run() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (active) setLoadingEarnings(false)
        return
      }
      const { data } = await supabase
        .from('campaign_payouts')
        .select('id, amount, status, created_at, campaign:campaigns(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!active) return
      setEarnings(
        (data ?? []).map(row => ({
          id: row.id,
          campaignTitle: row.campaign?.title ?? 'Campanha',
          amount: row.amount,
          status: row.status,
          paidAt: row.status === 'completed' ? row.created_at : null,
        }))
      )
      setLoadingEarnings(false)
    }
    run()
    return () => { active = false }
  }, [])

  const loading = balanceLoading || loadingEarnings

  // Persistir chave Pix/CPF de verdade precisa de colunas novas em `profiles`
  // (ou de uma criação real de wallet via Asaas) — nenhuma das duas existe
  // ainda, então isso fica honesto em vez de fingir que salvou.
  const handleSaveProfile = async () => {
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 400))
    setSaving(false)
    setConfigOpen(false)
    toast('Configuração de pagamento chega em breve — ainda estamos integrando com o Asaas.', 'info')
  }

  return (
    <div>
      <Topbar title="Pagamentos" />

      <div className="space-y-5 p-6">
        {/* Saldo disponível */}
        <div className="rounded-xl border border-[#00E5A0]/20 bg-gradient-to-br from-[#00E5A0]/[0.08] to-transparent p-6">
          <div className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#00E5A0]/80">
            Saldo disponível
          </div>
          {loading || !balance ? (
            <div className="mt-2 h-10 w-40 animate-pulse rounded bg-white/[0.06]" />
          ) : (
            <div className="mt-1 text-[36px] font-bold leading-none text-[#00E5A0]">
              {formatCurrency(balance.available)}
            </div>
          )}
          {!loading && balance && balance.pending > 0 && (
            <div className="mt-2 text-[12px] text-[#888888]">
              + {formatCurrency(balance.pending)} pendente de revisão final
            </div>
          )}
        </div>

        {/* Perfil de pagamento */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-semibold text-white">Perfil de pagamento</h2>
              <p className="mt-0.5 text-[12px] text-[#666666]">Chave Pix e CPF usados pra liberar seus ganhos.</p>
            </div>
            <span className="rounded-full border border-[#f59e0b]/25 bg-[#f59e0b]/[0.08] px-3 py-1 text-[12px] font-medium text-[#f59e0b]">
              Não configurado
            </span>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => setConfigOpen(true)}
              className="bg-[#00E5A0] text-[#0B0F19] hover:bg-[#00C484]"
            >
              Configurar chave Pix e CPF
            </Button>
          </div>
        </div>

        {/* Como funciona */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-white">Como funciona</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-[#00E5A0]/15 text-[12px] font-bold text-[#00E5A0]">
                  {i + 1}
                </div>
                <div className="text-[13px] font-medium text-white">{step.title}</div>
                <p className="text-[12px] leading-relaxed text-[#888888]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de ganhos */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111]">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[14px] font-semibold text-white">Histórico de ganhos</h2>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-white/[0.02] px-5 py-4" />
              ))
            ) : earnings.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-2 text-3xl">💸</div>
                <div className="text-[13px] font-medium text-white">Nenhum ganho registrado ainda</div>
                <div className="mt-1 text-[12px] text-[#444444]">
                  Participe de campanhas pra começar a acumular saldo.
                </div>
              </div>
            ) : (
              earnings.map(earning => (
                <div key={earning.id} className="flex items-center justify-between px-5 py-4">
                  <div>
                    <div className="text-[13px] font-medium text-white">{earning.campaignTitle}</div>
                    <div className="mt-0.5 text-[11px] text-[#555555]">
                      {earning.status === 'completed' && earning.paidAt
                        ? `Pago em ${formatDate(earning.paidAt)}`
                        : 'Aguardando revisão final da agência'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-[#00E5A0]">{formatCurrency(earning.amount)}</div>
                    <span
                      className={`text-[11px] font-medium ${earning.status === 'completed' ? 'text-[#DEFF9A]' : 'text-[#f59e0b]'}`}
                    >
                      {earning.status === 'completed' ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Dialog open={configOpen} onOpenChange={setConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar pagamento</DialogTitle>
            <DialogDescription>
              Sua chave Pix e CPF são usados só pra liberar os pagamentos das campanhas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="pix-key">Chave Pix</Label>
              <Input
                id="pix-key"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                placeholder="email, telefone, CPF ou chave aleatória"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleSaveProfile}
              disabled={!pixKey || !cpf || saving}
              className="bg-[#00E5A0] text-[#0B0F19] hover:bg-[#00C484]"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
