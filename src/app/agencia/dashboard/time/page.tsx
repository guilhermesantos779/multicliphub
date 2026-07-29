'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Topbar } from '@/components/dashboard/Topbar'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import { useToast } from '@/components/shared/Toast'
import { formatCurrencyBRL, formatViews } from '@/lib/utils'
import type { AgencyClipperMember, AgencyInviteLink } from '@/types/campaigns.types'

interface MemberMetrics {
  userId: string
  totalViews: number
  totalEarnings: number
}

export default function AgencyTeamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { agencyProfile, loading: profileLoading } = useAgencyProfile()

  const [roster, setRoster] = useState<AgencyClipperMember[]>([])
  const [metrics, setMetrics] = useState<MemberMetrics[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteLink, setInviteLink] = useState<AgencyInviteLink | null>(null)
  const [generatingLink, setGeneratingLink] = useState(false)

  const isFirstVisit = searchParams.get('onboarding') === '1'

  // `loading` starts true (useState(true) below) and is only ever set back
  // to false once, after the first load — refetches after approve/remove
  // update the lists silently instead of re-flashing the skeleton.
  const loadRoster = useCallback(async () => {
    const [rosterRes, metricsRes] = await Promise.all([
      fetch('/api/agencia/roster'),
      fetch('/api/agencia/roster/metrics'),
    ])
    const rosterJson = await rosterRes.json()
    const metricsJson = await metricsRes.json()
    setRoster(rosterJson.roster ?? [])
    setMetrics(metricsJson.perMember ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!profileLoading && !agencyProfile) {
      router.replace('/agencia/onboarding')
      return
    }
    if (!profileLoading && agencyProfile && agencyProfile.kind !== 'clipadores') {
      router.replace('/agencia/dashboard')
      return
    }
    if (agencyProfile?.kind === 'clipadores') {
      loadRoster()
    }
  }, [profileLoading, agencyProfile, router, loadRoster])

  const handleGenerateLink = async () => {
    setGeneratingLink(true)
    const res = await fetch('/api/agencia/roster/invite', { method: 'POST' })
    const json = await res.json()
    setGeneratingLink(false)
    if (!res.ok) {
      toast(json.error ?? 'Erro ao gerar link', 'error')
      return
    }
    setInviteLink(json.inviteLink)
  }

  const handleCopyLink = () => {
    if (!inviteLink) return
    const url = `${window.location.origin}/agencia/convite/${inviteLink.code}`
    navigator.clipboard.writeText(url)
    toast('Link copiado!', 'success')
  }

  const handleApprove = async (memberId: string) => {
    const res = await fetch(`/api/agencia/roster/${memberId}/approve`, { method: 'POST' })
    const json = await res.json()
    if (!res.ok) {
      toast(json.error ?? 'Erro ao aprovar', 'error')
      return
    }
    toast('Membro aprovado', 'success')
    loadRoster()
  }

  const handleRemove = async (memberId: string) => {
    const res = await fetch(`/api/agencia/roster/${memberId}/remove`, { method: 'POST' })
    const json = await res.json()
    if (!res.ok) {
      toast(json.error ?? 'Erro ao remover', 'error')
      return
    }
    toast('Membro removido', 'success')
    loadRoster()
  }

  const pending = roster.filter(m => m.status === 'pendente')
  const active = roster.filter(m => m.status === 'ativo')
  const metricsByUser = new Map(metrics.map(m => [m.userId, m]))

  return (
    <div>
      <Topbar title="Seu time" />

      <div className="mx-auto max-w-3xl p-6 space-y-6">
        {isFirstVisit && (
          <div className="rounded-xl border border-[#00E5A0]/20 bg-[#00E5A0]/[0.06] p-5">
            <h2 className="text-[14px] font-semibold text-white">Perfil criado! Agora monte seu time</h2>
            <p className="mt-1 text-[12px] text-[#888888]">
              Gere um link de convite e compartilhe com os clipadores que fazem parte da sua agência.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <h2 className="text-[14px] font-semibold text-white">Link de convite</h2>
          <p className="mt-0.5 mb-3 text-[12px] text-[#666666]">
            Qualquer clipador com esse link pode pedir pra entrar no seu time.
          </p>
          {inviteLink ? (
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-2 text-[12px] text-[#00E5A0]">
                {`${typeof window !== 'undefined' ? window.location.origin : ''}/agencia/convite/${inviteLink.code}`}
              </code>
              <button
                onClick={handleCopyLink}
                className="shrink-0 rounded-lg bg-[#00E5A0] px-3 py-2 text-[12px] font-semibold text-[#0B0F19] hover:bg-[#00B584]"
              >
                Copiar
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateLink}
              disabled={generatingLink}
              className="rounded-lg bg-[#00E5A0] px-4 py-2 text-[12px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-50"
            >
              {generatingLink ? 'Gerando...' : 'Gerar link de convite'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
            ))}
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <div>
                <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#666666]">
                  Pendentes ({pending.length})
                </h2>
                <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
                  {pending.map(member => (
                    <div key={member.id} className="flex items-center gap-4 px-5 py-3.5">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-white">
                          {member.fullName ?? member.username ?? member.userId}
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprove(member.id)}
                        className="rounded-lg bg-[#00E5A0]/10 px-2.5 py-1 text-[11px] font-medium text-[#00E5A0] hover:bg-[#00E5A0]/20"
                      >
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleRemove(member.id)}
                        className="rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#888888] hover:border-[#ef4444]/40 hover:text-[#ef4444]"
                      >
                        Recusar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#666666]">
                Membros ativos ({active.length})
              </h2>
              {active.length === 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-[#111111] py-10 text-center text-[13px] text-[#444444]">
                  Ainda não há membros no time.
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-[#111111]">
                  {active.map(member => {
                    const memberMetrics = metricsByUser.get(member.userId)
                    return (
                      <div key={member.id} className="flex items-center gap-4 px-5 py-3.5">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-medium text-white">
                            {member.fullName ?? member.username ?? member.userId}
                          </div>
                          <div className="text-[11px] text-[#555555]">
                            {formatViews(memberMetrics?.totalViews ?? 0)} views
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-[13px] font-semibold text-[#00E5A0]">
                          {formatCurrencyBRL((memberMetrics?.totalEarnings ?? 0) * 100)}
                        </div>
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="shrink-0 rounded-lg border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-[#888888] hover:border-[#ef4444]/40 hover:text-[#ef4444]"
                        >
                          Remover
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
