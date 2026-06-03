'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Topbar } from '@/components/dashboard/Topbar'
import { useUser } from '@/hooks/useUser'
import { useOnboarding } from '@/hooks/useOnboarding'
import { createClient } from '@/lib/supabase/client'
import { formatViews } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface RankEntry {
  id: string
  username: string | null
  full_name: string | null
  total_views: bigint | number
  total_posts: number
  plan: string | null
}

const PLAN_COLOR: Record<string, string> = {
  king:    '#DEFF9A',
  pro:     '#00E5A0',
  clipper: '#888888',
  trial:   '#f59e0b',
}

const PODIUM_MEDALS = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const { profile } = useUser()
  const { markItem } = useOnboarding()
  const [entries, setEntries] = useState<RankEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'ranking' | 'como'>('ranking')

  // Onboarding: visiting Ranking completes that checklist step.
  useEffect(() => {
    if (profile) markItem('check_ranking')
  }, [profile, markItem])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      // Read from public_profiles view: exposes safe columns for all users
      // (the base profiles table is owner-only via RLS) and includes username.
      const { data } = await supabase
        .from('public_profiles')
        .select('id, username, full_name, total_views, total_posts, plan')
        .order('total_views', { ascending: false })
        .limit(50)
      setEntries((data as RankEntry[]) || [])
      setLoading(false)
    }
    load()
  }, [])

  const myPosition = entries.findIndex(e => e.id === profile?.id) + 1
  const podium = entries.slice(0, 3)

  return (
    <div>
      <Topbar title="Ranking" />
      <div className="p-6 space-y-5">

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-[#111111] p-1 w-fit">
          {(['ranking', 'como'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors',
                tab === t ? 'bg-white/[0.08] text-white' : 'text-[#555555] hover:text-[#888888]'
              )}
            >
              {t === 'ranking' ? '🏆 Ranking' : '❓ Como funciona'}
            </button>
          ))}
        </div>

        {tab === 'como' ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-6 space-y-5">
            <h3 className="text-[15px] font-semibold text-white">Como o ranking funciona</h3>
            <div className="space-y-4">
              {[
                { icon: '👁️', title: 'Views acumulados', desc: 'Cada view nos seus vídeos publicados pelo MultiClipHub conta para o ranking.' },
                { icon: '📅', title: 'Atualização', desc: 'O ranking é atualizado em tempo real conforme suas publicações recebem visualizações.' },
                { icon: '🏆', title: 'Pódio', desc: 'Os 3 primeiros creators com mais views ficam no pódio de destaque.' },
                { icon: '📈', title: 'Como subir', desc: 'Publique mais clipes com o Upload e conecte mais canais para maximizar seu alcance.' },
                { icon: '🎁', title: 'Recompensas', desc: 'Creators no top 10 terão acesso antecipado a novos recursos e destaque na plataforma.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{item.title}</div>
                    <div className="mt-0.5 text-[12px] text-[#888888]">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Minha posição */}
            {myPosition > 0 && (
              <div className="rounded-xl border border-[#9146FF]/20 bg-[#9146FF]/[0.04] px-5 py-3 flex items-center justify-between">
                <span className="text-[13px] text-[#888888]">Sua posição</span>
                <span className="text-[20px] font-bold text-white">#{myPosition}</span>
              </div>
            )}

            {/* Pódio */}
            {!loading && podium.length > 0 && (
              <div className="flex items-end justify-center gap-4 pt-4 pb-6">
                {[podium[1], podium[0], podium[2]].filter(Boolean).map((entry, idx) => {
                  const pos = idx === 0 ? 2 : idx === 1 ? 1 : 3
                  const heights = { 1: 'h-28', 2: 'h-20', 3: 'h-16' }
                  const isMe = entry?.id === profile?.id
                  return (
                    <motion.div
                      key={entry?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: pos * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="text-2xl">{PODIUM_MEDALS[pos - 1]}</div>
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full text-[14px] font-bold text-white border-2',
                          isMe ? 'border-[#9146FF]' : 'border-white/[0.1]'
                        )}
                        style={{ background: '#1a1a1a' }}
                      >
                        {(entry?.full_name || entry?.username || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="text-center">
                        {entry?.username ? (
                          <Link
                            href={`/perfil/${entry.username}`}
                            className="block max-w-[80px] truncate text-[12px] font-medium text-white transition-colors hover:text-[#9146FF]"
                          >
                            {entry?.full_name?.split(' ')[0] || `@${entry.username}`}
                          </Link>
                        ) : (
                          <div className="max-w-[80px] truncate text-[12px] font-medium text-white">
                            {entry?.full_name?.split(' ')[0] || 'Anônimo'}
                          </div>
                        )}
                        <div className="text-[11px] text-[#888888]">{formatViews(Number(entry?.total_views))} views</div>
                      </div>
                      <div
                        className={cn(
                          'w-20 rounded-t-lg flex items-center justify-center',
                          heights[pos as 1|2|3]
                        )}
                        style={{
                          background: pos === 1
                            ? 'linear-gradient(to top, #DEFF9A22, #DEFF9A44)'
                            : pos === 2
                            ? 'linear-gradient(to top, #88888822, #88888844)'
                            : 'linear-gradient(to top, #f59e0b22, #f59e0b44)',
                          border: '1px solid',
                          borderColor: pos === 1 ? '#DEFF9A33' : pos === 2 ? '#88888833' : '#f59e0b33',
                        }}
                      >
                        <span className="text-[18px] font-bold" style={{ color: pos === 1 ? '#DEFF9A' : pos === 2 ? '#888' : '#f59e0b' }}>
                          {pos}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Lista completa */}
            <div className="rounded-xl border border-white/[0.06] bg-[#111111] divide-y divide-white/[0.04]">
              <div className="flex items-center gap-4 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-[#444444]">
                <span className="w-8">#</span>
                <span className="flex-1">Creator</span>
                <span className="w-20 text-right">Posts</span>
                <span className="w-24 text-right">Views</span>
              </div>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                    <div className="h-3 w-6 rounded bg-white/[0.06]" />
                    <div className="h-3 flex-1 rounded bg-white/[0.06]" />
                    <div className="h-3 w-12 rounded bg-white/[0.04]" />
                    <div className="h-3 w-16 rounded bg-white/[0.04]" />
                  </div>
                ))
              ) : entries.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-[#444444]">
                  Ainda não há creators no ranking. Seja o primeiro!
                </div>
              ) : entries.map((entry, i) => {
                const isMe = entry.id === profile?.id
                const planColor = PLAN_COLOR[entry.plan ?? ''] || '#888888'
                return (
                  <div
                    key={entry.id}
                    className={cn(
                      'flex items-center gap-4 px-5 py-3.5 transition-colors',
                      isMe ? 'bg-[#9146FF]/[0.04]' : 'hover:bg-white/[0.02]'
                    )}
                  >
                    <span className="w-8 shrink-0 text-[13px] font-bold text-[#444444]">
                      {i < 3 ? PODIUM_MEDALS[i] : `${i + 1}`}
                    </span>
                    {(() => {
                      const Inner = (
                        <>
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                            style={{ background: `${planColor}22`, border: `1px solid ${planColor}33` }}
                          >
                            {(entry.full_name || entry.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-[13px] font-medium text-white">
                              {entry.full_name || (entry.username ? `@${entry.username}` : 'Anônimo')}
                              {isMe && <span className="ml-1.5 text-[10px] text-[#9146FF]">você</span>}
                            </div>
                          </div>
                        </>
                      )
                      return entry.username ? (
                        <Link
                          href={`/perfil/${entry.username}`}
                          className="group flex flex-1 items-center gap-2.5 min-w-0 transition-opacity hover:opacity-80"
                        >
                          {Inner}
                        </Link>
                      ) : (
                        <div className="flex flex-1 items-center gap-2.5 min-w-0">{Inner}</div>
                      )
                    })()}
                    <span className="w-20 text-right text-[12px] text-[#666666]">{entry.total_posts}</span>
                    <span className="w-24 text-right text-[12px] font-semibold text-white">
                      {formatViews(Number(entry.total_views))}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
