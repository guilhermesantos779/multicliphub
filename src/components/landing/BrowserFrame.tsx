'use client'

import type { Ref } from 'react'
import { AppDashboard, type ScreenId } from './AppDashboard'

const URL_LABELS: Record<ScreenId, string> = {
  dashboard: 'multicliphub.com/dashboard',
  upload:    'multicliphub.com/upload',
  analytics: 'multicliphub.com/analytics',
  ranking:   'multicliphub.com/ranking',
}

interface BrowserFrameProps {
  ref?: Ref<HTMLDivElement>
  style?: React.CSSProperties
  className?: string
  activeScreen: ScreenId
  onScreenChange: (screen: ScreenId) => void
}

export function BrowserFrame({ ref, style, className, activeScreen, onScreenChange }: BrowserFrameProps) {
  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: '100%',
        background: '#111111',
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.10)',
        overflow: 'hidden',
        boxShadow:
          '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.08)',
        ...style,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 38,
          background: '#1c1c1c',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          gap: 14,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {(['#FF5F57', '#FEBC2E', '#28C840'] as const).map((c, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
          ))}
        </div>

        {/* Dynamic URL bar */}
        <div
          style={{
            flex: 1,
            maxWidth: 380,
            height: 24,
            margin: '0 auto',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 10, color: '#00E5A0', lineHeight: 1 }}>🔒</span>
          <span
            style={{
              fontSize: 11,
              color: '#888888',
              fontFamily: 'monospace',
              letterSpacing: '-0.01em',
              transition: 'all 0.22s ease',
            }}
          >
            {URL_LABELS[activeScreen]}
          </span>
        </div>
      </div>

      {/* App content */}
      <div style={{ height: 480, overflow: 'hidden' }}>
        <AppDashboard activeScreen={activeScreen} onScreenChange={onScreenChange} />
      </div>
    </div>
  )
}
