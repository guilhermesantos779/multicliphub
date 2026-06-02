export const FPS = 30

export const SCENES = {
  atmosphere: 0,
  product:    90,
  metrics:    360,
  analytics:  600,
  brand:      780,
  end:        900,
} as const

export const C = {
  black:   '#000000',
  surface: '#0a0a0a',
  card:    '#111111',
  purple:  '#9146FF',
  mint:    '#00E5A0',
  white:   '#FFFFFF',
  dim:     'rgba(255,255,255,0.50)',
  subtle:  'rgba(255,255,255,0.12)',
  border:  'rgba(255,255,255,0.07)',
} as const

export const APPLE_EASE = [0.25, 0.46, 0.45, 0.94] as const
