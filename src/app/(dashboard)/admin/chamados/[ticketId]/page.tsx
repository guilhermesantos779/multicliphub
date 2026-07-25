'use client'

import { use, useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { TablesUpdate } from '@/types/database.types'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils'
import { CategoryBadge } from '@/components/support/badges'
import { TicketThread } from '@/components/support/TicketThread'
import {
  STATUS_OPTIONS, PRIORITY_OPTIONS, STATUS_META, PRIORITY_META,
} from '@/lib/support'

interface Ticket {
  id: string
  user_id: string
  subject: string
  category: string
  status: string
  priority: string
  created_at: string
}
interface OwnerProfile { username: string | null; full_name: string | null; email: string }

export default function AdminTicketDetail({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = use(params)
  const { profile } = useUser()
  const { toast } = useToast()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [owner, setOwner] = useState<OwnerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTicket = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase.from('tickets').select('*').eq('id', ticketId).single()
    const t = data as Ticket | null
    setTicket(t)
    if (t) {
      const { data: o } = await supabase
        .from('profiles').select('username, full_name, email').eq('id', t.user_id).single()
      setOwner(o as OwnerProfile | null)
    }
    setLoading(false)
  }, [ticketId])

  useEffect(() => { fetchTicket() }, [fetchTicket])

  const updateStatus = async (status: string) => {
    const supabase = createClient()
    const patch: TablesUpdate<'tickets'> = { status }
    if (status === 'resolvido') patch.resolved_at = new Date().toISOString()
    const { error } = await supabase.from('tickets').update(patch).eq('id', ticketId)
    if (error) toast('Erro ao mudar status', 'error')
    else { toast('Status atualizado', 'success'); fetchTicket() }
  }

  const updatePriority = async (priority: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('tickets').update({ priority }).eq('id', ticketId)
    if (error) toast('Erro ao mudar prioridade', 'error')
    else { toast('Prioridade atualizada', 'success'); fetchTicket() }
  }

  const selectCls = 'rounded-lg border border-white/[0.08] bg-[#111111] px-2.5 py-1.5 text-[12px] text-white outline-none focus:border-[#9146FF]/50'

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link href="/admin/chamados" className="inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-white">
          <ArrowLeft size={15} /> Voltar aos chamados
        </Link>

        {loading || !profile ? (
          <div className="py-10 text-center text-[13px] text-white/30">Carregando...</div>
        ) : !ticket ? (
          <div className="py-10 text-center text-[13px] text-white/40">Chamado não encontrado.</div>
        ) : (
          <>
            {/* Header + admin controls */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h2 className="font-display text-[18px] font-semibold text-white">{ticket.subject}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <CategoryBadge category={ticket.category} />
                <span className="text-[12px] text-white/50">
                  {owner?.username ? `@${owner.username}` : owner?.email ?? '—'}
                </span>
                <span className="text-[11px] text-white/30">· Aberto em {formatDate(ticket.created_at)}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[12px] text-white/50">
                  Status
                  <select value={ticket.status} onChange={(e) => updateStatus(e.target.value)} className={selectCls}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-[12px] text-white/50">
                  Prioridade
                  <select value={ticket.priority} onChange={(e) => updatePriority(e.target.value)} className={selectCls}>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <TicketThread
              ticketId={ticket.id}
              currentUserId={profile.id}
              authorRole="admin"
              ownerName={owner?.full_name || owner?.username || 'Usuário'}
              canReply
              onAfterReply={fetchTicket}
            />
          </>
        )}
      </div>
    </div>
  )
}
