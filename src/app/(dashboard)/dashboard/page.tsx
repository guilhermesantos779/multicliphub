'use client'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Film } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Topbar } from '@/components/dashboard/Topbar'
import { SpotGlow, EmptyState, StaggerContainer, StaggerItem, AnimatedNumber } from '@/components/ui/brand'
import { MetricCard, MetricCardSkeleton } from '@/components/dashboard/MetricCard'
import { PostCardSkeleton } from '@/components/shared/Skeleton'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { useUser } from '@/hooks/useUser'
import { useToast } from '@/components/shared/Toast'
import { createClient } from '@/lib/supabase/client'
import { formatViews, formatDate } from '@/lib/utils'
import type { Platform } from '@/types/api.types'

function UpgradeSuccessHandler() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const t = useTranslations('dashboard')

  useEffect(() => {
    if (searchParams.get('upgrade') === 'success') {
      toast(t('upgrade_success'), 'success')
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [searchParams, toast, t])

  return null
}

interface RecentPost {
  id: string
  title: string
  status: string
  platforms: Platform[]
  total_views: number
  created_at: string
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  published: { color: '#DEFF9A', bg: 'rgba(222,255,154,0.08)' },
  failed:    { color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  scheduled: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  pending:   { color: '#666666', bg: 'rgba(102,102,102,0.08)' },
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const router = useRouter()
  const { profile, loading } = useUser()
  const [posts, setPosts] = useState<RecentPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    const fetchPosts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('id, title, status, platforms, total_views, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setPosts((data as RecentPost[]) || [])
      setPostsLoading(false)
    }
    fetchPosts()
  }, [profile])

  const postsLabel =
    profile?.plan === 'clipper'
      ? `${profile.posts_this_month}/200`
      : profile?.plan === 'trial'
      ? `${profile?.posts_this_month || 0}/10`
      : String(profile?.posts_this_month || 0)

  const postsSub =
    profile?.plan === 'pro' || profile?.plan === 'king'
      ? t('metric_posts_sub_unlimited')
      : t('metric_posts_sub_limit')

  return (
    <div>
      <Suspense fallback={null}>
        <UpgradeSuccessHandler />
      </Suspense>
      <Topbar title={t('title')} />

      <div className="relative p-4 space-y-6 md:p-6">
        {/* Ambient depth */}
        <SpotGlow color="mint" size="lg" position="top-right" />

        {/* Métricas */}
        <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            <>
              <StaggerItem>
                <MetricCard
                  label={t('metric_posts')}
                  value={postsLabel}
                  subLabel={postsSub}
                  iconBg="#1a1030"
                  trend="up"
                  trendValue={t('metric_posts_trend')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  label={t('metric_views')}
                  value={<AnimatedNumber value={profile?.total_views || 0} format={formatViews} />}
                  subLabel={t('metric_views_sub')}
                  iconBg="#0a2030"
                  trend="up"
                  trendValue={t('metric_views_trend')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  }
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  label={t('metric_platforms')}
                  value={3}
                  subLabel={t('metric_platforms_sub')}
                  iconBg="#1a2a1a"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                    </svg>
                  }
                />
              </StaggerItem>
              <StaggerItem>
                <MetricCard
                  label={t('metric_streak')}
                  value={t('metric_streak_value')}
                  subLabel={t('metric_streak_sub')}
                  iconBg="#2a1a0a"
                  trend="up"
                  trendValue={t('metric_streak_trend')}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                    </svg>
                  }
                />
              </StaggerItem>
            </>
          )}
        </StaggerContainer>

        {/* Posts recentes */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.05] backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[14px] font-semibold text-white">{t('recent_title')}</h2>
            <Link href="/historico" className="text-[12px] text-[#00E5A0] hover:underline">
              {t('see_all')}
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {postsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-5 py-4">
                  <PostCardSkeleton />
                </div>
              ))
            ) : posts.length === 0 ? (
              <EmptyState
                variant="compact"
                icon={<Film className="h-full w-full" style={{ color: 'rgba(0,229,160,0.6)' }} />}
                title={t('empty_title')}
                description={t('empty_subtitle')}
                action={{ label: t('empty_cta'), onClick: () => router.push('/upload') }}
              />
            ) : (
              posts.map((post, i) => {
                const statusKey = statusConfig[post.status] ? post.status : 'pending'
                const status = statusConfig[statusKey]! // statusKey is always a valid key
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#1a1a1a] text-lg">
                      🎬
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-[13px] font-medium text-white">{post.title}</div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {post.platforms?.map(p => (
                            <PlatformIcon key={p} platform={p} size={16} withLink={false} />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#444444]">{formatDate(post.created_at)}</span>
                        {post.total_views > 0 && (
                          <span className="text-[11px] text-[#444444]">· {formatViews(post.total_views)} {t('views')}</span>
                        )}
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {t(`status_${statusKey}`)}
                    </span>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>

        {/* CTA upgrade se trial */}
        {profile?.plan === 'trial' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/[0.04] p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[14px] font-semibold text-white">{t('trial_title')}</div>
                <div className="mt-0.5 text-[12px] text-[#888888]">
                  {t('trial_subtitle')}
                </div>
              </div>
              <Link
                href="/configuracoes"
                className="rounded-lg bg-[#f59e0b] px-4 py-2 text-[13px] font-medium text-black hover:bg-[#d97706] transition-colors"
              >
                {t('trial_cta')}
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
