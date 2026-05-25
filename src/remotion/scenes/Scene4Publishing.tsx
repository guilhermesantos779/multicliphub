import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import React from 'react'
import { AppChrome } from '../components/AppChrome'

const PLATFORMS = [
  { name: 'TikTok', delay: 0 },
  { name: 'Instagram Reels', delay: 18 },
  { name: 'YouTube Shorts', delay: 36 },
]

export const Scene4Publishing = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Upload" title="Publicando...">
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: 40, gap: 32, fontFamily: 'Inter, system-ui, sans-serif',
          height: '100%',
        }}>
          {/* Status do vídeo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Como crescer 10k seguidores em 30 dias
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>Publicando em simultâneo...</div>
          </div>

          {/* Cards de plataforma */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 380 }}>
            {PLATFORMS.map((p) => {
              const cardOpacity = interpolate(frame, [p.delay, p.delay + 15], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              const progressVal = interpolate(frame, [p.delay + 10, p.delay + 100], [0, 100], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              const done = progressVal >= 99

              const checkScale = spring({
                frame: frame - (p.delay + 100),
                fps,
                config: { damping: 14, stiffness: 200 },
                from: 0,
                to: done ? 1 : 0,
              })

              return (
                <div
                  key={p.name}
                  style={{
                    background: '#111', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '16px 20px',
                    opacity: cardOpacity,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{p.name}</span>
                    {done ? (
                      <span style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'rgba(0,229,160,0.15)', color: '#00E5A0',
                        transform: `scale(${checkScale})`, fontSize: 13,
                      }}>✓</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#00E5A0' }}>{Math.round(progressVal)}%</span>
                    )}
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      width: `${progressVal}%`, height: '100%',
                      background: done ? '#00E5A0' : 'linear-gradient(90deg, #00E5A0, #3CFFB8)',
                      borderRadius: 99,
                      transition: 'background 0.3s',
                    }} />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Sucesso */}
          {(() => {
            const successOpacity = interpolate(frame, [120, 140], [0, 1], {
              extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            })
            const successScale = spring({
              frame: frame - 118,
              fps,
              config: { damping: 16, stiffness: 120 },
              from: 0.88,
              to: 1,
            })
            return (
              <div style={{
                textAlign: 'center', opacity: successOpacity,
                transform: `scale(${successScale})`,
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                  Publicado com sucesso!
                </div>
                <div style={{ fontSize: 12, color: '#555' }}>3 plataformas · agora mesmo</div>
              </div>
            )
          })()}
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
