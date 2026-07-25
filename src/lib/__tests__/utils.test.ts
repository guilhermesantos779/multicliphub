import { describe, it, expect } from 'vitest'
import { formatViews } from '../utils'

// NOTE: the real formatViews always keeps one decimal (e.g. "1.0K", "1.0M")
// and has no billions branch — these assertions match the actual implementation,
// not an idealized format.
describe('formatViews', () => {
  it('formata valores abaixo de 1K como número puro', () => {
    expect(formatViews(0)).toBe('0')
    expect(formatViews(999)).toBe('999')
  })

  it('formata milhares com uma casa decimal', () => {
    expect(formatViews(1000)).toBe('1.0K')
    expect(formatViews(1500)).toBe('1.5K')
    expect(formatViews(10000)).toBe('10.0K')
  })

  it('formata milhões com uma casa decimal', () => {
    expect(formatViews(1_000_000)).toBe('1.0M')
    expect(formatViews(1_500_000)).toBe('1.5M')
  })
})
