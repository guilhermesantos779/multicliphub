'use client'

import {
  createContext, useCallback, useEffect, useRef, useState,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import { useProfileContext } from '@/components/app/ProfileProvider'
import { useToast } from '@/components/shared/Toast'
import { markChecklistItem } from '@/lib/onboarding/markComplete'
import {
  CHECKLIST_ITEMS, CHECKLIST_KEYS, CHECKLIST_TOTAL,
  type ChecklistItemDef, type ChecklistKey,
} from '@/lib/onboarding/items'

export interface ChecklistView extends ChecklistItemDef {
  completed: boolean
}

export interface OnboardingContextValue {
  ready: boolean
  // visibility flags (derived from the shared profile)
  showWizard: boolean
  showTour: boolean
  showChecklist: boolean
  // checklist state
  items: ChecklistView[]
  completedCount: number
  total: number
  // actions
  markItem: (key: ChecklistKey) => Promise<void>
  completeWizard: (opts: { startTour: boolean; step?: number }) => Promise<void>
  finishTour: () => Promise<void>
  dismissChecklist: () => Promise<void>
}

const noop = async () => {}

export const OnboardingContext = createContext<OnboardingContextValue>({
  ready: false,
  showWizard: false,
  showTour: false,
  showChecklist: false,
  items: CHECKLIST_ITEMS.map((i) => ({ ...i, completed: false })),
  completedCount: 0,
  total: CHECKLIST_TOTAL,
  markItem: noop,
  completeWizard: noop,
  finishTour: noop,
  dismissChecklist: noop,
})

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const ctx = useProfileContext()
  const profile = ctx?.profile ?? null
  const refreshProfile = ctx?.refresh
  const { toast } = useToast()

  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [ready, setReady] = useState(false)
  const seededFor = useRef<string | null>(null)

  // Load (and seed once) the checklist rows for the current user. Veterans
  // (checklist_completed = true) skip this entirely — clean experience.
  useEffect(() => {
    if (!profile) return
    if (profile.checklist_completed) { setReady(true); return }
    if (seededFor.current === profile.id) return
    seededFor.current = profile.id

    const supabase = createClient()
    ;(async () => {
      const { data } = await supabase
        .from('onboarding_checklist')
        .select('item_key, completed')
        .eq('user_id', profile.id)

      if (!data || data.length === 0) {
        await supabase.from('onboarding_checklist').upsert(
          CHECKLIST_KEYS.map((k) => ({ user_id: profile.id, item_key: k, completed: false })),
          { onConflict: 'user_id,item_key', ignoreDuplicates: true },
        )
        setChecklist(Object.fromEntries(CHECKLIST_KEYS.map((k) => [k, false])))
      } else {
        const map: Record<string, boolean> = {}
        for (const k of CHECKLIST_KEYS) map[k] = false
        for (const row of data) map[row.item_key] = row.completed
        setChecklist(map)
      }
      setReady(true)
    })()
  }, [profile])

  const markItem = useCallback(
    async (key: ChecklistKey) => {
      if (!profile || profile.checklist_completed) return
      if (checklist[key]) return // already done — no extra writes

      setChecklist((prev) => ({ ...prev, [key]: true }))
      const supabase = createClient()
      const { allCompleted } = await markChecklistItem(supabase, profile.id, key)

      if (allCompleted) {
        toast('Parabéns! Você completou todos os primeiros passos 🎉', 'success')
        await refreshProfile?.()
      }
    },
    [profile, checklist, toast, refreshProfile],
  )

  const completeWizard = useCallback(
    async ({ startTour, step = 5 }: { startTour: boolean; step?: number }) => {
      if (!profile) return
      const supabase = createClient()
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: step,
          tour_completed: startTour ? false : true,
        })
        .eq('id', profile.id)
      await refreshProfile?.()
    },
    [profile, refreshProfile],
  )

  const finishTour = useCallback(async () => {
    if (!profile) return
    const supabase = createClient()
    await supabase.from('profiles').update({ tour_completed: true }).eq('id', profile.id)
    await refreshProfile?.()
  }, [profile, refreshProfile])

  const dismissChecklist = useCallback(async () => {
    if (!profile) return
    const supabase = createClient()
    await supabase.from('profiles').update({ checklist_completed: true }).eq('id', profile.id)
    await refreshProfile?.()
  }, [profile, refreshProfile])

  const items: ChecklistView[] = CHECKLIST_ITEMS.map((i) => ({
    ...i,
    completed: !!checklist[i.key],
  }))
  const completedCount = items.filter((i) => i.completed).length

  const value: OnboardingContextValue = {
    ready,
    showWizard: !!profile && !profile.onboarding_completed,
    showTour: !!profile && profile.onboarding_completed && !profile.tour_completed,
    showChecklist:
      !!profile &&
      profile.onboarding_completed &&
      profile.tour_completed &&
      !profile.checklist_completed,
    items,
    completedCount,
    total: CHECKLIST_TOTAL,
    markItem,
    completeWizard,
    finishTour,
    dismissChecklist,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}
