// Single source of truth for the onboarding checklist items.
// item_key values must match what we seed/upsert in onboarding_checklist.
import {
  User, Camera, Link as LinkIcon, Upload, BarChart3, Trophy, MessageCircle,
  type LucideIcon,
} from 'lucide-react'

export const DISCORD_URL = 'https://discord.gg/multicliphub'

export type ChecklistKey =
  | 'set_nickname'
  | 'upload_photo'
  | 'connect_channel'
  | 'first_upload'
  | 'explore_analytics'
  | 'check_ranking'
  | 'join_discord'

export interface ChecklistItemDef {
  key: ChecklistKey
  label: string
  description: string
  icon: LucideIcon
  href: string
  /** External links open in a new tab (Discord). */
  external?: boolean
}

export const CHECKLIST_ITEMS: ChecklistItemDef[] = [
  { key: 'set_nickname',      label: 'Definir nickname',
    description: 'Escolha como você será conhecido',
    icon: User,          href: '/perfil/editar' },
  { key: 'upload_photo',      label: 'Foto de perfil',
    description: 'Adicione uma foto ao seu perfil',
    icon: Camera,        href: '/perfil/editar' },
  { key: 'connect_channel',   label: 'Conectar canal',
    description: 'Conecte TikTok, Instagram ou YouTube',
    icon: LinkIcon,      href: '/canais' },
  { key: 'first_upload',      label: 'Primeiro upload',
    description: 'Publique seu primeiro clipe',
    icon: Upload,        href: '/upload' },
  { key: 'explore_analytics', label: 'Ver Analytics',
    description: 'Acompanhe o desempenho dos seus clipes',
    icon: BarChart3,     href: '/analytics' },
  { key: 'check_ranking',     label: 'Ver Ranking',
    description: 'Descubra sua posição no ranking',
    icon: Trophy,        href: '/ranking' },
  { key: 'join_discord',      label: 'Entrar no Discord',
    description: 'Junte-se à comunidade de clipadores',
    icon: MessageCircle, href: DISCORD_URL, external: true },
]

export const CHECKLIST_KEYS = CHECKLIST_ITEMS.map((i) => i.key)
export const CHECKLIST_TOTAL = CHECKLIST_ITEMS.length
