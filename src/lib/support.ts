// Shared support-ticket metadata (labels, colors). PT-BR user-facing labels.

export type TicketCategory = 'bug' | 'duvida' | 'pagamento' | 'sugestao'
export type TicketStatus =
  | 'aberto' | 'em_analise' | 'aguardando_usuario' | 'resolvido' | 'fechado'
export type TicketPriority = 'baixa' | 'normal' | 'alta' | 'urgente'

export const CATEGORY_META: Record<TicketCategory, { label: string; color: string }> = {
  bug:       { label: 'Bug',       color: '#ef4444' },
  duvida:    { label: 'Dúvida',    color: '#9146FF' },
  pagamento: { label: 'Pagamento', color: '#00E5A0' },
  sugestao:  { label: 'Sugestão',  color: '#f59e0b' },
}

export const STATUS_META: Record<TicketStatus, { label: string; color: string }> = {
  aberto:             { label: 'Aberto',             color: 'rgba(255,255,255,0.6)' },
  em_analise:         { label: 'Em análise',         color: '#9146FF' },
  aguardando_usuario: { label: 'Aguardando usuário', color: '#f59e0b' },
  resolvido:          { label: 'Resolvido',          color: '#00E5A0' },
  fechado:            { label: 'Fechado',            color: 'rgba(255,255,255,0.3)' },
}

export const PRIORITY_META: Record<TicketPriority, { label: string; color: string }> = {
  baixa:   { label: 'Baixa',   color: 'rgba(255,255,255,0.4)' },
  normal:  { label: 'Normal',  color: 'rgba(255,255,255,0.6)' },
  alta:    { label: 'Alta',    color: '#f59e0b' },
  urgente: { label: 'Urgente', color: '#ef4444' },
}

export const CATEGORY_OPTIONS: TicketCategory[] = ['bug', 'duvida', 'pagamento', 'sugestao']
export const STATUS_OPTIONS: TicketStatus[] = ['aberto', 'em_analise', 'aguardando_usuario', 'resolvido', 'fechado']
export const PRIORITY_OPTIONS: TicketPriority[] = ['baixa', 'normal', 'alta', 'urgente']

export const TICKET_ATTACH_BUCKET = 'ticket-attachments'
export const MAX_ATTACHMENTS = 3
export const MAX_ATTACH_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export const DISCORD_INVITE_URL = 'https://discord.gg/multicliphub'
