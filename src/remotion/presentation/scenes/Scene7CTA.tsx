import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Img, staticFile } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { SNAPPY, ELASTIC } from '../easing'
import { GlowOrb }      from '../components/GlowOrb'
import { NeonText }     from '../components/NeonText'
import { ParticleField } from '../components/ParticleField'
import { CaptionLine }  from '../components/CaptionLine'

const WORDS = [
  { text: 'Distribuir.',  color: COLORS.white,  glow: COLORS.white,  start: 80  },
  { text: 'Multiplicar.', color: COLORS.purple, glow: COLORS.purple, start: 110 },
  { text: 'Escalar.',     color: COLORS.mint,   glow: COLORS.mint,   start: 140 },
]

const TRIAL_ITEMS = ['✓ 7 dias grátis', '✓ Sem cartão', '✓ Cancele quando quiser']

export function Scene7CTA() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const lf    = frame

  const glowPurpleSize    = ai(lf, [0, 300], [600, 1000])
  const glowPurpleOpacity = ai(lf, [0, 200], [0.10, 0.35])
  const glowMintSize      = ai(lf, [0, 300], [300, 600])
  const glowMintOpacity   = ai(lf, [0, 200], [0.06, 0.20])

  const logoSp      = spring({ frame: lf - 20, fps, config: { damping: 10, stiffness: 80 } })
  const logoOpacity = ai(lf, [20, 60], [0, 1])

  const dividerWidth   = ai(lf, [180, 240], [0, 500])
  const dividerOpacity = ai(lf, [180, 220], [0, 1])

  const urlOpacity = ai(lf, [240, 280], [0, 1])
  const urlScale   = ai(lf, [240, 280], [0.8, 1], ELASTIC)

  const badgeOpacity = ai(lf, [300, 340], [0, 1])

  return (
    <AbsoluteFill style={{ background: COLORS.black, fontFamily: '"Sora", sans-serif' }}>
      <GlowOrb color={COLORS.purple} size={glowPurpleSize} x="50%" y="50%" opacity={glowPurpleOpacity} blur={200} />
      <GlowOrb color={COLORS.mint}   size={glowMintSize}   x="50%" y="50%" opacity={glowMintOpacity}   blur={120} />

      {/* Particles */}
      {lf >= 18 && lf <= 220 && (
        <ParticleField
          count={48}
          startFrame={20}
          originX="50%"
          originY="38%"
          colors={[COLORS.purple, COLORS.mint, COLORS.gold, COLORS.white]}
        />
      )}

      {/* Logo */}
      <div style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${logoSp})`,
        opacity: logoOpacity,
        filter: 'drop-shadow(0 0 30px rgba(145,70,255,0.6))',
      }}>
        <Img src={staticFile('logo.png')} style={{ height: 72, display: 'block' }} />
      </div>

      {/* Tagline words */}
      <div style={{
        position: 'absolute',
        top: '46%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
      }}>
        {WORDS.map(({ text, color, glow, start }) => {
          const opacity = ai(lf, [start, start + 30], [0, 1])
          const wordY   = ai(lf, [start, start + 30], [20, 0], SNAPPY)
          return (
            <div
              key={text}
              style={{ opacity, transform: `translateY(${wordY}px)` }}
            >
              <NeonText size={76} color={color} glowColor={glow} glowStrength={30}>
                {text}
              </NeonText>
            </div>
          )
        })}
      </div>

      {/* Divider line */}
      <div style={{
        position: 'absolute',
        top: '58%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: dividerWidth,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${COLORS.purple}, ${COLORS.mint}, transparent)`,
        opacity: dividerOpacity,
      }} />

      {/* URL */}
      <div style={{
        position: 'absolute',
        top: '64%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${urlScale})`,
        opacity: urlOpacity,
        fontFamily: '"Sora", sans-serif',
        fontSize: 36,
        fontWeight: 300,
        color: 'rgba(255,255,255,0.5)',
        whiteSpace: 'nowrap',
      }}>
        multicliphub.com
      </div>

      {/* Trial badge */}
      <div style={{
        position: 'absolute',
        top: '74%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: badgeOpacity,
        background: 'rgba(145,70,255,0.15)',
        border: '1px solid rgba(145,70,255,0.4)',
        borderRadius: 99,
        padding: '10px 28px',
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
      }}>
        {TRIAL_ITEMS.map(item => (
          <span key={item} style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 14,
            color: COLORS.mint,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>
            {item}
          </span>
        ))}
      </div>

      <CaptionLine text={CAPTIONS.cta} startFrame={60} endFrame={680} />
    </AbsoluteFill>
  )
}
