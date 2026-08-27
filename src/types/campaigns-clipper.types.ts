// Tipos do domínio "Campanhas" — lado clipper.
// Categorias alinhadas ao enum real do schema (ver
// src/lib/campaigns/schemas.ts campaignCategorySchema); valores monetários
// em reais (numeric no banco), não em centavos. As rotas em
// src/app/api/campaigns/** mapeiam as colunas reais pra esse shape.

export type CampaignModality = 'cpm' | 'leaderboard'

export type CampaignCategory =
  | 'geral'
  | 'musica'
  | 'games'
  | 'entretenimento'
  | 'esportes'
  | 'educacao'
  | 'estilo_de_vida'
  | 'tecnologia'

export type CampaignContentType = 'clipping' | 'ugc'

export type CampaignStatus = 'draft' | 'aguardando_pagamento' | 'active' | 'paused' | 'completed' | 'cancelled'

export interface ReferenceMaterial {
  id: string
  type: 'link' | 'image'
  label: string
  url: string
}

export interface LeaderboardPrize {
  position: number
  amount: number
}

export interface Campaign {
  id: string
  title: string
  description: string
  rules: string
  hashtag: string
  coverImageUrl: string | null
  agencyId: string
  agencyName: string
  agencyLogoUrl: string | null
  agencyVerified: boolean
  modality: CampaignModality
  category: CampaignCategory
  contentType: CampaignContentType
  status: CampaignStatus
  createdAt: string
  endsAt: string
  cpmRate: number | null
  totalBudget: number | null
  prizes: LeaderboardPrize[] | null
  referenceMaterials: ReferenceMaterial[]
  participantsCount: number
  isParticipating: boolean
}

export type SubmissionPlatform = 'tiktok' | 'instagram' | 'youtube'

export interface CampaignSubmission {
  id: string
  campaignId: string
  userId: string
  platform: SubmissionPlatform
  url: string
  views: number
  detectedAt: string
}

export interface LeaderboardEntry {
  userId: string
  rank: number
  fullName: string
  avatarUrl: string | null
  totalViews: number
  postsCount: number
  earnings: number | null
}

export interface WalletBalance {
  available: number
  pending: number
}

export interface MyCampaignSummary {
  id: string
  title: string
}
