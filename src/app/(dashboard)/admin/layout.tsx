'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { label: 'Visão Geral',   href: '/admin',           icon: '📊' },
  { label: 'Usuários',      href: '/admin/users',     icon: '👥' },
  { label: 'Planos',        href: '/admin/plans',     icon: '💳' },
  { label: 'Ranking',       href: '/admin/ranking',   icon: '🏆' },
  { label: 'Cupons',        href: '/admin/coupons',   icon: '🎟️' },
  { label: 'Logs',          href: '/admin/logs',      icon: '📋' },
  { label: 'Configurações', href: '/admin/settings',  icon: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && profile?.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [profile, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#9146FF]" />
      </div>
    )
  }

  if (profile?.role !== 'admin') return null

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Admin sub-sidebar */}
      <aside className="flex w-48 shrink-0 flex-col border-r border-white/[0.06] bg-[#050505]">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3.5">
          <span className="text-base">🛡️</span>
          <span className="text-[13px] font-semibold text-white">Painel Admin</span>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {ADMIN_NAV.map(item => {
            const active =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-colors',
                  active
                    ? 'bg-[#9146FF]/15 text-white'
                    : 'text-[#555555] hover:bg-white/[0.04] hover:text-[#888888]'
                )}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
                {active && (
                  <span className="ml-auto h-3.5 w-0.5 rounded-full bg-[#9146FF]" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/[0.06] p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-[#444444] transition-colors hover:text-[#888888]"
          >
            ← Voltar ao App
          </Link>
        </div>
      </aside>

      {/* Admin content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
