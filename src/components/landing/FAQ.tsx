'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FadeIn } from '@/components/shared/FadeIn'

const ITEMS = [
  {
    q: 'O MultiClip Hub é seguro? Minhas senhas ficam armazenadas?',
    a: 'Nunca armazenamos suas senhas. Usamos autenticação OAuth oficial de cada plataforma – o mesmo sistema do Buffer e Later. Você se conecta diretamente pela plataforma, sem passar credenciais pelo MultiClip Hub.',
  },
  {
    q: 'Quantos vídeos posso publicar por dia?',
    a: 'No plano Pro e King não há limite no MultiClip Hub. Cada plataforma tem seus próprios limites de API: TikTok permite até 5 posts diários via API, Instagram Reels até 25 e YouTube Shorts até 50.',
  },
  {
    q: 'Como funciona o Ranking? É manipulável?',
    a: 'O ranking usa dados diretamente das APIs oficiais. Apenas vídeos publicados pelo MultiClip Hub são contabilizados. Contas com comportamento suspeito ou compra de views são automaticamente desclassificadas.',
  },
  {
    q: 'O que acontece se meu vídeo falhar ao publicar em uma plataforma?',
    a: 'Você recebe uma notificação imediata com o motivo da falha. O sistema tenta republicar automaticamente até 3 vezes. Se persistir, o clipe fica salvo no histórico com opção de republicar com 1 clique.',
  },
  {
    q: 'Como recebo os prêmios do ranking mensal?',
    a: 'Os 3 primeiros de cada categoria são contatados por e-mail até o dia 5 do mês seguinte para receber os cargos no Discord da comunidade e ter o plano upgradeado gratuitamente por 3 meses.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="bg-black py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <FadeIn className="mb-14 text-center">
          <span className="mb-3 inline-block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#00E5A0]">
            FAQ
          </span>
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-[#FAFAFA] sm:text-[52px]">
            Dúvidas frequentes
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-2">
          {ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0a0a] transition-colors hover:border-white/[0.10]">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[14px] font-medium text-[#FAFAFA]">{item.q}</span>
                    <span
                      className="shrink-0 text-[18px] text-[#888888] transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    >
                      +
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                      >
                        <p className="px-5 pb-4 text-[14px] leading-[1.7] text-[#888888]">
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
