'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface RankUser {
  id: string
  email: string
  full_name: string | null
  total_posts: number
  total_views: number
  role: string
}

const ROLE_COLORS: Record<string, string> = {
  king: '#DEFF9A', pro: '#9146FF', clipper: '#888888',
  trial: '#f59e0b', blocked: '#ef4444', admin: '#00E5A0',
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function AdminRankingPage() {
  const [users, setUsers]   = useState<RankUser[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy]   = useState<'total_views' | 'total_posts'>('total_views')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('id, email, full_name, total_posts, total_views, role')
        .order(sortBy, { ascending: false })
        .limit(50)
      setUsers((data as RankUser[]) || [])
      setLoading(false)
    }
    load()
  }, [sortBy])

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white">Ranking</h1>
          <p className="mt-0.5 text-[13px] text-[#888888]">Top 50 usuários</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-[#111111] p-1">
          {([['total_views', 'Views'], ['total_posts', 'Posts']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setSortBy(key); setLoading(true) }}
              className={`rounded px-3 py-1 text-[11px] transition-all ${
                sortBy === key ? 'bg-[#9146FF] text-white' : 'text-[#555555] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="grid grid-cols-[40px_1fr_90px_100px_100px] border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#444444]">
          <span>#</span>
          <span>Usuário</span>
          <span>Plano</span>
          <span>Views</span>
          <span>Posts</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-white/[0.02] px-4" />
              ))
            : users.map((u, i) => (
                <div key={u.id} className="grid grid-cols-[40px_1fr_90px_100px_100px] items-center gap-3 px-4 py-3">
                  <span className="text-[13px]">
                    {i < 3 ? MEDALS[i] : <span className="text-[12px] text-[#444444]">{i + 1}</span>}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[12px] font-medium text-white">
                      {u.full_name || u.email}
                    </div>
                    {u.full_name && (
                      <div className="truncate text-[10px] text-[#444444]">{u.email}</div>
                    )}
                  </div>
                  <span
                    className="w-fit rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                    style={{ color: ROLE_COLORS[u.role] || '#888', background: `${ROLE_COLORS[u.role] || '#888'}15` }}
                  >
                    {u.role}
                  </span>
                  <span className="text-[12px] text-[#888888]">{u.total_views.toLocaleString('pt-BR')}</span>
                  <span className="text-[12px] text-[#888888]">{u.total_posts.toLocaleString('pt-BR')}</span>
                </div>
              ))}
        </div>
      </div>
    </div>
  )
}
