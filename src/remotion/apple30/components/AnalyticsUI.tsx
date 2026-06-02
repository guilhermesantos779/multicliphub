import React from 'react'
import { Img, staticFile } from 'remotion'
import { C } from '../constants'

interface AnalyticsUIProps {
  barsProgress: number
}

const BARS = [
  { label: 'TikTok',    pct: 65, color: '#FFFFFF', views: '847K' },
  { label: 'Instagram', pct: 38, color: '#E1306C', views: '312K' },
  { label: 'YouTube',   pct: 22, color: '#FF0000', views: '98K'  },
]

export function AnalyticsUI({ barsProgress }: AnalyticsUIProps) {
  return (
    <div style={{ display: 'flex', height: 420 }}>
      {/* Sidebar */}
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
        {[
          { icon: '⊞', label: 'Dashboard', active: false },
          { icon: '↑',  label: 'Upload',    active: false },
          { icon: '📊', label: 'Analytics', active: true  },
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

      {/* Analytics content */}
      <div style={{
        flex: 1, background: C.surface,
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: '"Sora"', fontSize: 15, fontWeight: 600, color: C.white }}>
            Analytics Unificado
          </span>
          <div style={{
            padding: '4px 12px', borderRadius: 99,
            background: 'rgba(145,70,255,0.10)',
            fontFamily: '"Sora"', fontSize: 10, color: C.purple,
          }}>Este mês</div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'VIEWS TOTAIS', value: '1,2M',   color: C.purple },
            { label: 'MÉDIA/VÍDEO',  value: '32K',    color: C.purple },
            { label: 'MELHOR',       value: 'TikTok', color: C.mint   },
          ].map(m => (
            <div key={m.label} style={{
              background: C.card, border: `0.5px solid ${C.border}`,
              borderRadius: 12, padding: '16px 14px',
            }}>
              <div style={{
                fontFamily: '"Sora"', fontSize: 8,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 10,
              }}>{m.label}</div>
              <div style={{
                fontFamily: '"Sora"', fontSize: 24, fontWeight: 800,
                color: m.color, letterSpacing: '-0.04em',
                textShadow: `0 0 20px ${m.color}60`,
              }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Platform bars */}
        <div style={{
          background: C.card, border: `0.5px solid ${C.border}`,
          borderRadius: 12, padding: '18px 20px', flex: 1,
        }}>
          <div style={{
            fontFamily: '"Sora"', fontSize: 12, fontWeight: 600,
            color: C.white, marginBottom: 18,
          }}>Distribuição por Plataforma</div>
          {BARS.map((bar, i) => (
            <div key={bar.label} style={{ marginBottom: i < 2 ? 16 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: '"Sora"', fontSize: 12, fontWeight: 500, color: C.white }}>
                  {bar.label}
                </span>
                <span style={{ fontFamily: '"Sora"', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  {bar.views} views
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${barsProgress * bar.pct}%`,
                  background: bar.color,
                  borderRadius: 99,
                  boxShadow: `0 0 6px ${bar.color}88`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
