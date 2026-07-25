import { interpolate } from 'remotion'
import { APPLE } from './easing'

export function ai(
  frame: number,
  frameRange: [number, number],
  valueRange: [number, number],
  easing: (t: number) => number = APPLE,
): number {
  return interpolate(frame, frameRange, valueRange, {
    easing,
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })
}

export const fadeIn  = (f: number, start: number, dur = 20) =>
  ai(f, [start, start + dur], [0, 1])

export const fadeOut = (f: number, end: number, dur = 20) =>
  ai(f, [end - dur, end], [1, 0])

export const sceneFade = (f: number, start: number, end: number, dur = 25) =>
  Math.min(fadeIn(f, start, dur), fadeOut(f, end, dur))
