
'use client'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/shared/FadeIn'

interface Feature {
  id:          string
  icon:        ReactNode
  title:       string
  description: string
  badge?:      string
  wide?:       boolean
  extra?:      ReactNode
}

function IconWrap({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-mint/30 bg-mint/10 transition-all duration-200 group-hover:scale-110 group-hover:bg-mint/20">
      {children}
    </div>
  )
}

const STEPS_FLOW = ['① Upload', '→', '② Configurar', '→', '③ Publicar']

const FEATURES: Feature[] = [
  {
    id: 'upload',
    wide: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    title: 'Magic Upload',
    description:
      'Um clipe. Uma legenda. Publicado em TikTok, Reels e Shorts ao mesmo tempo. Sem abrir outros apps, sem copiar e colar.',
    badge: 'Economiza 40 min/dia',
    extra: (
      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
        {STEPS_FLOW.map((s, i) => (
          <span
            key={i}
            className={
              s === '→'
                ? 'text-mint'
                : 'rounded-md border border-white/[0.06] bg-[#1a1a1a] px-2 py-1 text-[#888888]'
            }
          >
            {s}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'ai',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
        <circle cx="19" cy="5" r="3" />
      </svg>
    ),
    title: 'IA que fala o idioma de cada algoritmo',
    description:
      'Adapta legenda e hashtags automaticamente para maximizar o alcance em cada plataforma.',
  },
  {
    id: 'analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Analytics Unificado',
    description:
      'Views do TikTok + Reels + Shorts em um único dashboard. Veja seu crescimento real.',
    extra: (
      <div className="mt-4 flex h-12 items-end gap-1">
        {[25, 40, 30, 55, 45, 70, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-mint/40 transition-colors hover:bg-mint/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: 'timing',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Best Time to Post',
    description:
      'Saiba exatamente quando postar com base no seu histórico. Sugestões personalizadas por plataforma.',
  },
  {
    id: 'ranking',
    wide: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 20 18 10" />
        <polyline points="12 20 12 4" />
        <polyline points="6 20 6 14" />
      </svg>
    ),
    title: 'Ranking Global Gamificado',
    description:
      'Dois rankings mensais: Kings of Reach (views) e Machine Gun (consistência). Top 3 ganham 3 meses grátis e cargos exclusivos no Discord.',
    badge: 'Kings of Reach · Machine Gun',
    extra: (
      <div className="mt-4 flex flex-col gap-1.5">
        {[
          { pos: '1', av: 'CL', name: 'ClipLord', val: '14.7M', you: false },
          { pos: '2', av: 'KR', name: 'KingRafa', val: '8.2M',  you: false },
          { pos: '·', av: 'VC', name: 'Você',     val: '2.1M',  you: true  },
        ].map((r) => (
          <div
            key={r.name}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
              r.you
                ? 'border border-mint/30 bg-mint/10'
                : 'border border-white/[0.04] bg-[#111111]'
            }`}
          >
            <span className="w-3 text-[11px] font-bold text-[#444444]">{r.pos}</span>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold ${
                r.you ? 'bg-mint text-[#0B0F19]' : 'bg-[#1a1a1a] text-[#888888]'
              }`}
            >
              {r.av}
            </div>
            <span
              className={`flex-1 text-[12px] ${
                r.you ? 'font-semibold text-[#FAFAFA]' : 'text-[#888888]'
              }`}
            >
              {r.name}
            </span>
            <span className="text-[11px] text-[#888888]">{r.val}</span>
          </div>
        ))}
      </div>
    ),
  },
]

export function BentoGrid() {
  return (
    <section id="funcionalidades" className="bg-black py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <FadeIn className="mb-16 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-mint">
            Funcionalidades
          </span>
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-[#FAFAFA] sm:text-[52px]">
            Tudo que você precisa para
            <br />
            <span className="text-[#888888]">dominar o algoritmo</span>
          </h2>
        </FadeIn>

        <div className="grid grid-cols-12 gap-4">
          {FEATURES.map((feature, i) => (
            <FadeIn
              key={feature.id}
              delay={i * 0.08}
              className={feature.wide ? 'col-span-12 md:col-span-7' : 'col-span-12 md:col-span-5'}
            >
              <motion.div
                className="group h-full rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 transition-colors duration-300 hover:border-white/[0.12]"
                whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
              >
                <IconWrap>{feature.icon}</IconWrap>
                <h3 className="mb-2 text-[17px] font-semibold text-[#FAFAFA]">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-[1.7] text-[#888888]">
                  {feature.description}
                </p>
                {feature.badge && (
                  <div className="mt-3 inline-flex items-center rounded-full border border-[#DEFF9A]/20 bg-[#DEFF9A]/5 px-2.5 py-1">
                    <span className="text-[10px] font-medium text-[#DEFF9A]">{feature.badge}</span>
                  </div>
                )}
                {feature.extra}
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
