'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronRight } from 'lucide-react'
import { useOnboarding } from '@/hooks/useOnboarding'

export function OnboardingChecklist() {
  const router = useRouter()
  const { items, completedCount, total, markItem, dismissChecklist } = useOnboarding()
  const [open, setOpen] = useState(false)

  const pct = total > 0 ? (completedCount / total) * 100 : 0
  const hasPending = completedCount < total

  function handleItemClick(key: string, href: string, external?: boolean, completed?: boolean) {
    if (completed) return
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer')
      markItem('join_discord')
      return
    }
    router.push(href)
    setOpen(false)
  }

  // ── Progress ring (collapsed) ──────────────────────────────────────────────
  const R = 18
  const C = 2 * Math.PI * R
  const dash = C * (pct / 100)

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="mb-3 flex max-h-[420px] w-[300px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-2xl"
          >
            {/* Header */}
            <div className="border-b border-white/[0.06] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-[15px] font-semibold text-white">Primeiros passos</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/30 transition-colors hover:text-white/70"
                  aria-label="Fechar"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[#00E5A0]"
                  animate={{ width: `${pct}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                />
              </div>
              <p className="mt-2 text-[11px] text-white/40">
                {completedCount} de {total} concluídos
              </p>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-2">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleItemClick(item.key, item.href, item.external, item.completed)}
                  disabled={item.completed}
                  className={[
                    'group flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors',
                    item.completed ? 'cursor-default' : 'hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {/* Status circle */}
                  {item.completed ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00E5A0]"
                    >
                      <Check size={13} className="text-black" strokeWidth={3} />
                    </motion.span>
                  ) : (
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/20">
                      <item.icon size={12} className="text-white/60" />
                    </span>
                  )}

                  <span className="min-w-0 flex-1">
                    <span
                      className={[
                        'block text-[12.5px] font-medium',
                        item.completed ? 'text-white/40 line-through' : 'text-white',
                      ].join(' ')}
                    >
                      {item.label}
                    </span>
                    {!item.completed && (
                      <span className="block truncate text-[11px] text-white/40">{item.description}</span>
                    )}
                  </span>

                  {!item.completed && (
                    <ChevronRight size={14} className="shrink-0 text-white/20 group-hover:text-white/50" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer — dismiss only after 5/7 */}
            {completedCount >= 5 && hasPending && (
              <div className="border-t border-white/[0.06] p-3 text-center">
                <button
                  onClick={dismissChecklist}
                  className="text-[11px] text-white/30 transition-colors hover:text-white/60"
                >
                  Dispensar
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed button with progress ring */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-[#0a0a0a] shadow-xl"
      >
        {/* Pulsing glow when there are pending items */}
        {hasPending && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: '0 0 0 0 rgba(145,70,255,0.5)' }}
            animate={{ boxShadow: ['0 0 0 0 rgba(145,70,255,0.45)', '0 0 0 10px rgba(145,70,255,0)'] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        )}
        <svg width="44" height="44" className="-rotate-90">
          <circle cx="22" cy="22" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <motion.circle
            cx="22" cy="22" r={R} fill="none" stroke="#00E5A0" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={C}
            animate={{ strokeDashoffset: C - dash }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          />
        </svg>
        <span className="absolute text-[11px] font-bold text-[#00E5A0]">
          {completedCount}/{total}
        </span>
      </motion.button>
    </div>
  )
}
