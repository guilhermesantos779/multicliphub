// Shared SVG <defs> mounted once at the app root. The purple→mint gradient and
// the neon glow filter are referenced document-wide by id (url(#mchGradient),
// url(#mchGlow)) from every proprietary icon — defined here a single time.
export function IconDefs() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        <linearGradient id="mchGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9146FF" />
          <stop offset="100%" stopColor="#00E5A0" />
        </linearGradient>
        <linearGradient id="mchGradientDiag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9146FF" />
          <stop offset="100%" stopColor="#00E5A0" />
        </linearGradient>
        <filter id="mchGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
