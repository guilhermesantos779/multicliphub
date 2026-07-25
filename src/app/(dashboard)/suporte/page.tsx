'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, MessageSquare } from 'lucide-react'
import { Topbar } from '@/components/dashboard/Topbar'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { CategoryBadge, StatusBadge } from '@/components/support/badges'
import { DISCORD_INVITE_URL } from '@/lib/support'

interface TicketRow {
  id: string
  subject: string
  category: string
  status: string
  last_message_at: string
  last_message_by: string | null
}

export default function SupportPage() {
  const { profile } = useUser()
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.id) return
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('tickets')
        .select('id, subject, category, status, last_message_at, last_message_by')
        .eq('user_id', profile.id)
        .order('last_message_at', { ascending: false })
      setTickets((data as TicketRow[]) ?? [])
      setLoading(false)
    })()
  }, [profile?.id])

  return (
    <div>
      <Topbar title="Suporte" />
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-[18px] font-semibold text-white">Suporte</h2>
            <p className="mt-0.5 text-[13px] text-white/50">Precisa de ajuda? Abra um chamado.</p>
          </div>
          <Link
            href="/suporte/novo"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#9146FF] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
          >
            <Plus size={15} />
            Abrir novo chamado
          </Link>
        </div>

        {/* Discord CTA */}
        <div className="rounded-2xl border border-[#00E5A0]/20 bg-[#00E5A0]/[0.05] p-5">
          <h3 className="text-[14px] font-semibold text-[#00E5A0]">Atendimento prioritário no Discord</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-white/60">
            Assinantes têm atendimento prioritário por chat e call na nossa comunidade.
          </p>
          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#00E5A0]/30 px-4 py-2 text-[13px] font-medium text-[#00E5A0] transition-colors hover:bg-[#00E5A0]/10"
          >
            Entre no Discord →
          </a>
        </div>

        {/* Tickets list */}
        <div>
          <h3 className="mb-3 text-[13px] font-semibold text-white/80">Seus chamados</h3>
          {loading ? (
            <div className="py-8 text-center text-[13px] text-white/30">Carregando...</div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-10 text-center">
              <MessageSquare size={26} className="mx-auto mb-2 text-white/20" />
              <p className="text-[13px] text-white/40">Você ainda não abriu nenhum chamado.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {tickets.map((t) => {
                const awaitingRead = t.last_message_by === 'admin' && t.status !== 'fechado'
                return (
                  <Link
                    key={t.id}
                    href={`/suporte/${t.id}`}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/[0.15]"
                  >
                    {awaitingRead && <span className="h-2 w-2 shrink-0 rounded-full bg-[#00E5A0]" title="Resposta da equipe" />}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[14px] font-medium text-white">{t.subject}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <CategoryBadge category={t.category} />
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] text-white/30">{formatDate(t.last_message_at)}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
