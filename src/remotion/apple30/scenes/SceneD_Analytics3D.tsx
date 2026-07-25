import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig,
         interpolate } from 'remotion'
import { C } from '../constants'
import { AmbientLight } from '../components/AmbientLight'
import { FloatingBrowser } from '../components/FloatingBrowser'
import { AnalyticsUI } from '../components/AnalyticsUI'

export function SceneD_Analytics3D() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame

  const rotateYSpring = spring({
    frame: localFrame - 3, fps,
    config: { damping: 25, stiffness: 45, mass: 1.8 },
    from: -12, to: 0,
  })
  const rotateXSpring = spring({
    frame: localFrame - 3, fps,
    config: { damping: 25, stiffness: 45, mass: 1.8 },
    from: 5, to: 0,
  })

  const browserOpacity = interpolate(localFrame, [3, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const cameraScale = interpolate(localFrame, [0, 180], [0.88, 1.02], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const barsProgress = interpolate(localFrame, [50, 150], [0, 1], {
    easing: (t) => 1 - Math.pow(1 - t, 2),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const captionOpacity = interpolate(localFrame, [70, 100], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(localFrame, [160, 180], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: C.black, opacity: fadeOut }}>
      <AmbientLight color={C.mint} size={700} x="50%" y="47%"
        baseOpacity={0.07} pulseAmplitude={0.02} pulseSpeed={160} />
      <AmbientLight color={C.purple} size={500} x="53%" y="52%"
        baseOpacity={0.05} pulseAmplitude={0.015} pulseSpeed={200} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `
          translate(-50%, -50%)
          perspective(1600px)
          rotateY(${rotateYSpring}deg)
          rotateX(${rotateXSpring}deg)
          scale(${cameraScale})
        `,
        opacity: browserOpacity,
        willChange: 'transform, opacity',
      }}>
        <FloatingBrowser width={960}>
          <AnalyticsUI barsProgress={barsProgress} />
        </FloatingBrowser>
      </div>

      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '62%', height: 60,
        background: `radial-gradient(ellipse, rgba(0,229,160,0.06) 0%, transparent 70%)`,
        filter: 'blur(24px)', opacity: browserOpacity,
      }} />

      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        textAlign: 'center', opacity: captionOpacity,
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif', fontSize: 20, fontWeight: 300,
          color: 'rgba(255,255,255,0.50)', letterSpacing: '-0.01em',
        }}>
          TikTok. Instagram. YouTube.{' '}
          <span style={{ color: C.mint, fontWeight: 500 }}>
            Tudo em um dashboard.
          </span>
        </span>
      </div>
    </AbsoluteFill>
  )
}
