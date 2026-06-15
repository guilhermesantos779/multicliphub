// src/components/ui/brand/AmbientGlow.tsx
// Background ambient gradients — purely decorative, pointer-events-none.

interface AmbientGlowProps {
  variant?: 'hero' | 'section-mint' | 'section-purple' | 'section-both'
  className?: string
}

export function AmbientGlow({
  variant = 'hero',
  className,
}: AmbientGlowProps) {
  const variants = {
    hero: (
      <>
        {/* Top center — mint */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2
          w-[800px] h-[600px] rounded-full
          bg-[radial-gradient(ellipse,rgba(0,229,160,0.08)_0%,transparent_70%)]
          pointer-events-none" />
        {/* Bottom right — purple */}
        <div className="absolute -bottom-20 right-0
          w-[500px] h-[400px] rounded-full
          bg-[radial-gradient(ellipse,rgba(145,70,255,0.06)_0%,transparent_70%)]
          pointer-events-none" />
      </>
    ),
    'section-mint': (
      <div className="absolute inset-0
        bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(0,229,160,0.06),transparent_70%)]
        pointer-events-none" />
    ),
    'section-purple': (
      <div className="absolute inset-0
        bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(145,70,255,0.06),transparent_70%)]
        pointer-events-none" />
    ),
    'section-both': (
      <>
        <div className="absolute top-0 left-0 w-1/2 h-full
          bg-[radial-gradient(ellipse_at_left,rgba(145,70,255,0.05),transparent_60%)]
          pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full
          bg-[radial-gradient(ellipse_at_right,rgba(0,229,160,0.05),transparent_60%)]
          pointer-events-none" />
      </>
    ),
  }

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ''}`}
    >
      {variants[variant]}
    </div>
  )
}

// Spot glow — single accent dot of light.
export function SpotGlow({
  color = 'mint',
  size = 'md',
  position = 'center',
}: {
  color?: 'mint' | 'purple' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const colors = {
    mint:   'rgba(0,229,160,0.15)',
    purple: 'rgba(145,70,255,0.15)',
    gold:   'rgba(255,215,0,0.15)',
  }
  const sizes = {
    sm: 'w-48 h-48',
    md: 'w-80 h-80',
    lg: 'w-[500px] h-[500px]',
  }
  const positions = {
    center:        'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left':     'top-0 left-0 -translate-x-1/4 -translate-y-1/4',
    'top-right':    'top-0 right-0 translate-x-1/4 -translate-y-1/4',
    'bottom-left':  'bottom-0 left-0 -translate-x-1/4 translate-y-1/4',
    'bottom-right': 'bottom-0 right-0 translate-x-1/4 translate-y-1/4',
  }

  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none rounded-full blur-3xl
        ${sizes[size]} ${positions[position]}`}
      style={{
        background: `radial-gradient(circle, ${colors[color]}, transparent 70%)`,
      }}
    />
  )
}
