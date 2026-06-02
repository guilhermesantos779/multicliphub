import React from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { COLORS, CAPTIONS } from '../constants'
import { ai } from '../utils'
import { ELASTIC } from '../easing'
import { NeonText }   from '../components/NeonText'
import { CaptionLine } from '../components/CaptionLine'

const ROWS = [
  { lf: 60,  feature: 'Ranking Gamificado',       left: '❌❌❌', right: '✅' },
  { lf: 85,  feature: 'Analytics 3 Plataformas',  left: '❌❌❌', right: '✅' },
  { lf: 110, feature: 'Feito para Clipadores',     left: '❌❌❌', right: '✅' },
  { lf: 135, feature: 'Comunidade Discord',        left: '❌❌❌', right: '✅' },
  { lf: 160, feature: 'Premiação Mensal',          left: '❌❌❌', right: '✅' },
  { lf: 185, feature: 'IA de Legendas',            left: '❌✅❌', right: '✅' },
  { lf: 210, feature: 'Preço mensal',              left: 'R$120/R$95/R$85', right: 'R$27' },
  { lf: 235, feature: 'Trial grátis',              left: '❌✅✅', right: '✅ 7 dias' },
]

export function Scene5Comparison() {
  const frame = useCurrentFrame()
  const lf    = frame

  const priceScale = ai(lf, [550, 590], [1, 2.2], ELASTIC)
  const priceHighlight = lf >= 550

  return (
    <AbsoluteFill style={{ background: COLORS.black, fontFamily: '"Inter", sans-serif', overflow: 'hidden' }}>

      {/* Left panel */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '47%', height: '100%',
        background: '#080808',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '60px 40px 20px', fontSize: 14, color: '#333333', fontWeight: 600, letterSpacing: '-0.01em' }}>
          Outras Ferramentas
        </div>
        <div style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {['Buffer — R$120/mês', 'Later — R$95/mês', 'Publer — R$85/mês'].map((tool, i) => {
            const op = ai(lf, [30, 50], [0, 1])
            return (
              <div key={i} style={{ fontSize: 13, color: '#2a2a2a', padding: '8px 0', opacity: op }}>
                {tool}
              </div>
            )
          })}
        </div>
      </div>

      {/* Center divider */}
      <div style={{
        position: 'absolute', left: '48.5%', top: 0, width: 1, height: '100%',
        background: 'linear-gradient(to bottom, transparent, #9146FF 30%, #9146FF 70%, transparent)',
        opacity: 0.4,
      }} />

      {/* Right panel */}
      <div style={{
        position: 'absolute', left: '52%', top: 0, width: '48%', height: '100%',
        background: COLORS.surface,
        boxShadow: 'inset 2px 0 20px rgba(145,70,255,0.1)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '60px 40px 20px',
          fontSize: 14, color: COLORS.purple, fontWeight: 600, letterSpacing: '-0.01em',
          textShadow: '0 0 20px rgba(145,70,255,0.5)',
        }}>
          MultiClip Hub
        </div>
      </div>

      {/* Feature rows spanning both panels */}
      <div style={{
        position: 'absolute', top: '20%', left: 0, right: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        {ROWS.map(({ lf: rowLf, feature, left, right }, i) => {
          const opacity  = ai(lf, [rowLf, rowLf + 20], [0, 1])
          const isPrice  = feature === 'Preço mensal'
          const rightIsPrice = isPrice && priceHighlight
          const rowFadeOp = priceHighlight && !isPrice ? 0.3 : 1

          return (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                opacity: opacity * rowFadeOp,
                height: 44,
              }}
            >
              {/* Left cell */}
              <div style={{ width: '47%', paddingLeft: 40, fontSize: 13, color: '#333333' }}>
                {left}
              </div>
              {/* Feature name */}
              <div style={{ width: '5%' }} />
              <div style={{ flex: 1, fontSize: 13, color: '#888888', textAlign: 'center' }}>
                {feature}
              </div>
              <div style={{ width: '2%' }} />
              {/* Right cell */}
              <div style={{ width: '46%', paddingLeft: 16 }}>
                {rightIsPrice ? (
                  <div style={{ transform: `scale(${priceScale})`, display: 'inline-block' }}>
                    <NeonText size={20} color={COLORS.mint} glowColor={COLORS.mint} glowStrength={60}>
                      {right}
                    </NeonText>
                  </div>
                ) : (
                  <span style={{ fontSize: right.startsWith('✅') ? 16 : 13, color: COLORS.mint }}>
                    {right}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <CaptionLine text={CAPTIONS.comparison} startFrame={60} endFrame={750} />
    </AbsoluteFill>
  )
}
