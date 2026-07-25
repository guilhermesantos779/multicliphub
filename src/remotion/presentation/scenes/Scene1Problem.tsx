import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { SNAPPY, DRAMATIC } from '../easing'
import { NeonText }   from '../components/NeonText'
import { CaptionLine } from '../components/CaptionLine'

const PLATFORMS = [
  { name: 'TikTok',    color: '#ffffff', icon: '♪', delay: 30 },
  { name: 'Instagram', color: '#E1306C', icon: '◎', delay: 60 },
  { name: 'YouTube',   color: '#FF0000', icon: '▶', delay: 90 },
]

export function Scene1Problem() {
  const frame = useCurrentFrame()
  const lf    = frame

  const titleOpacity = ai(lf, [0, 40], [0, 1])
  const titleY       = ai(lf, [0, 40], [-40, 0], SNAPPY)

  const wastedValue  = Math.floor(ai(lf, [80, 260], [0, 47], DRAMATIC))
  const wastedOpacity = ai(lf, [100, 140], [0, 1])
  const pulsScale    = 1 + Math.sin(lf * 0.15) * 0.02

  const rotation     = ai(lf, [0, 600], [0, 1440])

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 60%, rgba(239,68,68,0.04) 0%, #000000 70%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
      fontFamily: '"Inter", sans-serif',
    }}>

      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: 'center' }}>
        <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 64, fontWeight: 700, color: COLORS.white }}>
          O problema é{' '}
        </span>
        <NeonText size={64} color="#ef4444" glowColor="#ef4444" glowStrength={30}>
          real
        </NeonText>
      </div>

      {/* Three app boxes */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'center' }}>
        {PLATFORMS.map(({ name, color, icon, delay }) => {
          const pf      = lf - delay
          const opacity = ai(pf, [0, 20], [0, 1])
          const scale   = ai(pf, [0, 25], [0.85, 1], SNAPPY)

          return (
            <div
              key={name}
              style={{
                background:   '#111111',
                border:       `1px solid ${color}44`,
                borderRadius: 20,
                padding:      '32px 28px',
                display:      'flex',
                flexDirection:'column',
                alignItems:   'center',
                gap:          16,
                width:        240,
                opacity,
                transform:    `scale(${scale})`,
              }}
            >
              {/* Icon circle */}
              <div style={{
                width:        56,
                height:       56,
                borderRadius: 16,
                background:   `${color}22`,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     24,
                color,
              }}>
                {icon}
              </div>

              {/* Platform name */}
              <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.white }}>{name}</span>

              {/* Spinning ring */}
              <div style={{
                width:        40,
                height:       40,
                border:       `2px solid ${color}33`,
                borderTop:    `2px solid ${color}`,
                borderRadius: '50%',
                transform:    `rotate(${rotation}deg)`,
              }} />

              <span style={{ fontSize: 13, color: COLORS.muted }}>Fazendo upload...</span>
              <div style={{
                background:   'rgba(239,68,68,0.10)',
                border:       '1px solid rgba(239,68,68,0.25)',
                borderRadius: 6,
                padding:      '3px 10px',
                fontSize:     11,
                color:        '#ef4444',
              }}>
                Passo {PLATFORMS.indexOf(PLATFORMS.find(p => p.name === name)!) + 1} de 3 ×
              </div>
            </div>
          )
        })}
      </div>

      {/* Wasted time counter */}
      <div style={{
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        opacity:   wastedOpacity,
        transform: `scale(${pulsScale})`,
      }}>
        <div style={{
          fontFamily:  '"Sora", sans-serif',
          fontSize:    96,
          fontWeight:  800,
          color:       '#ef4444',
          textShadow:  '0 0 60px rgba(239,68,68,0.5)',
          lineHeight:  1,
        }}>
          {wastedValue}
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.4)', fontFamily: '"Inter", sans-serif' }}>
          min desperdiçados por dia
        </div>
      </div>

      <CaptionLine text={CAPTIONS.problem} startFrame={80} endFrame={570} />
    </AbsoluteFill>
  )
}
