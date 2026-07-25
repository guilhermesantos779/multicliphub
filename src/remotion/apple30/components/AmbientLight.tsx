import React from 'react'
import { useCurrentFrame } from 'remotion'

interface AmbientLightProps {
  color: string
  size?: number
  x?: string
  y?: string
  baseOpacity?: number
  pulseAmplitude?: number
  pulseSpeed?: number
}

export function AmbientLight({
  color,
  size = 900,
  x = '50%',
  y = '50%',
  baseOpacity = 0.12,
  pulseAmplitude = 0.04,
  pulseSpeed = 180,
}: AmbientLightProps) {
  const frame = useCurrentFrame()

  const breathe = Math.sin((frame / pulseSpeed) * Math.PI * 2)
  const opacity = baseOpacity + breathe * pulseAmplitude
  const scaleVal = 1 + breathe * 0.015

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        filter: `blur(${size * 0.18}px)`,
        opacity,
        transform: `translate(-50%, -50%) scale(${scaleVal})`,
        pointerEvents: 'none',
      }}
    />
  )
}
