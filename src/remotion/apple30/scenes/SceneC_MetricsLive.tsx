import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig,
         interpolate } from 'remotion'
import { C } from '../constants'
import { AmbientLight } from '../components/AmbientLight'
import { FloatingBrowser } from '../components/FloatingBrowser'
import { DashboardUI } from '../components/DashboardUI'

export function SceneC_MetricsLive() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame

  const browserSpring = spring({
    frame: localFrame - 5, fps,
    config: { damping: 20, stiffness: 55, mass: 1.3 },
    from: 0, to: 1,
  })
  const browserY = interpolate(browserSpring, [0, 1], [50, 0])
  const browserOpacity = interpolate(localFrame, [5, 30], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const cameraScale = interpolate(localFrame, [0, 240], [0.87, 1.03], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const metricsProgress = interpolate(localFrame, [40, 180], [0, 1], {
    easing: (t) => 1 - Math.pow(1 - t, 3),
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const captionOpacity = interpolate(localFrame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(localFrame, [220, 240], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: C.black, opacity: fadeOut }}>
      <AmbientLight color={C.purple} size={900} x="50%" y="48%"
        baseOpacity={0.09} pulseAmplitude={0.025} pulseSpeed={180} />
      <AmbientLight color={C.mint} size={400} x="48%" y="52%"
        baseOpacity={0.04} pulseAmplitude={0.01} pulseSpeed={220} />

      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `
          translate(-50%, -50%)
          scale(${cameraScale * browserSpring})
          translateY(${browserY}px)
        `,
        opacity: browserOpacity,
        willChange: 'transform, opacity',
      }}>
        <FloatingBrowser width={980}>
          <DashboardUI metricsProgress={metricsProgress} />
        </FloatingBrowser>
      </div>

      {/* Floor reflection */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '65%', height: 60,
        background: `radial-gradient(ellipse, rgba(145,70,255,0.07) 0%, transparent 70%)`,
        filter: 'blur(24px)',
        opacity: browserOpacity,
      }} />

      <div style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        textAlign: 'center', opacity: captionOpacity,
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: 20, fontWeight: 300,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '-0.01em',
        }}>
          Seus clipes. Seu alcance.{' '}
          <span style={{ color: C.purple, fontWeight: 500 }}>
            Em um só lugar.
          </span>
        </span>
      </div>
    </AbsoluteFill>
  )
}
