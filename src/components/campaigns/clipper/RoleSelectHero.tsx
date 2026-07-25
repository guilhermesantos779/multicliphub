'use client'
import Link from 'next/link'

interface RoleSelectHeroProps {
  onChooseClipper: () => void
}

export function RoleSelectHero({ onChooseClipper }: RoleSelectHeroProps) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center py-16 text-center">
      <span className="mb-4 rounded-full border border-[#00E5A0]/30 bg-[#00E5A0]/[0.08] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#00E5A0]">
        Comece sua primeira campanha
      </span>
      <h1 className="text-[28px] font-bold leading-tight text-white sm:text-[32px]">
        Divulgue conteúdo e ganhe, ou lance sua própria campanha
      </h1>
      <p className="mt-3 max-w-md text-[14px] text-[#888888]">
        O MultiClip Hub conecta clippers a agências e criadores — escolha como você quer começar.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/agencia/onboarding"
          className="group flex flex-col items-start rounded-xl border border-white/[0.08] bg-[#111111] p-6 text-left transition-colors hover:border-white/[0.2]"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#35FDBC] to-[#187D5B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <h2 className="text-[16px] font-semibold text-white">Quero criar uma campanha</h2>
          <p className="mt-1 text-[13px] text-[#888888]">
            Sou agência ou criador e quero divulgar meu conteúdo com clippers.
          </p>
          <span className="mt-4 text-[13px] font-medium text-[#00E5A0] group-hover:underline">
            Começar onboarding →
          </span>
        </Link>

        <button
          type="button"
          onClick={onChooseClipper}
          className="group flex flex-col items-start rounded-xl border border-white/[0.08] bg-[#111111] p-6 text-left transition-colors hover:border-white/[0.2]"
        >
          <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-[#35FDBC] to-[#187D5B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B0F19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h2 className="text-[16px] font-semibold text-white">Quero participar como clipper</h2>
          <p className="mt-1 text-[13px] text-[#888888]">
            Encontre campanhas ativas e comece a postar com a hashtag exigida.
          </p>
          <span className="mt-4 text-[13px] font-medium text-[#00E5A0] group-hover:underline">
            Ver campanhas →
          </span>
        </button>
      </div>

      <p className="mt-6 text-[12px] text-[#444444]">
        Você pode alternar entre os dois modos a qualquer momento.
      </p>
    </div>
  )
}
