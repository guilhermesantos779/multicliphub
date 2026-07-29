import { Topbar } from '@/components/dashboard/Topbar'
import { SpotGlow } from '@/components/ui/brand'
import { NewsFeed } from '@/components/inicio/NewsFeed'
import { HighlightsCarousel } from '@/components/inicio/HighlightsCarousel'
import { HomeRankingPreview } from '@/components/inicio/HomeRankingPreview'

export default function InicioPage() {
  return (
    <div>
      <Topbar title="Início" />

      <div className="relative space-y-8 p-4 md:p-6">
        <SpotGlow color="mint" size="lg" position="top-right" />

        <section>
          <h2 className="mb-3 text-[15px] font-extrabold text-white">Novidades do site</h2>
          <NewsFeed />
        </section>

        <section>
          <h2 className="mb-3 text-[15px] font-extrabold text-white">Campanhas em alta &amp; vencedores recentes</h2>
          <HighlightsCarousel />
        </section>

        <section>
          <h2 className="mb-3 text-[15px] font-extrabold text-white">Ranking geral</h2>
          <HomeRankingPreview />
        </section>
      </div>
    </div>
  )
}
