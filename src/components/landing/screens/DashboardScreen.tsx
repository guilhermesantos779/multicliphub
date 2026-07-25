const METRICS = [
  { label: 'POSTS',       value: '40',   color: '#9146FF' },
  { label: 'VIEWS',       value: '1.2M', color: '#9146FF' },
  { label: 'TEMPO SALVO', value: '480m', color: '#00E5A0' },
  { label: 'STREAK',      value: '7d',   color: '#f59e0b' },
]

const BARS = [
  { label: 'TikTok',    pct: 65, color: '#FFFFFF' },
  { label: 'Instagram', pct: 38, color: '#E1306C' },
  { label: 'YouTube',   pct: 22, color: '#FF0000' },
]

const POSTS = [
  { title: 'clip_golaço_final.mp4',    views: '847K' },
  { title: 'highlights_round_32.mp4',  views: '312K' },
  { title: 'melhor_jogada_semana.mp4', views: '98K'  },
]

export function DashboardScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#050505' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>Dashboard</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#888888' }}>🔔</span>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #9146FF, #00E5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>G</div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, flexShrink: 0 }}>
          {METRICS.map(m => (
            <div key={m.label} style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '9px 11px' }}>
              <div style={{ fontSize: 7, color: '#888888', letterSpacing: '0.06em', marginBottom: 5, textTransform: 'uppercase' as const }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>

          {/* Platform bars */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FAFAFA' }}>Distribuição por Plataforma</span>
              <span style={{ fontSize: 9, color: '#888888' }}>Este mês</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {BARS.map(bar => (
                <div key={bar.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: '#888888' }}>{bar.label}</span>
                    <span style={{ fontSize: 9, color: '#888888' }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent posts */}
          <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FAFAFA' }}>Vídeos Recentes</span>
              <span style={{ fontSize: 9, color: '#9146FF' }}>Ver todos</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {POSTS.map((post, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 5, background: 'rgba(145,70,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>▶</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 9, color: '#FAFAFA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                    <div style={{ fontSize: 8, color: '#888888', marginTop: 1 }}>{post.views} views</div>
                  </div>
                  <span style={{ fontSize: 8, color: '#00E5A0', background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.12)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, fontWeight: 500 }}>Publicado</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
