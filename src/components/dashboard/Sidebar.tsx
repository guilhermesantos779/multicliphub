'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useMyCampaigns } from '@/hooks/useMyCampaigns'
import { LogoSidebar } from '@/components/shared/Logo'


const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: 'Upload',
    href: '/upload',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    label: 'Canais',
    href: '/canais',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    label: 'Campanhas',
    href: '/campanhas',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <path d="M3 11l18-5v12L3 14v-3z" /><path d="M11.6 16.8L6 22" /><path d="M3 11v3a2 2 0 002 2h1" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    label: 'Ranking',
    href: '/ranking',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" />
      </svg>
    ),
  },
  {
    label: 'Histórico',
    href: '/historico',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
]

const BOTTOM_ITEMS = [
  {
    label: 'Perfil',
    href: '/perfil',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: (active: boolean) => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-white' : 'text-[#555555]'}>
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
]

function NavItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-200',
        active ? 'text-white' : 'text-[#555555] hover:text-[#888888]'
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-lg bg-white/[0.06]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
      <span className="relative">{item.icon(active)}</span>
      <span className="relative">{item.label}</span>
      {active && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[#00E5A0]"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { profile, isAdmin } = useUser()
  const planColors: Record<string, string> = {
    clipper: '#888888',
    pro: '#00E5A0',
    king: '#DEFF9A',
    trial: '#f59e0b',
  }
  const planColor = planColors[profile?.plan || 'trial'] || '#888888'

  const postsLimit = profile?.plan === 'clipper' ? 200 : profile?.plan === 'trial' ? 10 : null
  const postsUsed = profile?.posts_this_month || 0
  const postsPct = postsLimit ? Math.min((postsUsed / postsLimit) * 100, 100) : 0

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/[0.06] px-4">
        <LogoSidebar />
      </div>

      {/* User badge */}
      {profile && (
        <div className="border-b border-white/[0.06] p-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${planColor}44, ${planColor}22)`, border: `1px solid ${planColor}44` }}
            >
              {(profile.full_name || profile.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-medium text-white">
                {profile.full_name || 'Usuário'}
              </div>
              <div className="text-[10px] font-medium" style={{ color: planColor }}>
                Plano {profile.plan?.charAt(0).toUpperCase() + (profile.plan?.slice(1) || '')}
              </div>
            </div>
          </div>

          {postsLimit && (
            <div className="mt-2.5 space-y-1">
              <div className="flex justify-between text-[10px] text-[#444444]">
                <span>Posts este mês</span>
                <span>{postsUsed}/{postsLimit}</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${postsPct}%`,
                    backgroundColor:
                      postsPct > 90 ? '#ef4444' : postsPct > 75 ? '#f59e0b' : '#00E5A0',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <div key={item.href}>
            <NavItem
              item={item}
              active={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
            />
            {item.href === '/campanhas' && <MyCampaignsSublist pathname={pathname} />}
          </div>
        ))}
      </nav>

      {/* Separador + nav inferior */}
      <div className="border-t border-white/[0.06] p-2 space-y-0.5">
        {BOTTOM_ITEMS.map(item => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname.startsWith(item.href)}
          />
        ))}

        {isAdmin && (
          <NavItem
            item={{
              label: 'Admin',
              href: '/admin',
              icon: (active: boolean) => (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={active ? 'text-[#DEFF9A]' : 'text-[#555555]'}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
            }}
            active={pathname.startsWith('/admin')}
          />
        )}

        <LogoutButton />
      </div>
    </aside>
  )
}

function MyCampaignsSublist({ pathname }: { pathname: string }) {
  const { campaigns, loading } = useMyCampaigns()

  if (loading || campaigns.length === 0) return null

  return (
    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-3">
      <div className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-[#444444]">
        Minhas campanhas
      </div>
      {campaigns.map(campaign => {
        const href = `/campanhas/${campaign.id}`
        const active = pathname.startsWith(href)
        return (
          <Link
            key={campaign.id}
            href={href}
            className={cn(
              'block truncate rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors',
              active ? 'text-[#00E5A0]' : 'text-[#555555] hover:text-[#888888]'
            )}
          >
            {campaign.title}
          </Link>
        )
      })}
    </div>
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
