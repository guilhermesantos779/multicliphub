import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { APPLE, SNAPPY } from '../easing'
import { GlowOrb }     from '../components/GlowOrb'
import { NeonText }    from '../components/NeonText'
import { CaptionLine } from '../components/CaptionLine'

const PLATFORMS_CHECK = [
  { name: 'TikTok',    icon: '♪', color: '#ffffff', delay: 240 },
  { name: 'Instagram', icon: '◎', color: '#E1306C', delay: 270 },
  { name: 'YouTube',   icon: '▶', color: '#FF0000', delay: 300 },
]

const NAV_ITEMS = ['Dashboard', 'Upload', 'Analytics', 'Ranking']

export function Scene2Solution() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const lf    = frame

  const rotateY = ai(lf, [0, 220], [-35, 0], APPLE)
  const rotateX = ai(lf, [0, 220], [12, 0], APPLE)
  const scale   = ai(lf, [0, 220], [0.75, 1], SNAPPY)

  const titleOpacity = ai(lf, [0, 30], [0, 1])
  const glowPurple   = ai(lf, [0, 220], [0.05, 0.20])
  const glowMint     = ai(lf, [0, 220], [0.02, 0.10])

  return (
    <AbsoluteFill style={{
      background: COLORS.black,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 32,
      fontFamily: '"Inter", sans-serif',
    }}>
      <GlowOrb color={COLORS.purple} size={800} x="50%" y="50%" opacity={glowPurple} blur={160} />
      <GlowOrb color={COLORS.mint}   size={400} x="70%" y="40%" opacity={glowMint}   blur={100} />

      {/* Title */}
      <div style={{ opacity: titleOpacity, textAlign: 'center' }}>
        <NeonText size={56} color={COLORS.white} glowColor={COLORS.white} glowStrength={10}>
          Um upload.{' '}
        </NeonText>
        <NeonText size={56} color={COLORS.mint} glowColor={COLORS.mint} glowStrength={30}>
          Três plataformas.
        </NeonText>
      </div>

      {/* 3D Dashboard */}
      <div style={{
        perspective: 1400,
        transform: `perspective(1400px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}>
        <div style={{
          width:        900,
          background:   '#0d0d0d',
          borderRadius: 12,
          border:       '1px solid rgba(255,255,255,0.10)',
          boxShadow:    '0 40px 100px rgba(0,0,0,0.9)',
          overflow:     'hidden',
        }}>
          {/* Browser chrome */}
          <div style={{
            height:       42,
            background:   '#0d0d0d',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display:      'flex',
            alignItems:   'center',
            padding:      '0 14px',
            gap:          14,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['#FF5F57', '#FEBC2E', '#28C840'] as const).map((c, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, maxWidth: 320, height: 24, margin: '0 auto',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6,
            }}>
              <span style={{ fontSize: 10, color: COLORS.mint }}>🔒</span>
              <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                multicliphub.com/upload
              </span>
            </div>
          </div>

          {/* App layout */}
          <div style={{ height: 420, display: 'flex' }}>
            {/* Sidebar */}
            <div style={{
              width: 180, background: '#0a0a0a',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', padding: '12px 8px', gap: 4,
            }}>
              {NAV_ITEMS.map(item => {
                const active = item === 'Upload'
                return (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 10px', borderRadius: 6,
                    background: active ? 'rgba(145,70,255,0.10)' : 'transparent',
                    borderLeft: active ? '2px solid #9146FF' : '2px solid transparent',
                    fontSize: 12, color: active ? COLORS.white : '#555',
                    fontWeight: active ? 600 : 400,
                  }}>
                    {item}
                  </div>
                )
              })}
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>Upload & Publicar</div>

              {/* Drop zone */}
              <div style={{
                border: `2px dashed ${COLORS.purple}66`,
                borderRadius: 12, padding: '20px 24px',
                display: 'flex', flexDirection: 'column', gap: 4,
                background: 'rgba(145,70,255,0.04)',
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.white }}>
                  clip_golaço_final.mp4
                </span>
                <span style={{ fontSize: 11, color: '#666' }}>147 MB · pronto para publicar</span>
              </div>

              {/* Platform cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { name: 'TikTok',    color: '#ffffff' },
                  { name: 'Reels',     color: '#E1306C' },
                  { name: 'Shorts',    color: '#FF0000' },
                ].map(p => (
                  <div key={p.name} style={{
                    background: `${p.color}11`, border: `1px solid ${p.color}44`,
                    borderRadius: 8, padding: '10px 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 12, color: p.color, fontWeight: 600,
                  }}>
                    {p.name}
                    <span style={{ color: COLORS.mint, fontSize: 14 }}>✓</span>
                  </div>
                ))}
              </div>

              {/* Publish button */}
              <div style={{
                background: COLORS.purple, borderRadius: 10,
                padding: '12px 0', textAlign: 'center',
                fontSize: 14, fontWeight: 700, color: COLORS.white,
              }}>
                Publicar nas 3 Plataformas →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform checkmarks */}
      <div style={{ display: 'flex', gap: 24 }}>
        {PLATFORMS_CHECK.map(({ name, icon, color, delay }) => {
          const sp = spring({ frame: lf - delay, fps, config: { damping: 12, stiffness: 120 } })
          if (lf < delay) return null
          return (
            <div key={name} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              transform: `scale(${sp})`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: `${color}22`, border: `1px solid ${color}55`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color,
              }}>
                {icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.white }}>{name}</span>
              <span style={{ fontSize: 18, color: COLORS.mint }}>✓</span>
            </div>
          )
        })}
      </div>

      <CaptionLine text={CAPTIONS.solution} startFrame={60} endFrame={570} />
    </AbsoluteFill>
  )
}
