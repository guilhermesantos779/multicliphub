import Link from 'next/link'
import { Plus, ExternalLink } from 'lucide-react'
import { PlatformIcon } from './icons/PlatformIcon'
import { PLATFORM_META, type ProfilePlatform } from '@/lib/profile'
import type { Database } from '@/types/database.types'

type ProfileLink = Database['public']['Tables']['profile_links']['Row']

interface ProfileLinksProps {
  links: ProfileLink[]
  isOwnProfile: boolean
}

function isKnownPlatform(p: string): p is ProfilePlatform {
  return p in PLATFORM_META
}

export function ProfileLinks({ links, isOwnProfile }: ProfileLinksProps) {
  return (
    <section>
      <h2 className="mb-4 font-display text-[15px] font-semibold text-white">
        Redes de corte
      </h2>

      {links.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-8 text-center backdrop-blur-md">
          <p className="text-[13px] text-white/40">Nenhuma rede conectada ainda</p>
          {isOwnProfile && (
            <Link
              href="/perfil/editar"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#9146FF] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#7c3aed]"
            >
              <Plus size={14} />
              Adicionar rede
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {links.map((link) => {
            const platform = isKnownPlatform(link.platform) ? link.platform : null
            const meta = platform ? PLATFORM_META[platform] : null
            const glowColor = meta?.glow === 'mint' ? '0,229,160' : '145,70,255'

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-md transition-colors hover:border-white/[0.15]"
              >
                {/* Corner glow matching platform color */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle, rgba(${glowColor},0.18) 0%, transparent 70%)`,
                    filter: 'blur(12px)',
                  }}
                />

                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: meta ? `${meta.color}1A` : 'rgba(255,255,255,0.06)',
                    color: meta?.color ?? '#ffffff',
                  }}
                >
                  {platform ? <PlatformIcon platform={platform} size={20} /> : <ExternalLink size={18} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-medium text-white">
                      {meta?.label ?? link.platform}
                    </span>
                    <ExternalLink
                      size={12}
                      className="text-white/30 transition-colors group-hover:text-white/60"
                    />
                  </div>
                  <div className="truncate text-[12px] text-white/45">
                    {link.display_name || link.url.replace(/^https?:\/\//, '')}
                  </div>
                </div>

                {link.followers_count && (
                  <div className="shrink-0 text-right">
                    <div className="text-[14px] font-semibold text-white">
                      {link.followers_count}
                    </div>
                    <div className="text-[10px] text-white/40">seguidores</div>
                  </div>
                )}
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
