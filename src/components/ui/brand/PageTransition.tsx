// src/components/ui/brand/PageTransition.tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Opacity-only on purpose: app pages render a sticky Topbar, and a transformed
// ancestor (translateY) would break `position: sticky`. A cross-fade keeps the
// header anchored while still feeling smooth.
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Stagger children — for grids/lists of cards that cascade in. Safe to use a
// transform here: these wrappers never contain sticky/fixed descendants.
export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
