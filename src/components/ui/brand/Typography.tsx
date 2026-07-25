// src/components/ui/brand/Typography.tsx
// Consistent typography primitives used across the entire app.

import { cn } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

// Display — hero headlines
export function Display({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'text-5xl md:text-6xl lg:text-7xl',
      'font-black tracking-[-0.03em] leading-[1.05]',
      'text-white',
      className
    )}>
      {children}
    </h1>
  )
}

// Heading 1
export function H1({ children, className }: TypographyProps) {
  return (
    <h1 className={cn(
      'text-3xl md:text-4xl lg:text-5xl',
      'font-black tracking-[-0.03em] leading-[1.1]',
      'text-white',
      className
    )}>
      {children}
    </h1>
  )
}

// Heading 2
export function H2({ children, className }: TypographyProps) {
  return (
    <h2 className={cn(
      'text-2xl md:text-3xl',
      'font-extrabold tracking-[-0.02em] leading-[1.15]',
      'text-white',
      className
    )}>
      {children}
    </h2>
  )
}

// Heading 3
export function H3({ children, className }: TypographyProps) {
  return (
    <h3 className={cn(
      'text-xl md:text-2xl',
      'font-bold tracking-[-0.01em] leading-[1.25]',
      'text-white',
      className
    )}>
      {children}
    </h3>
  )
}

// Eyebrow — small label above headings
export function Eyebrow({ children, className }: TypographyProps) {
  return (
    <p className={cn(
      'text-[11px] font-bold tracking-[0.1em] uppercase',
      'text-mint',
      className
    )}>
      {children}
    </p>
  )
}

// Body text
export function Body({
  children,
  className,
  size = 'base',
}: TypographyProps & { size?: 'sm' | 'base' | 'lg' }) {
  const sizes = {
    sm:   'text-sm',
    base: 'text-base',
    lg:   'text-lg',
  }
  return (
    <p className={cn(
      sizes[size],
      'font-normal leading-relaxed',
      'text-white/60',
      className
    )}>
      {children}
    </p>
  )
}

// Caption — smallest text, labels
export function Caption({ children, className }: TypographyProps) {
  return (
    <span className={cn(
      'text-xs font-medium',
      'text-white/40',
      className
    )}>
      {children}
    </span>
  )
}

// Gradient text — for highlighted words in headings
export function GradientText({
  children,
  className,
  from = '#3CFFB8',
  to = '#00B584',
}: TypographyProps & { from?: string; to?: string }) {
  return (
    <span
      className={cn('inline-block', className)}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
    >
      {children}
    </span>
  )
}
