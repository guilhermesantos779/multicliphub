import Link from 'next/link'
import { Pencil, Eye, Trophy, Film } from 'lucide-react'
import { ProfileFrame } from './ProfileFrame'
import { PLAN_META, normalizePlan } from '@/lib/profile'
import { formatViews } from '@/lib/utils'
import type { Database } from '@/types/database.types'

type PublicProfile = Database['public']['Views']['public_profiles']['Row']

interface ProfileHeaderProps {
  profile: PublicProfile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const plan = normalizePlan(profile.plan)
  const planMeta = PLAN_META[plan]
  const displayName = profile.full_name || 'Sem nome'
  const initial = (profile.full_name || profile.username || 'U').charAt(0).toUpperCase()

  return (
    <div>
      {/* Banner */}
      <div className="relative h-[200px] w-full overflow-hidden">
        {profile.banner_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.banner_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: 'linear-gradient(135deg, #1a0533, #000)' }}
          />
        )}
        {/* Fade into the page */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
        />
      </div>

      {/* Header content */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-end justify-between">
          {/* Avatar overlaps banner */}
          <div className="-mt-12">
            <ProfileFrame plan={profile.plan} size={96}>
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${planMeta.color}55, ${planMeta.color}22)`,
                  }}
                >
                  {initial}
                </div>
              )}
            </ProfileFrame>
          </div>

          {isOwnProfile && (
            <Link
              href="/perfil/editar"
              className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-white/80 backdrop-blur-md transition-colors hover:border-white/[0.25] hover:text-white"
            >
              <Pencil size={14} />
              Editar perfil
            </Link>
          )}
        </div>

        {/* Name + username */}
        <div className="mt-3">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-[22px] font-bold tracking-[-0.02em] text-white">
              {displayName}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ color: planMeta.color, background: `${planMeta.color}1A` }}
            >
              {planMeta.label}
            </span>
          </div>
          <p className="mt-0.5 text-[14px] text-white/50">@{profile.username}</p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/70">
            {profile.bio}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-white/40">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={13} />
            {formatViews(profile.total_views ?? 0)} views
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Trophy size={13} />
            {profile.ranking_position ? `#${profile.ranking_position} no ranking` : 'Sem ranking'}
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Film size={13} />
            {profile.total_posts ?? 0} posts
          </span>
        </div>
      </div>
    </div>
  )
}
