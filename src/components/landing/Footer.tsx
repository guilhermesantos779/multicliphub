import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/shared/Logo'

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
      {children}
    </p>
  )
}

function ColLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="flex flex-col">
      {links.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            className="block py-1.5 text-[13px] text-white/60 transition-colors hover:text-white"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  const t = useTranslations()
  const PRODUTO = [
    { label: t('nav.features'),     href: '#funcionalidades' },
    { label: t('nav.howItWorks'),   href: '#como-funciona'   },
    { label: t('nav.pricing'),      href: '#precos'          },
    { label: t('nav.ranking'),      href: '#ranking'         },
    { label: t('footer.changelog'), href: '#'                },
  ]
  const EMPRESA = [
    { label: t('footer.about'),   href: '#' },
    { label: t('footer.discord'), href: '#' },
    { label: t('footer.blog'),    href: '#' },
    { label: t('footer.contact'), href: 'mailto:multicliphubempresa@multicliphub.com.br' },
  ]
  const LEGAL = [
    { label: t('footer.terms'),   href: '/terms'   },
    { label: t('footer.privacy'), href: '/privacy' },
    { label: t('footer.cookies'), href: '#'        },
    { label: t('footer.lgpd'),    href: '#'        },
  ]
  return (
    <footer className="border-t border-white/[0.04] py-16 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Logo height={28} variant="mint" className="mb-4" />
            <p className="text-[13px] text-white/40 leading-relaxed max-w-[220px]">
              Distribuição inteligente para clipadores profissionais.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex items-center gap-3">
              {/* Discord */}
              <Link href="#" aria-label="discord" className="text-white/40 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
                </svg>
              </Link>
              {/* Twitter/X */}
              <Link href="#" aria-label="twitter" className="text-white/40 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link href="#" aria-label="instagram" className="text-white/40 hover:text-white transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              {/* YouTube */}
              <Link href="#" aria-label="youtube" className="text-white/40 hover:text-white transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Produto */}
          <div>
            <ColTitle>{t('footer.col_product')}</ColTitle>
            <ColLinks links={PRODUTO} />
          </div>

          {/* Empresa */}
          <div>
            <ColTitle>{t('footer.col_company')}</ColTitle>
            <ColLinks links={EMPRESA} />
          </div>

          {/* Legal */}
          <div>
            <ColTitle>{t('footer.col_legal')}</ColTitle>
            <ColLinks links={LEGAL} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/[0.04] pt-8">
          <p className="text-[12px] text-white/35">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-[12px] text-white/35">{t('footer.made_in')}</p>
        </div>
      </div>
    </footer>
  )
}
