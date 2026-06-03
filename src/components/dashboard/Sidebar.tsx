'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { LogoSidebar } from '@/components/shared/Logo'
import { SystemIcon, type SystemIconName } from '@/components/icons/SystemIcon'
import { UserMenu } from '@/components/app/UserMenu'

const navIcon = (name: SystemIconName) => (active: boolean) =>
  <SystemIcon name={name} active={active} size={18} />

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard',  icon: navIcon('dashboard') },
  { label: 'Upload',    href: '/upload',     icon: navIcon('upload')    },
  { label: 'Canais',    href: '/canais',     icon: navIcon('canais')    },
  { label: 'Analytics', href: '/analytics',  icon: navIcon('analytics') },
  { label: 'Ranking',   href: '/ranking',    icon: navIcon('ranking')   },
  { label: 'Histórico', href: '/historico',  icon: navIcon('historico') },
]

// 'Perfil' moved into the user-card dropdown ("Ver perfil") to avoid duplication
const BOTTOM_ITEMS = [
  { label: 'Suporte',       href: '/suporte',       icon: navIcon('suporte') },
  { label: 'Configurações', href: '/configuracoes', icon: navIcon('config') },
]

// Maps a nav href to a tour anchor so ProductTour can spotlight it.
const TOUR_ANCHOR: Record<string, string> = {
  '/upload': 'upload',
  '/analytics': 'analytics',
  '/ranking': 'ranking',
  '/suporte': 'suporte',
}

function NavItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      data-tour={TOUR_ANCHOR[item.href]}
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
  const postsLimit = profile?.plan === 'clipper' ? 200 : profile?.plan === 'trial' ? 10 : null
  const postsUsed = profile?.posts_this_month || 0
  const postsPct = postsLimit ? Math.min((postsUsed / postsLimit) * 100, 100) : 0

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-white/[0.06] px-4">
        <LogoSidebar />
      </div>

      {/* User card — real avatar + compact plan frame + dropdown */}
      <div data-tour="profile" className="border-b border-white/[0.06] p-3">
        <UserMenu profile={profile} layout="sidebar" avatarSize={40} />

        {profile && postsLimit && (
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

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.href}
            item={item}
            active={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
          />
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
              icon: navIcon('admin'),
            }}
            active={pathname.startsWith('/admin')}
          />
        )}

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
