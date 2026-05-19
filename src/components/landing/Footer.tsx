import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

const LINKS = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Preços',          href: '#precos'          },
  { label: 'Ranking',         href: '#ranking'         },
  { label: 'Discord',         href: '#'                },
  { label: 'Termos',          href: '/terms'           },
  { label: 'Privacidade',     href: '/privacy'         },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo height={28} variant="mint" />
            <span className="text-[13px] text-[#444444]">· O escritório digital do clipador profissional</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-[12px] text-[#444444] transition-colors hover:text-[#888888]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-[12px] text-[#444444]">© 2025 MultiClip Hub</p>
        </div>
      </div>
    </footer>
  )
}
