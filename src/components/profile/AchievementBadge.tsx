import { AchievementIcon } from './icons/AchievementIcon'
import { cn, formatDate } from '@/lib/utils'
import type { AchievementTier } from '@/lib/profile'
import type { Database } from '@/types/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']

const SIZE_PX = { sm: 48, md: 64, lg: 80 } as const

interface AchievementBadgeProps {
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: string | null
  size?: keyof typeof SIZE_PX
}

export function AchievementBadge({
  achievement,
  unlocked,
  unlockedAt,
  size = 'md',
}: AchievementBadgeProps) {
  const px = SIZE_PX[size]
  // Don't spoil secret achievements that are still locked
  const reveal = unlocked || !achievement.is_secret

  return (
    <div className="group relative flex flex-col items-center gap-1.5">
      <div className="transition-transform duration-200 group-hover:scale-105">
        <AchievementIcon
          iconType={achievement.icon_type}
          tier={achievement.tier as AchievementTier}
          size={px}
          locked={!unlocked}
        />
      </div>

      {size !== 'sm' && (
        <span
          className={cn(
            'max-w-[84px] text-center text-[10px] font-medium leading-tight',
            unlocked ? 'text-white/80' : 'text-white/30',
          )}
        >
          {reveal ? achievement.name : '???'}
        </span>
      )}

      {/* Hover tooltip */}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-max max-w-[200px] -translate-x-1/2 rounded-lg border border-white/[0.1] bg-[#15151c] px-3 py-2 text-center shadow-xl group-hover:block">
        <p className="text-[11px] font-semibold text-white">
          {reveal ? achievement.name : 'Conquista secreta'}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-white/50">
          {unlocked
            ? achievement.description
            : reveal
              ? achievement.description
              : 'Continue clipando para descobrir.'}
        </p>
        {unlocked && unlockedAt ? (
          <p className="mt-1 text-[9px] text-[#00E5A0]">
            Desbloqueada em {formatDate(unlockedAt)}
          </p>
        ) : (
          !unlocked && <p className="mt-1 text-[9px] text-white/30">Bloqueada</p>
        )}
      </div>
    </div>
  )
}
