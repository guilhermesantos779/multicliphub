// Tipos do domínio "Campanhas" — lado clipper.
// TODO: substituir por tipos gerados a partir do schema real (Database['public']['Tables']['campaigns']...)
// quando as migrations do Agente 1 forem mergeadas.

export type CampaignModality = 'cpm' | 'leaderboard'

export type CampaignCategory =
  | 'musica'
  | 'games'
  | 'entretenimento'
  | 'esportes'
  | 'educacao'
  | 'estilo_de_vida'
  | 'tecnologia'

export type CampaignContentType = 'clipping' | 'ugc'

export type CampaignStatus = 'active' | 'awaiting_payment' | 'ended' | 'draft'

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

export type SubmissionPlatform = 'tiktok' | 'instagram' | 'youtube' | 'kwai'

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

export interface PaymentProfile {
  configured: boolean
  pixKey: string | null
  cpf: string | null
}

export interface CampaignEarning {
  id: string
  campaignId: string
  campaignTitle: string
  amount: number
  status: 'pending' | 'paid'
  paidAt: string | null
}

export interface MyCampaignSummary {
  id: string
  title: string
}

export interface PublicPost {
  id: string
  platform: SubmissionPlatform
  url: string
  views: number
  postedAt: string
}

export interface ParticipantProfile {
  entry: LeaderboardEntry
  posts: PublicPost[]
}
