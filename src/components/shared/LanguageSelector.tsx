'use client'

import { useState, useTransition } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

const LOCALES = [
  { code: 'pt-BR', label: 'PT', flag: '🇧🇷', name: 'Português' },
  { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
] as const

// Cookie-based locale switch (no URL change). Sets the `LOCALE` cookie that
// src/i18n/request.ts reads, then refreshes the server components so the new
// messages take effect.
export function LanguageSelector() {
  const locale = useLocale()
  const t = useTranslations('language')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [, startTransition] = useTransition()

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0]

  function switchLocale(code: string) {
    document.cookie = `LOCALE=${code}; path=/; max-age=31536000; samesite=lax`
    setOpen(false)
    startTransition(() => router.refresh())
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-2.5 py-1.5 text-[13px] font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
        aria-label={t('select')}
        aria-expanded={open}
      >
        <span className="text-[14px] leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg className="h-3 w-3 opacity-50" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
          <path d="M6 8 2 4h8L6 8z" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a] shadow-xl shadow-black/50">
            {LOCALES.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-white/[0.05] ${
                  locale === loc.code ? 'font-medium text-[#00E5A0]' : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="text-[15px] leading-none">{loc.flag}</span>
                <span>{loc.name}</span>
                {locale === loc.code && (
                  <svg className="ml-auto h-3.5 w-3.5 text-[#00E5A0]" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path d="M12 3 6 10 2 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
