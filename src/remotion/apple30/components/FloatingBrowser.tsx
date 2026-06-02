import React, { forwardRef } from 'react'
import { C } from '../constants'

interface FloatingBrowserProps {
  children: React.ReactNode
  width?: number
  style?: React.CSSProperties
}

export const FloatingBrowser = forwardRef<HTMLDivElement, FloatingBrowserProps>(
  function FloatingBrowser({ children, width = 960, style }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width,
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: `
            0 80px 200px rgba(0,0,0,0.9),
            0 40px 80px rgba(0,0,0,0.7),
            0 0 0 0.5px rgba(255,255,255,0.08),
            0 0 120px rgba(145,70,255,0.08)
          `,
          border: '0.5px solid rgba(255,255,255,0.10)',
          ...style,
        }}
      >
        {/* Browser Chrome */}
        <div
          style={{
            height: 36,
            background: 'rgba(10,10,10,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '0.5px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            {[
              { color: '#FF5F57', shadow: 'rgba(255,95,87,0.5)' },
              { color: '#FEBC2E', shadow: 'rgba(254,188,46,0.5)' },
              { color: '#28C840', shadow: 'rgba(40,200,64,0.5)' },
            ].map((dot, i) => (
              <div
                key={i}
                style={{
                  width: 11, height: 11,
                  borderRadius: '50%',
                  background: dot.color,
                  boxShadow: `0 0 4px ${dot.shadow}`,
                }}
              />
            ))}
          </div>

          {/* URL bar */}
          <div
            style={{
              flex: 1,
              height: 22,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '10px',
              gap: '6px',
              margin: '0 10px',
            }}
          >
            <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
              <rect x="1" y="4" width="6" height="5" rx="1"
                fill="rgba(255,255,255,0.25)" />
              <path d="M2.5 4V2.5C2.5 1.67 3.17 1 4 1s1.5.67 1.5 1.5V4"
                stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            </svg>
            <span
              style={{
                fontFamily: '"Sora", sans-serif',
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.01em',
              }}
            >
              multicliphub.com
            </span>
          </div>
        </div>

        {/* Content area */}
        <div style={{ background: C.surface }}>
          {children}
        </div>
      </div>
    )
  }
)
