'use client'

import { use, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Topbar } from '@/components/dashboard/Topbar'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { CategoryBadge, StatusBadge } from '@/components/support/badges'
import { TicketThread } from '@/components/support/TicketThread'

interface Ticket {
  id: string
  user_id: string
  subject: string
  category: string
  status: string
  created_at: string
}

export default function UserTicketDetail({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params)
  const { profile } = useUser()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTicket = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('tickets').select('*').eq('id', ticketId).single()
    setTicket(data as Ticket | null)
    setLoading(false)
  }, [ticketId])

  useEffect(() => { fetchTicket() }, [fetchTicket])

  return (
    <div>
      <Topbar title="Chamado" />
      <div className="mx-auto max-w-3xl p-6 space-y-5">
        <Link href="/suporte" className="inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={15} /> Voltar aos chamados
        </Link>

        {loading || !profile ? (
          <div className="py-10 text-center text-[13px] text-white/30">Carregando...</div>
        ) : !ticket ? (
          <div className="py-10 text-center text-[13px] text-white/40">Chamado não encontrado.</div>
        ) : (
          <>
            {/* Header */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="font-display text-[18px] font-semibold text-white">{ticket.subject}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CategoryBadge category={ticket.category} />
                <StatusBadge status={ticket.status} />
                <span className="text-[11px] text-white/30">Aberto em {formatDate(ticket.created_at)}</span>
              </div>
            </div>

            {ticket.status === 'resolvido' && (
              <div className="rounded-xl border border-[#00E5A0]/20 bg-[#00E5A0]/[0.05] px-4 py-3 text-[13px] text-[#00E5A0]">
                Este chamado foi marcado como resolvido. Ainda precisa de ajuda? Responda abaixo.
              </div>
            )}

            <TicketThread
              ticketId={ticket.id}
              currentUserId={profile.id}
              authorRole="user"
              ownerName={profile.full_name || 'Você'}
              canReply={ticket.status !== 'fechado'}
              onAfterReply={fetchTicket}
            />
          </>
        )}
      </div>
    </div>
  )
}
