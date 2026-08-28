'use client'
import { useEffect, useState } from 'react'
import { TermsContent } from './TermsContent'

interface LatestVersion {
  id: string
  versao: string
  conteudo: string
}

// Mounted in every authenticated layout. Silent no-op for most page loads
// (accepted:true) — only blocks when the user has never accepted the
// currently-vigent terms for their account type (new version published, or a
// pre-existing account that predates this whole system).
export function TermsGate() {
  const [checked, setChecked] = useState(false)
  const [version, setVersion] = useState<LatestVersion | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/terms/status').then(res => res.json()).then(json => {
      if (!active) return
      if (!json.accepted && json.latestVersion) {
        setVersion(json.latestVersion)
      }
      setChecked(true)
    }).catch(() => { if (active) setChecked(true) })
    return () => { active = false }
  }, [])

  if (!checked || !version) return null

  const handleAccept = async () => {
    setAccepting(true)
    const res = await fetch('/api/terms/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terms_version_id: version.id }),
    })
    if (res.ok) {
      setVersion(null)
    }
    setAccepting(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#111111]">
        <div className="border-b border-white/[0.08] px-6 py-5">
          <h2 className="text-[17px] font-extrabold text-white">Revise nossos termos atualizados</h2>
          <p className="mt-1 text-[12px] text-[#888888]">
            Atualizamos nossos Termos de Uso. Você precisa aceitar a versão atual pra continuar usando o MultiClip Hub.
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <TermsContent versao={version.versao} conteudo={version.conteudo} />
        </div>
        <div className="border-t border-white/[0.08] px-6 py-4">
          <button
            type="button"
            onClick={handleAccept}
            disabled={accepting}
            className="w-full rounded-xl bg-[#00E5A0] py-3 text-[13px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584] disabled:opacity-60"
          >
            {accepting ? 'Confirmando...' : 'Aceitar e continuar'}
          </button>
        </div>
      </div>
    </div>
  )
}
