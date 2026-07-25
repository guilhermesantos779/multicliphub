// src/components/ui/brand/EmptyState.tsx
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'compact'
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      variant === 'default' ? 'py-20 px-6' : 'py-10 px-4',
      className
    )}>
      {/* Icon container with subtle surface */}
      <div className={cn(
        'flex items-center justify-center rounded-2xl',
        'bg-white/[0.04] border border-white/[0.07]',
        'mb-5',
        variant === 'default' ? 'w-16 h-16' : 'w-12 h-12'
      )}>
        <div className={variant === 'default' ? 'w-8 h-8' : 'w-6 h-6'}>
          {icon}
        </div>
      </div>

      {/* Dotted connecting line (decorative) */}
      <div className="w-px h-4 bg-gradient-to-b from-white/10 to-transparent mb-5" />

      <h3 className={cn(
        'font-bold text-white mb-2',
        variant === 'default' ? 'text-lg' : 'text-base'
      )}>
        {title}
      </h3>
      <p className={cn(
        'text-white/40 leading-relaxed max-w-xs',
        variant === 'default' ? 'text-sm' : 'text-xs'
      )}>
        {description}
      </p>

      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            'mt-6 px-5 py-2.5',
            'bg-gradient-to-br from-mint-bright to-mint-dark',
            'text-black font-bold text-sm rounded-xl',
            'transition-all duration-150',
            'hover:shadow-[0_0_20px_rgba(0,229,160,0.3)]',
            'hover:scale-[1.02]',
            'active:scale-[0.98]',
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
