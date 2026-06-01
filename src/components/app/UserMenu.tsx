'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { ProfileFrame } from '@/components/profile/ProfileFrame'
import { createClient } from '@/lib/supabase/client'
import { normalizePlan, PLAN_META, type ProfilePlan } from '@/lib/profile'

export interface UserMenuProfile {
  username: string | null
  full_name: string | null
  avatar_url: string | null
  plan: string | null
}

interface UserMenuProps {
  profile: UserMenuProfile | null
  layout: 'header' | 'sidebar'
  avatarSize?: number
}

const PLAN_LABEL: Record<ProfilePlan, { text: string; color: string }> = {
  king:    { text: 'Plano King',    color: '#00E5A0' },
  pro:     { text: 'Plano Pro',     color: '#9146FF' },
  clipper: { text: 'Plano Clipper', color: 'rgba(255,255,255,0.6)' },
  trial:   { text: 'Gratuito',      color: 'rgba(255,255,255,0.4)' },
}

export function UserMenu({ profile, layout, avatarSize = 36 }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click + Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Loading skeleton (no layout shift)
  if (!profile) {
    return (
      <div
        className="animate-pulse rounded-full bg-white/[0.06]"
        style={{ width: avatarSize, height: avatarSize }}
        aria-hidden
      />
    )
  }

  const tier = normalizePlan(profile.plan)
  const planLabel = PLAN_LABEL[tier]
  const initial = (profile.full_name || profile.username || 'U').charAt(0).toUpperCase()

  const Avatar = (
    <ProfileFrame plan={profile.plan} size={avatarSize} variant="compact">
      <div className="relative h-full w-full">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.full_name || 'Avatar'}
            fill
            sizes={`${avatarSize}px`}
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-semibold text-white"
            style={{
              fontSize: avatarSize * 0.42,
              background: `linear-gradient(135deg, ${PLAN_META[tier].color}55, ${PLAN_META[tier].color}22)`,
            }}
          >
            {initial}
          </div>
        )}
      </div>
    </ProfileFrame>
  )

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const dropdownPos =
    layout === 'sidebar'
      ? 'bottom-full mb-2 left-0' // open upward
      : 'top-full mt-2 right-0'   // open downward, right-aligned

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          layout === 'sidebar'
            ? 'flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-white/[0.04]'
            : 'flex items-center rounded-full transition-opacity hover:opacity-90'
        }
      >
        {Avatar}
        {layout === 'sidebar' && (
          <>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-white">
                {profile.full_name || 'Usuário'}
              </div>
              <div className="text-[11px] font-medium" style={{ color: planLabel.color }}>
                {planLabel.text}
              </div>
            </div>
            <ChevronDown size={15} className="shrink-0 text-white/40" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className={`absolute z-50 ${dropdownPos} w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-black/90 shadow-2xl backdrop-blur-xl`}
        >
          <MenuLink
            href={profile.username ? `/perfil/${profile.username}` : '/perfil'}
            icon={<User size={15} />}
            label="Ver perfil"
            onClick={() => setOpen(false)}
          />
          <MenuLink
            href="/configuracoes"
            icon={<Settings size={15} />}
            label="Configurações"
            onClick={() => setOpen(false)}
          />
          <div className="my-1 h-px bg-white/[0.06]" />
          <button
            role="menuitem"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-[#ef4444] transition-colors hover:bg-white/[0.04]"
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  href, icon, label, onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-white/80 transition-colors hover:bg-white/[0.04] hover:text-white"
    >
      <span className="text-white/50">{icon}</span>
      {label}
    </Link>
  )
}
