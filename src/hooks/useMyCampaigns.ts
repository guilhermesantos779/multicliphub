'use client'
import { useEffect, useState } from 'react'
import { fetchMyCampaigns } from '@/lib/mocks/campaigns'
import type { MyCampaignSummary } from '@/types/campaigns-clipper.types'

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState<MyCampaignSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    // TODO: substituir por chamada real quando merged (rota do Agente 1)
    fetchMyCampaigns().then(data => {
      if (active) {
        setCampaigns(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return { campaigns, loading }
}
