// Dados mockados da feature de Campanhas (lado clipper).
// TODO: substituir cada função abaixo por chamadas reais (Supabase / app/api/campanhas/**)
// assim que as rotas do Agente 1 forem mergeadas neste branch.
import type {
  Campaign,
  CampaignEarning,
  CampaignSubmission,
  LeaderboardEntry,
  MyCampaignSummary,
  ParticipantProfile,
  PaymentProfile,
  PublicPost,
  WalletBalance,
} from '@/types/campaigns.types'

export const MOCK_CURRENT_USER_ID = 'user-me'

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Lança Essa Clipe',
    description: 'Corte os melhores momentos dos nossos lançamentos e leve seu clipe pro topo.',
    rules: 'Só cortes verticais. Sem conteúdo ofensivo. Máximo 60s por post. Um post por vídeo original.',
    hashtag: '#RecMusicClip',
    coverImageUrl: null,
    agencyId: 'agency-1',
    agencyName: 'Rec Music',
    agencyLogoUrl: null,
    agencyVerified: true,
    modality: 'cpm',
    category: 'musica',
    contentType: 'clipping',
    status: 'active',
    createdAt: '2026-07-01T12:00:00Z',
    endsAt: '2026-07-28T23:59:59Z',
    cpmRate: 8.5,
    totalBudget: 5000,
    prizes: null,
    referenceMaterials: [
      { id: 'ref-1', type: 'link', label: 'Vídeo original — Show SP', url: 'https://example.com/rec-music/show-sp' },
      { id: 'ref-2', type: 'image', label: 'Capa oficial da campanha', url: 'https://example.com/rec-music/capa.png' },
    ],
    participantsCount: 128,
    isParticipating: true,
  },
  {
    id: 'camp-2',
    title: 'Duelo de Clipes FURIA',
    description: 'Corte os melhores plays da FURIA no CS e dispute o topo do ranking.',
    rules: 'Apenas clipes de partidas oficiais. Proibido conteúdo de outras orgs. Máximo 3 posts por dia.',
    hashtag: '#ClipeFURIA',
    coverImageUrl: null,
    agencyId: 'agency-2',
    agencyName: 'FURIA Gaming',
    agencyLogoUrl: null,
    agencyVerified: true,
    modality: 'leaderboard',
    category: 'games',
    contentType: 'clipping',
    status: 'active',
    createdAt: '2026-07-05T12:00:00Z',
    endsAt: '2026-08-04T23:59:59Z',
    cpmRate: null,
    totalBudget: null,
    prizes: [
      { position: 1, amount: 3000 },
      { position: 2, amount: 1500 },
      { position: 3, amount: 800 },
    ],
    referenceMaterials: [
      { id: 'ref-3', type: 'link', label: 'VOD — Major Playoffs', url: 'https://example.com/furia/vod-playoffs' },
    ],
    participantsCount: 342,
    isParticipating: false,
  },
  {
    id: 'camp-3',
    title: 'UGC Verão StarFit',
    description: 'Grave seu treino usando os suplementos StarFit e mostre resultado real.',
    rules: 'Conteúdo autoral (UGC), sem uso de vídeo de terceiros. Precisa citar o produto em cena.',
    hashtag: '#StarFitVerao',
    coverImageUrl: null,
    agencyId: 'agency-3',
    agencyName: 'StarFit Suplementos',
    agencyLogoUrl: null,
    agencyVerified: false,
    modality: 'cpm',
    category: 'esportes',
    contentType: 'ugc',
    status: 'active',
    createdAt: '2026-07-10T12:00:00Z',
    endsAt: '2026-07-25T23:59:59Z',
    cpmRate: 5,
    totalBudget: 2000,
    prizes: null,
    referenceMaterials: [
      { id: 'ref-4', type: 'image', label: 'Referência de embalagem', url: 'https://example.com/starfit/embalagem.png' },
    ],
    participantsCount: 54,
    isParticipating: false,
  },
  {
    id: 'camp-4',
    title: 'Corte o Podcast',
    description: 'Recorte os melhores momentos do episódio da semana e dispute o ranking.',
    rules: 'Cortes de até 90s. Precisa manter o áudio original. Nada de cortes fora de contexto.',
    hashtag: '#CorteFlow',
    coverImageUrl: null,
    agencyId: 'agency-4',
    agencyName: 'Flow Podcast',
    agencyLogoUrl: null,
    agencyVerified: true,
    modality: 'leaderboard',
    category: 'entretenimento',
    contentType: 'clipping',
    status: 'active',
    createdAt: '2026-06-20T12:00:00Z',
    endsAt: '2026-07-20T23:59:59Z',
    cpmRate: null,
    totalBudget: null,
    prizes: [
      { position: 1, amount: 2000 },
      { position: 2, amount: 1000 },
      { position: 3, amount: 500 },
    ],
    referenceMaterials: [
      { id: 'ref-5', type: 'link', label: 'Episódio #182 completo', url: 'https://example.com/flow/ep182' },
    ],
    participantsCount: 210,
    isParticipating: true,
  },
  {
    id: 'camp-5',
    title: 'Aulão de Growth',
    description: 'Compartilhe sua experiência com o curso EduTech em vídeo curto.',
    rules: 'Precisa ser aluno matriculado. Depoimento autêntico, sem roteiro fixo.',
    hashtag: '#EduTechGrowth',
    coverImageUrl: null,
    agencyId: 'agency-5',
    agencyName: 'EduTech Academy',
    agencyLogoUrl: null,
    agencyVerified: false,
    modality: 'cpm',
    category: 'educacao',
    contentType: 'ugc',
    status: 'active',
    createdAt: '2026-07-12T12:00:00Z',
    endsAt: '2026-08-11T23:59:59Z',
    cpmRate: 4,
    totalBudget: 800,
    prizes: null,
    referenceMaterials: [],
    participantsCount: 12,
    isParticipating: false,
  },
  {
    id: 'camp-6',
    title: 'Skin Drop Tech Review',
    description: 'Corte os melhores momentos dos nossos reviews de hardware.',
    rules: 'Apenas trechos dos vídeos oficiais do canal. Sem uso de trilha externa.',
    hashtag: '#ByteZoneClip',
    coverImageUrl: null,
    agencyId: 'agency-6',
    agencyName: 'ByteZone',
    agencyLogoUrl: null,
    agencyVerified: true,
    modality: 'leaderboard',
    category: 'tecnologia',
    contentType: 'clipping',
    status: 'active',
    createdAt: '2026-07-08T12:00:00Z',
    endsAt: '2026-07-30T23:59:59Z',
    cpmRate: null,
    totalBudget: null,
    prizes: [
      { position: 1, amount: 1200 },
      { position: 2, amount: 600 },
    ],
    referenceMaterials: [
      { id: 'ref-6', type: 'link', label: 'Review RTX — vídeo completo', url: 'https://example.com/bytezone/review-rtx' },
    ],
    participantsCount: 76,
    isParticipating: false,
  },
  {
    id: 'camp-7',
    title: 'Rotina Real Vidalife',
    description: 'Mostre sua rotina usando os produtos Vidalife no dia a dia.',
    rules: 'UGC autoral, precisa aparecer o produto em uso real, sem exageros.',
    hashtag: '#VidalifeReal',
    coverImageUrl: null,
    agencyId: 'agency-7',
    agencyName: 'Vidalife',
    agencyLogoUrl: null,
    agencyVerified: false,
    modality: 'cpm',
    category: 'estilo_de_vida',
    contentType: 'ugc',
    status: 'active',
    createdAt: '2026-07-14T12:00:00Z',
    endsAt: '2026-08-05T23:59:59Z',
    cpmRate: 6,
    totalBudget: 1500,
    prizes: null,
    referenceMaterials: [],
    participantsCount: 38,
    isParticipating: false,
  },
]

