// Compact number formatting with PT-BR decimals (comma): 1500 -> "1,5K".
export function formatNumber(value: number): string {
  if (value < 1000) return String(value)
  const format = (n: number, suffix: string) => {
    const fixed = (Math.floor((n) * 10) / 10).toFixed(1) // truncate, 1 decimal
    const trimmed = fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
    return trimmed.replace('.', ',') + suffix
  }
  if (value < 1_000_000) return format(value / 1000, 'K')
  if (value < 1_000_000_000) return format(value / 1_000_000, 'M')
  return format(value / 1_000_000_000, 'B')
}
