'use client'

import dynamic from 'next/dynamic'
import type { WebGLShaderProps } from './web-gl-shader'

// Lazy-loads three.js only after first paint — keeps LCP fast
const WebGLShaderInner = dynamic(
  () => import('./web-gl-shader').then(m => m.WebGLShader),
  { ssr: false, loading: () => null },
)

export function WebGLShaderLazy(props: WebGLShaderProps) {
  return <WebGLShaderInner {...props} />
}
