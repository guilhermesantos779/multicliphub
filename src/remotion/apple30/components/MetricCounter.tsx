import React from 'react'
import { C } from '../constants'

interface MetricCounterProps {
  value: string
  label: string
  color?: string
}

export function MetricCounter({ value, label, color = C.purple }: MetricCounterProps) {
  return (
    <div style={{
      background: C.card, border: `0.5px solid ${C.border}`,
      borderRadius: 12, padding: '16px 14px',
    }}>
      <div style={{
        fontFamily: '"Sora"', fontSize: 8,
        color: 'rgba(255,255,255,0.35)',
        textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 10,
      }}>{label}</div>
      <div style={{
        fontFamily: '"Sora"', fontSize: 26, fontWeight: 800,
        color, letterSpacing: '-0.04em', lineHeight: 1,
        textShadow: `0 0 20px ${color}60`,
      }}>{value}</div>
    </div>
  )
}
