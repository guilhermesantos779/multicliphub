'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface NewsItem {
  id: string
  titulo: string
  descricao: string
  tipo: string | null
  publicado_em: string
}

const FEED_LIMIT = 8

const TIPO_ICON: Record<string, string> = {
  feature: '✨',
  evento: '🎉',
  aviso: '📢',
  manutencao: '🛠️',
}

function NewsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
      ))}
    </div>
  )
}

export function NewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_news')
        .select('id, titulo, descricao, tipo, publicado_em')
        .order('publicado_em', { ascending: false })
        .limit(FEED_LIMIT)
      if (!cancelled) {
        setItems(data ?? [])
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <NewsSkeleton />

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-8 text-center text-[13px] text-[#555555]">
        Nenhuma novidade publicada ainda.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <div
          key={item.id}
          className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-colors hover:border-mint/20"
        >
          <span className="mt-0.5 shrink-0 text-lg">{(item.tipo && TIPO_ICON[item.tipo]) || '📰'}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h3 className="text-[13px] font-bold text-white">{item.titulo}</h3>
              <span className="text-[10px] text-[#555555]">{formatDate(item.publicado_em)}</span>
            </div>
            <p className="mt-0.5 text-[12px] font-light leading-relaxed text-[#999999]">{item.descricao}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
