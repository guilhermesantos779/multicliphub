import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { CountUp }      from '../components/CountUp'
import { NeonText }     from '../components/NeonText'
import { ParticleField } from '../components/ParticleField'
import { CaptionLine }  from '../components/CaptionLine'

interface PhoneProps {
  platform: string
  accentColor: string
  viewsTarget: number
  likesTarget: number
  commentsTarget: number
  width: number
  height: number
  delayFrames: number
  lf: number
}

function Phone({ platform, accentColor, viewsTarget, likesTarget, commentsTarget, width, height, delayFrames, lf }: PhoneProps) {
  const videoOpacity = 0.3 + Math.sin(lf * 0.1) * 0.1

  return (
    <div style={{
      width, height,
      borderRadius: 28,
      border: '1.5px solid rgba(255,255,255,0.15)',
      background: '#0a0a0a',
      boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 40px ${accentColor}22`,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Notch */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 60, height: 18, background: '#000',
        borderRadius: '0 0 10px 10px', zIndex: 10,
      }} />

      {/* Screen content */}
      <div style={{ padding: '28px 16px 16px', display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
        {/* Platform name */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          marginTop: 8,
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: 6,
            background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#000', fontWeight: 700,
          }}>
            {platform[0]}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.white }}>{platform}</span>
        </div>

        {/* Video placeholder */}
        <div style={{
          flex: 1, background: '#111',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 32, opacity: videoOpacity, color: accentColor }}>▶</span>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 12, justifyContent: 'space-around',
          padding: '8px 0',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#555' }}>👁</div>
            <CountUp
              target={viewsTarget}
              startFrame={60 + delayFrames}
              duration={300}
              style={{ fontSize: 11, fontWeight: 700, color: COLORS.white }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#555' }}>❤️</div>
            <CountUp
              target={likesTarget}
              startFrame={60 + delayFrames}
              duration={300}
              style={{ fontSize: 11, fontWeight: 700, color: COLORS.white }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#555' }}>💬</div>
            <CountUp
              target={commentsTarget}
              startFrame={60 + delayFrames}
              duration={300}
              style={{ fontSize: 11, fontWeight: 700, color: COLORS.white }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const NOTIFICATIONS = [
  { lf: 80,  text: '🔔 +1.200 visualizações', bg: 'rgba(145,70,255,0.12)', color: '#c4b5fd' },
  { lf: 120, text: '❤️ +847 curtidas',          bg: 'rgba(0,229,160,0.08)',  color: COLORS.mint },
  { lf: 160, text: '💬 +312 comentários',       bg: 'rgba(255,255,255,0.04)', color: '#888' },
  { lf: 200, text: '📈 Trending agora!',         bg: 'rgba(255,215,0,0.1)',   color: COLORS.gold },
]

export function Scene6SocialMedia() {
  const frame = useCurrentFrame()
  const lf    = frame

  return (
    <AbsoluteFill style={{
      background: COLORS.black,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Three phones */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'center' }}>
        <Phone platform="TikTok"    accentColor="#ffffff" viewsTarget={847000} likesTarget={94000} commentsTarget={12400} width={220} height={440} delayFrames={0}  lf={lf} />
        <Phone platform="Instagram" accentColor="#E1306C" viewsTarget={312000} likesTarget={28600} commentsTarget={4100}  width={250} height={500} delayFrames={20} lf={lf} />
        <Phone platform="YouTube"   accentColor="#FF0000" viewsTarget={98000}  likesTarget={8200}  commentsTarget={1900}  width={220} height={440} delayFrames={40} lf={lf} />
      </div>

      {/* Particle bursts at 50% milestone */}
      {lf >= 210 && <ParticleField count={20} startFrame={210} originX="22%" originY="58%" colors={[COLORS.purple, COLORS.mint]} />}
      {lf >= 220 && <ParticleField count={20} startFrame={220} originX="50%" originY="52%" colors={[COLORS.mint, '#E1306C']}    />}
      {lf >= 230 && <ParticleField count={20} startFrame={230} originX="78%" originY="58%" colors={['#FF0000', COLORS.purple]}  />}

      {/* Floating notifications */}
      {NOTIFICATIONS.map(({ lf: notifLf, text, bg, color }) => {
        if (lf < notifLf) return null
        const slideX = ai(lf, [notifLf, notifLf + 30], [200, 0])
        const opOut  = ai(lf, [notifLf + 120, notifLf + 140], [1, 0])
        return (
          <div
            key={text}
            style={{
              position:  'absolute',
              right:     80,
              top:       `${20 + NOTIFICATIONS.indexOf(NOTIFICATIONS.find(n => n.lf === notifLf)!) * 60}px`,
              transform: `translateX(${slideX}px)`,
              opacity:   opOut,
              background: bg,
              border:    '1px solid rgba(255,255,255,0.08)',
              borderRadius: 99,
              padding:   '8px 16px',
              fontSize:  12,
              color,
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        )
      })}

      {/* Total counter */}
      <div style={{
        position: 'absolute', bottom: 120, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: ai(lf, [80, 110], [0, 1]),
      }}>
        <NeonText size={48} color={COLORS.white} glowColor={COLORS.purple} glowStrength={20}>
          <CountUp
            target={1257000}
            startFrame={80}
            duration={300}
            style={{ fontFamily: '"Sora", sans-serif', fontSize: 48, fontWeight: 700, color: COLORS.white }}
          />
          {' views totais'}
        </NeonText>
      </div>

      <CaptionLine text={CAPTIONS.social} startFrame={60} endFrame={740} />
    </AbsoluteFill>
  )
}
