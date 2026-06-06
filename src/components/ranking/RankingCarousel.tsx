'use client'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { Upload, Trophy, Layers, Medal, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Slide {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  title: string
  desc: string
  accent: string // active glow color
}

const SLIDES: Slide[] = [
  {
    icon: Upload,
    title: 'Publique seus clipes',
    desc: 'Cada clipe publicado pelo MultiClip Hub conta pontos no ranking do mês. Quanto mais você posta, mais sobe.',
    accent: '#9146FF',
  },
  {
    icon: Trophy,
    title: 'Dois rankings, duas formas de vencer',
    desc: 'Kings of Reach premia quem tem mais views. Machine Gun premia quem posta com mais consistência. Escolha seu jogo.',
    accent: '#DEFF9A',
  },
  {
    icon: Layers,
    title: 'Ranking por plataforma',
    desc: 'Rankings separados de TikTok, Instagram e YouTube. Forte numa só? Você ainda brilha onde manda bem.',
    accent: '#00E5A0',
  },
  {
    icon: Medal,
    title: 'Conquistas e cargos',
    desc: 'Suba no ranking e desbloqueie conquistas e cargos exclusivos na comunidade do Discord.',
    accent: '#9146FF',
  },
  {
    icon: Gift,
    title: 'Premiação real',
    desc: 'Top 3 de cada ranking ganham 3 meses grátis e destaque na comunidade. Todo mês o ranking zera — sempre dá pra vencer.',
    accent: '#00E5A0',
  },
]

const AUTO_MS = 5000
const SWIPE_THRESHOLD = 60

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export function RankingCarousel() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  const [paused, setPaused] = useState(false)

  const paginate = useCallback((dir: number) => {
    setState(([i]) => [(i + dir + SLIDES.length) % SLIDES.length, dir])
  }, [])

  const goTo = useCallback((target: number) => {
    setState(([i]) => [target, target > i ? 1 : -1])
  }, [])

  // Auto-advance, paused on hover / drag / focus.
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => paginate(1), AUTO_MS)
    return () => clearInterval(id)
  }, [paused, paginate, index])

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    setPaused(false)
    if (info.offset.x < -SWIPE_THRESHOLD) paginate(1)
    else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1)
  }

  const slide = SLIDES[index]
  const Icon = slide.icon

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stage */}
      <div className="relative h-[300px] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md sm:h-[240px]">
        {/* Active accent glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-1/3 left-1/2 h-[160%] w-[80%] -translate-x-1/2 transition-colors duration-500"
          style={{ background: `radial-gradient(circle at center, ${slide.accent}1f 0%, transparent 60%)`, filter: 'blur(40px)' }}
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
            className="absolute inset-0 flex cursor-grab flex-col items-center justify-center gap-4 px-8 text-center active:cursor-grabbing sm:px-16"
          >
            {/* Animated icon — floats + glows on the active slide */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-16 w-16 place-items-center rounded-2xl border"
              style={{
                borderColor: `${slide.accent}40`,
                background: `linear-gradient(135deg, ${slide.accent}22, transparent)`,
                color: slide.accent,
                boxShadow: `0 0 24px ${slide.accent}33`,
              }}
            >
              <Icon size={28} strokeWidth={1.75} />
            </motion.div>

            <div className="pointer-events-none">
              <h3 className="text-[17px] font-semibold text-white sm:text-[18px]">{slide.title}</h3>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-[#999999]">{slide.desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Arrows — desktop */}
        <button
          onClick={() => paginate(-1)}
          aria-label="anterior"
          className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:text-white sm:grid"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          onClick={() => paginate(1)}
          aria-label="próximo"
          className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/[0.08] bg-black/40 text-white/60 backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:text-white sm:grid"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`ir para o slide ${i + 1}`}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              i === index ? 'w-6 bg-[#00E5A0]' : 'w-2 bg-white/20 hover:bg-white/40'
            )}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-[11px] text-[#555555] sm:hidden">Arraste para o lado para navegar</p>
    </div>
  )
}
