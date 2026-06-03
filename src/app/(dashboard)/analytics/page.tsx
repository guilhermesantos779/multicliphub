'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { MetricCard, MetricCardSkeleton } from '@/components/dashboard/MetricCard'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { useUser } from '@/hooks/useUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { createClient } from '@/lib/supabase/client'
import { formatViews } from '@/lib/utils'
import type { Platform } from '@/types/api.types'

interface PlatformStat {
  platform: Platform
  posts: number
  views: number
}

const PLATFORM_COLORS: Record<Platform, string> = {
  tiktok:    '#fe2c55',
  instagram: '#c13584',
  youtube:   '#ff0000',
}

const PLATFORM_NAMES: Record<Platform, string> = {
  tiktok:    'TikTok',
  instagram: 'Instagram',
  youtube:   'YouTube',
}

export default function AnalyticsPage() {
  const { profile, loading: profileLoading } = useUser()
  const { markItem } = useOnboarding()
  const [stats, setStats] = useState<PlatformStat[]>([])
  const [loading, setLoading] = useState(true)

  // Onboarding: visiting Analytics completes that checklist step.
  useEffect(() => {
    if (profile) markItem('explore_analytics')
  }, [profile, markItem])

  useEffect(() => {
    if (!profile) return
    const load = async () => {
      const supabase = createClient()
      const { data: posts } = await supabase
        .from('posts')
        .select('platforms, total_views, status')
        .eq('user_id', profile.id)

      if (posts) {
        const map: Record<string, PlatformStat> = {}
        for (const post of posts) {
          for (const p of (post.platforms as Platform[]) || []) {
            if (!map[p]) map[p] = { platform: p, posts: 0, views: 0 }
            map[p].posts++
            map[p].views += Number(post.total_views) || 0
          }
        }
        setStats(Object.values(map).sort((a, b) => b.views - a.views))
      }
      setLoading(false)
    }
    load()
  }, [profile])

  const maxViews = Math.max(...stats.map(s => s.views), 1)

  return (
    <div>
      <Topbar title="Analytics" />
      <div className="p-6 space-y-6">

        {/* Métricas top */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {profileLoading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            <>
              <MetricCard
                label="Views Totais"
                value={formatViews(profile?.total_views || 0)}
                subLabel="acumulado"
                iconBg="#0a2030"
                trend="up"
                trendValue="todos os canais"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
              />
              <MetricCard
                label="Posts Publicados"
                value={(profile as any)?.total_posts || 0}
                subLabel="desde o início"
                iconBg="#1a1030"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9146FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
              />
              <MetricCard
                label="Posts este mês"
                value={profile?.posts_this_month || 0}
                subLabel="mês atual"
                iconBg="#1a2a1a"
                trend="up"
                trendValue="mês atual"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
              />
              <MetricCard
                label="Plataformas"
                value={stats.length}
                subLabel="com publicações"
                iconBg="#2a1a0a"
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
              />
            </>
          )}
        </div>

        {/* Views por plataforma */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
          <h3 className="mb-5 text-[14px] font-semibold text-white">Views por plataforma</h3>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-3 w-24 rounded bg-white/[0.06]" />
                  <div className="h-7 rounded bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : stats.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-2 text-3xl">📊</div>
              <div className="text-[13px] font-medium text-white mb-1">Sem dados ainda</div>
              <div className="text-[12px] text-[#444444]">Publique clipes para ver suas analytics</div>
            </div>
          ) : (
            <div className="space-y-5">
              {stats.map((stat, i) => {
                const pct = (stat.views / maxViews) * 100
                const color = PLATFORM_COLORS[stat.platform]
                return (
                  <motion.div
                    key={stat.platform}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={stat.platform} size={16} withLink={false} />
                        <span className="text-[13px] font-medium text-white">{PLATFORM_NAMES[stat.platform]}</span>
                        <span className="text-[11px] text-[#444444]">{stat.posts} posts</span>
                      </div>
                      <span className="text-[13px] font-semibold text-white">{formatViews(stat.views)}</span>
                    </div>
                    <div className="h-7 w-full overflow-hidden rounded-lg bg-[#0a0a0a]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-lg flex items-center px-3"
                        style={{ backgroundColor: `${color}33`, border: `1px solid ${color}55` }}
                      >
                        {pct > 15 && (
                          <span className="text-[11px] font-medium" style={{ color }}>{Math.round(pct)}%</span>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        {/* Posts por plataforma */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {stats.map(stat => {
              const color = PLATFORM_COLORS[stat.platform]
              return (
                <div
                  key={stat.platform}
                  className="rounded-xl border border-white/[0.06] bg-[#111111] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <PlatformIcon platform={stat.platform} size={18} withLink={false} />
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ color, background: `${color}18` }}
                    >
                      {PLATFORM_NAMES[stat.platform]}
                    </span>
                  </div>
                  <div className="text-[22px] font-bold text-white">{formatViews(stat.views)}</div>
                  <div className="mt-0.5 text-[11px] text-[#888888]">views · {stat.posts} posts</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
