'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface WebGLShaderProps {
  xScale?: number     // horizontal curve scale  (default 1.0)
  yScale?: number     // vertical amplitude      (default 0.5)
  distortion?: number // chromatic distortion    (default 0.05)
  speed?: number      // animation speed         (default 0.008) — lower = slower
}

const VERTEX_SHADER = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

// Purple→mint light curves — brand palette #9146FF / #00E5A0
const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform vec2  resolution;
  uniform float time;
  uniform float xScale;
  uniform float yScale;
  uniform float distortion;

  const vec3 PURPLE = vec3(0.569, 0.275, 1.0);   // #9146FF
  const vec3 MINT   = vec3(0.0,   0.898, 0.627);  // #00E5A0

  void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    float d  = length(p) * distortion;
    float rx = p.x * (1.0 + d);

    float intensity = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);

    // Gradient factor: purple→mint along X, with gentle time-based drift
    float t = clamp((p.x + 1.0) * 0.5 + 0.15 * sin(time * 0.2), 0.0, 1.0);
    vec3 lineColor = mix(PURPLE, MINT, t);

    vec3 color = lineColor * intensity;
    gl_FragColor = vec4(color, 1.0);
  }
`

export function WebGLShader({
  xScale = 1.0,
  yScale = 0.5,
  distortion = 0.05,
  speed = 0.008,
}: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mutable refs so the animation loop can read latest values without restarting
  const speedRef      = useRef(speed)
  const animIdRef     = useRef<number | null>(null)
  const uniformsRef   = useRef<Record<string, { value: unknown }> | null>(null)

  // Keep speedRef in sync with the prop (no loop restart needed)
  useEffect(() => { speedRef.current = speed }, [speed])

  // Update uniforms live when props change — no Three.js teardown
  useEffect(() => {
    const u = uniformsRef.current
    if (!u) return
    ;(u.xScale as { value: number }).value     = xScale
    ;(u.yScale as { value: number }).value     = yScale
    ;(u.distortion as { value: number }).value = distortion
  }, [xScale, yScale, distortion])

  // One-time Three.js setup — runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // FIX: when prefers-reduced-motion is set, run at 20% speed instead of
    // stopping completely. A frozen background looks broken; slow movement
    // respects the accessibility intent without appearing as a bug.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const motionMultiplier = reduceMotion ? 0.2 : 1.0

    // Renderer — cap pixel ratio for performance. On phones (<768px) cap
    // harder at 1.5 so the fullscreen fragment shader doesn't lag mid-range
    // devices; desktop keeps the crisper 2x ceiling.
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const pixelCap = isMobile ? 1.5 : 2
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(devicePixelRatio, pixelCap))
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Full-screen triangle covering clip-space
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array([-1, -1, 3, -1, -1, 3]), 2),
    )

    const uniforms = {
      resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      time:       { value: 0.0 },
      xScale:     { value: xScale },
      yScale:     { value: yScale },
      distortion: { value: distortion },
    }
    uniformsRef.current = uniforms as Record<string, { value: unknown }>

    const material = new THREE.RawShaderMaterial({
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
    })
    scene.add(new THREE.Mesh(geometry, material))

    // Resize handler
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      uniforms.resolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    let lastTime = performance.now()

    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate)
      const now   = performance.now()
      const delta = (now - lastTime) / 1000
      lastTime = now
      // delta * speed * 60 → ~speed units per frame at 60fps
      uniforms.time.value += delta * speedRef.current * motionMultiplier * 60
      renderer.render(scene, camera)
    }

    animate() // always start the loop; reduced-motion just slows it

    // Pause when tab is hidden, resume on focus
    const onVisibility = () => {
      if (document.hidden) {
        if (animIdRef.current !== null) {
          cancelAnimationFrame(animIdRef.current)
          animIdRef.current = null
        }
      } else if (animIdRef.current === null) {
        lastTime = performance.now()
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      if (animIdRef.current !== null) {
        cancelAnimationFrame(animIdRef.current)
        animIdRef.current = null
      }
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
      uniformsRef.current = null
      material.dispose()
      geometry.dispose()
      renderer.dispose()
    }
  }, []) // runs once — props are accessed via refs or separate effects

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    />
  )
}
