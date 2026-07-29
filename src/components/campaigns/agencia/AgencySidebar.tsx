'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogoSidebar } from '@/components/shared/Logo'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'

const NAV_ITEMS = [
  {
    label: 'Minhas Campanhas',
    href: '/agencia/dashboard/campanhas',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Nova campanha',
    href: '/agencia/dashboard/campanhas/nova',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
]

const TEAM_NAV_ITEM = {
  label: 'Meu Time',
  href: '/agencia/dashboard/time',
  icon: (active: boolean) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
}

function NavItem({ item, active }: { item: (typeof NAV_ITEMS)[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-200 ${
        active ? 'text-white' : 'text-[#555555] hover:text-[#888888]'
      }`}
    >
      {active && (
        <motion.div
          layoutId="agency-sidebar-active"
          className="absolute inset-0 rounded-lg bg-white/[0.06]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative">{item.icon(active)}</span>
      <span className="relative">{item.label}</span>
    </Link>
  )
}

export function AgencySidebar() {
  const pathname = usePathname()
  const { agencyProfile } = useAgencyProfile()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-white/[0.06] bg-[#0B0F19]">
      <div className="flex h-14 items-center border-b border-white/[0.06] px-4">
        <LogoSidebar />
      </div>

      {agencyProfile && (
        <div className="border-b border-white/[0.06] p-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#0B0F19]"
              style={{ background: 'linear-gradient(135deg, #35FDBC, #187D5B)' }}
            >
              {agencyProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-white">{agencyProfile.name}</div>
              <div className="text-[10px] font-medium text-[#00E5A0]">
                {agencyProfile.type === 'agencia' ? 'Agência' : 'Influenciador'}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavItem key={item.href} item={item} active={pathname.startsWith(item.href)} />
        ))}
        {agencyProfile?.kind === 'clipadores' && (
          <NavItem item={TEAM_NAV_ITEM} active={pathname.startsWith(TEAM_NAV_ITEM.href)} />
        )}
      </nav>

      <div className="border-t border-white/[0.06] p-2 space-y-0.5">
        <LogoutButton />
      </div>
    </aside>
  )
}

function LogoutButton() {
  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#555555] transition-colors hover:text-[#ef4444]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Sair
    </button>
  )
}
