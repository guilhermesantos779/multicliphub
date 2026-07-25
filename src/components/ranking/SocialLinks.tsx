'use client'
import { DISCORD_INVITE_URL } from '@/lib/support'

// MultiClip Hub's own community channels, surfaced on the ranking page so
// climbers can follow the brand and join the Discord where roles/achievements
// live. Instagram handle is a placeholder until the real one is confirmed.
const INSTAGRAM_URL = 'https://instagram.com/multicliphub'

interface SocialItem {
  label: string
  href: string
  hoverBorder: string
  hoverGlow: string
  hoverText: string
  icon: React.ReactNode
}

const SOCIALS: SocialItem[] = [
  {
    label: 'Instagram',
    href: INSTAGRAM_URL,
    // Mint hover per brand spec (avoid baking the IG gradient into a flat mark)
    hoverBorder: 'hover:border-[#00E5A0]/50',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,229,160,0.25)]',
    hoverText: 'group-hover/social:text-[#00E5A0]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: DISCORD_INVITE_URL,
    hoverBorder: 'hover:border-[#5865F2]/60',
    hoverGlow: 'hover:shadow-[0_0_20px_rgba(88,101,242,0.3)]',
    hoverText: 'group-hover/social:text-[#5865F2]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.2 14.2 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
]

export function SocialLinks() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-5">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-[14px] font-semibold text-white">Faça parte da comunidade</h3>
          <p className="mt-0.5 text-[12px] text-[#888888]">
            Siga o MultiClip Hub e dispute os cargos no Discord
          </p>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`group/social grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-[#888888] transition-all duration-200 ${s.hoverBorder} ${s.hoverGlow}`}
            >
              <span className={`transition-colors duration-200 ${s.hoverText}`}>{s.icon}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
