import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import { AppChrome } from '../components/AppChrome'
import { PlatformIcon } from '../components/Platform'

type PlatformKey = 'tiktok' | 'instagram' | 'youtube'

const PLATFORMS: { key: PlatformKey; label: string; completesAt: number }[] = [
  { key: 'tiktok',    label: 'TikTok',          completesAt: 40  },
  { key: 'instagram', label: 'Instagram Reels',  completesAt: 70  },
  { key: 'youtube',   label: 'YouTube Shorts',   completesAt: 100 },
]

const ACCENT: Record<PlatformKey, string> = {
  tiktok:    '#fff',
  instagram: '#E1306C',
  youtube:   '#FF0000',
}

// Componente isolado para cada card de plataforma — árvore DOM estável
function PlatformCard({
  platform,
  frame,
  fps,
}: {
  platform: typeof PLATFORMS[0]
  frame: number
  fps: number
}) {
  const { key, label, completesAt } = platform
  const startAt = completesAt - 30

  const isDone    = frame >= completesAt
  const isLoading = frame >= startAt && !isDone

  const progress = interpolate(frame, [startAt, completesAt], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const cardOpacity = interpolate(frame, [startAt - 20, startAt], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const checkScale = spring({
    frame: frame - completesAt,
    fps,
    config: { damping: 14, stiffness: 200 },
    from: 0,
    to: 1,
  })

  const statusText = isDone
    ? '✓ Publicado com sucesso'
    : isLoading
    ? 'Enviando vídeo...'
    : 'Na fila...'

  const statusColor = isDone ? '#00E5A0' : isLoading ? '#888' : '#444'

  return (
    <div style={{
      background: '#111',
      border: `1px solid ${isDone ? 'rgba(0,229,160,0.2)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 14,
      padding: '14px 16px',
      opacity: cardOpacity,
      display: 'flex',
      flexDirection: 'column',  // COLUNA: texto em cima, barra embaixo
      gap: 12,
    }}>
      {/* ── Linha superior: ícone + nome/status + indicador ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        {/* Ícone da plataforma */}
        <PlatformIcon platform={key} size={34} />

        {/* Nome + status em coluna, ocupam o espaço restante */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 11,
            color: statusColor,
            marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            {statusText}
          </div>
        </div>

        {/* Indicador de conclusão — sempre renderizado, opacity controla visibilidade */}
        <div style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'rgba(0,229,160,0.12)',
          border: '1px solid rgba(0,229,160,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: '#00E5A0',
          fontWeight: 700,
          transform: `scale(${isDone ? checkScale : 0})`,
          opacity: isDone ? 1 : 0,
        }}>✓</div>

        {/* Percentual — mesmo nível, visível enquanto loading */}
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: ACCENT[key],
          minWidth: 34,
          textAlign: 'right',
          opacity: isLoading ? 1 : 0,
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* ── Barra de progresso — completamente separada do texto ── */}
      <div style={{
        height: 4,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: isDone
            ? '#00E5A0'
            : `linear-gradient(90deg, ${ACCENT[key]}, #00E5A0)`,
          borderRadius: 99,
        }} />
      </div>
    </div>
  )
}

// Botões de ação pós-publicação
function PostPublishButtons({ frame, fps }: { frame: number; fps: number }) {
  const scale = spring({
    frame: frame - 115,
    fps,
    config: { damping: 16, stiffness: 130 },
    from: 0.88,
    to: 1,
  })
  const opacity = interpolate(frame, [112, 128], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        background: '#00E5A0',
        borderRadius: 10,
        padding: '10px 20px',
        fontSize: 12.5,
        fontWeight: 700,
        color: '#0B0F19',
        cursor: 'default',
      }}>
        Publicar novo clipe
      </div>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10,
        padding: '10px 20px',
        fontSize: 12.5,
        fontWeight: 500,
        color: '#aaa',
        cursor: 'default',
      }}>
        Ver no Histórico
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

  const allDone = frame >= 110

  const overallProgress = interpolate(frame, [0, 105], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const headerScale = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 140 },
    from: 0.94,
    to: 1,
  })

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <AppChrome activeNav="Upload" title="Upload & Publicar">
        <div style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          fontFamily: 'Inter, system-ui, sans-serif',
          height: '100%',
        }}>
          {/* Header do card principal */}
          <div style={{
            background: '#111',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '18px 20px',
            transform: `scale(${headerScale})`,
          }}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                {allDone ? '🎉 Publicado com sucesso!' : '⚡ Publicando seu clipe...'}
              </div>
              <div style={{ fontSize: 12, color: '#555' }}>
                {allDone
                  ? 'Distribuído para 3 plataformas simultaneamente'
                  : 'Distribuindo para as plataformas em paralelo'}
              </div>
            </div>

            {/* Barra de progresso geral */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                <span style={{ color: '#555' }}>Progresso geral</span>
                <span style={{ color: '#00E5A0', fontWeight: 600 }}>
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  width: `${overallProgress}%`,
                  height: '100%',
                  background: allDone ? '#00E5A0' : 'linear-gradient(90deg, #00E5A0, #3CFFB8)',
                  borderRadius: 99,
                }} />
              </div>
            </div>
          </div>

          {/* Cards de plataforma individuais */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLATFORMS.map(platform => (
              <PlatformCard
                key={platform.key}
                platform={platform}
                frame={frame}
                fps={fps}
              />
            ))}
          </div>

          {/* Botões pós-publicação — sempre no DOM, opacity controla aparição */}
          <div style={{ opacity: allDone ? 1 : 0, pointerEvents: allDone ? 'auto' : 'none' }}>
            <PostPublishButtons frame={frame} fps={fps} />
          </div>
        </div>
      </AppChrome>
    </AbsoluteFill>
  )
}
