'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/Logo'

const NAV_LINKS = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Ranking',         href: '#ranking'         },
  { label: 'Como Funciona',   href: '#como-funciona'   },
  { label: 'Preços',          href: '#precos'          },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-white/[0.06] bg-black/80 backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/">
          <Logo height={32} variant="mint" />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="group relative py-1 text-[13px] text-[#888888] transition-colors duration-200 hover:text-[#FAFAFA]"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#00E5A0] transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="px-3 py-1.5 text-[13px] text-[#888888] transition-colors hover:text-[#FAFAFA]"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#00E5A0] px-4 py-1.5 text-[13px] font-medium text-[#0B0F19] transition-all hover:bg-[#00B584] hover:shadow-[0_0_20px_rgba(0,229,160,0.3)]"
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              'block h-px w-5 bg-[#888888] transition-transform duration-200',
              menuOpen && 'translate-y-[5px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-5 bg-[#888888] transition-opacity duration-200',
              menuOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'block h-px w-5 bg-[#888888] transition-transform duration-200',
              menuOpen && '-translate-y-[5px] -rotate-45',
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/[0.06] bg-black/95 px-4 pb-4 pt-2 backdrop-blur-md md:hidden">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-[14px] text-[#888888] transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" className="py-2 text-center text-[14px] text-[#888888]">
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#00E5A0] py-2 text-center text-[14px] font-medium text-[#0B0F19] transition-all hover:bg-[#00B584]"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
