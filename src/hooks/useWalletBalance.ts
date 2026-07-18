'use client'
import { useEffect, useState } from 'react'
import { fetchWalletBalance } from '@/lib/mocks/campaigns'
import type { WalletBalance } from '@/types/campaigns.types'

export function useWalletBalance() {
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    // TODO: substituir por chamada real quando merged (rota do Agente 4 — pagamentos Asaas)
    fetchWalletBalance().then(data => {
      if (active) {
        setBalance(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return { balance, loading }
}
