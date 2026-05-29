const SUMMARY = [
  { label: 'VIEWS TOTAIS', value: '1.2M',   color: '#9146FF' },
  { label: 'MÉDIA/VÍDEO',  value: '32K',    color: '#9146FF' },
  { label: 'MELHOR',       value: 'TikTok', color: '#00E5A0' },
]

const BARS = [
  { label: 'TikTok',    views: '847K', pct: 65, color: '#FFFFFF' },
  { label: 'Instagram', views: '312K', pct: 38, color: '#E1306C' },
  { label: 'YouTube',   views: '98K',  pct: 22, color: '#FF0000' },
]

// Heatmap cells — mock heat data (0=cold, 3=hot)
const HEAT = [3,1,2,0,3,2,1,3,2,0,1,3,2,1,0,3,2,1,3,0,2]

export function AnalyticsScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#050505' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>Analytics Unificado</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#888888' }}>🔔</span>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #9146FF, #00E5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>G</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, flexShrink: 0 }}>
          {SUMMARY.map(m => (
            <div key={m.label} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 7, color: '#888888', letterSpacing: '0.06em', marginBottom: 5, textTransform: 'uppercase' as const }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Platform distribution */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#FAFAFA', marginBottom: 12 }}>Distribuição por Plataforma</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {BARS.map(bar => (
              <div key={bar.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, color: '#888888' }}>{bar.label}</span>
                  <span style={{ fontSize: 9, color: '#555', fontWeight: 500 }}>{bar.views} views</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap teaser */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#FAFAFA' }}>Melhores Horários</span>
            <span style={{ fontSize: 8, background: 'rgba(145,70,255,0.15)', color: '#9146FF', padding: '2px 7px', borderRadius: 4, fontWeight: 600 }}>Pro+</span>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {HEAT.map((v, i) => (
              <div
                key={i}
                style={{
                  width: 18, height: 18, borderRadius: 3,
                  background: v === 0 ? 'rgba(255,255,255,0.04)'
                    : v === 1 ? 'rgba(145,70,255,0.20)'
                    : v === 2 ? 'rgba(145,70,255,0.45)'
                    : 'rgba(145,70,255,0.80)',
                  filter: i > 10 ? 'blur(2px)' : 'none',
                  opacity: i > 10 ? 0.4 : 1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
