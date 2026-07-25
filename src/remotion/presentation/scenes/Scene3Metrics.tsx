import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion'
import { interpolate } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { GlowOrb }      from '../components/GlowOrb'
import { CountUp }      from '../components/CountUp'
import { NeonText }     from '../components/NeonText'
import { ParticleField } from '../components/ParticleField'
import { CaptionLine }  from '../components/CaptionLine'

const METRIC_CARDS = [
  { label: 'VIEWS TOTAIS',        target: 1200000, suffix: '', color: COLORS.purple, delay: 0,  countStart: 40,  countDur: 120 },
  { label: 'POSTS PUBLICADOS',    target: 40,   suffix: '',  color: COLORS.mint,   delay: 15, countStart: 70,  countDur: 80  },
  { label: 'TEMPO ECONOMIZADO',   target: 480,  suffix: ' min', color: COLORS.mint, delay: 30, countStart: 100, countDur: 100 },
  { label: 'STREAK ATIVO',        target: 7,    suffix: ' dias', color: COLORS.gold, delay: 45, countStart: 130, countDur: 60  },
]

const BARS = [
  { label: 'TikTok',    pctEnd: 65, color: '#ffffff',  start: 200, end: 280 },
  { label: 'Instagram', pctEnd: 38, color: '#E1306C', start: 220, end: 300 },
  { label: 'YouTube',   pctEnd: 22, color: '#FF0000', start: 240, end: 320 },
]

export function Scene3Metrics() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const lf    = frame

  const bgGlow  = 0.1 + Math.sin(lf * 0.05) * 0.04
  const titleOp = ai(lf, [0, 30], [0, 1])

  return (
    <AbsoluteFill style={{
      background: COLORS.black,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 28,
      fontFamily: '"Inter", sans-serif',
    }}>
      <GlowOrb color={COLORS.purple} size={900} x="50%" y="50%" opacity={bgGlow} blur={200} />

      {/* Title */}
      <div style={{ opacity: titleOp, textAlign: 'center' }}>
        <NeonText size={52} color={COLORS.white} glowColor={COLORS.white} glowStrength={8}>
          Suas métricas. Em tempo real.
        </NeonText>
      </div>

      {/* 2x2 Metric grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 320px)', gap: 20 }}>
        {METRIC_CARDS.map(({ label, target, suffix, color, delay, countStart, countDur }, idx) => {
          const sp = spring({ frame: lf - delay, fps, config: { damping: 14, stiffness: 90 } })
          const cardY = interpolate(sp, [0, 1], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

          return (
            <div
              key={label}
              style={{
                background:   '#111111',
                border:       '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding:      24,
                transform:    `translateY(${cardY}px) scale(${sp})`,
                opacity:      sp,
              }}
            >
              <div style={{ fontSize: 9, color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                {label}
              </div>
              <CountUp
                target={target}
                suffix={suffix}
                startFrame={countStart}
                duration={countDur}
                style={{
                  fontFamily:  '"Sora", sans-serif',
                  fontSize:    52,
                  fontWeight:  700,
                  color,
                  textShadow:  `0 0 30px ${color}88`,
                  lineHeight:  1,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Particle bursts */}
      {lf >= 155 && <ParticleField count={20} startFrame={155} originX="25%" originY="45%" colors={[COLORS.purple, COLORS.mint]} />}
      {lf >= 165 && <ParticleField count={16} startFrame={165} originX="75%" originY="45%" colors={[COLORS.mint, COLORS.purple]} />}

      {/* Platform bars */}
      <div style={{
        background: '#111111', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12, padding: '20px 24px', width: 680,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.white }}>Distribuição por Plataforma</span>
          <span style={{ fontSize: 10, color: '#555' }}>Este mês</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BARS.map(({ label, pctEnd, color, start, end }) => {
            const pct = ai(lf, [start, end], [0, pctEnd])
            return (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
                  <span style={{ fontSize: 11, color: '#555' }}>{Math.floor(pct)}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <CaptionLine text={CAPTIONS.metrics} startFrame={60} endFrame={820} />
    </AbsoluteFill>
  )
}
