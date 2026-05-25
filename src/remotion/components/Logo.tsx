import React, { useId } from 'react'

const FRONT_PATH = 'M 42 30 Q 42 28 44 28 Q 46 28 48 29.4 L 100 60 L 48 90.6 Q 46 92 44 92 Q 42 92 42 90 Z'
const MID_PATH   = 'M 32 30 Q 32 28 34 28 Q 36 28 38 29.4 L 74 56.6 Q 76 58 76 60 Q 76 62 74 63.4 L 38 90.6 Q 36 92 34 92 Q 32 92 32 90 Z'
const BACK_PATH  = 'M 22 30 Q 22 28 24 28 Q 26 28 28 29.4 L 64 56.6 Q 66 58 66 60 Q 66 62 64 63.4 L 28 90.6 Q 26 92 24 92 Q 22 92 22 90 Z'

interface RemotionLogoProps {
  variant?: 'full' | 'icon'
  height?: number
  style?: React.CSSProperties
}

export const RemotionLogo = ({ variant = 'full', height = 36, style }: RemotionLogoProps) => {
  // useId gera um ID único por instância do componente — evita colisão de
  // linearGradient IDs quando múltiplos Logos coexistem no DOM durante transições
  const uid = useId()
  const gradId = `mcGrad_${uid.replace(/:/g, '_')}`
  const markSize = variant === 'icon' ? height : Math.round(height * 0.95)

  const mark = (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3CFFB8" />
          <stop offset="100%" stopColor="#00B584" />
        </linearGradient>
      </defs>
      <path d={BACK_PATH}  fill="none" stroke="#00E5A0" strokeWidth="3" strokeLinejoin="round" opacity={0.35} />
      <path d={MID_PATH}   fill="none" stroke="#00E5A0" strokeWidth="3" strokeLinejoin="round" opacity={0.70} />
      <path d={FRONT_PATH} fill={`url(#${gradId})`} />
    </svg>
  )

  if (variant === 'icon') {
    return <div style={{ display: 'flex', ...style }}>{mark}</div>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(height * 0.28), height, ...style }}>
      {mark}
      <span
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: Math.round(height * 0.38),
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.18em',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontWeight: 700 }}>MultiClip</span>
        <span style={{ fontWeight: 300, opacity: 0.78 }}>Hub</span>
      </span>
    </div>
  )
}
