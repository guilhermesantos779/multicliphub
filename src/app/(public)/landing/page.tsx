import { Navbar }     from '@/components/landing/Navbar'
import { Hero }       from '@/components/landing/Hero'
import { BentoGrid }  from '@/components/landing/BentoGrid'
import { Pricing }    from '@/components/landing/Pricing'
import { FAQ }        from '@/components/landing/FAQ'
import { CTASection } from '@/components/landing/CTASection'
import { Footer }     from '@/components/landing/Footer'

export const metadata = {
  title: 'MultiClip Hub — O escritório digital do clipador profissional',
  description:
    'Distribua seus clipes para TikTok, Reels e Shorts com um único upload. Ranking global. Analytics unificado.',
}

export default function LandingPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Pricing />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
