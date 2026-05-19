/**
 * MultiClip Hub — STACK brand mark
 * Three play-button triangles offset diagonally on a 120×120 grid.
 * Back two layers = obsidian ghost outlines (22% / 45% opacity).
 * Front layer = solid Electric Mint gradient.
 * On dark backgrounds use variant="mint" (ghosts in mint tone).
 */

interface LogoMarkProps {
  /** px size of the square mark */
  size?: number
  /** 'color' = standard (obsidian ghosts + mint front) | 'mint' = all-mint (for dark bg) | 'solid' = front only (favicon) */
  variant?: 'color' | 'mint' | 'solid' | 'mono'
  className?: string
}

interface LogoProps {
  /** Total height of the horizontal lockup */
  height?: number
  variant?: 'color' | 'mint' | 'mono'
  /** text color override */
  textColor?: string
  className?: string
}

/** Reusable SVG defs — gradients shared across all mark variants */
function Defs() {
  return (
    <defs>
      <linearGradient id="mcMintGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3CFFB8" />
        <stop offset="100%" stopColor="#00B584" />
      </linearGradient>
    </defs>
  )
}

/** The front solid play-triangle path (120×120 viewBox) */
const FRONT_PATH = 'M 42 30 Q 42 28 44 28 Q 46 28 48 29.4 L 100 60 L 48 90.6 Q 46 92 44 92 Q 42 92 42 90 Z'
const MID_PATH   = 'M 32 30 Q 32 28 34 28 Q 36 28 38 29.4 L 74 56.6 Q 76 58 76 60 Q 76 62 74 63.4 L 38 90.6 Q 36 92 34 92 Q 32 92 32 90 Z'
const BACK_PATH  = 'M 22 30 Q 22 28 24 28 Q 26 28 28 29.4 L 64 56.6 Q 66 58 66 60 Q 66 62 64 63.4 L 28 90.6 Q 26 92 24 92 Q 22 92 22 90 Z'
/** Solid-only variant (favicon ≤16px) */
const SOLID_PATH = 'M 28 28 Q 28 26 30 26 Q 32 26 34 27.4 L 102 60 L 34 92.6 Q 32 94 30 94 Q 28 94 28 92 Z'

export function LogoMark({ size = 32, variant = 'mint', className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MultiClip Hub"
      className={className}
    >
      <Defs />

      {variant === 'solid' && (
        <path d={SOLID_PATH} fill="url(#mcMintGrad)" />
      )}

      {variant === 'color' && (
        <>
          <path d={BACK_PATH} fill="none" stroke="#0B0F19" strokeWidth="3" strokeLinejoin="round" opacity="0.22" />
          <path d={MID_PATH}  fill="none" stroke="#0B0F19" strokeWidth="3" strokeLinejoin="round" opacity="0.45" />
          <path d={FRONT_PATH} fill="url(#mcMintGrad)" />
        </>
      )}

      {variant === 'mint' && (
        <>
          <path d={BACK_PATH} fill="none" stroke="#00E5A0" strokeWidth="3" strokeLinejoin="round" opacity="0.35" />
          <path d={MID_PATH}  fill="none" stroke="#00E5A0" strokeWidth="3" strokeLinejoin="round" opacity="0.70" />
          <path d={FRONT_PATH} fill="url(#mcMintGrad)" />
        </>
      )}

      {variant === 'mono' && (
        <>
          <path d={BACK_PATH} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" opacity="0.30" />
          <path d={MID_PATH}  fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" opacity="0.55" />
          <path d={FRONT_PATH} fill="currentColor" />
        </>
      )}
    </svg>
  )
}

/** Full horizontal lockup: mark + "MultiClip Hub" wordmark */
export function Logo({ height = 36, variant = 'mint', textColor, className }: LogoProps) {
  const wordColor = textColor ?? (variant === 'color' ? '#0B0F19' : '#FFFFFF')
  const hubOpacity = variant === 'color' ? 1 : 0.78

  return (
    <div className={`flex items-center gap-2.5 ${className ?? ''}`} style={{ height }}>
      <LogoMark size={height} variant={variant} />
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: height * 0.38,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: wordColor,
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.18em',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 700 }}>MultiClip</span>
        <span style={{ fontWeight: 300, opacity: hubOpacity }}>Hub</span>
      </span>
    </div>
  )
}

/** Compact sidebar variant — mark only with small text below */
export function LogoSidebar() {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={28} variant="mint" />
      <span
        style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, letterSpacing: '-0.02em' }}
        className="text-white whitespace-nowrap"
      >
        <span style={{ fontWeight: 700 }}>MultiClip</span>
        {' '}
        <span style={{ fontWeight: 300, opacity: 0.78 }}>Hub</span>
      </span>
    </div>
  )
}
