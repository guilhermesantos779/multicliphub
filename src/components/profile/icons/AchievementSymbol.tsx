// Proprietary achievement symbols (24x24 viewBox), drawn in a single color.
// Replaces Lucide glyphs inside the hexagonal badges. Keep geometry simple so
// they read clearly down to ~20px.
import type { ReactNode } from 'react'

const S: Record<string, (c: string) => ReactNode> = {
  eye: (c) => (
    <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
      <path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" />
      <circle cx="12" cy="12" r="3" fill={c} stroke="none" />
    </g>
  ),
  flame: (c) => (
    <path
      fill={c}
      d="M12 2 C8 7 6 9 6 13 a6 6 0 0 0 12 0 c0-3 -2-5 -3-7 -.5 2 -1.5 3 -2.5 3 C13 9 14 6 12 2 Z"
    />
  ),
  zap: (c) => <path fill={c} d="M13 2 L5 13 H11 L10 22 L19 10 H12.5 Z" />,
  crown: (c) => (
    <g fill={c}>
      <path d="M4 18 L6 7 L10 12 L12 5 L14 12 L18 7 L20 18 Z" />
      <rect x="4" y="18.5" width="16" height="2.6" rx="1" />
    </g>
  ),
  scissors: (c) => (
    <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round">
      <circle cx="6.5" cy="7" r="2.6" />
      <circle cx="6.5" cy="17" r="2.6" />
      <path d="M9 8.6 L20 18 M9 15.4 L20 6" />
    </g>
  ),
  target: (c) => (
    <g>
      <g fill="none" stroke={c} strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
      </g>
      <circle cx="12" cy="12" r="2" fill={c} />
    </g>
  ),
  cpu: (c) => (
    <g>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke={c} strokeWidth="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" fill={c} />
      <g stroke={c} strokeWidth="2" strokeLinecap="round">
        <path d="M9 3 V6 M15 3 V6 M9 18 V21 M15 18 V21 M3 9 H6 M3 15 H6 M18 9 H21 M18 15 H21" />
      </g>
    </g>
  ),
  star: (c) => (
    <path fill={c} d="M12 2 l2.9 6 6.5 .6 -4.9 4.3 1.5 6.4 -6-3.4 -6 3.4 1.5-6.4 -4.9-4.3 6.5-.6 z" />
  ),
  calendar: (c) => (
    <g>
      <rect x="3.5" y="5" width="17" height="16" rx="2" fill="none" stroke={c} strokeWidth="2" />
      <g stroke={c} strokeWidth="2" strokeLinecap="round">
        <path d="M3.5 9.5 H20.5 M8 3 V6 M16 3 V6" />
      </g>
    </g>
  ),
  trophy: (c) => (
    <g fill={c}>
      <path d="M7 4 H17 V8 C17 11 15 12.5 12 12.5 C9 12.5 7 11 7 8 Z" />
      <path d="M7 5 H4.6 C4.1 5 4 6 4.2 6.6 C4.7 8 6 8.7 7 8.8 Z" />
      <path d="M17 5 H19.4 C19.9 5 20 6 19.8 6.6 C19.3 8 18 8.7 17 8.8 Z" />
      <rect x="11" y="12.5" width="2" height="4" />
      <rect x="8" y="16.5" width="8" height="2.6" rx="1" />
    </g>
  ),
  'trending-up': (c) => (
    <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16 L9 10 L13 14 L21 6" />
      <path d="M15 6 H21 V12" />
    </g>
  ),
  medal: (c) => (
    <g>
      <g stroke={c} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M8 2 L10.5 8 M16 2 L13.5 8" />
      </g>
      <circle cx="12" cy="15" r="6" fill="none" stroke={c} strokeWidth="2" />
      <path fill={c} d="M12 11.7 l1 2.1 2.2 .2 -1.7 1.5 .5 2.2 -2-1.1 -2 1.1 .5-2.2 -1.7-1.5 2.2-.2 z" />
    </g>
  ),
  link: (c) => (
    <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round">
      <path d="M9.5 14.5 a3.5 3.5 0 0 1 0-5 L12 7 a3.5 3.5 0 0 1 5 5 L15.7 13.3" />
      <path d="M14.5 9.5 a3.5 3.5 0 0 1 0 5 L12 17 a3.5 3.5 0 0 1 -5-5 L8.3 10.7" />
    </g>
  ),
  rocket: (c) => (
    <g fill={c}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2 C16 5 17 10 16 14 H8 C7 10 8 5 12 2 Z M12 7.2 a1.8 1.8 0 1 0 0.01 0 z"
      />
      <path d="M8 14 L5 17.5 L8 17.5 Z M16 14 L19 17.5 L16 17.5 Z" />
      <path d="M10.4 16 H13.6 L12 21 Z" />
    </g>
  ),
  gem: (c) => (
    <g>
      <path fill={c} d="M6 3 H18 L22 9 L12 22 L2 9 Z" />
      <g stroke="#000" strokeOpacity="0.22" strokeWidth="1" fill="none" strokeLinejoin="round">
        <path d="M2 9 H22 M9 3 L8 9 L12 22 M15 3 L16 9 L12 22" />
      </g>
    </g>
  ),
}

interface AchievementSymbolProps {
  name: string
  color: string
  size?: number
  className?: string
}

export function AchievementSymbol({ name, color, size = 24, className }: AchievementSymbolProps) {
  const render = S[name] ?? S.star!
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      {render(color)}
    </svg>
  )
}
