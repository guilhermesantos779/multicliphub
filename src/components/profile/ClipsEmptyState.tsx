import Link from 'next/link'
import { Film } from 'lucide-react'
import { PlatformIcon } from './icons/PlatformIcon'

interface ClipsEmptyStateProps {
  isOwnProfile: boolean
  username: string
}

export function ClipsEmptyState({ isOwnProfile, username }: ClipsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 py-16 text-center">
      {/* Icon cluster */}
      <div className="relative mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <Film size={28} className="text-white/30" />
        </div>
        {/* Platform orbits */}
        <div className="absolute -right-2 -top-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12] text-white/40">
          <PlatformIcon platform="tiktok" size={14} />
        </div>
        <div className="absolute -bottom-1 -right-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12] text-white/40">
          <PlatformIcon platform="instagram" size={14} />
        </div>
        <div className="absolute -bottom-1 -left-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0a0a12] text-white/40">
          <PlatformIcon platform="youtube" size={14} />
        </div>
      </div>

      {isOwnProfile ? (
        <>
          <p className="mb-1 text-[14px] font-medium text-white/60">
            Nenhum clipe publicado ainda
          </p>
          <p className="mb-5 max-w-[240px] text-[12px] leading-relaxed text-white/30">
            Publique seu primeiro clipe e ele aparecerá aqui com as visualizações de cada
            plataforma.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-[#00E5A0] px-4 py-2 text-[14px] font-semibold text-black transition-colors hover:bg-[#00E5A0]/90"
          >
            Publicar agora
          </Link>
        </>
      ) : (
        <>
          <p className="mb-1 text-[14px] font-medium text-white/60">
            Nenhum clipe por aqui ainda
          </p>
          <p className="max-w-[240px] text-[12px] leading-relaxed text-white/30">
            Quando @{username} publicar clipes, eles aparecem aqui com as visualizações em
            tempo real.
          </p>
        </>
      )}
    </div>
  )
}
