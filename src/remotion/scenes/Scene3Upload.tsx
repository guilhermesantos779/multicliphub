import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { AppChrome } from '../components/AppChrome'

const PLATFORMS = [
  { name: 'TikTok', color: '#010101', accent: '#fff', active: true },
  { name: 'Reels', color: '#E1306C', accent: '#fff', active: true },
  { name: 'YouTube', color: '#FF0000', accent: '#fff', active: true },
  { name: 'Kwai', color: '#FF6500', accent: '#fff', active: false },
]

export const Scene3Upload = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Progresso da barra de upload
  const progress = interpolate(frame, [40, 160], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const progressVisible = frame > 35

  // Drop zone pulse
  const dzScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, stiffness: 100 },
    from: 0.96,
    to: 1,
  })

  const titleLength = Math.floor(
    interpolate(frame, [15, 45], [0, 30], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )

  const titleText = 'Como crescer 10k seguidores em 30'.slice(0, titleLength)
  const titleCursor = frame % 28 < 14 && titleLength < 30

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Upload" title="Upload">
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Inter, system-ui, sans-serif' }}>
          {/* Drop zone */}
          <div style={{
            border: '1.5px dashed rgba(0,229,160,0.35)',
            borderRadius: 16,
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(0,229,160,0.03)',
            transform: `scale(${dzScale})`,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(0,229,160,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                Solte seu vídeo aqui
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>MP4, MOV, AVI — até 2GB</div>
            </div>
            {/* Progresso sempre no DOM — opacity controla visibilidade */}
            <div style={{ width: '100%', maxWidth: 280, opacity: progressVisible ? 1 : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11, color: '#555' }}>
                <span>demo-viral.mp4</span>
                <span style={{ color: '#00E5A0' }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #00E5A0, #3CFFB8)', borderRadius: 99 }} />
              </div>
            </div>
          </div>

          {/* Título */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: 6 }}>
              Título do vídeo
            </div>
            <div style={{
              background: '#111', border: '1px solid rgba(0,229,160,0.35)',
              borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#fff',
              display: 'flex', alignItems: 'center',
            }}>
              {titleText}
              <span style={{
                width: 1.5, height: 14, background: '#00E5A0', marginLeft: 1, display: 'inline-block',
                opacity: titleCursor ? 1 : 0,
              }} />
            </div>
          </div>

          {/* Plataformas */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#444', marginBottom: 10 }}>
              Publicar em
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {PLATFORMS.map((p, i) => {
                const pOpacity = interpolate(frame, [10 + i * 5, 28 + i * 5], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })
                return (
                  <div
                    key={p.name}
                    style={{
                      padding: '8px 16px', borderRadius: 10,
                      border: p.active ? `1.5px solid ${p.color === '#010101' ? '#00E5A0' : p.color}` : '1px solid rgba(255,255,255,0.08)',
                      background: p.active ? (p.color === '#010101' ? 'rgba(0,229,160,0.08)' : `${p.color}18`) : 'transparent',
                      fontSize: 12.5, fontWeight: 500, color: p.active ? '#fff' : '#444',
                      opacity: pOpacity,
                    }}
                  >
                    {p.name}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Botão publicar */}
          <div style={{
            background: '#00E5A0', borderRadius: 12, padding: '13px 20px',
            textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#0B0F19',
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            Publicar em 3 plataformas
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
