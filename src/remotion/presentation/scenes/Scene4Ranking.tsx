import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion'
import { interpolate } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { GlowOrb }      from '../components/GlowOrb'
import { NeonText }     from '../components/NeonText'
import { ParticleField } from '../components/ParticleField'
import { CaptionLine }  from '../components/CaptionLine'

const LEADERBOARD = [
  { pos: 1, name: 'ClipLord',  views: '14,7M views', color: '#FFD700' },
  { pos: 2, name: 'KingRafa',  views: '8,2M views',  color: '#C0C0C0' },
  { pos: 3, name: 'ZeroNine', views: '6,1M views',  color: '#CD7F32' },
  { pos: 4, name: 'FluxClip', views: '4,9M views',  color: '#444444' },
  { pos: 8, name: 'Você',     views: '1,2M views',  color: COLORS.purple, you: true },
]

const MEDALS = ['🥇', '🥈', '🥉']

export function Scene4Ranking() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const lf    = frame

  const podiumRotY = ai(lf, [0, 180], [-90, 0])

  const crownSp  = spring({ frame: lf - 190, fps, config: { damping: 8, stiffness: 120 } })
  const crownY   = interpolate(crownSp, [0, 1], [-200, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const nameSp   = spring({ frame: lf - 200, fps, config: { damping: 12, stiffness: 100 } })

  return (
    <AbsoluteFill style={{
      background: COLORS.black,
      fontFamily: '"Inter", sans-serif',
    }}>
      <GlowOrb color={COLORS.gold} size={600} x="50%" y="90%" opacity={0.06} blur={120} />

      {/* Podium */}
      <div style={{
        position: 'absolute',
        left: '12%',
        top: '50%',
        transform: `translate(0, -50%) perspective(1000px) rotateY(${podiumRotY}deg)`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
      }}>
        {/* 2nd */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#C0C0C0', fontWeight: 600 }}>KingRafa</span>
          <div style={{
            width: 100, height: 120, background: '#C0C0C0', borderRadius: '8px 8px 0 0',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8,
            fontSize: 24, fontWeight: 800, color: '#000',
          }}>2</div>
        </div>

        {/* 1st */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {lf >= 190 && (
            <div style={{ transform: `translateY(${crownY}px)`, fontSize: 56 }}>👑</div>
          )}
          {lf >= 200 && (
            <div style={{ transform: `scale(${nameSp})`, opacity: nameSp }}>
              <NeonText size={16} color="#000000" glowColor={COLORS.gold} glowStrength={8}>
                Guilherme
              </NeonText>
            </div>
          )}
          <div style={{
            width: 100, height: 160, borderRadius: '8px 8px 0 0',
            background: 'linear-gradient(to top, #b8860b, #FFD700)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8,
            fontSize: 24, fontWeight: 800, color: '#000',
          }}>1</div>
        </div>

        {/* 3rd */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#CD7F32', fontWeight: 600 }}>ZeroNine</span>
          <div style={{
            width: 100, height: 90, background: '#CD7F32', borderRadius: '8px 8px 0 0',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 8,
            fontSize: 24, fontWeight: 800, color: '#000',
          }}>3</div>
        </div>
      </div>

      {/* Gold confetti */}
      {lf >= 200 && (
        <ParticleField
          count={32}
          startFrame={200}
          originX="30%"
          originY="40%"
          colors={['#FFD700', '#FFA500', '#ffffff88']}
        />
      )}

      {/* Leaderboard */}
      <div style={{
        position: 'absolute',
        left: '52%',
        top: '18%',
        width: '42%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.white, marginBottom: 12, letterSpacing: '-0.02em' }}>
          👑 Kings of Reach
        </div>
        {LEADERBOARD.map((entry, i) => {
          const entryStart = 240 + i * 10
          const slideX = ai(lf, [entryStart, entryStart + 25], [120, 0])
          const opacity = ai(lf, [entryStart, entryStart + 25], [0, 1])

          return (
            <div
              key={entry.pos}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background:   entry.you ? 'rgba(145,70,255,0.08)' : 'transparent',
                borderLeft:   entry.you ? `2px solid ${COLORS.purple}` : '2px solid transparent',
                transform:    `translateX(${slideX}px)`,
                opacity,
              }}
            >
              <span style={{ width: 24, textAlign: 'center', fontSize: 14 }}>
                {entry.pos <= 3 ? MEDALS[entry.pos - 1] : entry.pos}
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: entry.you ? `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.mint})` : 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: COLORS.white, flexShrink: 0,
              }}>
                {entry.name.slice(0, 2).toUpperCase()}
              </div>
              <span style={{ flex: 1, fontSize: 13, color: entry.you ? '#c4b5fd' : COLORS.white, fontWeight: entry.you ? 600 : 400 }}>
                {entry.name}
              </span>
              <span style={{ fontSize: 12, color: entry.color, fontWeight: 600 }}>{entry.views}</span>
            </div>
          )
        })}
      </div>

      <CaptionLine text={CAPTIONS.ranking} startFrame={80} endFrame={570} />
    </AbsoluteFill>
  )
}
