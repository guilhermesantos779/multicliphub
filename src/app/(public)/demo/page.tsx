'use client'
import dynamic from 'next/dynamic'
import { MultiClipDemo } from '@/remotion/Video'

// Player é client-only (usa canvas/WebGL) — carrega sem SSR
const Player = dynamic(
  () => import('@remotion/player').then(m => m.Player),
  { ssr: false }
)

export default function DemoPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      gap: 24,
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>
          MultiClip Hub — Demo
        </h1>
        <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>
          Preview do vídeo de apresentação
        </p>
      </div>

      {/* Player */}
      <div style={{ width: '100%', maxWidth: 960, borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 60px rgba(0,229,160,0.08)' }}>
        <Player
          component={MultiClipDemo}
          durationInFrames={990}
          fps={30}
          compositionWidth={1280}
          compositionHeight={720}
          style={{ width: '100%' }}
          controls
          autoPlay={false}
          loop={false}
          clickToPlay={false}
          showPosterWhenPaused={false}
        />
      </div>

      {/* Info */}
      <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#444' }}>
        <span>1280 × 720</span>
        <span>·</span>
        <span>30 FPS</span>
        <span>·</span>
        <span>33 segundos</span>
        <span>·</span>
        <span>7 cenas</span>
      </div>
    </div>
  )
}
