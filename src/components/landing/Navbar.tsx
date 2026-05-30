'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

const NAV_LINKS = [
  { label: 'Funcionalidades', href: '#funcionalidades' },
  { label: 'Como funciona',   href: '#como-funciona'   },
  { label: 'Ranking',         href: '#ranking'         },
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
    <div className="fixed inset-x-4 top-4 z-50 flex justify-center">
      {/* Ambient glow bleeding behind navbar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-4 h-40 overflow-visible"
      >
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 900,
            height: 220,
            background:
              'radial-gradient(ellipse, rgba(145,70,255,0.18) 0%, rgba(0,229,160,0.06) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      <nav
        className={[
          'w-full max-w-6xl',
          'flex items-center justify-between',
          'rounded-2xl border border-white/[0.08]',
          'px-5 py-3',
          'transition-all duration-300',
          scrolled
            ? 'bg-black/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-black/40 backdrop-blur-lg',
        ].join(' ')}
      >
        {/* Logo */}
        <Link href="/landing" className="flex items-center gap-2 shrink-0">
          <Logo height={28} variant="mint" />
        </Link>

        {/* Center nav — desktop */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[13px] text-white/60 hover:text-white transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden md:inline text-[13px] text-white/60 hover:text-white transition-colors px-3 py-2"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-[#9146FF] px-4 py-2 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#7c3aed]"
          >
            Começar grátis
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'fechar menu' : 'abrir menu'}
            aria-expanded={menuOpen}
            className="flex md:hidden h-8 w-8 flex-col items-center justify-center gap-1.5 ml-1"
          >
            <span
              className="block h-px w-5 bg-white/60 transition-transform duration-200"
              style={{ transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block h-px w-5 bg-white/60 transition-opacity duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block h-px w-5 bg-white/60 transition-transform duration-200"
              style={{ transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-white/[0.08] bg-black/90 px-5 py-4 backdrop-blur-xl md:hidden">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-[14px] text-white/60 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            <Link
              href="/login"
              className="py-2 text-center text-[14px] text-white/60 hover:text-white"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#9146FF] py-2.5 text-center text-[14px] font-medium text-white hover:bg-[#7c3aed]"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
