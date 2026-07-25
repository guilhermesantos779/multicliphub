'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'

interface AppSetting {
  key: string
  value: string
  description: string | null
  updated_at: string
}

const BOOL_TRUE = 'true'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<AppSetting[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<string | null>(null)
  const [edited, setEdited]     = useState<Record<string, string>>({})

  const fetchSettings = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('app_settings')
      .select('*')
      .order('key')
    setSettings((data as AppSetting[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const save = async (key: string, newValue: string) => {
    setSaving(key)
    const supabase = createClient()
    const { error } = await supabase
      .from('app_settings')
      .update({ value: newValue, updated_at: new Date().toISOString() })
      .eq('key', key)
    if (error) {
      toast('Erro ao salvar configuração', 'error')
    } else {
      toast('Configuração salva', 'success')
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s))
      setEdited(prev => { const n = { ...prev }; delete n[key]; return n })
    }
    setSaving(null)
  }

  const isBool = (value: string) => value === 'true' || value === 'false'
  const currentValue = (s: AppSetting) => edited[s.key] ?? s.value

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-[20px] font-bold text-white">Configurações</h1>
        <p className="mt-0.5 text-[13px] text-[#888888]">Parâmetros globais da plataforma</p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-[#111111] overflow-hidden">
        <div className="grid grid-cols-[200px_1fr_160px_80px] border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-[#444444]">
          <span>Chave</span>
          <span>Valor</span>
          <span>Descrição</span>
          <span>Ação</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-white/[0.02] px-4" />
              ))
            : settings.map(s => {
                const val = currentValue(s)
                const isDirty = edited[s.key] !== undefined
                return (
                  <div key={s.key} className="grid grid-cols-[200px_1fr_160px_80px] items-center gap-4 px-4 py-3">
                    <span className="font-mono text-[11px] text-[#9146FF]">{s.key}</span>

                    <div>
                      {isBool(s.value) ? (
                        <button
                          onClick={() => {
                            const next = val === BOOL_TRUE ? 'false' : 'true'
                            save(s.key, next)
                          }}
                          className={`relative h-5 w-9 rounded-full transition-colors ${val === BOOL_TRUE ? 'bg-[#9146FF]' : 'bg-[#333]'}`}
                        >
                          <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${val === BOOL_TRUE ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      ) : (
                        <input
                          value={val}
                          onChange={e => setEdited(prev => ({ ...prev, [s.key]: e.target.value }))}
                          className="w-full rounded-lg border border-white/[0.08] bg-[#0a0a0a] px-3 py-1.5 text-[12px] text-white outline-none focus:border-[#9146FF]/50"
                        />
                      )}
                    </div>

                    <span className="text-[11px] text-[#555555]">{s.description || '—'}</span>

                    {!isBool(s.value) && (
                      <button
                        onClick={() => save(s.key, val)}
                        disabled={!isDirty || saving === s.key}
                        className="rounded-lg bg-[#9146FF]/15 px-3 py-1.5 text-[10px] font-medium text-[#9146FF] transition-colors hover:bg-[#9146FF]/25 disabled:opacity-30"
                      >
                        {saving === s.key ? '...' : 'Salvar'}
                      </button>
                    )}
                    {isBool(s.value) && <span />}
                  </div>
                )
              })}
        </div>
      </div>
    </div>
  )
}
