'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useUser'
import { useMyCampaigns } from '@/hooks/useMyCampaigns'
import { useAgencyProfile } from '@/hooks/useAgencyProfile'
import { useMobileNav } from '@/components/dashboard/MobileNav'
import { LogoSidebar } from '@/components/shared/Logo'
import { SystemIcon, type SystemIconName } from '@/components/icons/SystemIcon'
import { UserMenu } from '@/components/app/UserMenu'
import type { AgencyProfile } from '@/types/campaigns.types'

const navIcon = (name: SystemIconName) => (active: boolean) =>
  <SystemIcon name={name} active={active} size={18} />

// `key` and `badge` map to the `menu` i18n namespace; labels are translated at render time.
type NavEntry = {
  key: string
  href: string
  icon: ReturnType<typeof navIcon>
  badge?: string
}

// Agencies (either kind) don't post content — they manage campaigns instead.
// So the shared nav swaps the whole creator-tooling block (upload, canais,
// analytics, ranking, campanhas, historico) for the agency's own items
// rather than just hiding "Conexão de Contas" in isolation.
function buildNavItems(agencyProfile: AgencyProfile | null): NavEntry[] {
  const items: NavEntry[] = [{ key: 'inicio', href: '/inicio', icon: navIcon('inicio') }]

  if (agencyProfile) {
    items.push({ key: 'visao_geral', href: '/agencia/dashboard', icon: navIcon('dashboard') })
    items.push({ key: 'campanhas_agencia', href: '/agencia/dashboard/campanhas', icon: navIcon('campanhas') })
    if (agencyProfile.kind === 'clipadores') {
      items.push({ key: 'time_agencia', href: '/agencia/dashboard/time', icon: navIcon('time') })
    }
    items.push({ key: 'campanhas_site', href: '/campanhas', icon: navIcon('campanhas') })
    return items
  }

  return [
    ...items,
    { key: 'dashboard', href: '/dashboard',  icon: navIcon('dashboard') },
    { key: 'upload',    href: '/upload',     icon: navIcon('upload')    },
    { key: 'canais',    href: '/canais',     icon: navIcon('canais')    },
    { key: 'analytics', href: '/analytics',  icon: navIcon('analytics') },
    { key: 'ranking',   href: '/ranking',    icon: navIcon('ranking')   },
    { key: 'campanhas', href: '/campanhas',  icon: navIcon('campanhas') },
    { key: 'historico', href: '/historico',  icon: navIcon('historico') },
  ]
}

// Nav roots that other items nest under — matched exactly, not by prefix,
// so e.g. "/agencia/dashboard" isn't marked active while on
// "/agencia/dashboard/campanhas" (which has its own nav entry).
const EXACT_MATCH_ONLY = new Set(['/dashboard', '/agencia/dashboard'])

// 'Perfil' moved into the user-card dropdown ("Ver perfil") to avoid duplication
const BOTTOM_ITEMS: NavEntry[] = [
  { key: 'suporte',       href: '/suporte',       icon: navIcon('suporte') },
  { key: 'configuracoes', href: '/configuracoes', icon: navIcon('config') },
]

// Maps a nav href to a tour anchor so ProductTour can spotlight it.
const TOUR_ANCHOR: Record<string, string> = {
  '/upload': 'upload',
  '/analytics': 'analytics',
  '/ranking': 'ranking',
  '/suporte': 'suporte',
}

function NavItem({ item, active, onNavigate }: { item: NavEntry; active: boolean; onNavigate?: () => void }) {
  const t = useTranslations('menu')
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      data-tour={TOUR_ANCHOR[item.href]}
      className={cn(
        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-200 hover:translate-x-0.5',
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
      <span className="relative">{t(item.key)}</span>
      {item.badge && (
        <span className="relative ml-auto rounded-full border border-[#00E5A0]/20 bg-[#00E5A0]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-wide text-[#00E5A0]">
          {t(item.badge)}
        </span>
      )}
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
  const t = useTranslations('menu')
  const pathname = usePathname()
  const { profile, isAdmin } = useUser()
  const { agencyProfile } = useAgencyProfile()
  const { open, setOpen } = useMobileNav()
  const navItems = buildNavItems(agencyProfile)
  const postsLimit = profile?.plan === 'clipper' ? 200 : profile?.plan === 'trial' ? 10 : null
  const postsUsed = profile?.posts_this_month || 0
  const postsPct = postsLimit ? Math.min((postsUsed / postsLimit) * 100, 100) : 0

  // Close the mobile drawer whenever the route changes (covers swipe-nav and
  // links that point at the current section).
  useEffect(() => { setOpen(false) }, [pathname, setOpen])

  const closeOnMobile = () => setOpen(false)

  return (
    <>
      {/* Backdrop — mobile only, behind the drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnMobile}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-screen w-56 flex-col border-r border-white/[0.06] bg-obsidiana/80 backdrop-blur-xl',
          'transition-transform duration-300 ease-out md:z-40 md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
      {/* Top shine line */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Ambient glow — top, purple */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-purple/[0.06] to-transparent" />

      {/* Logo + mobile close */}
      <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
        <LogoSidebar />
        <button
          onClick={closeOnMobile}
          aria-label="fechar menu"
          className="grid h-8 w-8 place-items-center rounded-lg text-[#666666] transition-colors hover:text-white md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* User card — real avatar + compact plan frame + dropdown */}
      <div data-tour="profile" className="border-b border-white/[0.06] p-3">
        <UserMenu profile={profile} layout="sidebar" avatarSize={40} />

        {profile && postsLimit && (
          <div className="mt-2.5 space-y-1">
            <div className="flex justify-between text-[10px] text-[#444444]">
              <span>{t('posts_this_month')}</span>
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
        {navItems.map(item => (
          <div key={item.href}>
            <NavItem
              item={item}
              onNavigate={closeOnMobile}
              active={pathname === item.href || (!EXACT_MATCH_ONLY.has(item.href) && pathname.startsWith(item.href))}
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
            onNavigate={closeOnMobile}
            active={pathname.startsWith(item.href)}
          />
        ))}

        {isAdmin && (
          <NavItem
            item={{
              key: 'admin',
              href: '/admin',
              icon: navIcon('admin'),
            }}
            onNavigate={closeOnMobile}
            active={pathname.startsWith('/admin')}
          />
        )}

        <LogoutButton />
      </div>
      </aside>
    </>
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
  const t = useTranslations('menu')
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
      {t('logout')}
    </button>
  )
}
