'use client'

import { useEffect, useLayoutEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnboarding } from '@/hooks/useOnboarding'

interface TourStep {
  anchor: string // data-tour value
  title: string
  body: string
}

const STEPS: TourStep[] = [
  {
    anchor: 'upload',
    title: '📤 Seu trabalho começa aqui',
    body: 'Um único upload publica no TikTok, Instagram e YouTube ao mesmo tempo. É a função principal do MultiClip Hub.',
  },
  {
    anchor: 'analytics',
    title: '📊 Tudo em um só lugar',
    body: 'Veja as views de todas as plataformas num único dashboard. Sem precisar abrir três apps.',
  },
  {
    anchor: 'ranking',
    title: '👑 Compete e vence',
    body: 'Rankings mensais com premiação real. Top 3 ganham 3 meses grátis. Quanto mais você posta, mais sobe.',
  },
  {
    anchor: 'profile',
    title: '🎮 Seu perfil de clipador',
    body: 'Seu perfil público mostra conquistas, ranking e suas redes. Outros clipadores podem te visitar.',
  },
  {
    anchor: 'suporte',
    title: '💬 Precisa de ajuda?',
    body: 'Abra um chamado aqui ou entre no Discord para atendimento prioritário. A comunidade está te esperando.',
  },
]

const PAD = 8 // padding around the spotlit element
const CARD_W = 280

interface Rect { x: number; y: number; width: number; height: number }

export function ProductTour() {
  const { finishTour } = useOnboarding()
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)
  const [vp, setVp] = useState({ w: 0, h: 0 })

  const measure = () => {
    if (typeof window === 'undefined') return
    setVp({ w: window.innerWidth, h: window.innerHeight })
    const el = document.querySelector(`[data-tour="${STEPS[step]!.anchor}"]`)
    if (el) {
      const r = el.getBoundingClientRect()
      setRect({ x: r.left - PAD, y: r.top - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 })
    } else {
      setRect(null)
    }
  }

  useLayoutEffect(measure, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const isLast = step === STEPS.length - 1
  const next = () => (isLast ? finishTour() : setStep((s) => s + 1))

  // Tooltip placement: prefer to the right of the element (sidebar is on the
  // left); fall back to left, then below.
  const placeRight = rect ? rect.x + rect.width + 16 + CARD_W < vp.w : true
  const cardLeft = rect
    ? placeRight
      ? rect.x + rect.width + 16
      : Math.max(16, rect.x - CARD_W - 16)
    : vp.w / 2 - CARD_W / 2
  const cardTop = rect ? Math.min(Math.max(16, rect.y), vp.h - 220) : vp.h / 2 - 110

  return (
    <div className="fixed inset-0 z-[90]">
      {/* Dimmed overlay with a hole cut out via SVG mask */}
      <svg width={vp.w} height={vp.h} className="pointer-events-none absolute inset-0">
        <defs>
          <mask id="tour-spotlight">
            <rect x={0} y={0} width={vp.w} height={vp.h} fill="white" />
            {rect && (
              <motion.rect
                initial={false}
                animate={{ x: rect.x, y: rect.y, width: rect.width, height: rect.height }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                rx={12}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x={0} y={0} width={vp.w} height={vp.h} fill="rgba(0,0,0,0.78)" mask="url(#tour-spotlight)" />
      </svg>

      {/* Click-catcher (blocks app interaction during the tour) */}
      <div className="absolute inset-0" />

      {/* Purple glow ring around the hole */}
      {rect && (
        <motion.div
          initial={false}
          animate={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="pointer-events-none absolute rounded-xl"
          style={{ boxShadow: '0 0 0 1.5px rgba(145,70,255,0.7), 0 0 24px 2px rgba(145,70,255,0.35)' }}
        />
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="absolute w-[280px] rounded-2xl border border-[#9146FF]/30 bg-[#0a0a0a] p-4 shadow-2xl"
          style={{ left: cardLeft, top: cardTop }}
        >
          <p className="font-display text-[15px] font-semibold text-white">{STEPS[step]!.title}</p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{STEPS[step]!.body}</p>

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={finishTour}
              className="text-[11px] text-white/40 transition-colors hover:text-white/60"
            >
              Pular tour
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-white/40">
                {step + 1} de {STEPS.length}
              </span>
              <button
                onClick={next}
                className="rounded-lg bg-[#9146FF] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#7c3aed]"
              >
                {isLast ? 'Finalizar tour ✓' : 'Próximo →'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
