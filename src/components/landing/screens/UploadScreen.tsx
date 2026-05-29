const STEPS = [
  { n: 1, label: 'Vídeo',      active: false, done: true  },
  { n: 2, label: 'Configurar', active: true,  done: false },
  { n: 3, label: 'Publicar',   active: false, done: false },
]

const PLATFORMS = [
  { label: 'TikTok', icon: '♪', selected: true, bg: '#111'      },
  { label: 'Reels',  icon: '◎', selected: true, bg: 'linear-gradient(135deg,#f09433,#bc1888)' },
  { label: 'Shorts', icon: '▶', selected: true, bg: '#FF0000'   },
]

export function UploadScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#050505' }}>

      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a', flexShrink: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em' }}>Upload & Publicar</span>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #9146FF, #00E5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>G</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexShrink: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.n} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: step.done ? '#9146FF' : step.active ? 'transparent' : 'transparent',
                  border: step.done ? 'none' : step.active ? '2px solid #9146FF' : '2px solid #333',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  color: step.done ? '#fff' : step.active ? '#9146FF' : '#555',
                }}>
                  {step.done ? '✓' : step.n}
                </div>
                <span style={{ fontSize: 8, color: step.active ? '#FAFAFA' : '#555', fontWeight: step.active ? 600 : 400, whiteSpace: 'nowrap' }}>{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i === 0 ? '#9146FF' : '#222', margin: '0 8px', marginBottom: 14 }} />
              )}
            </div>
          ))}
        </div>

        {/* File preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(0,229,160,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>▶</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#FAFAFA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>clip_golaço_final.mp4</div>
            <div style={{ fontSize: 8, color: '#888888', marginTop: 2 }}>147 MB · 00:58 · 1080×1920</div>
          </div>
          <span style={{ fontSize: 8, color: '#00E5A0', background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.15)', padding: '3px 8px', borderRadius: 4, flexShrink: 0, fontWeight: 600 }}>Pronto</span>
        </div>

        {/* Platform selector */}
        <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: '12px 14px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: '#888888', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Distribuir em</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PLATFORMS.map(p => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', background: '#111', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{p.icon}</div>
                <span style={{ fontSize: 10, color: '#FAFAFA', flex: 1, fontWeight: 500 }}>{p.label}</span>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.selected ? '#00E5A0' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#000', fontWeight: 700 }}>{p.selected ? '✓' : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Publish button */}
        <button
          type="button"
          style={{ width: '100%', padding: '11px 0', background: '#9146FF', color: '#FAFAFA', border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em', flexShrink: 0, boxShadow: '0 0 20px rgba(145,70,255,0.25)' }}
        >
          Publicar Agora nas 3 Plataformas →
        </button>
      </div>
    </div>
  )
}
