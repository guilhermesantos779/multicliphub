import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { SNAPPY } from '../easing'
import { GlowOrb }      from '../components/GlowOrb'
import { ParticleField } from '../components/ParticleField'
import { CaptionLine }   from '../components/CaptionLine'

export function Scene0Intro() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const purpleBreath = 0.12 + Math.sin(frame * 0.08) * 0.05
  const mintBreath   = (0.12 + Math.sin(frame * 0.08) * 0.05) * 0.6

  const logoScale = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 100 } })
  const logoOpacity = ai(frame, [20, 50], [0, 1])

  const taglineOpacity = ai(frame, [120, 160], [0, 1])
  const taglineY       = ai(frame, [120, 160], [20, 0], SNAPPY)

  const line1Width  = ai(frame, [180, 240], [0, 200])
  const line2Width  = ai(frame, [200, 260], [0, 140])
  const line3Width  = ai(frame, [220, 280], [0, 80])

  const fadeOutOpacity = ai(frame, [440, 480], [0, 1])

  return (
    <AbsoluteFill style={{ background: COLORS.black, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Sora", sans-serif' }}>
      <GlowOrb color={COLORS.purple} size={700} x="50%" y="50%" opacity={purpleBreath} blur={120} />
      <GlowOrb color={COLORS.mint}   size={300} x="50%" y="50%" opacity={mintBreath}   blur={80}  />

      {frame >= 15 && frame <= 300 && (
        <ParticleField
          count={36}
          startFrame={20}
          originX="50%"
          originY="42%"
          colors={[COLORS.purple, COLORS.mint, '#ffffff88']}
        />
      )}

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '34%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${logoScale})`,
        opacity: logoOpacity,
      }}>
        <Img
          src={staticFile('logo.png')}
          style={{ height: 80, display: 'block' }}
        />
      </div>

      {/* Tagline */}
      <div style={{
        position:  'absolute',
        top:       '55%',
        left:      '50%',
        transform: `translate(-50%, calc(-50% + ${taglineY}px))`,
        opacity:   taglineOpacity,
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        textAlign: 'center',
      }}>
        <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 52, fontWeight: 300, color: COLORS.white, lineHeight: 1.2 }}>
          O escritório digital do
        </span>
        <span style={{ fontFamily: '"Sora", sans-serif', fontSize: 52, fontWeight: 700, color: COLORS.white, lineHeight: 1.2 }}>
          clipador profissional
        </span>
      </div>

      {/* Accent lines */}
      <div style={{
        position:  'absolute',
        top:       'calc(55% + 80px)',
        left:      '50%',
        transform: 'translateX(-50%)',
        display:   'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}>
        <div style={{
          width:     line1Width,
          height:    2,
          background: COLORS.purple,
          borderRadius: 99,
          boxShadow: `0 0 12px ${COLORS.purple}`,
        }} />
        <div style={{
          width:     line2Width,
          height:    1,
          background: COLORS.mint,
          borderRadius: 99,
          boxShadow: `0 0 8px ${COLORS.mint}`,
        }} />
        <div style={{
          width:     line3Width,
          height:    1,
          background: COLORS.purple,
          borderRadius: 99,
          boxShadow: `0 0 8px ${COLORS.purple}`,
        }} />
      </div>

      {/* Scene fade out */}
      <AbsoluteFill style={{ background: COLORS.black, opacity: fadeOutOpacity, pointerEvents: 'none' }} />

      <CaptionLine text={CAPTIONS.intro} startFrame={160} endFrame={460} />
    </AbsoluteFill>
  )
}
