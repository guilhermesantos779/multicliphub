import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig,
         Img, staticFile, interpolate } from 'remotion'
import { C } from '../constants'
import { AmbientLight } from '../components/AmbientLight'

export function SceneA_Atmosphere() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const logoSpring = spring({
    frame: frame - 10, fps,
    config: { damping: 18, stiffness: 60, mass: 1.2 },
    from: 0, to: 1,
  })

  const logoY = interpolate(logoSpring, [0, 1], [20, 0])
  const logoOpacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const tagOpacity = interpolate(frame, [40, 65], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const tagY = interpolate(frame, [40, 65], [10, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const fadeToNext = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: C.black, opacity: fadeToNext }}>
      <AmbientLight
        color={C.purple}
        size={800}
        x="50%" y="45%"
        baseOpacity={0.10}
        pulseAmplitude={0.03}
        pulseSpeed={120}
      />
      <AmbientLight
        color={C.mint}
        size={400}
        x="52%" y="48%"
        baseOpacity={0.05}
        pulseAmplitude={0.02}
        pulseSpeed={150}
      />

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '42%', left: '50%',
        transform: `translate(-50%, calc(-50% + ${logoY}px))`,
        opacity: logoOpacity,
      }}>
        <Img
          src={staticFile('logo.png')}
          style={{
            height: 52, width: 'auto', objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(145,70,255,0.35))',
          }}
        />
      </div>

      {/* Tagline */}
      <div style={{
        position: 'absolute',
        top: '56%', left: '50%',
        transform: `translate(-50%, calc(-50% + ${tagY}px))`,
        opacity: tagOpacity,
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: 17, fontWeight: 300,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.04em',
        }}>
          O escritório digital do clipador profissional
        </span>
      </div>
    </AbsoluteFill>
  )
}
