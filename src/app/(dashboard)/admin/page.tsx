'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ViewAsToggle } from '@/components/admin/ViewAsToggle'

interface Stats {
  totalUsers: number
  activeUsers: number
  trialUsers: number
  blockedUsers: number
  totalPosts: number
  planDistribution: Record<string, number>
}

interface RecentUser {
  id: string
  email: string
  role: string
  plan: string | null
  created_at: string
}

const PLAN_COLORS: Record<string, string> = {
  king:    '#DEFF9A',
  pro:     '#9146FF',
  clipper: '#888888',
  trial:   '#f59e0b',
  blocked: '#ef4444',
  admin:   '#00E5A0',
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const [
        { count: total },
        { data: allProfiles },
        { count: totalPosts },
        { data: recent },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('role, plan'),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('profiles')
          .select('id, email, role, plan, created_at')
          .order('created_at', { ascending: false })
          .limit(8),
      ])

      const planDist: Record<string, number> = {}
      allProfiles?.forEach(p => {
        const key = p.plan || p.role || 'trial'
        planDist[key] = (planDist[key] || 0) + 1
      })

      setStats({
        totalUsers:       total || 0,
        activeUsers:      allProfiles?.filter(p => !['blocked', 'trial'].includes(p.role)).length || 0,
        trialUsers:       allProfiles?.filter(p => p.role === 'trial').length || 0,
        blockedUsers:     allProfiles?.filter(p => p.role === 'blocked').length || 0,
        totalPosts:       totalPosts || 0,
        planDistribution: planDist,
      })
      setRecentUsers((recent as RecentUser[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const metricCards = stats ? [
    { label: 'Total de Usuários', value: stats.totalUsers,  icon: '👥', color: '#9146FF' },
    { label: 'Usuários Ativos',   value: stats.activeUsers, icon: '✅', color: '#00E5A0' },
    { label: 'Em Trial',          value: stats.trialUsers,  icon: '⏱️', color: '#f59e0b' },
    { label: 'Total de Posts',    value: stats.totalPosts,  icon: '📹', color: '#9146FF' },
  ] : []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-[20px] font-bold text-white">Visão Geral</h1>
        <p className="mt-0.5 text-[13px] text-[#888888]">Resumo operacional do MultiClip Hub</p>
      </div>

      <ViewAsToggle />

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-white/[0.06] bg-[#111111]" />
            ))
          : metricCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-white/[0.06] bg-[#111111] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] text-[#888888]">{card.label}</span>
                  <span className="text-base">{card.icon}</span>
                </div>
                <div className="text-[28px] font-bold text-white">
                  {card.value.toLocaleString('pt-BR')}
                </div>
              </motion.div>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Distribuição de planos */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-white">Distribuição de Planos</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-8 animate-pulse rounded bg-white/[0.04]" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats?.planDistribution || {}).map(([plan, count]) => {
                const total = stats?.totalUsers || 1
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={plan}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="capitalize" style={{ color: PLAN_COLORS[plan] || '#888' }}>{plan}</span>
                      <span className="text-[#888888]">{count} usuários</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: PLAN_COLORS[plan] || '#888888' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Cadastros recentes */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-white">Cadastros Recentes</h2>
          <div className="space-y-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.04]" />
                ))
              : recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: `${PLAN_COLORS[user.role] || '#888'}22`, border: `1px solid ${PLAN_COLORS[user.role] || '#888'}44` }}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 truncate text-[12px] text-[#888888]">{user.email}</span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                      style={{
                        color: PLAN_COLORS[user.plan || user.role] || '#888',
                        background: `${PLAN_COLORS[user.plan || user.role] || '#888'}15`,
                      }}
                    >
                      {user.plan || user.role}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  )
}
