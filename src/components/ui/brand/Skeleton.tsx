// src/components/ui/brand/Skeleton.tsx
// Shimmer skeleton states (Design Layer 3). Requires the `shimmer` keyframe
// in globals.css.
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'badge'
}

function SkeletonBase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/[0.06]',
        'relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-to-r',
        'before:from-transparent before:via-white/[0.08] before:to-transparent',
        'before:translate-x-[-100%]',
        'before:animate-[shimmer_1.5s_ease-in-out_infinite]',
        className
      )}
    />
  )
}

export function Skeleton({ className, variant = 'default' }: SkeletonProps) {
  if (variant === 'text') {
    return <SkeletonBase className={cn('h-4 w-full', className)} />
  }
  if (variant === 'avatar') {
    return <SkeletonBase className={cn('h-10 w-10 rounded-full', className)} />
  }
  if (variant === 'badge') {
    return <SkeletonBase className={cn('h-5 w-16 rounded-full', className)} />
  }
  return <SkeletonBase className={cn('h-4', className)} />
}

// Dashboard stats skeleton
export function StatCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.04]
      border border-white/[0.08] space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

// Video card skeleton (recent videos, profile grid)
export function VideoCardSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonBase className="aspect-[9/16] w-full rounded-xl" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

// Ranking row skeleton
export function RankingRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03]">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  )
}

// Profile header skeleton
export function ProfileHeaderSkeleton() {
  return (
    <div className="flex items-start gap-5 p-6">
      <Skeleton className="h-20 w-20 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-24" />
        <div className="flex gap-2 mt-2">
          <Skeleton variant="badge" />
          <Skeleton variant="badge" />
        </div>
      </div>
    </div>
  )
}
