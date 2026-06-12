import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getTranslations } from 'next-intl/server'
import './globals.css'
import { IconDefs } from '@/components/icons/IconDefs'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations('meta')
  const title = t('title')
  const description = t('description')
  return {
    title,
    description,
    icons: {
      icon: '/favicon-32.png',
      apple: '/logo-icon.png',
    },
    openGraph: {
      title,
      description,
      siteName: 'MultiClip Hub',
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      type: 'website',
      images: [{ url: '/brand/logo-dark.png', width: 1200, height: 630, alt: 'MultiClip Hub' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/brand/logo-dark.png'],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale} className={`${GeistSans.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        <NextIntlClientProvider>
          <IconDefs />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
