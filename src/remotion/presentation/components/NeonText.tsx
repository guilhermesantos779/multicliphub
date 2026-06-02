import React from 'react'

interface NeonTextProps {
  children: React.ReactNode
  size?: number
  color?: string
  glowColor?: string
  glowStrength?: number
  weight?: number
  style?: React.CSSProperties
}

export function NeonText({
  children,
  size = 80,
  color = '#FFFFFF',
  glowColor = '#9146FF',
  glowStrength = 40,
  weight = 700,
  style,
}: NeonTextProps) {
  const s = glowStrength
  return (
    <span
      style={{
        fontFamily:  '"Sora", sans-serif',
        fontSize:    size,
        fontWeight:  weight,
        color,
        textShadow: [
          `0 0 ${s * 0.4}px ${glowColor}`,
          `0 0 ${s}px ${glowColor}`,
          `0 0 ${s * 2}px ${glowColor}88`,
          `0 0 ${s * 4}px ${glowColor}44`,
        ].join(', '),
        lineHeight:  1.1,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
