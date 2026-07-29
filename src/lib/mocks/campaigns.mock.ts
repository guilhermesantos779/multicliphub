// TODO: substituir todo este arquivo por chamadas reais ao Supabase / rotas
// app/api/campanhas/** quando o schema (Agente 1) e as rotas de API forem
// mergeados. Mantido isolado aqui para não travar o desenvolvimento do
// frontend da agência enquanto os outros agentes trabalham em paralelo.

import type {
  AgencyProfile,
  Campaign,
  CampaignPost,
  LeaderboardEntry,
} from '@/types/campaigns.types'

export const MOCK_AGENCY_PROFILE: AgencyProfile = {
  id: 'agency-1',
  userId: 'user-agency-1',
  type: 'agencia',
  kind: 'marca_streamer',
  name: 'Nebula Talent',
  logoUrl: null,
  bio: 'Agência de talentos focada em criadores de conteúdo gaming e entretenimento.',
  website: 'https://nebulatalent.com',
  socialLinks: [
    { id: 'sl-1', platform: 'Instagram', url: 'https://instagram.com/nebulatalent' },
    { id: 'sl-2', platform: 'TikTok', url: 'https://tiktok.com/@nebulatalent' },
  ],
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    agencyId: 'agency-1',
    agencyName: 'Nebula Talent',
    agencyLogoUrl: null,
    agencyVerified: true,
    coverImageUrl: null,
    title: 'Lançamento Season 5 — Clipping',
    description: 'Clipe os melhores momentos das lives da temporada 5.',
    rules: 'Use apenas conteúdo oficial da live. Proibido usar trilhas com copyright de terceiros.',
    hashtag: '#Season5Clips',
    category: 'games',
    contentType: 'clipping',
    materials: [
      { id: 'mat-1', type: 'link', label: 'VOD completo da live', url: 'https://youtube.com/watch?v=exemplo' },
    ],
    modality: 'cpm',
    cpmRateCents: 800,
    budgetCents: 500000,
    leaderboardPrizes: [],
    durationDays: 20,
    status: 'active',
    visibility: 'aberta',
    createdAt: '2026-07-01T12:00:00.000Z',
    startsAt: '2026-07-02T00:00:00.000Z',
    endsAt: '2026-07-22T00:00:00.000Z',
    newPostsSinceLastVisit: 6,
    awaitingFinalReview: false,
    finalReviewConfirmedAt: null,
  },
  {
    id: 'camp-2',
    agencyId: 'agency-1',
    agencyName: 'Nebula Talent',
    agencyLogoUrl: null,
    agencyVerified: true,
    coverImageUrl: null,
    title: 'Desafio de Dança — UGC',
    description: 'Grave seu próprio vídeo reagindo ou recriando a coreografia oficial.',
    rules: 'Vídeo precisa ter no mínimo 15 segundos e mostrar o produto claramente.',
    hashtag: '#DanceChallengeNT',
    category: 'entertainment',
    contentType: 'ugc',
    materials: [
      { id: 'mat-2', type: 'image', label: 'Referência de coreografia', url: 'https://example.com/ref.png' },
    ],
    modality: 'leaderboard',
    cpmRateCents: null,
    budgetCents: null,
    leaderboardPrizes: [
      { id: 'lp-1', position: 1, amountCents: 150000 },
      { id: 'lp-2', position: 2, amountCents: 80000 },
      { id: 'lp-3', position: 3, amountCents: 40000 },
    ],
    durationDays: 30,
    status: 'completed',
    visibility: 'aberta',
    createdAt: '2026-06-01T12:00:00.000Z',
    startsAt: '2026-06-02T00:00:00.000Z',
    endsAt: '2026-07-02T00:00:00.000Z',
    newPostsSinceLastVisit: 0,
    awaitingFinalReview: true,
    finalReviewConfirmedAt: null,
  },
  {
    id: 'camp-3',
    agencyId: 'agency-1',
    agencyName: 'Nebula Talent',
    agencyLogoUrl: null,
    agencyVerified: true,
    coverImageUrl: null,
    title: 'Bastidores do Podcast',
    description: 'Clipes curtos dos melhores momentos do podcast semanal.',
    rules: 'Manter o logo do podcast visível durante todo o clipe.',
    hashtag: '#PodcastBastidores',
    category: 'entertainment',
    contentType: 'clipping',
    materials: [],
    modality: 'cpm',
    cpmRateCents: 500,
    budgetCents: 200000,
    leaderboardPrizes: [],
    durationDays: 7,
    status: 'aguardando_pagamento',
    visibility: 'aberta',
    createdAt: '2026-07-16T09:00:00.000Z',
    startsAt: null,
    endsAt: null,
    newPostsSinceLastVisit: 0,
    awaitingFinalReview: false,
    finalReviewConfirmedAt: null,
  },
]

