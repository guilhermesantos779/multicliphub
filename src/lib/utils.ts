import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`
  return views.toString()
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(date))
}

export function formatCurrencyBRL(cents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100)
}

export function getPlanLimits(plan: string) {
  const limits = {
    clipper: { postsPerMonth: 200, channelsTotal: 3, channelsPerPlatform: 1 },
    pro: { postsPerMonth: Infinity, channelsTotal: 9, channelsPerPlatform: 3 },
    king: { postsPerMonth: Infinity, channelsTotal: Infinity, channelsPerPlatform: Infinity },
    trial: { postsPerMonth: 10, channelsTotal: 2, channelsPerPlatform: 1 },
  }
  return limits[plan as keyof typeof limits] || limits.trial
}
