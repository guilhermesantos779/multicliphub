import React from 'react'
import { useCurrentFrame, interpolate } from 'remotion'
import { APPLE } from '../easing'

interface CaptionLineProps {
  text: string
  startFrame: number
  endFrame: number
}

export function CaptionLine({ text, startFrame, endFrame }: CaptionLineProps) {
  const frame = useCurrentFrame()
  const lf    = frame - startFrame

  const opacity = Math.min(
    interpolate(lf, [0, 15], [0, 1], {
      easing: APPLE, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }),
    interpolate(frame, [endFrame - 20, endFrame], [1, 0], {
      easing: APPLE, extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }),
  )

  const charsToShow = interpolate(lf, [0, 40], [0, text.length], {
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })

  const visible   = text.slice(0, Math.floor(charsToShow))
  const cursorOn  = Math.floor(frame / 8) % 2 === 0

  if (frame < startFrame || frame > endFrame) return null

  return (
    <div
      style={{
        position:       'absolute',
        bottom:         80,
        left:           0,
        right:          0,
        display:        'flex',
        justifyContent: 'center',
        opacity,
        zIndex:         100,
        pointerEvents:  'none',
      }}
    >
      <div
        style={{
          background:     'rgba(0,0,0,0.72)',
          border:         '1px solid rgba(255,255,255,0.10)',
          borderRadius:   99,
          padding:        '10px 28px',
          backdropFilter: 'blur(16px)',
          fontFamily:     '"Inter", sans-serif',
          fontSize:       16,
          color:          'rgba(255,255,255,0.82)',
          letterSpacing:  '0.01em',
          whiteSpace:     'nowrap',
        }}
      >
        {visible}
        <span style={{ opacity: cursorOn ? 1 : 0, color: '#9146FF' }}>|</span>
      </div>
    </div>
  )
}
