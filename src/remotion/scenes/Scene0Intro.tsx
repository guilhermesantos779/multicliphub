import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'
import React from 'react'
import { RemotionLogo } from '../components/Logo'

export const Scene0Intro = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 80 },
    from: 0.7,
    to: 1,
  })

  const logoOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const tagOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const tagY = interpolate(frame, [35, 55], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const fadeOut = interpolate(frame, [65, 80], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const glowOpacity = interpolate(frame, [20, 40, 60, 80], [0, 0.18, 0.12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const lineWidth = interpolate(frame, [48, 65], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #0d1a14 0%, #080808 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Grid de pontos decorativo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(0,229,160,0.08) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Glow radial atrás da logo */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,229,160,0.22) 0%, transparent 70%)',
        opacity: glowOpacity,
      }} />

      {/* Container logo + tagline */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
        opacity: logoOpacity,
        transform: `scale(${logoScale})`,
      }}>
        {/* Logo */}
        <RemotionLogo height={72} />

        {/* Linha separadora */}
        <div style={{
          width: lineWidth,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,229,160,0.5), transparent)',
          transition: 'width 0.3s',
        }} />

        {/* Tagline */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: tagOpacity,
          transform: `translateY(${tagY}px)`,
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {['Distribuir', '·', 'Multiplicar', '·', 'Escalar'].map((word, i) => (
            <span
              key={i}
              style={{
                fontSize: word === '·' ? 14 : 15,
                fontWeight: word === '·' ? 400 : 500,
                letterSpacing: '0.08em',
                color: word === '·' ? 'rgba(0,229,160,0.35)' : 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
