import React from 'react'
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig,
         interpolate } from 'remotion'
import { C } from '../constants'
import { AmbientLight } from '../components/AmbientLight'
import { FloatingBrowser } from '../components/FloatingBrowser'
import { UploadUI } from '../components/UploadUI'

export function SceneB_ProductHero() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localFrame = frame

  const browserSpring = spring({
    frame: localFrame - 5, fps,
    config: { damping: 22, stiffness: 50, mass: 1.5 },
    from: 0, to: 1,
  })

  const browserY = interpolate(browserSpring, [0, 1], [60, 0])
  const browserOpacity = interpolate(localFrame, [5, 35], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  // Slow Apple-style camera zoom — ease in/out
  const cameraScale = interpolate(localFrame, [0, 270], [0.85, 1.0], {
    easing: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const publishProgress = interpolate(localFrame, [60, 220], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  // Subtle 3D tilt on entry
  const tiltX = interpolate(localFrame, [0, 80], [3, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const tiltY = interpolate(localFrame, [0, 80], [-4, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  const captionOpacity = interpolate(localFrame, [80, 110], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })
  const fadeOut = interpolate(localFrame, [250, 270], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ background: C.black, opacity: fadeOut }}>
      <AmbientLight
        color={C.purple} size={1000}
        x="50%" y="50%"
        baseOpacity={0.09} pulseAmplitude={0.02} pulseSpeed={200}
      />
      <AmbientLight
        color={C.mint} size={500}
        x="55%" y="52%"
        baseOpacity={0.04} pulseAmplitude={0.015} pulseSpeed={240}
      />

      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: `
          translate(-50%, -50%)
          scale(${cameraScale * browserSpring})
          translateY(${browserY}px)
          perspective(2000px)
          rotateX(${tiltX}deg)
          rotateY(${tiltY}deg)
        `,
        opacity: browserOpacity,
        willChange: 'transform, opacity',
      }}>
        <FloatingBrowser width={960}>
          <UploadUI publishProgress={publishProgress} />
        </FloatingBrowser>
      </div>

      {/* Floor reflection */}
      <div style={{
        position: 'absolute',
        bottom: '12%', left: '50%',
        transform: 'translateX(-50%)',
        width: '60%', height: 60,
        background: `radial-gradient(ellipse, rgba(145,70,255,0.08) 0%, transparent 70%)`,
        filter: 'blur(20px)',
        opacity: browserOpacity,
      }} />

      {/* Caption */}
      <div style={{
        position: 'absolute',
        bottom: 80, left: 0, right: 0,
        textAlign: 'center',
        opacity: captionOpacity,
      }}>
        <span style={{
          fontFamily: '"Sora", sans-serif',
          fontSize: 20, fontWeight: 300,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '-0.01em',
        }}>
          Um upload.{' '}
          <span style={{ color: C.mint, fontWeight: 500 }}>
            Três plataformas.
          </span>
          {' '}Ao mesmo tempo.
        </span>
      </div>
    </AbsoluteFill>
  )
}
