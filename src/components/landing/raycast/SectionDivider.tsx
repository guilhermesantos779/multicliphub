'use client'

interface SectionDividerProps {
  eyebrow?: string
  glowColor?: 'purple' | 'mint' | 'none'
}

export function SectionDivider({ eyebrow, glowColor = 'none' }: SectionDividerProps) {
  return (
    <div className="relative">
      {glowColor !== 'none' && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 400,
            height: 200,
            background:
              glowColor === 'purple'
                ? 'radial-gradient(ellipse, rgba(145,70,255,0.10), transparent 70%)'
                : 'radial-gradient(ellipse, rgba(0,229,160,0.08), transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      )}
      <div className="relative border-t border-white/[0.04]">
        {eyebrow && (
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-black px-6">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
              {eyebrow}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
