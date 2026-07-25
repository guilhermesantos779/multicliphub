import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from 'remotion'
import React from 'react'
import { AppChrome } from '../components/AppChrome'

const BAR_DATA = [
  { label: 'Seg', value: 0.45, platform: 'TikTok' },
  { label: 'Ter', value: 0.62, platform: 'Reels' },
  { label: 'Qua', value: 0.38, platform: 'TikTok' },
  { label: 'Qui', value: 0.81, platform: 'YouTube' },
  { label: 'Sex', value: 0.95, platform: 'TikTok' },
  { label: 'Sáb', value: 0.72, platform: 'Reels' },
  { label: 'Dom', value: 0.58, platform: 'YouTube' },
]

const STAT_CARDS = [
  { label: 'Views Totais', value: '2.4M', delta: '+34%', color: '#38bdf8' },
  { label: 'Engajamento', value: '8.7%', delta: '+12%', color: '#00E5A0' },
  { label: 'Novos Seguidores', value: '12.3K', delta: '+89%', color: '#a78bfa' },
]

export const Scene5Analytics = () => {
  const frame = useCurrentFrame()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const barProgress = interpolate(frame, [20, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const MAX_BAR_HEIGHT = 110

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Analytics" title="Analytics">
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {STAT_CARDS.map((s, i) => {
              const opacity = interpolate(frame, [i * 8, i * 8 + 18], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              return (
                <div key={s.label} style={{
                  background: '#111', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12, padding: '14px 16px', opacity,
                }}>
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#00E5A0' }}>{s.delta} esta semana</div>
                </div>
              )
            })}
          </div>

          {/* Bar chart */}
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px',
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 18 }}>Views por dia</div>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 12,
              height: MAX_BAR_HEIGHT + 24, paddingBottom: 24, position: 'relative',
            }}>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75, 1].map(g => (
                <div key={g} style={{
                  position: 'absolute',
                  left: 0, right: 0,
                  bottom: 24 + g * MAX_BAR_HEIGHT,
                  height: 1,
                  background: 'rgba(255,255,255,0.04)',
                }} />
              ))}

              {BAR_DATA.map((bar, i) => {
                const h = bar.value * MAX_BAR_HEIGHT * barProgress
                const isMax = bar.value === Math.max(...BAR_DATA.map(b => b.value))
                return (
                  <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
                    <div style={{
                      width: '100%', height: h,
                      background: isMax
                        ? 'linear-gradient(180deg, #3CFFB8 0%, #00B584 100%)'
                        : 'rgba(0,229,160,0.25)',
                      borderRadius: '4px 4px 2px 2px',
                      transition: 'height 0.1s',
                    }} />
                    <span style={{
                      position: 'absolute', bottom: -20,
                      fontSize: 10, color: '#555',
                    }}>{bar.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Plataforma breakdown */}
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 20px',
            display: 'flex', gap: 24,
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            {[
              { name: 'TikTok', pct: 54, color: '#00E5A0' },
              { name: 'Reels', pct: 28, color: '#E1306C' },
              { name: 'YouTube', pct: 18, color: '#FF0000' },
            ].map(p => (
              <div key={p.name} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11.5 }}>
                  <span style={{ color: '#888' }}>{p.name}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{p.pct}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: `${p.pct * barProgress}%`, height: '100%',
                    background: p.color, borderRadius: 99,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
