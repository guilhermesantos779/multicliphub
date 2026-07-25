import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate,
         Img, staticFile } from 'remotion'
import { C } from '../constants'
import { AmbientLight } from '../components/AmbientLight'

export function SceneE_BrandClose() {
  const frame = useCurrentFrame()
  const localFrame = frame

  const logoOpacity = interpolate(localFrame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const logoY = interpolate(localFrame, [10, 40], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const tagOpacity = interpolate(localFrame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const urlOpacity = interpolate(localFrame, [70, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const lineWidth = interpolate(localFrame, [55, 85], [0, 200], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const finalFade = interpolate(localFrame, [105, 120], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: C.black, opacity: finalFade }}>
      <AmbientLight color={C.purple} size={600} x="50%" y="50%"
        baseOpacity={0.06} pulseAmplitude={0.02} pulseSpeed={180} />

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '40%', left: '50%',
        transform: `translate(-50%, calc(-50% + ${logoY}px))`,
        opacity: logoOpacity,
      }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            height: 48, width: 'auto', objectFit: 'contain',
            filter: 'drop-shadow(0 0 16px rgba(145,70,255,0.30))',
          }}
        />
      </div>

      {/* Divider line */}
      <div style={{
        position: 'absolute',
        top: '51%', left: '50%',
        transform: 'translateX(-50%)',
        width: lineWidth,
        height: 1,
        background: `linear-gradient(90deg,
          transparent 0%,
          rgba(145,70,255,0.6) 30%,
          rgba(0,229,160,0.6) 70%,
          transparent 100%)`,
        opacity: lineWidth > 0 ? 1 : 0,
      }} />

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        top: '56%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        opacity: tagOpacity,
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: 15, fontWeight: 300,
          color: 'rgba(255,255,255,0.40)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Distribuir · Multiplicar · Escalar
        </span>
      </div>

      {/* URL */}
      <div style={{
        position: 'absolute',
        top: '64%', left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: urlOpacity,
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: 14, fontWeight: 300,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.04em',
        }}>
          multicliphub.com
        </span>
      </div>
    </AbsoluteFill>
  )
}
