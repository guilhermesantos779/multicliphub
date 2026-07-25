export const COLORS = {
  black:  '#000000',
  surface: '#0a0a0a',
  card:   '#111111',
  purple: '#9146FF',
  mint:   '#00E5A0',
  gold:   '#FFD700',
  white:  '#FFFFFF',
  dim:    'rgba(255,255,255,0.55)',
  muted:  '#444444',
  border: 'rgba(255,255,255,0.08)',
} as const

export const FPS = 60

export const SCENES = {
  intro:      0,
  problem:    480,
  solution:   1080,
  metrics:    1680,
  ranking:    2520,
  comparison: 3120,
  social:     3900,
  cta:        4680,
  end:        5400,
} as const

export const CAPTIONS = {
  intro:      'O escritório digital do clipador profissional.',
  problem:    'Você ainda publica em 3 apps diferentes? Todo. Dia.',
  solution:   'Um upload. Três plataformas. Ao mesmo tempo.',
  metrics:    'Seus clipes. Seu alcance. Suas métricas — em um só lugar.',
  ranking:    'Compete. Sobe. Domina o algoritmo.',
  comparison: 'O que eles não têm. O que você precisa.',
  social:     'Enquanto você dorme. O algoritmo trabalha.',
  cta:        'Distribuir. Multiplicar. Escalar.',
} as const
