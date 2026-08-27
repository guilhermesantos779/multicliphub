'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useUser } from '@/hooks/useUser'
import { useNotifications } from '@/hooks/useNotifications'
import { useWalletBalance } from '@/hooks/useWalletBalance'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import { useMobileNav } from '@/components/dashboard/MobileNav'
import { formatDate } from '@/lib/utils'
import { UserMenu } from '@/components/app/UserMenu'
import { LanguageSelector } from '@/components/shared/LanguageSelector'

function WalletPill() {
  const { balance, loading } = useWalletBalance()

  if (loading || !balance) return null

  const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    balance.available
  )

  return (
    <Link
      href="/perfil/pagamentos"
      className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.06] bg-[#111111] px-3 text-[12px] font-medium text-[#888888] transition-colors hover:border-white/[0.12] hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M17 15h.01" />
      </svg>
      <span>Disponível</span>
      <span className="font-semibold text-[#00E5A0]">{formatted}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  )
}

const notifIcons: Record<string, string> = {
  published: '✅',
  failed: '❌',
  ranking: '🏆',
  record: '🔥',
  trial: '⚠️',
  disconnected: '🔗',
}

export function Topbar({ title }: { title: string }) {
  const t = useTranslations('topbar')
  const { profile } = useUser()
  const { agencyProfile } = useAgencyProfile()
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications(profile?.id)
  const { toggle } = useMobileNav()
  const [notifOpen, setNotifOpen] = useState(false)

  const handleBellClick = () => {
    setNotifOpen(v => !v)
    if (!notifOpen && unreadCount > 0) markAllRead()
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-white/[0.06] bg-obsidiana/70 px-4 backdrop-blur-xl md:px-6">
      {/* Bottom border shine */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="flex min-w-0 items-center gap-2">
        {/* Hamburger — opens the nav drawer on mobile */}
        <button
          onClick={toggle}
          aria-label="abrir menu"
          className="-ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#888888] transition-colors hover:text-white md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <h1 className="truncate text-[15px] font-semibold text-white">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <LanguageSelector />
        {!agencyProfile && <WalletPill />}

        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative grid h-9 w-9 place-items-center rounded-lg border border-white/[0.06] bg-[#111111] text-[#666666] transition-colors hover:border-white/[0.12] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00E5A0] text-[9px] font-bold text-[#0B0F19]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-80 overflow-hidden rounded-xl border border-white/[0.12] bg-surface-high/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
              >
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                  <span className="text-[13px] font-semibold text-white">{t('notifications')}</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] text-[#00E5A0] hover:underline">
                      {t('mark_all_read')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-[13px] text-[#444444]">
                      {t('no_notifications')}
                    </div>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/[0.04] ${!n.read ? 'bg-[#00E5A0]/[0.04]' : ''}`}
                      >
                        <span className="mt-0.5 text-sm">{notifIcons[n.type] || '📢'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium text-white">{n.title}</div>
                          {n.message && <div className="text-[11px] text-[#555555]">{n.message}</div>}
                          <div className="mt-1 text-[10px] text-[#333333]">{formatDate(n.created_at)}</div>
                        </div>
                        {!n.read && (
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00E5A0]" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar + dropdown (real avatar, compact plan frame) */}
        <UserMenu profile={profile} layout="header" avatarSize={36} />
      </div>
    </header>
  )
}