function buildLeaderboard(campaignId: string): LeaderboardEntry[] {
  const names = [
    'Bruno Cavalcante', 'Larissa Mendes', 'Kaique Ferreira', 'Ana Beatriz Souza',
    'Pedro Henrique Lima', 'Isabela Rocha', 'Thiago Almeida', 'Camila Duarte',
    'Rafael Nogueira', 'Gabriela Teixeira',
  ]
  const isParticipating = MOCK_CAMPAIGNS.find(c => c.id === campaignId)?.isParticipating ?? false
  const modality = MOCK_CAMPAIGNS.find(c => c.id === campaignId)?.modality ?? 'cpm'

  const entries: LeaderboardEntry[] = names.map((fullName, i) => {
    const totalViews = Math.round(890_000 / (i + 1) + (campaignId.length * 1000))
    return {
      userId: `user-${campaignId}-${i + 1}`,
      rank: i + 1,
      fullName,
      avatarUrl: null,
      totalViews,
      postsCount: Math.max(1, 12 - i),
      earnings: modality === 'leaderboard' && i < 3 ? [3000, 1500, 800][i] : null,
    }
  })

  if (isParticipating) {
    entries.splice(4, 0, {
      userId: MOCK_CURRENT_USER_ID,
      rank: 5,
      fullName: 'Você',
      avatarUrl: null,
      totalViews: 214_500,
      postsCount: 6,
      earnings: null,
    })
    entries.forEach((e, i) => { e.rank = i + 1 })
  }

  return entries
}

