// src/components/ui/brand/Glass.tsx
// Glassmorphism components — the premium surface system (Design Layer 2).

import { cn } from '@/lib/utils'

interface GlassProps {
  children: React.ReactNode
  className?: string
  intensity?: 'subtle' | 'medium' | 'strong'
  border?: 'none' | 'default' | 'accent-mint' | 'accent-purple' | 'gradient'
  glow?: 'none' | 'mint' | 'purple' | 'gold'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
  hover?: boolean
}

const intensities = {
  subtle: 'bg-white/[0.03] backdrop-blur-sm',
  medium: 'bg-white/[0.05] backdrop-blur-md',
  strong: 'bg-white/[0.08] backdrop-blur-xl',
}

const borders = {
  none:            'border-transparent',
  default:         'border border-white/[0.08]',
  'accent-mint':   'border border-mint/25',
  'accent-purple': 'border border-purple/25',
  gradient:        'border border-transparent',
}

const glows = {
  none:   '',
  mint:   'shadow-[0_0_30px_rgba(0,229,160,0.12)]',
  purple: 'shadow-[0_0_30px_rgba(145,70,255,0.12)]',
  gold:   'shadow-[0_0_30px_rgba(255,215,0,0.12)]',
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

const roundeds = {
  md:   'rounded-xl',
  lg:   'rounded-2xl',
  xl:   'rounded-3xl',
  '2xl':'rounded-[28px]',
}

export function GlassCard({
  children,
  className,
  intensity = 'medium',
  border = 'default',
  glow = 'none',
  padding = 'md',
  rounded = 'lg',
  hover = false,
}: GlassProps) {
  if (border === 'gradient') {
    return (
      <div
        className={cn(
          'relative p-[1px]',
          roundeds[rounded],
          'bg-gradient-to-br from-purple/30 via-white/5 to-mint/30',
          hover && 'transition-all duration-300 hover:-translate-y-1',
          glow !== 'none' && glows[glow],
          className
        )}
      >
        <div className={cn(
          'h-full w-full',
          roundeds[rounded],
          intensities[intensity],
          paddings[padding],
        )}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      intensities[intensity],
      borders[border],
      roundeds[rounded],
      paddings[padding],
      glows[glow],
      hover && [
        'transition-all duration-300',
        'hover:-translate-y-1',
        'hover:bg-white/[0.07]',
        'hover:border-white/[0.15]',
        'hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
      ],
      className
    )}>
      {children}
    </div>
  )
}

// Glass panel — for larger sections/panels
export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      'relative overflow-hidden',
      'bg-white/[0.03] backdrop-blur-xl',
      'border border-white/[0.06]',
      'rounded-3xl',
      'shadow-[0_8px_48px_rgba(0,0,0,0.5)]',
      className
    )}>
      {/* Inner top light reflection */}
      <div className="absolute top-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        pointer-events-none" />
      {children}
    </div>
  )
}

// Glass nav item — standalone glass treatment for simple nav links.
// (The dashboard Sidebar keeps its own animated NavItem; use this for new menus.)
export function GlassNavItem({
  children,
  active = false,
  className,
  ...props
}: {
  children: React.ReactNode
  active?: boolean
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative rounded-xl px-3 py-2.5',
        'transition-all duration-200',
        active ? [
          'bg-mint/[0.12]',
          'border border-mint/20',
          'text-mint',
        ] : [
          'text-white/50',
          'hover:bg-white/[0.05]',
          'hover:text-white/80',
          'border border-transparent',
        ],
        className
      )}
      {...props}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2
          w-0.5 h-4 bg-mint rounded-full
          shadow-[0_0_8px_#00E5A0]" />
      )}
      {children}
    </div>
  )
}
