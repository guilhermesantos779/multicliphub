'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'mch_cookie_consent'
const CONSENT_DAYS = 365

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage unavailable (private mode, etc.) — just skip the banner.
    }
  }, [])

  const choose = (choice: 'all' | 'essential') => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, decidedAt: new Date().toISOString() }))
      document.cookie = `mch_cookie_consent=${choice}; path=/; max-age=${CONSENT_DAYS * 86400}; samesite=lax`
    } catch {
      // ignore — worst case the banner shows again next visit
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[150] p-4">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl border border-white/[0.1] bg-[#111111]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-relaxed text-white/70">
          Usamos cookies pra manter você conectado e melhorar sua experiência. Veja nossa{' '}
          <Link href="/privacidade" className="text-[#00E5A0] hover:underline">Política de Privacidade</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('essential')}
            className="rounded-lg border border-white/[0.1] px-3 py-2 text-[12px] font-medium text-white/70 transition-colors hover:text-white"
          >
            Rejeitar não essenciais
          </button>
          <button
            type="button"
            onClick={() => choose('all')}
            className="rounded-lg bg-[#00E5A0] px-3 py-2 text-[12px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  )
}
