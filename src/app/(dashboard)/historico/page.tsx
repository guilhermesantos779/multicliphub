'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { PlatformIcon } from '@/components/shared/PlatformIcon'
import { PostCardSkeleton } from '@/components/shared/Skeleton'
import { useUser } from '@/hooks/useUser'
import { createClient } from '@/lib/supabase/client'
import { formatViews, formatDate } from '@/lib/utils'
import type { Platform, PostStatus } from '@/types/api.types'

interface Post {
  id: string
  title: string
  caption: string
  status: PostStatus
  platforms: Platform[]
  total_views: number
  scheduled_at: string | null
  created_at: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  published:  { label: 'Publicado', color: '#DEFF9A', bg: 'rgba(222,255,154,0.08)' },
  failed:     { label: 'Falhou',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)'   },
  scheduled:  { label: 'Agendado', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)'  },
  pending:    { label: 'Pendente', color: '#666666', bg: 'rgba(102,102,102,0.08)' },
  publishing: { label: 'Publicando', color: '#9146FF', bg: 'rgba(145,70,255,0.08)' },
}

const PLATFORMS: { value: Platform | 'all'; label: string }[] = [
  { value: 'all',       label: 'Todas' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube',   label: 'YouTube' },
]

const STATUSES = [
  { value: 'all',       label: 'Todos' },
  { value: 'published', label: 'Publicados' },
  { value: 'scheduled', label: 'Agendados' },
  { value: 'failed',    label: 'Falharam' },
]

export default function HistoricoPage() {
  const { profile } = useUser()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!profile) return
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('id, title, caption, status, platforms, total_views, scheduled_at, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(100)
      setPosts((data as Post[]) || [])
      setLoading(false)
    }
    load()
  }, [profile])

  const filtered = posts.filter(p => {
    if (platformFilter !== 'all' && !p.platforms?.includes(platformFilter)) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <Topbar title="Histórico" />
      <div className="p-6 space-y-5">

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por título…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 w-56 rounded-lg border border-white/[0.08] bg-[#111111] px-3 text-[13px] text-white placeholder-[#444444] outline-none focus:border-white/20"
          />
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#111111] p-1">
            {PLATFORMS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setPlatformFilter(opt.value as Platform | 'all')}
                className={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors ${
                  platformFilter === opt.value
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#555555] hover:text-[#888888]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-[#111111] p-1">
            {STATUSES.map(opt => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors ${
                  statusFilter === opt.value
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#555555] hover:text-[#888888]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[12px] text-[#444444]">
            {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        {/* Lista */}
        <div className="rounded-xl border border-white/[0.06] bg-[#111111] divide-y divide-white/[0.04]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-5 py-4"><PostCardSkeleton /></div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-3 text-4xl">📋</div>
              <div className="text-[14px] font-medium text-white mb-1">Nenhum post encontrado</div>
              <div className="text-[12px] text-[#444444]">
                {posts.length === 0
                  ? 'Publique seu primeiro clipe pela página de Upload'
                  : 'Tente outros filtros'}
              </div>
            </div>
          ) : filtered.map((post, i) => {
            const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.pending
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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
                        <PlatformIcon key={p} platform={p} size={14} withLink={false} />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#444444]">{formatDate(post.created_at)}</span>
                    {post.total_views > 0 && (
                      <span className="text-[11px] text-[#444444]">· {formatViews(post.total_views)} views</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ color: status.color, background: status.bg }}
                  >
                    {status.label}
                  </span>
                  {post.status === 'failed' && (
                    <button
                      className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-[11px] text-[#888888] transition-colors hover:border-[#9146FF]/40 hover:text-[#9146FF]"
                      onClick={() => {}}
                    >
                      Republicar
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