const MOCK_SUBMISSIONS: Record<string, CampaignSubmission[]> = {
  'camp-1': [
    { id: 'sub-1', campaignId: 'camp-1', userId: MOCK_CURRENT_USER_ID, platform: 'tiktok', url: 'https://tiktok.com/@voce/video/1', views: 82_400, detectedAt: '2026-07-15T18:30:00Z' },
    { id: 'sub-2', campaignId: 'camp-1', userId: MOCK_CURRENT_USER_ID, platform: 'instagram', url: 'https://instagram.com/reel/2', views: 61_200, detectedAt: '2026-07-16T14:10:00Z' },
    { id: 'sub-3', campaignId: 'camp-1', userId: MOCK_CURRENT_USER_ID, platform: 'kwai', url: 'https://kwai.com/@voce/video/3', views: 70_900, detectedAt: '2026-07-17T09:45:00Z' },
  ],
  'camp-4': [
    { id: 'sub-4', campaignId: 'camp-4', userId: MOCK_CURRENT_USER_ID, platform: 'youtube', url: 'https://youtube.com/shorts/4', views: 45_000, detectedAt: '2026-07-10T11:00:00Z' },
  ],
}

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), ms))
}

export interface CampaignFilters {
  category?: Campaign['category'] | 'all'
  contentType?: Campaign['contentType'] | 'all'
}

// TODO: substituir por SELECT em `campaigns` (join `agency_profiles`) via Supabase.
export async function fetchCampaigns(filters?: CampaignFilters): Promise<Campaign[]> {
  let result = MOCK_CAMPAIGNS
  if (filters?.category && filters.category !== 'all') {
    result = result.filter(c => c.category === filters.category)
  }
  if (filters?.contentType && filters.contentType !== 'all') {
    result = result.filter(c => c.contentType === filters.contentType)
  }
  return delay(result)
}

// TODO: substituir por SELECT em `campaigns` WHERE id = :id.
export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  return delay(MOCK_CAMPAIGNS.find(c => c.id === id) ?? null)
}

// TODO: substituir por SELECT em `campaign_participants` do usuário logado.
export async function fetchMyCampaigns(): Promise<MyCampaignSummary[]> {
  return delay(
    MOCK_CAMPAIGNS.filter(c => c.isParticipating).map(c => ({ id: c.id, title: c.title }))
  )
}

// TODO: substituir por SELECT em `campaign_leaderboard` (view materializada ou RPC).
export async function fetchLeaderboard(campaignId: string): Promise<LeaderboardEntry[]> {
  return delay(buildLeaderboard(campaignId))
}

// TODO: substituir por SELECT em `campaign_submissions` WHERE campaign_id = :id AND user_id = :user.
export async function fetchMySubmissions(campaignId: string): Promise<CampaignSubmission[]> {
  return delay(MOCK_SUBMISSIONS[campaignId] ?? [])
}

// TODO: substituir por SELECT em `campaign_leaderboard` + `campaign_submissions` (posts públicos) do participante.
export async function fetchParticipantProfile(
  campaignId: string,
  userId: string
): Promise<ParticipantProfile | null> {
  const entry = buildLeaderboard(campaignId).find(e => e.userId === userId)
  if (!entry) return delay(null)

  const platforms: PublicPost['platform'][] = ['tiktok', 'instagram', 'youtube', 'kwai']
  const avgViews = Math.round(entry.totalViews / entry.postsCount)
  const posts: PublicPost[] = Array.from({ length: entry.postsCount }).map((_, i) => ({
    id: `${userId}-post-${i + 1}`,
    platform: platforms[i % platforms.length],
    url: `https://example.com/posts/${userId}-${i + 1}`,
    views: Math.round(avgViews * (1 + (i % 3) * 0.08)),
    postedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }))

  return delay({ entry, posts })
}

// TODO: substituir por SELECT em `wallets` WHERE user_id = :user.
export async function fetchWalletBalance(): Promise<WalletBalance> {
  return delay({ available: 342.5, pending: 128 })
}

// TODO: substituir por SELECT em `payment_profiles` WHERE user_id = :user.
export async function fetchPaymentProfile(): Promise<PaymentProfile> {
  return delay({ configured: false, pixKey: null, cpf: null })
}

// TODO: substituir por SELECT em `campaign_earnings` WHERE user_id = :user, join campaigns.
export async function fetchEarningsHistory(): Promise<CampaignEarning[]> {
  return delay([
    { id: 'earn-1', campaignId: 'camp-1', campaignTitle: 'Lança Essa Clipe', amount: 187.4, status: 'pending', paidAt: null },
    { id: 'earn-2', campaignId: 'camp-4', campaignTitle: 'Corte o Podcast', amount: 500, status: 'paid', paidAt: '2026-07-05T10:00:00Z' },
  ])
}

// TODO: substituir por checagem real de `agency_profiles` do usuário logado.
export async function fetchHasAgencyProfile(): Promise<boolean> {
  return delay(false, 150)
}
