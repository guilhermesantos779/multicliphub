// src/lib/design-tokens.ts
// Single source of truth for design decisions, mirrored by the CSS @theme
// tokens in globals.css. Use the Tailwind utilities (bg-mint, text-purple,
// bg-obsidiana, text-gold, shadow-glow-mint…) in markup; reach for these JS
// constants only for inline styles, canvas, charts, or motion configs.

export const colors = {
  // Base
  obsidiana:    '#0B0F19',  // primary background
  obsidianaLow: '#080C14',  // deeper sections
  surface:      '#111827',  // card backgrounds
  surfaceHigh:  '#1a2035',  // elevated surfaces

  // Mint (primary action / success / Clipper tier)
  mint:         '#00E5A0',
  mintBright:   '#3CFFB8',
  mintDark:     '#00B584',
  mintFaint:    'rgba(0,229,160,0.08)',
  mintSubtle:   'rgba(0,229,160,0.15)',

  // Purple (CTA / Pro tier / brand accent)
  purple:       '#9146FF',
  purpleBright: '#A569FF',
  purpleDark:   '#7B2FE0',
  purpleFaint:  'rgba(145,70,255,0.08)',
  purpleSubtle: 'rgba(145,70,255,0.15)',

  // Tiers
  gold:         '#FFD700',
  goldDark:     '#B8860B',
  silver:       '#C0C0C0',
  bronze:       '#CD7F32',
  diamond:      '#00E5FF',

  // Text scale
  text:         'rgba(255,255,255,0.90)',
  textMid:      'rgba(255,255,255,0.60)',
  textLow:      'rgba(255,255,255,0.40)',
  textFaint:    'rgba(255,255,255,0.20)',

  // Borders
  border:       'rgba(255,255,255,0.08)',
  borderMid:    'rgba(255,255,255,0.12)',
  borderHigh:   'rgba(255,255,255,0.20)',

  // Semantic
  success:      '#00E5A0',
  error:        '#ED4245',
  warning:      '#F59E0B',
  info:         '#9146FF',
} as const

export const typography = {
  // Font family — Manrope is loaded in app/layout.tsx as --font-manrope.
  fontDisplay: "var(--font-manrope), sans-serif",
  fontBody:    "var(--font-manrope), sans-serif",

  // Size scale (rem)
  xs:   '0.75rem',   // 12px — labels, captions, badges
  sm:   '0.875rem',  // 14px — body small, secondary text
  base: '1rem',      // 16px — body default
  lg:   '1.125rem',  // 18px — emphasized body
  xl:   '1.25rem',   // 20px — small headings
  '2xl':'1.5rem',    // 24px — section headings
  '3xl':'1.875rem',  // 30px — page headings
  '4xl':'2.25rem',   // 36px — hero sub
  '5xl':'3rem',      // 48px — hero
  '6xl':'3.75rem',   // 60px — display
  '7xl':'4.5rem',    // 72px — display large

  // Weight scale
  light:     '300',
  regular:   '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
  black:     '900',

  // Tracking (letter-spacing)
  tightest: '-0.04em',
  tighter:  '-0.02em',
  tight:    '-0.01em',
  normal:   '0em',
  wide:     '0.05em',
  widest:   '0.1em',

  // Leading (line-height)
  none:    '1',
  tighter2:'1.1',
  tight2:  '1.2',
  snug:    '1.375',
  normal2: '1.5',
  relaxed: '1.625',
} as const

export const spacing = {
  // Base unit: 4px — all spacing should be a multiple of 4.
  px:   '1px',
  0.5:  '2px',
  1:    '4px',
  2:    '8px',
  3:    '12px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  8:    '32px',
  10:   '40px',
  12:   '48px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
} as const

export const radius = {
  sm:   '6px',
  md:   '10px',
  lg:   '14px',
  xl:   '18px',
  '2xl':'24px',
  full: '9999px',
} as const

export const shadows = {
  sm:  '0 1px 3px rgba(0,0,0,0.4)',
  md:  '0 4px 12px rgba(0,0,0,0.4)',
  lg:  '0 8px 32px rgba(0,0,0,0.5)',
  xl:  '0 16px 48px rgba(0,0,0,0.6)',
  glow: {
    mint:   '0 0 20px rgba(0,229,160,0.3)',
    purple: '0 0 20px rgba(145,70,255,0.3)',
    gold:   '0 0 20px rgba(255,215,0,0.3)',
  },
} as const

export const zIndex = {
  base:    0,
  raised:  10,
  dropdown:20,
  sticky:  30,
  overlay: 40,
  modal:   50,
  toast:   60,
} as const
