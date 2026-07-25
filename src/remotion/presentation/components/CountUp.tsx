import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { ELASTIC } from '../easing'

interface CountUpProps {
  target: number
  suffix?: string
  prefix?: string
  startFrame?: number
  duration?: number
  style?: React.CSSProperties
}

function formatPTBR(value: number, target: number): string {
  if (target >= 1000000) {
    return (value / 1000000).toFixed(1).replace('.', ',') + 'M'
  }
  if (target >= 1000) {
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'K'
    }
    return value.toString()
  }
  return value.toLocaleString('pt-BR')
}

export function CountUp({
  target,
  suffix = '',
  prefix = '',
  startFrame = 0,
  duration = 90,
  style,
}: CountUpProps) {
  const frame = useCurrentFrame()
  const lf    = frame - startFrame

  const progress = interpolate(lf, [0, duration], [0, 1], {
    easing:           ELASTIC,
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })

  const current = Math.floor(progress * target)
  const display = formatPTBR(current, target)

  return (
    <span style={style}>
      {prefix}{display}{suffix}
    </span>
  )
}
