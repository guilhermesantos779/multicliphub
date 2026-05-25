import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { AppChrome } from '../components/AppChrome'

const PLATFORMS = [
  { name: 'TikTok', delay: 0 },
  { name: 'Instagram Reels', delay: 18 },
  { name: 'YouTube Shorts', delay: 36 },
]

// Separado em componente para evitar IIFE e manter árvore estável entre frames
function SuccessCard({ frame, fps }: { frame: number; fps: number }) {
  const successOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
      textAlign: 'center',
      opacity: successOpacity,
      transform: `scale(${successScale})`,
    }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
        Publicado com sucesso!
      </div>
      <div style={{ fontSize: 12, color: '#555' }}>3 plataformas · agora mesmo</div>
    </div>
  )
}

function PlatformCard({
  name,
  delay,
  frame,
  fps,
}: {
  name: string
  delay: number
  frame: number
  fps: number
}) {
  const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const progressVal = interpolate(frame, [delay + 10, delay + 100], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const done = progressVal >= 99

  const checkScale = spring({
    frame: frame - (delay + 100),
    fps,
    config: { damping: 14, stiffness: 200 },
    from: 0,
    to: 1,
  })

  return (
    <div style={{
      background: '#111',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      padding: '16px 20px',
      opacity: cardOpacity,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{name}</span>
        {/* Mantém a mesma estrutura de elemento em todos os frames:
            opacity controla visibilidade sem alterar a árvore de componentes */}
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%',
          background: done ? 'rgba(0,229,160,0.15)' : 'transparent',
          color: '#00E5A0',
          fontSize: 13,
          transform: done ? `scale(${checkScale})` : 'scale(0)',
        }}>✓</span>
        <span style={{
          fontSize: 11,
          color: '#00E5A0',
          position: 'absolute',
          opacity: done ? 0 : 1,
        }}>{Math.round(progressVal)}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          width: `${progressVal}%`,
          height: '100%',
          background: done ? '#00E5A0' : 'linear-gradient(90deg, #00E5A0, #3CFFB8)',
          borderRadius: 99,
        }} />
      </div>
    </div>
  )
}

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
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          gap: 32,
          fontFamily: 'Inter, system-ui, sans-serif',
          height: '100%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 6 }}>
              Como crescer 10k seguidores em 30 dias
            </div>
            <div style={{ fontSize: 12, color: '#555' }}>Publicando em simultâneo...</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 380, position: 'relative' }}>
            {PLATFORMS.map((p) => (
              <PlatformCard key={p.name} name={p.name} delay={p.delay} frame={frame} fps={fps} />
            ))}
          </div>

          <SuccessCard frame={frame} fps={fps} />
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
