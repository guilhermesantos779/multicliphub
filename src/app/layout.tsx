import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'MultiClip Hub — O escritório digital do clipador profissional',
  description: 'Distribua seus clipes para TikTok, Reels e Shorts com um único upload.',
  icons: {
    icon: '/favicon-32.png',
    apple: '/logo-icon.png',
  },
  openGraph: {
    title: 'MultiClip Hub — O escritório digital do clipador profissional',
    description: 'Distribua seus clipes para TikTok, Reels e Shorts com um único upload.',
    siteName: 'MultiClip Hub',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/brand/logo-dark.png', width: 1200, height: 630, alt: 'MultiClip Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MultiClip Hub — O escritório digital do clipador profissional',
    description: 'Distribua seus clipes para TikTok, Reels e Shorts com um único upload.',
    images: ['/brand/logo-dark.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
