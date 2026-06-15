// src/components/ui/brand/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'mint' | 'purple' | 'gold' | 'silver' | 'bronze'
    | 'error' | 'warning' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variants = {
  mint:    'bg-mint/10 text-mint border-mint/20',
  purple:  'bg-purple/10 text-purple border-purple/20',
  gold:    'bg-gold/10 text-gold border-gold/20',
  silver:  'bg-silver/10 text-silver border-silver/20',
  bronze:  'bg-bronze/10 text-bronze border-bronze/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  neutral: 'bg-white/5 text-white/50 border-white/10',
}

const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5',
      'font-bold border rounded-full',
      'leading-none',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          variant === 'mint'   && 'bg-mint animate-pulse',
          variant === 'purple' && 'bg-purple',
          variant === 'gold'   && 'bg-gold',
          variant === 'error'  && 'bg-red-400',
          !['mint', 'purple', 'gold', 'error'].includes(variant) && 'bg-current'
        )} />
      )}
      {children}
    </span>
  )
}
