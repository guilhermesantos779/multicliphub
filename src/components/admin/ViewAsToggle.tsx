'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ViewAsMode = 'clipper' | 'agency' | null

const OPTIONS: { mode: ViewAsMode; label: string; icon: string }[] = [
  { mode: null, label: 'Normal (Admin)', icon: '🛡️' },
  { mode: 'clipper', label: 'Ver como Clipador', icon: '🎬' },
  { mode: 'agency', label: 'Ver como Agência', icon: '📢' },
]

export function ViewAsToggle() {
  const router = useRouter()
  const [current, setCurrent] = useState<ViewAsMode>(null)
  const [loading, setLoading] = useState(true)
  const [switching, setSwitching] = useState<ViewAsMode>(null)

  useEffect(() => {
    let active = true
    fetch('/api/admin/view-as').then(res => res.json()).then(json => {
      if (active) {
        setCurrent(json.mode ?? null)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [])

  const handleSwitch = async (mode: ViewAsMode) => {
    setSwitching(mode)
    await fetch('/api/admin/view-as', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode }),
    })
    // Full navigation (not client-side router.push) so the proxy re-evaluates
    // every guard fresh with the new cookie instead of leaving stale nav state.
    window.location.href = '/inicio'
  }

  return (
    <div className="rounded-xl border border-[#9146FF]/20 bg-[#9146FF]/[0.04] p-5">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[14px]">🎭</span>
        <h2 className="text-[14px] font-semibold text-white">Modo de visualização</h2>
      </div>
      <p className="mb-4 text-[12px] text-[#888888]">
        Veja o site como um clipador ou uma agência veriam, usando sua própria conta admin. Não altera nenhum dado — expira sozinho em 12h.
      </p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(opt => {
          const active = !loading && current === opt.mode
          return (
            <button
              key={opt.label}
              onClick={() => handleSwitch(opt.mode)}
              disabled={loading || switching !== null}
              className={`rounded-lg border px-3.5 py-2 text-[12px] font-medium transition-colors disabled:opacity-50 ${
                active
                  ? 'border-[#9146FF]/50 bg-[#9146FF]/15 text-white'
                  : 'border-white/[0.08] bg-[#111111] text-[#888888] hover:border-white/[0.16] hover:text-white'
              }`}
            >
              {switching === opt.mode ? 'Trocando...' : `${opt.icon} ${opt.label}`}
            </button>
          )
        })}
      </div>
    </div>
  )
}
