'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  subLabel?: string
  icon: ReactNode
  iconBg?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  className?: string
}

const trendColors = {
  up: '#DEFF9A',
  down: '#ef4444',
  neutral: '#888888',
}

export function MetricCard({
  label, value, subLabel, icon, iconBg = '#1a1030',
  trend, trendValue, className,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border border-white/[0.06] bg-[#111111] p-4',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#444444]">
          {label}
        </span>
        <div
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[22px] font-bold leading-none text-white">
            {value}
          </div>
          {subLabel && (
            <div className="mt-1 text-[11px] text-[#444444]">{subLabel}</div>
          )}
        </div>

        {trend && trendValue && (
          <div
            className="flex items-center gap-1 text-[11px] font-medium"
            style={{ color: trendColors[trend] }}
          >
            <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-white/[0.06]" />
      </div>
      <div className="h-7 w-24 animate-pulse rounded bg-white/[0.06]" />
      <div className="mt-1.5 h-2.5 w-16 animate-pulse rounded bg-white/[0.06]" />
    </div>
  )
}
