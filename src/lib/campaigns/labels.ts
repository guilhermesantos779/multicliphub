import type { CampaignCategory, CampaignContentType, CampaignModality } from '@/types/campaigns-clipper.types'

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  musica: 'Música',
  games: 'Games',
  entretenimento: 'Entretenimento',
  esportes: 'Esportes',
  educacao: 'Educação',
  estilo_de_vida: 'Estilo de vida',
  tecnologia: 'Tecnologia',
}

export const CONTENT_TYPE_LABELS: Record<CampaignContentType, string> = {
  clipping: 'Clipping',
  ugc: 'UGC',
}

export const MODALITY_LABELS: Record<CampaignModality, string> = {
  cpm: 'CPM',
  leaderboard: 'Leaderboard',
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDaysRemaining(endsAt: string): string {
  const diffMs = new Date(endsAt).getTime() - Date.now()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Encerrada'
  if (diffDays === 1) return '1 dia restante'
  return `${diffDays} dias restantes`
}
