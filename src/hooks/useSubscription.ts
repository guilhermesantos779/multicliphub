'use client'
import { useState } from 'react'
import type { PlanKey } from '@/lib/stripe'

export function useSubscription() {
  const [loading, setLoading] = useState(false)

  const subscribe = async (plan: PlanKey, billing: 'monthly' | 'annual') => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billing }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('Erro ao redirecionar para checkout:', data.error)
      }
    } finally {
      setLoading(false)
    }
  }

  return { subscribe, loading }
}
