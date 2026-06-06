'use client'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Topbar } from '@/components/dashboard/Topbar'
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

  useEffect(() => {
    if (searchParams.get('upgrade') === 'success') {
      toast('🎉 Upgrade realizado com sucesso! Bem-vindo ao novo plano.', 'success')
      window.history.replaceState({}, '', '/dashboard')
    }
  }, [searchParams, toast])

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

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Publicado', color: '#DEFF9A', bg: 'rgba(222,255,154,0.08)' },
  failed:    { label: 'Falhou',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  scheduled: { label: 'Agendado', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  pending:   { label: 'Pendente', color: '#666666', bg: 'rgba(102,102,102,0.08)' },
}

export default function DashboardPage() {
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
    profile?.plan === 'pro' || profile?.plan === 'king' ? 'Ilimitado' : '200 posts/mês'

  return (
    <div>
      <Suspense fallback={null}>
        <UpgradeSuccessHandler />
      </Suspense>
      <Topbar title="Dashboard" />

      <div className="p-4 space-y-6 md:p-6">
        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : (
            <>
              <MetricCard
                label="Posts este mês"
                value={postsLabel}
                subLabel={postsSub}
                iconBg="#1a1030"
                trend="up"
                trendValue="este mês"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                }
              />
              <MetricCard
                label="Views Totais"
                value={formatViews(profile?.total_views || 0)}
                subLabel="em todos os canais"
                iconBg="#0a2030"
                trend="up"
                trendValue="acumulado"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                }
              />
              <MetricCard
                label="Plataformas"
                value={3}
                subLabel="Conectadas"
                iconBg="#1a2a1a"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                  </svg>
                }
              />
              <MetricCard
                label="Sequência"
                value="7 dias"
                subLabel="publicações diárias"
                iconBg="#2a1a0a"
                trend="up"
                trendValue="recorde!"
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                  </svg>
                }
              />
            </>
          )}
        </div>

        {/* Posts recentes */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <h2 className="text-[14px] font-semibold text-white">Vídeos Recentes</h2>
            <Link href="/historico" className="text-[12px] text-[#00E5A0] hover:underline">
              Ver todos
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
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-3 text-4xl">🎬</div>
                <div className="text-[14px] font-medium text-white mb-1">
                  Nenhum clipe publicado ainda
                </div>
                <div className="mb-4 text-[12px] text-[#444444]">
                  Envie seu primeiro clipe e domine os algoritmos
                </div>
                <Link
                  href="/upload"
                  className="rounded-lg bg-[#00E5A0] px-4 py-2 text-[13px] font-semibold text-[#0B0F19] hover:bg-[#00B584] transition-colors"
                >
                  Enviar primeiro clipe
                </Link>
              </div>
            ) : (
              posts.map((post, i) => {
                const status = statusConfig[post.status] || statusConfig.pending
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
                          <span className="text-[11px] text-[#444444]">· {formatViews(post.total_views)} views</span>
                        )}
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ color: status.color, background: status.bg }}
                    >
                      {status.label}
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
                <div className="text-[14px] font-semibold text-white">Seu trial está ativo ⚠️</div>
                <div className="mt-0.5 text-[12px] text-[#888888]">
                  Escolha um plano para continuar postando após o período de teste
                </div>
              </div>
              <Link
                href="/pricing"
                className="rounded-lg bg-[#f59e0b] px-4 py-2 text-[13px] font-medium text-black hover:bg-[#d97706] transition-colors"
              >
                Ver planos
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
