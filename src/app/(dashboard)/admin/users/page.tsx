'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { formatDate } from '@/lib/utils'

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: string
  plan: string | null
  posts_this_month: number
  total_posts: number
  total_views: number
  created_at: string
  stripe_customer_id: string | null
}

const ROLE_COLORS: Record<string, { text: string; bg: string }> = {
  admin:   { text: '#00E5A0', bg: 'rgba(0,229,160,0.1)'   },
  king:    { text: '#DEFF9A', bg: 'rgba(222,255,154,0.08)' },
  pro:     { text: '#9146FF', bg: 'rgba(145,70,255,0.1)'   },
  clipper: { text: '#888888', bg: 'rgba(136,136,136,0.1)'  },
  trial:   { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)'   },
  blocked: { text: '#ef4444', bg: 'rgba(239,68,68,0.1)'    },
}

const ROLE_OPTIONS = ['clipper', 'pro', 'king', 'trial', 'blocked', 'admin']
// Plan can be set independently of role (e.g. an admin on any plan)
const PLAN_OPTIONS = ['trial', 'clipper', 'pro', 'king']

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers]           = useState<AdminUser[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [selected, setSelected]     = useState<AdminUser | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [grantDays, setGrantDays]   = useState(7)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => setCurrentUserId(data.user?.id ?? null))
  }, [])

  const fetchUsers = useCallback(async () => {
    const supabase = createClient()
    let query = supabase
      .from('profiles')
      .select('id, email, full_name, role, plan, posts_this_month, total_posts, total_views, created_at, stripe_customer_id')
      .order('created_at', { ascending: false })
      .limit(200)

    if (filterRole !== 'all') query = query.eq('role', filterRole)

    const { data } = await query
    setUsers((data as AdminUser[]) || [])
    setLoading(false)
  }, [filterRole])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const updateUserRole = async (userId: string, newRole: string) => {
    setActionLoading(true)
    const supabase = createClient()
    const planMap: Record<string, string | null> = {
      clipper: 'clipper', pro: 'pro', king: 'king',
      trial: 'trial', blocked: null, admin: null,
    }
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, plan: planMap[newRole] ?? null })
      .eq('id', userId)

    if (error) {
      toast('Erro ao atualizar usuário', 'error')
    } else {
      toast(`Usuário atualizado para ${newRole}`, 'success')
      setSelected(prev => prev && prev.id === userId ? { ...prev, role: newRole } : prev)
      fetchUsers()
    }
    setActionLoading(false)
  }

  // Set ONLY the plan, leaving role untouched (so an admin keeps admin)
  const updateUserPlan = async (userId: string, newPlan: string) => {
    setActionLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan })
      .eq('id', userId)

    if (error) {
      toast('Erro ao atualizar plano', 'error')
    } else {
      toast(`Plano alterado para ${newPlan}`, 'success')
      setSelected(prev => prev && prev.id === userId ? { ...prev, plan: newPlan } : prev)
      fetchUsers()
    }
    setActionLoading(false)
  }

  const grantFreeDays = async (userId: string) => {
    setActionLoading(true)
    const expires = new Date()
    expires.setDate(expires.getDate() + grantDays)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ plan_expires_at: expires.toISOString() })
      .eq('id', userId)
    if (error) { toast('Erro ao conceder dias', 'error') }
    else { toast(`${grantDays} dias grátis concedidos`, 'success') }
    setActionLoading(false)
  }

  const filtered = users.filter(u =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white">Usuários</h1>
          <p className="mt-0.5 text-[13px] text-[#888888]">{users.length} usuários cadastrados</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por e-mail ou nome..."
          className="rounded-lg border border-white/[0.08] bg-[#111111] px-3 py-2 text-[13px] text-white placeholder-[#444] outline-none focus:border-[#9146FF]/50 min-w-[220px]"
        />
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-[#111111] p-1">
          {['all', 'admin', 'king', 'pro', 'clipper', 'trial', 'blocked'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`rounded px-2.5 py-1 text-[10px] capitalize transition-all ${
                filterRole === r ? 'bg-[#9146FF] text-white' : 'text-[#555555] hover:text-white'
              }`}
            >
              {r === 'all' ? 'Todos' : r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4" style={{ minHeight: '60vh' }}>
        {/* Tabela */}
        <div className="flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-[#111111]">
          <div className="grid grid-cols-[1fr_110px_90px_70px] border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#444444]">
            <span>Usuário</span><span>Plano</span><span>Posts</span><span>Ação</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse bg-white/[0.02] px-4" />
                ))
              : filtered.map(user => {
                  const rc = ROLE_COLORS[user.role] || ROLE_COLORS.trial!
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelected(user)}
                      className={`grid cursor-pointer grid-cols-[1fr_110px_90px_70px] items-center gap-3 px-4 py-3 transition-colors ${
                        selected?.id === user.id ? 'bg-[#9146FF]/[0.06]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[12px] font-medium text-white">
                          {user.full_name || user.email}
                        </div>
                        {user.full_name && (
                          <div className="truncate text-[10px] text-[#444444]">{user.email}</div>
                        )}
                      </div>
                      <span
                        className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                        style={{ color: rc.text, background: rc.bg }}
                      >
                        {user.plan || user.role}
                      </span>
                      <span className="text-[12px] text-[#888888]">
                        {user.posts_this_month}/{user.total_posts}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(user) }}
                        className="text-[11px] text-[#9146FF] hover:underline"
                      >
                        Editar
                      </button>
                    </div>
                  )
                })}
          </div>
        </div>

        {/* Drawer de detalhes */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="w-64 shrink-0 rounded-xl border border-white/[0.06] bg-[#111111] p-5 space-y-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-white">Detalhes</span>
                <button onClick={() => setSelected(null)} className="text-[#444444] hover:text-white text-sm">✕</button>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#9146FF]/20 text-[18px] font-bold text-[#9146FF]">
                {(selected.full_name || selected.email).charAt(0).toUpperCase()}
              </div>

              <div className="space-y-2">
                {[
                  { label: 'E-mail',       value: selected.email },
                  { label: 'Nome',         value: selected.full_name || '—' },
                  { label: 'Role',         value: selected.role },
                  { label: 'Plano',        value: selected.plan || '—' },
                  { label: 'Posts/mês',    value: String(selected.posts_this_month) },
                  { label: 'Total posts',  value: String(selected.total_posts) },
                  { label: 'Cadastro',     value: formatDate(selected.created_at) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between gap-2 text-[11px]">
                    <span className="text-[#555555]">{item.label}</span>
                    <span className="truncate text-right text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/[0.06] pt-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#444444]">Ações</div>

                {/* Dias grátis */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={grantDays}
                    onChange={e => setGrantDays(Number(e.target.value))}
                    min={1} max={365}
                    className="w-14 rounded border border-white/[0.08] bg-[#0a0a0a] px-2 py-1.5 text-[11px] text-white outline-none"
                  />
                  <button
                    onClick={() => grantFreeDays(selected.id)}
                    disabled={actionLoading}
                    className="flex-1 rounded-lg bg-[#9146FF]/15 px-2 py-1.5 text-[10px] font-medium text-[#9146FF] transition-colors hover:bg-[#9146FF]/25 disabled:opacity-50"
                  >
                    Dias grátis
                  </button>
                </div>

                {/* Alterar cargo (role) — define permissões. 'admin' = acesso total.
                    Bloqueado para a própria conta para evitar auto-rebaixamento. */}
                <div>
                  <div className="mb-1.5 text-[10px] text-[#444444]">Alterar cargo</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ROLE_OPTIONS.map(r => {
                      const isSelf = selected.id === currentUserId
                      return (
                        <button
                          key={r}
                          onClick={() => updateUserRole(selected.id, r)}
                          disabled={actionLoading || selected.role === r || isSelf}
                          className={`rounded-lg py-1.5 text-[10px] font-medium capitalize transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                            selected.role === r
                              ? 'bg-[#9146FF] text-white'
                              : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#222] hover:text-white'
                          }`}
                        >
                          {r}
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-1.5 text-[9px] text-[#444444]">
                    {selected.id === currentUserId
                      ? 'Você não pode alterar o próprio cargo (proteção contra auto-rebaixamento).'
                      : 'Mudar o cargo também ajusta o plano. Para definir o plano sem mexer no cargo, use abaixo.'}
                  </p>
                </div>

                {/* Alterar plano — independente do cargo (admin pode ter qualquer plano) */}
                <div>
                  <div className="mb-1.5 text-[10px] text-[#444444]">Alterar plano</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PLAN_OPTIONS.map(pl => (
                      <button
                        key={pl}
                        onClick={() => updateUserPlan(selected.id, pl)}
                        disabled={actionLoading || selected.plan === pl}
                        className={`rounded-lg py-1.5 text-[10px] font-medium capitalize transition-all disabled:opacity-40 ${
                          selected.plan === pl
                            ? 'bg-[#00E5A0] text-[#0B0F19]'
                            : 'bg-[#1a1a1a] text-[#888888] hover:bg-[#222] hover:text-white'
                        }`}
                      >
                        {pl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
