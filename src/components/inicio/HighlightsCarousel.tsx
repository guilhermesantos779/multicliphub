'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { formatViews } from '@/lib/utils'

interface TrendingCampaign {
  id: string
  title: string
  coverImageUrl: string | null
  modality: string
  endsAt: string | null
  agencyName: string
  agencyLogoUrl: string | null
  recentActivity: number
  totalViews: number
}

interface Winner {
  campaignId: string
  campaignTitle: string
  winnerUserId: string
  winnerName: string
  winnerUsername: string | null
  winnerAvatarUrl: string | null
  totalViews: number
}

type Slide =
  | { kind: 'trending'; data: TrendingCampaign }
  | { kind: 'winner'; data: Winner }

const AUTO_MS = 6000
const SWIPE_THRESHOLD = 60

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

function CarouselSkeleton() {
  return <div className="h-[260px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
}

export function HighlightsCarousel() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch('/api/inicio/highlights')
      const json = await res.json()
      if (cancelled) return
      const trendingSlides: Slide[] = (json.trending ?? []).map((data: TrendingCampaign) => ({ kind: 'trending', data }))
      const winnerSlides: Slide[] = (json.winners ?? []).map((data: Winner) => ({ kind: 'winner', data }))
      setSlides([...trendingSlides, ...winnerSlides])
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const paginate = useCallback((dir: number) => {
    setState(([i]) => [(i + dir + slides.length) % slides.length, dir])
  }, [slides.length])

  const goTo = useCallback((target: number) => {
    setState(([i]) => [target, target > i ? 1 : -1])
  }, [])

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const id = setInterval(() => paginate(1), AUTO_MS)
    return () => clearInterval(id)
  }, [paused, paginate, index, slides.length])

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    setPaused(false)
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
  }

  if (loading) return <CarouselSkeleton />

  if (slides.length === 0) {
    return (
      <div className="flex h-[220px] flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
        <div className="mb-2 text-3xl">🚀</div>
        <p className="text-[13px] font-bold text-white">Nenhum destaque por enquanto</p>
        <p className="mt-1 max-w-xs text-[12px] font-light text-[#888888]">
          Assim que campanhas ficarem ativas ou terminarem, elas aparecem aqui.
        </p>
      </div>
    )
  }

  const slide = slides[index % slides.length]!

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="relative h-[260px] overflow-hidden rounded-2xl border border-white/[0.06] bg-obsidiana sm:h-[220px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/3 left-1/2 h-[160%] w-[80%] -translate-x-1/2"
          style={{ background: 'radial-gradient(circle at center, rgba(0,229,160,0.16) 0%, transparent 60%)', filter: 'blur(40px)' }}
        />

        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragStart={() => setPaused(true)}
            onDragEnd={onDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            {slide.kind === 'trending' ? <TrendingSlide campaign={slide.data} /> : <WinnerSlide winner={slide.data} />}
          </motion.div>
        </AnimatePresence>

        {slides.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              aria-label="anterior"
              className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:border-mint/40 hover:text-white sm:grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="próximo"
              className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:border-mint/40 hover:text-white sm:grid"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`ir para o destaque ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-mint' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function TrendingSlide({ campaign }: { campaign: TrendingCampaign }) {
  return (
    <Link href={`/campanhas/${campaign.id}`} className="flex h-full items-center gap-5 px-6 sm:px-10">
      <div
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-mint/20 to-[#187D5B]/20 shadow-glow-mint sm:h-28 sm:w-28"
      >
        {campaign.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={campaign.coverImageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl opacity-50">🎬</div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/[0.1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mint">
          🔥 Em alta
        </span>
        <h3 className="mt-2 truncate text-[18px] font-extrabold leading-snug text-white sm:text-[20px]">
          {campaign.title}
        </h3>
        <p className="mt-0.5 truncate text-[12px] font-light text-[#999999]">{campaign.agencyName}</p>
        <p className="mt-1.5 text-[12px] font-light text-[#777777]">
          {formatViews(campaign.totalViews)} views acumuladas
        </p>
      </div>
    </Link>
  )
}

function WinnerSlide({ winner }: { winner: Winner }) {
  const content = (
    <div className="flex h-full items-center gap-5 px-6 sm:px-10">
      <div
        className="grid h-24 w-24 shrink-0 place-items-center rounded-full text-[28px] font-extrabold text-obsidiana shadow-glow-mint sm:h-28 sm:w-28"
        style={{ background: 'linear-gradient(135deg, #3CFFB8, #00B584)' }}
      >
        {winner.winnerAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={winner.winnerAvatarUrl} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          winner.winnerName.charAt(0).toUpperCase()
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/[0.1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-mint">
          🏆 Vencedor
        </span>
        <h3 className="mt-2 truncate text-[18px] font-extrabold leading-snug text-white sm:text-[20px]">
          {winner.winnerName}
        </h3>
        <p className="mt-0.5 truncate text-[12px] font-light text-[#999999]">{winner.campaignTitle}</p>
        <p className="mt-1.5 text-[12px] font-light text-[#777777]">
          {formatViews(winner.totalViews)} views · 1º lugar
        </p>
      </div>
    </div>
  )

  return winner.winnerUsername ? (
    <Link href={`/perfil/${winner.winnerUsername}`} className="block h-full">{content}</Link>
  ) : (
    <div className="h-full">{content}</div>
  )
}
