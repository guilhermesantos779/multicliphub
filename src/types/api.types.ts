export type Platform = 'tiktok' | 'instagram' | 'youtube'
export type PlanName = 'clipper' | 'pro' | 'king' | 'trial'
export type UserRole = 'admin' | 'king' | 'pro' | 'clipper' | 'trial' | 'blocked'
export type PostStatus = 'pending' | 'publishing' | 'published' | 'failed' | 'scheduled'

export interface PublishResult {
  platform: Platform
  status: 'success' | 'failed'
  postUrl?: string
  errorMessage?: string
}

export interface UploadPayload {
  title: string
  caption: string
  platforms: Platform[]
  useAI: boolean
  scheduledAt?: string
}
