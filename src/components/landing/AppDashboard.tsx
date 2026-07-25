'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import { DashboardScreen } from './screens/DashboardScreen'
import { UploadScreen }    from './screens/UploadScreen'
import { AnalyticsScreen } from './screens/AnalyticsScreen'
import { RankingScreen }   from './screens/RankingScreen'

export type ScreenId = 'dashboard' | 'upload' | 'analytics' | 'ranking'

interface AppDashboardProps {
  activeScreen: ScreenId
  onScreenChange: (screen: ScreenId) => void
}

const NAV_ITEMS: { id: ScreenId; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'upload',    icon: '↑', label: 'Upload'     },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
  { id: 'ranking',   icon: '🏆', label: 'Ranking'   },
]

const SCREENS: Record<ScreenId, ComponentType> = {
  dashboard: DashboardScreen,
  upload:    UploadScreen,
  analytics: AnalyticsScreen,
  ranking:   RankingScreen,
}

const SCREEN_VARIANTS = {
  enter:  { x: 20, opacity: 0 },
  center: { x: 0,  opacity: 1 },
  exit:   { x: -20, opacity: 0 },
}

export function AppDashboard({ activeScreen, onScreenChange }: AppDashboardProps) {
  const ActiveScreenComponent = SCREENS[activeScreen]

  return (
    <div style={{ display: 'flex', height: '100%', background: '#000000', overflow: 'hidden', fontFamily: 'inherit' }}>

      {/* SIDEBAR — clickable nav */}
      <div style={{ width: 128, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Image src="/logo.png" alt="MultiClip Hub" width={18} height={18} style={{ borderRadius: 4 }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: '#FAFAFA', letterSpacing: '-0.02em', lineHeight: 1.2 }}>MultiClip Hub</span>
        </div>

        {/* User badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg, #9146FF, #00E5A0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>G</div>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#FAFAFA' }}>Guilherme</div>
            <div style={{ fontSize: 8, color: '#9146FF' }}>Plano King</div>
          </div>
        </div>

        {/* Clickable nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px', flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeScreen === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onScreenChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 8px',
                  borderRadius: 6,
                  background: isActive ? 'rgba(145,70,255,0.10)' : 'transparent',
                  color: isActive ? '#FAFAFA' : '#555555',
                  fontSize: 10,
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: isActive ? '2px solid #9146FF' : '2px solid transparent',
                  border: 'none',
                  borderLeftWidth: 2,
                  borderLeftStyle: 'solid' as const,
                  borderLeftColor: isActive ? '#9146FF' : 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left' as const,
                  transition: 'all 0.18s ease',
                  outline: 'none',
                }}
              >
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* MAIN PANEL — animated screen transitions */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeScreen}
            variants={SCREEN_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          >
            <ActiveScreenComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
