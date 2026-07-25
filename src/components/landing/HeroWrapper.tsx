'use client'

import dynamic from 'next/dynamic'

const Hero = dynamic(
  () => import('@/components/landing/Hero').then(m => ({ default: m.Hero })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(145,70,255,0.3)',
            borderTopColor: '#9146FF',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
)

export function HeroWrapper() {
  return <Hero />
}
