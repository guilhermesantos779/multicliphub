import React from 'react'
import { Img, staticFile, interpolate } from 'remotion'
import { C } from '../constants'

interface DashboardUIProps {
  metricsProgress: number
}

export function DashboardUI({ metricsProgress }: DashboardUIProps) {
  const views  = Math.floor(interpolate(metricsProgress, [0, 1], [0, 1247000]))
  const posts  = Math.floor(interpolate(metricsProgress, [0, 1], [0, 40]))
  const saved  = Math.floor(interpolate(metricsProgress, [0, 1], [0, 480]))
  const streak = Math.floor(interpolate(metricsProgress, [0, 1], [0, 7]))

  const formatViews = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + 'M'
    if (n >= 1000)    return (n / 1000).toFixed(0) + 'K'
    return String(n)
  }

  const METRICS = [
    { label: 'VIEWS TOTAIS', value: formatViews(views), color: C.purple },
    { label: 'POSTS',        value: String(posts),       color: C.purple },
    { label: 'TEMPO SALVO',  value: `${saved}m`,         color: C.mint   },
    { label: 'STREAK',       value: `${streak}d`,        color: '#f59e0b' },
  ]

  return (
    <div style={{ display: 'flex', height: 460 }}>
      {/* SIDEBAR */}
      <div style={{
        width: 200, flexShrink: 0,
        background: C.surface,
        borderRight: `0.5px solid ${C.border}`,
        padding: '18px 12px',
        display: 'flex', flexDirection: 'column', gap: 3,
      }}>
        <div style={{ padding: '4px 8px', marginBottom: 16 }}>
          <Img src={staticFile('logo.png')}
            style={{ height: 24, width: 'auto', objectFit: 'contain' }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          padding: '9px 10px', borderRadius: 10,
          background: C.card, border: `0.5px solid ${C.border}`,
          marginBottom: 10,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'rgba(145,70,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: C.purple,
            fontFamily: '"Sora", sans-serif',
          }}>G</div>
          <div>
            <div style={{ fontFamily: '"Sora"', fontSize: 11, fontWeight: 600, color: C.white }}>Guilherme</div>
            <div style={{ fontFamily: '"Sora"', fontSize: 9, color: C.mint, fontWeight: 500 }}>Plano King</div>
          </div>
        </div>
        {[
          { icon: '⊞', label: 'Dashboard', active: true  },
          { icon: '↑',  label: 'Upload',    active: false },
          { icon: '📊', label: 'Analytics', active: false },
          { icon: '🏆', label: 'Ranking',   active: false },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 7,
            background: item.active ? 'rgba(145,70,255,0.10)' : 'transparent',
            borderLeft: item.active ? `2px solid ${C.purple}` : '2px solid transparent',
            color: item.active ? C.white : 'rgba(255,255,255,0.30)',
            fontFamily: '"Sora"', fontSize: 11, fontWeight: item.active ? 600 : 400,
          }}>
            <span style={{ fontSize: 12 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1, background: C.surface,
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"Sora"', fontSize: 15, fontWeight: 600, color: C.white }}>Dashboard</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: C.card, border: `0.5px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, color: 'rgba(255,255,255,0.4)',
            }}>🔔</div>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(145,70,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Sora"', fontSize: 11, fontWeight: 700, color: C.purple,
            }}>G</div>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
          {METRICS.map(m => (
            <div key={m.label} style={{
              background: C.card, border: `0.5px solid ${C.border}`,
              borderRadius: 12, padding: '16px 14px',
            }}>
              <div style={{
                fontFamily: '"Sora"', fontSize: 8,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.10em',
                marginBottom: 10,
              }}>{m.label}</div>
              <div style={{
                fontFamily: '"Sora"', fontSize: 26, fontWeight: 800,
                color: m.color, letterSpacing: '-0.04em', lineHeight: 1,
                textShadow: `0 0 20px ${m.color}60`,
              }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Recent posts */}
        <div style={{
          background: C.card, border: `0.5px solid ${C.border}`,
          borderRadius: 12, overflow: 'hidden', flex: 1,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: `0.5px solid ${C.border}`,
          }}>
            <span style={{ fontFamily: '"Sora"', fontSize: 12, fontWeight: 600, color: C.white }}>
              Vídeos Recentes
            </span>
            <span style={{ fontFamily: '"Sora"', fontSize: 10, color: C.purple }}>Ver todos</span>
          </div>
          {[
            { title: 'clip_golaço_final.mp4',   views: '847K' },
            { title: 'highlights_round_32.mp4', views: '312K' },
            { title: 'melhor_jogada_semana.mp4', views: '98K' },
          ].map((post, i) => (
            <div key={post.title} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px',
              borderBottom: i < 2 ? `0.5px solid rgba(255,255,255,0.04)` : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'rgba(145,70,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: C.purple, fontSize: 14,
              }}>▶</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: '"Sora"', fontSize: 11, fontWeight: 500,
                  color: C.white, overflow: 'hidden', textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>{post.title}</div>
                <div style={{
                  fontFamily: '"Sora"', fontSize: 10,
                  color: 'rgba(255,255,255,0.35)', marginTop: 2,
                }}>{post.views} views</div>
              </div>
              <div style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(0,229,160,0.08)',
                fontFamily: '"Sora"', fontSize: 9, fontWeight: 600, color: C.mint,
              }}>Publicado</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
