import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import React from 'react'
import { AppChrome } from '../components/AppChrome'

const RANKING = [
  { pos: 1, name: 'Gustavo Rocha', views: '2.4M', plan: 'Pro', color: '#DEFF9A', avatar: 'G' },
  { pos: 2, name: 'Mariana Costa', views: '1.8M', plan: 'King', color: '#FFD700', avatar: 'M' },
  { pos: 3, name: 'Rafael Souza', views: '1.2M', plan: 'Pro', color: '#DEFF9A', avatar: 'R' },
  { pos: 4, name: 'Camila Nunes', views: '890K', plan: 'Clipper', color: '#888', avatar: 'C' },
  { pos: 5, name: 'Pedro Alves', views: '650K', plan: 'Pro', color: '#DEFF9A', avatar: 'P' },
]

const MEDALS = ['🥇', '🥈', '🥉']

export const Scene6Ranking = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Ranking" title="Ranking Global">
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(222,255,154,0.08), rgba(0,229,160,0.04))',
            border: '1px solid rgba(222,255,154,0.15)',
            borderRadius: 14, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
            opacity: interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{ fontSize: 32 }}>🏆</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#DEFF9A' }}>Você está em #1 este mês!</div>
              <div style={{ fontSize: 11.5, color: '#666', marginTop: 3 }}>Continue publicando para manter a liderança</div>
            </div>
          </div>

          {/* Ranking list */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 13, fontWeight: 600, color: '#fff' }}>
              Top Creators — Maio 2025
            </div>
            {RANKING.map((user, i) => {
              const rowOpacity = interpolate(frame, [10 + i * 8, 28 + i * 8], [0, 1], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              const rowX = interpolate(frame, [10 + i * 8, 28 + i * 8], [20, 0], {
                extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
              })
              const isMe = i === 0

              return (
                <div
                  key={user.pos}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 18px',
                    borderBottom: i < RANKING.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isMe ? 'rgba(222,255,154,0.04)' : 'transparent',
                    opacity: rowOpacity,
                    transform: `translateX(${rowX}px)`,
                  }}
                >
                  <div style={{ width: 28, textAlign: 'center', fontSize: i < 3 ? 20 : 13, color: '#555', fontWeight: 600 }}>
                    {i < 3 ? MEDALS[i] : `#${user.pos}`}
                  </div>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${user.color}44, ${user.color}22)`,
                    border: `1px solid ${user.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff',
                    flexShrink: 0,
                  }}>{user.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: isMe ? 700 : 500, color: isMe ? '#DEFF9A' : '#fff' }}>
                      {user.name} {isMe && '(você)'}
                    </div>
                    <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>Plano {user.plan}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isMe ? '#DEFF9A' : '#fff' }}>{user.views}</div>
                    <div style={{ fontSize: 10, color: '#444' }}>views</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{
            background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.15)',
            borderRadius: 14, padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Escale para o próximo nível</div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>Plano King — publicações ilimitadas</div>
            </div>
            <div style={{
              background: '#00E5A0', borderRadius: 10, padding: '8px 18px',
              fontSize: 12.5, fontWeight: 700, color: '#0B0F19',
            }}>Upgrade</div>
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
