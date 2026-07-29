export type CampaignModality = 'cpm' | 'leaderboard'
export type CampaignStatus = 'draft' | 'awaiting_payment' | 'active' | 'ended' | 'reviewed'
export type CampaignCategory =
  | 'all'
  | 'music'
  | 'games'
  | 'entertainment'
  | 'sports'
  | 'education'
  | 'lifestyle'
  | 'tech'
export type CampaignContentType = 'clipping' | 'ugc'
export type ReferenceMaterialType = 'link' | 'image'
export type AgencyProfileType = 'agencia' | 'influencer'
export type AgencyKind = 'clipadores' | 'marca_streamer'
export type CampaignPlatform = 'tiktok' | 'instagram' | 'youtube'
export type CampaignVisibility = 'aberta' | 'fechada_agencia'

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  all: 'Todas as categorias',
  music: 'Música',
  games: 'Games',
  entertainment: 'Entretenimento',
  sports: 'Esportes',
  education: 'Educação',
  lifestyle: 'Estilo de vida',
  tech: 'Tecnologia',
}

export const CONTENT_TYPE_LABELS: Record<CampaignContentType, string> = {
  clipping: 'Clipping',
  ugc: 'UGC',
}

export interface AgencySocialLink {
  id: string
  platform: string
  url: string
}

export interface AgencyProfile {
  id: string
  userId: string
  type: AgencyProfileType
  kind: AgencyKind
  name: string
  logoUrl: string | null
  bio: string
  website: string | null
  socialLinks: AgencySocialLink[]
}

export interface ReferenceMaterial {
  id: string
  type: ReferenceMaterialType
  label: string
  url: string
}

export interface LeaderboardPrize {
  id: string
  position: number
  amountCents: number
}

export interface Campaign {
  id: string
  agencyId: string
  agencyName: string
  agencyLogoUrl: string | null
  agencyVerified: boolean
  coverImageUrl: string | null
  title: string
  description: string
  rules: string
  hashtag: string
  category: CampaignCategory
  contentType: CampaignContentType
  materials: ReferenceMaterial[]
  modality: CampaignModality
  cpmRateCents: number | null
  budgetCents: number | null
  leaderboardPrizes: LeaderboardPrize[]
  durationDays: 7 | 20 | 30
  status: CampaignStatus
  visibility: CampaignVisibility
  createdAt: string
  startsAt: string | null
  endsAt: string | null
  newPostsSinceLastVisit: number
  awaitingFinalReview: boolean
  finalReviewConfirmedAt: string | null
}

export interface LeaderboardEntry {
  userId: string
  rank: number
  displayName: string
  avatarUrl: string | null
  totalViews: number
  postsCount: number
  earningsCents: number
}

export type AgencyClipperMemberStatus = 'pendente' | 'ativo' | 'removido'

export interface AgencyClipperMember {
  id: string
  agencyProfileId: string
  userId: string
  status: AgencyClipperMemberStatus
  invitedAt: string
  joinedAt: string | null
  removedAt: string | null
  // Denormalized fields joined in from `profiles`, present when the API
  // route enriches the roster listing.
  username?: string
  fullName?: string | null
  avatarUrl?: string | null
}

export interface AgencyInviteLink {
  id: string
  agencyProfileId: string
  code: string
  expiresAt: string | null
  isActive: boolean
  createdAt: string
}

export interface AgencyClipperMetrics {
  agencyProfileId: string
  userId: string
  totalViews: number
  // In reais (BRL), matching campaign_payouts.amount — NOT cents. The
  // agencia dashboard's mocked components (CampaignCard, LeaderboardList)
  // use a *Cents convention that predates the real schema; this field talks
  // to the real database instead, so it stays in the DB's native unit and
  // converts only at the point where formatCurrencyBRL (which expects
  // cents) is called.
  totalEarnings: number
}

export interface CampaignPost {
  id: string
  campaignId: string
  userId: string
  platform: CampaignPlatform
  url: string
  thumbnailUrl: string | null
  views: number
  createdAt: string
  removed: boolean
  removedReason?: string
}
