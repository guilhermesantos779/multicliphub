'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { WalletBalance } from '@/types/campaigns-clipper.types'

export function useWalletBalance() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (active) setLoading(false)
        return
      }

      const { data } = await supabase
        .from('campaign_payouts')
        .select('amount, status')
        .eq('user_id', user.id)

      if (!active) return

      const rows = data ?? []
      setBalance({
        available: rows.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0),
        pending: rows.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0),
      })
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return { balance, loading }
}
