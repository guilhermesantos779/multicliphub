'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface AnimatedBorderButtonProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  href?: string
}

export function AnimatedBorderButton({
  children,
  onClick,
  className,
  href,
}: AnimatedBorderButtonProps) {
  const inner = (
    <span
      className={cn(
        'animated-border-btn',
        'relative inline-flex cursor-pointer select-none items-center justify-center',
        'rounded-full px-6 py-2.5',
        'text-[13px] font-medium text-white',
        className,
      )}
      onClick={onClick}
    >
      {/* Fundo preto interno */}
      <span
        className="absolute inset-[2px] rounded-full bg-black"
        aria-hidden
      />
      {/* Texto acima */}
      <span className="relative z-10">{children}</span>
    </span>
  )

  if (href) {
    return <Link href={href}>{inner}</Link>
  }
  return <>{inner}</>
}
