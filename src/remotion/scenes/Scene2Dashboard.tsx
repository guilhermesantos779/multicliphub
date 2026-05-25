import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import React from 'react'
import { AppChrome } from '../components/AppChrome'

const METRICS = [
  { label: 'Posts este mês', value: '47', sub: '200 posts/mês', color: '#00E5A0' },
  { label: 'Views Totais', value: '2.4M', sub: 'em todos os canais', color: '#38bdf8' },
  { label: 'Plataformas', value: '3', sub: 'Conectadas', color: '#4ade80' },
  { label: 'Sequência', value: '7 dias', sub: 'publicações diárias', color: '#fb923c' },
]

const POSTS = [
  { title: 'Como crescer 10k seguidores em 30 dias', status: 'Publicado', color: '#DEFF9A', bg: 'rgba(222,255,154,0.08)', platforms: ['TikTok', 'Reels'] },
  { title: 'Estratégia de conteúdo viral para 2025', status: 'Publicado', color: '#DEFF9A', bg: 'rgba(222,255,154,0.08)', platforms: ['YouTube', 'TikTok'] },
  { title: 'O segredo do algoritmo que ninguém conta', status: 'Agendado', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', platforms: ['Reels'] },
]

export const Scene2Dashboard = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Dashboard" title="Dashboard">
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Metrics grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {METRICS.map((m, i) => {
              const cardY = spring({
                frame: frame - i * 6,
                fps,
                config: { damping: 20, stiffness: 150 },
                from: 16,
                to: 0,
              })
              const cardOpacity = interpolate(frame, [i * 6, i * 6 + 18], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
              return (
                <div
                  key={m.label}
                  style={{
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '14px 16px',
                    transform: `translateY(${cardY}px)`,
                    opacity: cardOpacity,
                  }}
                >
                  <div style={{ fontSize: 10, color: '#555', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: m.color, marginBottom: 2 }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: '#444' }}>{m.sub}</div>
                </div>
              )
            })}
          </div>

          {/* Recent posts */}
          <div style={{
            background: '#111', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
            opacity: interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Vídeos Recentes</span>
              <span style={{ fontSize: 11, color: '#00E5A0' }}>Ver todos</span>
            </div>
            {POSTS.map((post, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px',
                borderBottom: i < POSTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, background: '#1a1a1a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}>🎬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: '#fff', marginBottom: 3 }}>{post.title}</div>
                  <div style={{ fontSize: 11, color: '#444', display: 'flex', gap: 6 }}>
                    {post.platforms.map(p => <span key={p}>{p}</span>)}
                  </div>
                </div>
                <span style={{
                  background: post.bg, color: post.color,
                  borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 500,
                }}>{post.status}</span>
              </div>
            ))}
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
