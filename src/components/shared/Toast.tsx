'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createContext, useContext } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

const icons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: '📢',
  warning: '⚠️',
}

const colors: Record<ToastType, string> = {
  success: '#DEFF9A',
  error: '#ef4444',
  info: '#00E5A0',
  warning: '#f59e0b',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-center gap-3 overflow-hidden rounded-[14px] border border-white/[0.1] bg-obsidiana/90 px-4 py-3 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
              style={{
                borderLeftColor: colors[t.type],
                borderLeftWidth: 3,
                boxShadow: `0 16px 48px rgba(0,0,0,0.6), 0 0 24px ${colors[t.type]}1f`,
              }}
            >
              {/* Top-edge shine */}
              <span className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span>{icons[t.type]}</span>
              <span className="text-[13px] font-medium text-white/90">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
