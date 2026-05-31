// Shared, framework-agnostic data for the social profile system.
// No "use client" — safe to import from server and client components.

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'special'

// Tier palette. bronze/silver/gold/diamond follow the conventional medal
// language; "special" uses the brand purple→mint gradient.
export const TIER_META: Record<
  AchievementTier,
  { label: string; color: string; glow: string; gradient?: [string, string] }
> = {
  bronze:  { label: 'Bronze',   color: '#CD7F32', glow: 'rgba(205,127,50,0.55)' },
  silver:  { label: 'Prata',    color: '#C0C0C0', glow: 'rgba(192,192,192,0.55)' },
  gold:    { label: 'Ouro',     color: '#FFD700', glow: 'rgba(255,215,0,0.55)' },
  diamond: { label: 'Diamante', color: '#00E5FF', glow: 'rgba(0,229,255,0.55)' },
  special: {
    label: 'Especial',
    color: '#9146FF',
    glow: 'rgba(145,70,255,0.6)',
    gradient: ['#9146FF', '#00E5A0'],
  },
}

export type ProfilePlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'twitch'
  | 'kick'
  | 'twitter'

export const PLATFORM_META: Record<
  ProfilePlatform,
  { label: string; color: string; glow: 'purple' | 'mint'; placeholder: string }
> = {
  tiktok:    { label: 'TikTok',    color: '#69C9D0', glow: 'mint',   placeholder: 'https://tiktok.com/@usuario' },
  instagram: { label: 'Instagram', color: '#E1306C', glow: 'purple', placeholder: 'https://instagram.com/usuario' },
  youtube:   { label: 'YouTube',   color: '#FF0000', glow: 'purple', placeholder: 'https://youtube.com/@canal' },
  twitch:    { label: 'Twitch',    color: '#9146FF', glow: 'purple', placeholder: 'https://twitch.tv/canal' },
  kick:      { label: 'Kick',      color: '#53FC18', glow: 'mint',   placeholder: 'https://kick.com/canal' },
  twitter:   { label: 'Twitter',   color: '#1DA1F2', glow: 'purple', placeholder: 'https://x.com/usuario' },
}

export const PLATFORM_ORDER: ProfilePlatform[] = [
  'tiktok', 'instagram', 'youtube', 'twitch', 'kick', 'twitter',
]

// Plan tiers used by ProfileFrame. The DB has no 'free' — entry level is 'trial'
// (and some rows have null plan). Treat trial/null as the simple frame.
export type ProfilePlan = 'trial' | 'clipper' | 'pro' | 'king'

export const PLAN_META: Record<ProfilePlan, { label: string; color: string }> = {
  trial:   { label: 'Trial',   color: '#f59e0b' },
  clipper: { label: 'Clipper', color: '#9146FF' },
  pro:     { label: 'Pro',     color: '#00E5A0' },
  king:    { label: 'King',    color: '#DEFF9A' },
}

export function normalizePlan(plan: string | null | undefined): ProfilePlan {
  if (plan === 'clipper' || plan === 'pro' || plan === 'king') return plan
  return 'trial'
}

export const MAX_PROFILE_LINKS = 6
export const MAX_FEATURED_ACHIEVEMENTS = 5
export const MAX_BIO_LENGTH = 160
export const MAX_DISPLAY_NAME_LENGTH = 30
