'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { FadeIn } from '@/components/shared/FadeIn'
import Link from 'next/link'

export function FAQ() {
  const t = useTranslations('faq')
  const items = t.raw('items') as { q: string; a: string }[]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header — left aligned */}
        <FadeIn className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            {t('eyebrow')}
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[15px] text-white/50">
            {t('subtitle_prefix')}
            <Link
              href="mailto:suportemulticliphub@gmail.com"
              className="text-white/70 underline underline-offset-2 hover:text-white transition-colors"
            >
              {t('subtitle_link')}
            </Link>
          </p>
        </FadeIn>

        {/* Accordion */}
        <div className="flex flex-col">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <FadeIn key={i} delay={i * 0.04}>
                <div
                  className={[
                    'border-t border-white/[0.06]',
                    i === items.length - 1 ? 'border-b border-white/[0.06]' : '',
                  ].join(' ')}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15px] font-medium text-white">{item.q}</span>
                    <span
                      className="shrink-0 text-[20px] text-white/40 transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-[14px] leading-[1.7] text-white/50">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
