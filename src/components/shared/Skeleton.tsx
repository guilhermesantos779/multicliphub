import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-white/[0.06]', className)} />
  )
}

export function PostCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#111111] p-4">
      <div className="h-10 w-10 animate-pulse rounded-lg bg-white/[0.06]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-white/[0.06]" />
      </div>
      <div className="h-5 w-16 animate-pulse rounded-full bg-white/[0.06]" />
    </div>
  )
}
