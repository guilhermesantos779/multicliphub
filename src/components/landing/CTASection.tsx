import Link from 'next/link'
import { FadeIn } from '@/components/shared/FadeIn'

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black py-32">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-[rgba(0,229,160,0.05)] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <FadeIn>
          <div className="rounded-3xl border border-white/[0.06] bg-[#0a0a0a] p-12 sm:p-16">
            <div className="mb-2 text-4xl">🚀</div>

            <h2 className="mb-4 text-[40px] font-bold leading-[1.05] tracking-[-0.04em] text-[#FAFAFA] sm:text-[52px]">
              Pronto para dominar
              <br />
              o algoritmo?
            </h2>

            <p className="mb-10 text-[16px] leading-[1.7] text-[#888888]">
              Mais de 2.300 clipadores já crescem mais rápido.
              <br />
              Agora é a sua vez.
            </p>

            <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#00E5A0] px-8 py-3.5 text-[15px] font-semibold text-[#0B0F19] transition-colors hover:bg-[#00B584]"
              >
                Criar minha conta grátis →
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-8 py-3.5 text-[15px] text-[#888888] transition-colors hover:border-white/[0.16] hover:text-white"
              >
                Falar com a equipe
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {['7 dias grátis', 'Sem cartão de crédito', 'Cancele quando quiser'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[13px] text-[#444444]">
                  <span className="text-[#00E5A0]">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
