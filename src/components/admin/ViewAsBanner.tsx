'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'

const LABELS: Record<string, string> = {
  clipper: 'clipador',
  agency: 'agência',
}

export function ViewAsBanner() {
  const { isAdmin } = useUser()
  const [mode, setMode] = useState<string | null>(null)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    let active = true
    fetch('/api/admin/view-as').then(res => res.json()).then(json => {
      if (active) setMode(json.mode ?? null)
    })
    return () => { active = false }
  }, [isAdmin])

  if (!isAdmin || !mode) return null

  const handleExit = async () => {
    setExiting(true)
    await fetch('/api/admin/view-as', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: null }),
    })
    window.location.href = '/admin'
  }

  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-3 bg-[#9146FF] px-4 py-2 text-[12px] font-medium text-white">
      <span>🎭 Visualizando como {LABELS[mode] ?? mode} — os dados são reais, mas você está vendo com sua conta admin</span>
      <button
        onClick={handleExit}
        disabled={exiting}
        className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold transition-colors hover:bg-white/25 disabled:opacity-60"
      >
        {exiting ? 'Saindo...' : 'Voltar ao normal'}
      </button>
    </div>
  )
}
