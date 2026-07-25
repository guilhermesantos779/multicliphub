'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'

// Shared open-state for the mobile navigation drawer. The hamburger lives in
// the Topbar while the drawer itself is the Sidebar, so they coordinate through
// this lightweight context instead of prop-drilling across the layout.
interface MobileNavCtx {
  open: boolean
  setOpen: (v: boolean) => void
  toggle: () => void
}

const Ctx = createContext<MobileNavCtx | null>(null)

export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <Ctx.Provider value={{ open, setOpen, toggle: () => setOpen(!open) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useMobileNav() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useMobileNav must be used within MobileNavProvider')
  return ctx
}
