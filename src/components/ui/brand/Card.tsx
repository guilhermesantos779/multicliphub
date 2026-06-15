// src/components/ui/brand/Card.tsx
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const variants = {
  default:  'bg-white/[0.04] border border-white/[0.08]',
  elevated: 'bg-white/[0.06] border border-white/[0.10] shadow-lg',
  bordered: 'bg-transparent border border-white/[0.12]',
  ghost:    'bg-transparent border-none',
}

const paddings = {
  none: '',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variants[variant],
        paddings[padding],
        hover && [
          'transition-all duration-200',
          'hover:-translate-y-0.5',
          'hover:border-white/[0.15]',
          'hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          'cursor-pointer',
        ],
        className
      )}
    >
      {children}
    </div>
  )
}

// Stat card — for dashboard metrics
export function StatCard({
  label,
  value,
  sub,
  icon,
  color = 'mint',
  className,
}: {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  color?: 'mint' | 'purple' | 'gold'
  className?: string
}) {
  const colorMap = {
    mint:   { text: 'text-mint',   bg: 'bg-mint/10',   border: 'border-mint/20' },
    purple: { text: 'text-purple', bg: 'bg-purple/10', border: 'border-purple/20' },
    gold:   { text: 'text-gold',   bg: 'bg-gold/10',   border: 'border-gold/20' },
  }
  const c = colorMap[color]

  return (
    <Card
      variant="default"
      padding="md"
      hover
      className={cn('space-y-3', className)}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/40
          uppercase tracking-widest">
          {label}
        </span>
        {icon && (
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            c.bg, `border ${c.border}`
          )}>
            {icon}
          </div>
        )}
      </div>
      <div>
        <div className={cn(
          'text-3xl font-black tracking-tight leading-none',
          c.text
        )}>
          {value}
        </div>
        {sub && (
          <p className="text-xs text-white/30 mt-1.5">{sub}</p>
        )}
      </div>
    </Card>
  )
}
