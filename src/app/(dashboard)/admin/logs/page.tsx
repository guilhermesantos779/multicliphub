'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SystemLog {
  id: string
  level: 'info' | 'warn' | 'error'
  action: string
  message: string
  user_id: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

const LEVEL_COLORS = {
  info:  { text: '#00E5A0', bg: 'rgba(0,229,160,0.08)'  },
  warn:  { text: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  error: { text: '#ef4444', bg: 'rgba(239,68,68,0.08)'  },
}

export default function AdminLogsPage() {
  const [logs, setLogs]           = useState<SystemLog[]>([])
  const [loading, setLoading]     = useState(true)
  const [filterLevel, setFilter]  = useState<'all' | 'info' | 'warn' | 'error'>('all')
  const [paused, setPaused]       = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setLogs((data as SystemLog[]) || [])
        setLoading(false)
      })

    const channel = supabase
      .channel('system_logs_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'system_logs' },
        payload => {
          if (!paused) {
            setLogs(prev => [payload.new as SystemLog, ...prev].slice(0, 500))
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = filterLevel === 'all' ? logs : logs.filter(l => l.level === filterLevel)

  const fmt = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })
  }

  return (
    <div className="flex h-full flex-col p-6 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white">Logs do Sistema</h1>
          <p className="mt-0.5 text-[13px] text-[#888888]">{filtered.length} entradas • realtime ativo</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-[#111111] p-1">
            {(['all', 'info', 'warn', 'error'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`rounded px-2.5 py-1 text-[10px] capitalize transition-all ${
                  filterLevel === lvl ? 'bg-[#9146FF] text-white' : 'text-[#555555] hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'Todos' : lvl}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPaused(v => !v)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              paused
                ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                : 'bg-[#00E5A0]/10 text-[#00E5A0]'
            }`}
          >
            {paused ? '▶ Retomar' : '⏸ Pausar'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0a0a0a] font-mono">
        <div className="divide-y divide-white/[0.03]">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse bg-white/[0.02]" />
              ))
            : filtered.length === 0
            ? <div className="px-4 py-12 text-center text-[12px] text-[#444444]">Nenhum log encontrado</div>
            : filtered.map(log => {
                const lc = LEVEL_COLORS[log.level] || LEVEL_COLORS.info
                return (
                  <div key={log.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-white/[0.02]">
                    <span className="shrink-0 text-[9px] text-[#333333] pt-0.5 w-32">{fmt(log.created_at)}</span>
                    <span
                      className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{ color: lc.text, background: lc.bg }}
                    >
                      {log.level}
                    </span>
                    <span className="text-[11px] text-[#9146FF] shrink-0 w-32 truncate">{log.action}</span>
                    <span className="flex-1 text-[11px] text-[#cccccc] break-all">{log.message}</span>
                    {log.metadata && (
                      <span className="text-[9px] text-[#444444] shrink-0 max-w-[120px] truncate">
                        {JSON.stringify(log.metadata)}
                      </span>
                    )}
                  </div>
                )
              })}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
