'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FadeIn } from '@/components/shared/FadeIn'
import { PlatformIcon } from '@/components/shared/PlatformIcon'

const AVATARS = ['FB', 'LC', 'AP', 'KR', 'MG']

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-16">
      {/* Fundo: glow + grid de pontos */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(0,229,160,0.05)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
        {/* Badge */}
        <FadeIn delay={0} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DEFF9A]" />
            <span className="text-[12px] text-[#888888]">
              Ranking Global lançado – top 3 ganha 3 meses grátis
            </span>
          </div>
        </FadeIn>

        {/* Título */}
        <FadeIn delay={0.1} className="mb-6">
          <h1 className="text-[52px] font-bold leading-[1.05] tracking-[-0.04em] sm:text-[64px] md:text-[80px]">
            <span className="text-[#FAFAFA]">Domine o algoritmo.</span>
            <br />
            <span className="text-[#00E5A0]">Poste uma vez.</span>
            <br />
            <span className="bg-gradient-to-r from-white to-[#DEFF9A] bg-clip-text text-transparent">
              Conquiste tudo.
            </span>
          </h1>
        </FadeIn>

        {/* Subtítulo */}
        <FadeIn delay={0.2} className="mb-10">
          <p className="mx-auto max-w-2xl text-[17px] leading-[1.7] text-[#888888] sm:text-[19px]">
            O MultiClip Hub distribui seus clipes simultaneamente para TikTok, Reels e Shorts.{' '}
            <span className="text-[#FAFAFA]">Um upload. Três plataformas. Zero tempo perdido.</span>
          </p>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.3} className="mb-12">
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#00E5A0] px-6 py-3 text-[14px] font-semibold text-[#0B0F19] transition-all hover:bg-[#00B584] hover:shadow-[0_0_24px_rgba(0,229,160,0.3)]"
            >
              Começar grátis agora
              <span>→</span>
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-6 py-3 text-[14px] text-[#888888] transition-colors hover:bg-white/[0.08] hover:text-white">
              <span className="text-xs">▶</span>
              Ver demonstração
            </button>
          </div>
        </FadeIn>

        {/* Prova social */}
        <FadeIn delay={0.4} className="mb-16 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="flex">
              {AVATARS.map((initials, i) => (
                <div
                  key={initials}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-[#1a1a1a] text-[9px] font-bold text-[#888888]"
                  style={{ marginLeft: i > 0 ? '-8px' : '0' }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-[11px] text-[#DEFF9A]">★★★★★ 4.9/5</div>
              <div className="text-[11px] text-[#888888]">+2.300 clipadores já usam</div>
            </div>
          </div>
        </FadeIn>

        {/* Mockup do produto */}
        <FadeIn delay={0.5} className="flex justify-center">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-5 text-left shadow-2xl">
            {/* Arquivo */}
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111111] p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#00E5A0]/10 text-lg">
                🎬
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#FAFAFA]">
                  clip_golação_final.mp4
                </p>
                <p className="text-[11px] text-[#444444]">147 MB · 00:58 · 1080×1920</p>
              </div>
              <span className="rounded-full bg-[#DEFF9A]/10 px-2 py-0.5 text-[10px] font-medium text-[#DEFF9A]">
                Pronto
              </span>
            </div>

            {/* Barra de progresso animada em loop */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] text-[#888888]">Publicando em 3 plataformas...</span>
                <span className="text-[12px] font-medium text-[#DEFF9A]">100%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1a]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#00E5A0] to-[#DEFF9A]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                />
              </div>
            </div>

            {/* Status das plataformas */}
            <div className="flex flex-col gap-2">
              {(['tiktok', 'instagram', 'youtube'] as const).map((platform, i) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: i * 0.6 + 0.5,
                    duration: 0.4,
                    repeat: Infinity,
                    repeatDelay: 2.4,
                  }}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-[#111111] px-3 py-2"
                >
                  <PlatformIcon platform={platform} size={22} showLabel />
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#DEFF9A]" />
                    <span className="text-[11px] text-[#DEFF9A]">Publicado</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
