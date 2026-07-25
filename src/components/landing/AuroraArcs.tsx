'use client'

export function AuroraArcs() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* LEFT ARC — primary purple → mint */}
      <div
        style={{
          position: 'absolute',
          left: '-18%',
          top: '0%',
          width: '58%',
          height: '100%',
          background:
            'conic-gradient(from 195deg at 25% 48%, #9146FF 0deg, #00E5A0 70deg, transparent 130deg)',
          filter: 'blur(90px)',
          opacity: 0.30,
          borderRadius: '50%',
        }}
      />
      {/* LEFT ARC — inner intensity boost */}
      <div
        style={{
          position: 'absolute',
          left: '-6%',
          top: '10%',
          width: '38%',
          height: '75%',
          background:
            'conic-gradient(from 205deg at 18% 50%, #9146FF 0deg, rgba(145,70,255,0.6) 45deg, transparent 90deg)',
          filter: 'blur(60px)',
          opacity: 0.40,
          borderRadius: '50%',
        }}
      />

      {/* RIGHT ARC — primary mint → purple */}
      <div
        style={{
          position: 'absolute',
          right: '-18%',
          top: '0%',
          width: '58%',
          height: '100%',
          background:
            'conic-gradient(from 15deg at 75% 48%, #00E5A0 0deg, #9146FF 70deg, transparent 130deg)',
          filter: 'blur(90px)',
          opacity: 0.30,
          borderRadius: '50%',
        }}
      />
      {/* RIGHT ARC — inner intensity boost */}
      <div
        style={{
          position: 'absolute',
          right: '-6%',
          top: '10%',
          width: '38%',
          height: '75%',
          background:
            'conic-gradient(from 5deg at 82% 50%, #00E5A0 0deg, rgba(0,229,160,0.6) 45deg, transparent 90deg)',
          filter: 'blur(60px)',
          opacity: 0.40,
          borderRadius: '50%',
        }}
      />

      {/* Fade left → center */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '18%',
          background: 'linear-gradient(to right, #000000, transparent)',
        }}
      />
      {/* Fade right → center */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '18%',
          background: 'linear-gradient(to left, #000000, transparent)',
        }}
      />
      {/* Fade top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to bottom, #000000, transparent)',
        }}
      />
      {/* Fade bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(to top, #000000, transparent)',
        }}
      />
    </div>
  )
}
