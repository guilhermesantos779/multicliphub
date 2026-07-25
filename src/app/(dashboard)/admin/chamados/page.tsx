'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { CategoryBadge, StatusBadge, PriorityBadge } from '@/components/support/badges'
import {
  STATUS_OPTIONS, CATEGORY_OPTIONS, PRIORITY_OPTIONS,
  STATUS_META, CATEGORY_META, PRIORITY_META,
} from '@/lib/support'

interface AdminTicket {
  id: string
  user_id: string
  subject: string
  category: string
  status: string
  priority: string
  last_message_at: string
  last_message_by: string | null
}
interface MiniProfile { id: string; username: string | null; full_name: string | null; email: string }

const PAGE_SIZE = 20

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>([])
  const [profiles, setProfiles] = useState<Record<string, MiniProfile>>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  const [fStatus, setFStatus] = useState('all')
  const [fCategory, setFCategory] = useState('all')
  const [fPriority, setFPriority] = useState('all')
  const [search, setSearch] = useState('')

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    let query = supabase
      .from('tickets')
      .select('id, user_id, subject, category, status, priority, last_message_at, last_message_by')

    if (fStatus !== 'all') query = query.eq('status', fStatus)
    if (fCategory !== 'all') query = query.eq('category', fCategory)
    if (fPriority !== 'all') query = query.eq('priority', fPriority)

    if (search.trim()) {
      const term = search.trim()
      // match subject OR a user whose username/email/name matches
      const { data: matchedProfiles } = await supabase
        .from('profiles')
        .select('id')
        .or(`username.ilike.%${term}%,email.ilike.%${term}%,full_name.ilike.%${term}%`)
      const ids = (matchedProfiles ?? []).map((p) => p.id)
      const orParts = [`subject.ilike.%${term}%`]
      if (ids.length > 0) orParts.push(`user_id.in.(${ids.join(',')})`)
      query = query.or(orParts.join(','))
    }

    const from = page * PAGE_SIZE
    query = query.order('last_message_at', { ascending: false }).range(from, from + PAGE_SIZE)

    const { data } = await query
    const rows = (data as AdminTicket[]) ?? []
    setHasMore(rows.length > PAGE_SIZE)
    const pageRows = rows.slice(0, PAGE_SIZE)

    // Pin unanswered (last_message_by = 'user') to the top of the page
    pageRows.sort((a, b) => {
      const ua = a.last_message_by === 'user' ? 0 : 1
      const ub = b.last_message_by === 'user' ? 0 : 1
      if (ua !== ub) return ua - ub
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    })
    setTickets(pageRows)

    const ids = Array.from(new Set(pageRows.map((t) => t.user_id)))
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from('profiles')
        .select('id, username, full_name, email')
        .in('id', ids)
      const map: Record<string, MiniProfile> = {}
      for (const p of (profs ?? []) as MiniProfile[]) map[p.id] = p
      setProfiles(map)
    }
    setLoading(false)
  }, [fStatus, fCategory, fPriority, search, page])

  useEffect(() => { fetchTickets() }, [fetchTickets])
  // Reset to first page when filters/search change
  useEffect(() => { setPage(0) }, [fStatus, fCategory, fPriority, search])

  const selectCls = 'rounded-lg border border-white/[0.08] bg-[#111111] px-2.5 py-1.5 text-[12px] text-white outline-none focus:border-[#9146FF]/50'

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="font-display text-[18px] font-semibold text-white">Chamados</h1>
        <p className="mt-0.5 text-[13px] text-white/50">Todos os chamados de suporte dos usuários.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por assunto ou usuário"
            className="w-64 rounded-lg border border-white/[0.08] bg-[#111111] py-1.5 pl-8 pr-3 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
          />
        </div>
        <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={selectCls}>
          <option value="all">Status: todos</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
        </select>
        <select value={fCategory} onChange={(e) => setFCategory(e.target.value)} className={selectCls}>
          <option value="all">Categoria: todas</option>
          {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
        </select>
        <select value={fPriority} onChange={(e) => setFPriority(e.target.value)} className={selectCls}>
          <option value="all">Prioridade: todas</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-white/[0.06]">
        <div className="hidden items-center gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide text-white/40 md:flex">
          <span className="flex-1">Assunto / usuário</span>
          <span className="w-24">Categoria</span>
          <span className="w-28">Status</span>
          <span className="w-20">Prioridade</span>
          <span className="w-24 text-right">Atividade</span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-[13px] text-white/30">Carregando...</div>
        ) : tickets.length === 0 ? (
          <div className="py-10 text-center text-[13px] text-white/40">Nenhum chamado encontrado.</div>
        ) : (
          tickets.map((t) => {
            const p = profiles[t.user_id]
            const unanswered = t.last_message_by === 'user'
            return (
              <Link
                key={t.id}
                href={`/admin/chamados/${t.id}`}
                className={`flex flex-col gap-2 border-b border-white/[0.04] px-4 py-3 transition-colors last:border-0 hover:bg-white/[0.03] md:flex-row md:items-center md:gap-3 ${unanswered ? 'bg-[#00E5A0]/[0.03]' : ''}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {unanswered && <span className="h-2 w-2 shrink-0 rounded-full bg-[#00E5A0]" title="Aguardando resposta" />}
                    <span className="truncate text-[13px] font-medium text-white">{t.subject}</span>
                  </div>
                  <span className="text-[11px] text-white/40">
                    {p?.username ? `@${p.username}` : p?.email ?? '—'}
                  </span>
                </div>
                <span className="w-24 shrink-0"><CategoryBadge category={t.category} /></span>
                <span className="w-28 shrink-0"><StatusBadge status={t.status} /></span>
                <span className="w-20 shrink-0"><PriorityBadge priority={t.priority} /></span>
                <span className="w-24 shrink-0 text-[11px] text-white/30 md:text-right">{formatDate(t.last_message_at)}</span>
              </Link>
            )
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] text-white/60 disabled:opacity-30"
        >
          ← Anterior
        </button>
        <span className="text-[12px] text-white/40">Página {page + 1}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] text-white/60 disabled:opacity-30"
        >
          Próxima →
        </button>
      </div>
    </div>
  )
}
