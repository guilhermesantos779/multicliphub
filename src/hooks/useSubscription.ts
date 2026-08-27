'use client'
import { useState } from 'react'
import { useToast } from '@/components/shared/Toast'
import type { PlanKey } from '@/lib/stripe'

export function useSubscription() {
  const { toast } = useToast()
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
        toast(data.error ?? 'Erro ao iniciar assinatura', 'error')
        setLoading(false)
      }
    } catch (err) {
      console.error('Erro ao iniciar checkout:', err)
      toast('Erro ao iniciar assinatura', 'error')
      setLoading(false)
    }
  }

  return { subscribe, loading }
}
