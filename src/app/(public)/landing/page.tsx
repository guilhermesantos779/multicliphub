import { Navbar }           from '@/components/landing/Navbar'
import { HeroWrapper }      from '@/components/landing/HeroWrapper'
import { Features }         from '@/components/landing/Features'
import { HowItWorks }       from '@/components/landing/HowItWorks'
import { RankingSection }   from '@/components/landing/RankingSection'
import { Pricing }          from '@/components/landing/Pricing'
import { FAQ }              from '@/components/landing/FAQ'
import { CTASection }       from '@/components/landing/CTASection'
import { Footer }           from '@/components/landing/Footer'
import { SectionDivider }   from '@/components/landing/raycast/SectionDivider'
import { TextReveal }       from '@/components/ui/text-reveal'
// Client wrapper with ssr:false so three.js loads after first paint (LCP protection)
import { WebGLShaderLazy }  from '@/components/ui/web-gl-shader-lazy'
import { StatsCounter }     from '@/components/landing/StatsCounter'
import { getPlatformStats } from '@/lib/stats/platform'

export const metadata = {
  title: 'MultiClip Hub — O escritório digital do clipador profissional',
  description:
    'Distribua seus clipes para TikTok, Reels e Shorts com um único upload. Ranking global. Analytics unificado.',
}

// Stats come from a cookieless public RPC, so the page can stay ISR (no
// per-request dynamic rendering, LCP unaffected). Refreshed at most once a minute.
export const revalidate = 60

export default async function LandingPage() {
  const stats = await getPlatformStats()

  return (
    <div className="relative min-h-screen text-white antialiased">
      {/* Background animado — carregado após o primeiro paint (three.js lazy) */}
      <WebGLShaderLazy speed={0.008} distortion={0.06} yScale={0.5} />

      {/* Todo o conteúdo flutua acima do shader */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroWrapper />

          {/* Social proof — only renders once real views exist (returns null otherwise) */}
          <StatsCounter
            totalViews={stats.total_views}
            totalClips={stats.total_clips}
            totalCreators={stats.total_creators}
            hasRealData={stats.has_real_data}
          />

          <SectionDivider />
          <Features />
          <SectionDivider eyebrow="manifesto" />

          {/* Seção manifesto — TextReveal word-by-word */}
          <section className="mx-auto max-w-4xl px-6">
            <TextReveal
              text="Um upload publica em TikTok, Reels e Shorts ao mesmo tempo. Você posta uma vez. O algoritmo trabalha por você."
              accentWords={['algoritmo']}
            />
          </section>

          <SectionDivider eyebrow="processo" />
          <HowItWorks />
          <SectionDivider />
          <RankingSection />
          <SectionDivider eyebrow="planos" glowColor="purple" />
          <Pricing />
          <SectionDivider />
          <FAQ />
          <CTASection />
          <Footer />
        </main>
      </div>
    </div>
  )
}