const CLIPPER_NAMES = ['Ana Prado', 'Bruno Vaz', 'Carla Dias', 'Diego Rocha', 'Elis Nunes', 'Fábio Reis']

export function getMockLeaderboard(campaignId: string): LeaderboardEntry[] {
  const seed = campaignId.length
  return CLIPPER_NAMES.map((name, i) => {
    const totalViews = Math.max(1200, (seed * 900 + (CLIPPER_NAMES.length - i) * 48000) - i * 3200)
    const postsCount = 8 - i
    return {
      userId: `user-clipper-${i + 1}`,
      rank: i + 1,
      displayName: name,
      avatarUrl: null,
      totalViews,
      postsCount,
      earningsCents: Math.round((totalViews / 1000) * 800),
    }
  })
}

export function getMockCampaignById(id: string): Campaign | undefined {
  return MOCK_CAMPAIGNS.find(c => c.id === id)
}

export function getMockClipperByUserId(campaignId: string, userId: string): LeaderboardEntry | undefined {
  return getMockLeaderboard(campaignId).find(entry => entry.userId === userId)
}

// ── Estado mockado em memória (só dura a sessão do navegador) ──────────
// Simula persistência de remoção de posts e confirmação de revisão final
// para a demo funcionar de ponta a ponta. TODO: substituir tudo isto por
// mutações reais no Supabase (`campaign_posts`, `campaigns.final_review_*`)
// quando as rotas do Agente 1 forem mergeadas.
function postsKey(campaignId: string, userId: string): string {
  return `${campaignId}:${userId}`
}

function generatePosts(campaignId: string, userId: string): CampaignPost[] {
  const platforms: CampaignPost['platform'][] = ['tiktok', 'instagram', 'youtube']
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `post-${campaignId}-${userId}-${i + 1}`,
    campaignId,
    userId,
    platform: platforms[i % platforms.length]!,
    url: 'https://tiktok.com/@clipper/video/1234567890',
    thumbnailUrl: null,
    views: Math.max(500, 42000 - i * 9500),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    removed: false,
  }))
}

const postsStore: Record<string, CampaignPost[]> = {}
const reviewConfirmedAtStore: Record<string, string | null> = {}
const lastModifiedAtStore: Record<string, string | undefined> = {}

export function getMockCampaignPosts(campaignId: string, userId: string): CampaignPost[] {
  const key = postsKey(campaignId, userId)
  if (!postsStore[key]) {
    postsStore[key] = generatePosts(campaignId, userId)
  }
  return postsStore[key]
}

export function removeMockPost(campaignId: string, userId: string, postId: string, reason: string): void {
  const key = postsKey(campaignId, userId)
  const posts = postsStore[key] ?? []
  postsStore[key] = posts.map(p => (p.id === postId ? { ...p, removed: true, removedReason: reason } : p))
  lastModifiedAtStore[campaignId] = new Date().toISOString()
}

export function getCampaignReviewMeta(campaignId: string): { confirmedAt: string | null; lastModifiedAt: string | undefined } {
  return {
    confirmedAt: reviewConfirmedAtStore[campaignId] ?? null,
    lastModifiedAt: lastModifiedAtStore[campaignId],
  }
}

export function confirmMockReview(campaignId: string): string {
  const now = new Date().toISOString()
  reviewConfirmedAtStore[campaignId] = now
  return now
}
