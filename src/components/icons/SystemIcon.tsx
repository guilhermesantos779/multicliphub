'use client'

import type { CSSProperties, ReactNode } from 'react'

export type SystemIconName =
  | 'dashboard' | 'upload' | 'analytics' | 'ranking' | 'perfil'
  | 'canais' | 'historico' | 'config' | 'notificacoes' | 'admin' | 'suporte'

interface SystemIconProps {
  name: SystemIconName
  active?: boolean
  size?: number
  className?: string
}

// Proprietary gaming-style nav glyphs. Bold filled shapes; on active they take
// the shared purple→mint gradient (url(#mchGradient)) plus a neon glow.
const ICONS: Record<SystemIconName, (paint: string) => ReactNode> = {
  dashboard: (p) => (
    <g fill={p}>
      <rect x="3" y="3" width="8" height="8" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
      <rect x="3" y="13" width="8" height="8" rx="2" />
    </g>
  ),
  upload: (p) => (
    <g fill={p}>
      <path d="M12 2.5 L18 9 H14 V14 H10 V9 H6 Z" />
      <rect x="4" y="18" width="16" height="3.2" rx="1.5" />
    </g>
  ),
  analytics: (p) => (
    <g fill={p}>
      <rect x="3" y="13" width="4.2" height="8" rx="1.4" />
      <rect x="9.9" y="8.5" width="4.2" height="12.5" rx="1.4" />
      <rect x="16.8" y="4" width="4.2" height="17" rx="1.4" />
    </g>
  ),
  ranking: (p) => (
    <g fill={p}>
      <path d="M6 4 H18 V7.5 C18 11.5 15.3 13.6 12 13.6 C8.7 13.6 6 11.5 6 7.5 Z" />
      <path d="M5.8 4.6 H4.4 C3.9 4.6 3.6 5 3.6 5.5 C3.6 6.8 4.6 8 5.8 8.3 Z" />
      <path d="M18.2 4.6 H19.6 C20.1 4.6 20.4 5 20.4 5.5 C20.4 6.8 19.4 8 18.2 8.3 Z" />
      <rect x="11" y="13" width="2" height="4" />
      <rect x="7.5" y="17" width="9" height="2.8" rx="1" />
    </g>
  ),
  perfil: (p) => (
    <g fill={p}>
      <circle cx="12" cy="8" r="4.2" />
      <path d="M4 20.6 C4 16.4 7.6 14 12 14 C16.4 14 20 16.4 20 20.6 Z" />
    </g>
  ),
  canais: (p) => (
    <g>
      <path
        d="M6 7 L12 17 M18 7 L12 17 M6 7 H18"
        stroke={p}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="6" cy="7" r="3" fill={p} />
      <circle cx="18" cy="7" r="3" fill={p} />
      <circle cx="12" cy="17" r="3" fill={p} />
    </g>
  ),
  historico: (p) => (
    <g fill="none" stroke={p} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9 A8 8 0 1 1 4.3 13.2" />
      <path d="M3 5.5 L5 9 L8.5 7.6" />
      <path d="M12 8.2 V12 L15 13.8" />
    </g>
  ),
  config: (p) => (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={p}
      d="M13.4 2 h-2.8 l-.45 2.55 a7.4 7.4 0 0 0 -1.75 1.01 l-2.45-.92 -1.4 2.42 2 1.65 a7.4 7.4 0 0 0 0 2.02 l-2 1.65 1.4 2.42 2.45-.92 a7.4 7.4 0 0 0 1.75 1.01 l.45 2.55 h2.8 l.45-2.55 a7.4 7.4 0 0 0 1.75-1.01 l2.45.92 1.4-2.42 -2-1.65 a7.4 7.4 0 0 0 0-2.02 l2-1.65 -1.4-2.42 -2.45.92 a7.4 7.4 0 0 0 -1.75-1.01 z M12 9 a3 3 0 1 0 0.01 0 z"
    />
  ),
  notificacoes: (p) => (
    <g fill={p}>
      <path d="M12 2.4 a2 2 0 0 1 2 2 v.35 a6 6 0 0 1 4 5.65 v3.3 l1.75 2.7 a1 1 0 0 1 -.84 1.55 H5.09 a1 1 0 0 1 -.84-1.55 L6 13.7 V10.4 a6 6 0 0 1 4-5.65 v-.35 a2 2 0 0 1 2-2 z" />
      <path d="M9.4 19.6 h5.2 a2.6 2.6 0 0 1 -5.2 0 z" />
    </g>
  ),
  admin: (p) => (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill={p}
      d="M12 2 L20 5 V11 C20 16.2 16.4 20.2 12 22 C7.6 20.2 4 16.2 4 11 V5 Z M12 7.2 l1.32 2.68 2.96 .43 -2.14 2.09 .5 2.95 -2.64-1.39 -2.64 1.39 .5-2.95 -2.14-2.09 2.96-.43 z"
    />
  ),
  suporte: (p) => (
    <g>
      <g fill="none" stroke={p} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3.6" />
      </g>
      <g stroke={p} strokeWidth="2" strokeLinecap="round">
        <path d="M5.6 5.6 L9.4 9.4 M18.4 5.6 L14.6 9.4 M5.6 18.4 L9.4 14.6 M18.4 18.4 L14.6 14.6" />
      </g>
    </g>
  ),
}

export function SystemIcon({ name, active = false, size = 24, className }: SystemIconProps) {
  const paint = active ? 'url(#mchGradient)' : 'rgba(255,255,255,0.4)'
  const style: CSSProperties = active
    ? { filter: 'drop-shadow(0 0 3px rgba(145,70,255,0.7))' }
    : {}

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {ICONS[name](paint)}
    </svg>
  )
}
