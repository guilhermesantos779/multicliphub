'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeIn } from '@/components/shared/FadeIn'
import Link from 'next/link'

const ITEMS = [
  {
    q: 'O MultiClip Hub é seguro? Meus tokens estão protegidos?',
    a: 'Nunca armazenamos suas senhas. Usamos autenticação OAuth oficial de cada plataforma — o mesmo sistema do Buffer e Later. Você se conecta diretamente pela plataforma sem passar credenciais pelo MultiClip Hub.',
  },
  {
    q: 'Funciona com contas verificadas / business?',
    a: 'Sim. As APIs oficiais do TikTok, Instagram e YouTube aceitam contas pessoais, verificadas e business. Basta conectar via OAuth e pronto.',
  },
  {
    q: 'E se uma plataforma mudar a API?',
    a: 'Nossa equipe acompanha os changelogs oficiais em tempo real. Caso uma API mude, atualizamos o conector em até 24h e você recebe uma notificação proativa antes de qualquer impacto.',
  },
  {
    q: 'Posso cancelar a qualquer momento?',
    a: 'Sim, sem multa e sem burocracia. Cancele pelo painel em menos de 30 segundos. Você continua tendo acesso até o fim do período já pago.',
  },
  {
    q: 'Quanto tempo demora a publicação?',
    a: 'A publicação simultânea nas três plataformas leva entre 30 segundos e 3 minutos dependendo do tamanho do vídeo e da fila das APIs. Você recebe notificação quando cada plataforma confirmar.',
  },
  {
    q: 'Tem limite de vídeos por mês?',
    a: 'No plano Clipper são 200 posts/mês. Nos planos Pro e King os posts são ilimitados — o limite fica por conta das cotas de API de cada plataforma (TikTok: 5/dia, Instagram: 25/dia, YouTube: 50/dia).',
  },
  {
    q: 'Como funciona o ranking?',
    a: 'Os dados vêm direto das APIs oficiais. Apenas vídeos publicados pelo MultiClip Hub são contabilizados. O ranking atualiza a cada 6 horas e reinicia no primeiro dia de cada mês.',
  },
  {
    q: 'Posso ter mais de um canal por plataforma?',
    a: 'No plano Pro você conecta até 3 contas por plataforma (9 canais no total). No plano King os canais são ilimitados, ideal para agências e managers que gerenciam múltiplos criadores.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header — left aligned */}
        <FadeIn className="mb-14 max-w-2xl">
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
            perguntas frequentes
          </p>
          <h2
            className="font-display font-semibold leading-[1.05] tracking-[-0.04em] text-white mb-3"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            Tudo que você precisa saber.
          </h2>
          <p className="text-[15px] text-white/50">
            Se algo não estiver aqui,{' '}
            <Link
              href="mailto:suportemulticliphub@gmail.com"
              className="text-white/70 underline underline-offset-2 hover:text-white transition-colors"
            >
              fale com a gente
            </Link>
          </p>
        </FadeIn>

        {/* Accordion */}
        <div className="flex flex-col">
          {ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <FadeIn key={i} delay={i * 0.04}>
                <div
                  className={[
                    'border-t border-white/[0.06]',
                    i === ITEMS.length - 1 ? 'border-b border-white/[0.06]' : '',
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
