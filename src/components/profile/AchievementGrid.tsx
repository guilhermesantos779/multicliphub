import { AchievementBadge } from './AchievementBadge'
import type { Database } from '@/types/database.types'

type Achievement = Database['public']['Tables']['achievements']['Row']

interface AchievementGridProps {
  achievements: Achievement[]
  unlockedMap: Record<string, string> // slug -> unlocked_at
  featuredSlugs: string[]
  isOwnProfile: boolean
}

export function AchievementGrid({
  achievements,
  unlockedMap,
  featuredSlugs,
}: AchievementGridProps) {
  const isUnlocked = (slug: string) => slug in unlockedMap
  const unlockedCount = achievements.filter((a) => isUnlocked(a.slug)).length

  // Featured = chosen slugs that are actually unlocked, in the chosen order
  const bySlug = new Map(achievements.map((a) => [a.slug, a]))
  const featured = featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((a): a is Achievement => !!a && isUnlocked(a.slug))

  // Full grid: unlocked first, then locked
  const sorted = [...achievements].sort((a, b) => {
    const ua = isUnlocked(a.slug) ? 0 : 1
    const ub = isUnlocked(b.slug) ? 0 : 1
    return ua - ub
  })

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="font-display text-[15px] font-semibold text-white">Conquistas</h2>
        <span className="rounded-full bg-[#00E5A0]/10 px-2 py-0.5 text-[11px] font-semibold text-[#00E5A0]">
          {unlockedCount}/{achievements.length} desbloqueadas
        </span>
      </div>

      {/* Featured row */}
      {featured.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Em destaque
          </p>
          <div className="flex flex-wrap gap-4">
            {featured.map((a) => (
              <AchievementBadge
                key={a.slug}
                achievement={a}
                unlocked
                unlockedAt={unlockedMap[a.slug]}
                size="lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Full grid */}
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-5 lg:grid-cols-8">
        {sorted.map((a) => (
          <AchievementBadge
            key={a.slug}
            achievement={a}
            unlocked={isUnlocked(a.slug)}
            unlockedAt={unlockedMap[a.slug]}
            size="md"
          />
        ))}
      </div>
    </section>
  )
}
