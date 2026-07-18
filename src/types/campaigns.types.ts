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
export type AgencyProfileType = 'agency' | 'influencer'
export type CampaignPlatform = 'tiktok' | 'instagram' | 'youtube'

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
