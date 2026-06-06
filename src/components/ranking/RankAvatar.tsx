'use client'
import { ProfileFrame } from '@/components/profile/ProfileFrame'
import { normalizePlan, PLAN_META } from '@/lib/profile'

interface RankAvatarProps {
  fullName: string | null
  username: string | null
  avatarUrl: string | null
  plan: string | null
  size?: number
  variant?: 'full' | 'compact'
}

// Avatar with the user's plan frame (King gets the animated hex rim + sparkles),
// reused by the podium and the big ranking cards.
export function RankAvatar({ fullName, username, avatarUrl, plan, size = 56, variant = 'compact' }: RankAvatarProps) {
  const initial = (fullName || username || 'U').charAt(0).toUpperCase()
  const planMeta = PLAN_META[normalizePlan(plan)]
  return (
    <ProfileFrame plan={plan} size={size} variant={variant}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={fullName || username || ''} className="h-full w-full object-cover" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-bold text-white"
          style={{
            fontSize: size * 0.4,
            background: `linear-gradient(135deg, ${planMeta.color}55, ${planMeta.color}22)`,
          }}
        >
          {initial}
        </div>
      )}
    </ProfileFrame>
  )
}
