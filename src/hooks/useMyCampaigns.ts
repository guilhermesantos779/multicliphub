'use client'
import { useEffect, useState } from 'react'
import type { MyCampaignSummary } from '@/types/campaigns-clipper.types'

interface Participation {
  campaign: { id: string; title: string } | null
}

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState<MyCampaignSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function run() {
      const res = await fetch('/api/campaigns/my-campaigns')
      const json = await res.json()
      if (!active) return
      const summaries = ((json.participations ?? []) as Participation[])
        .map(p => p.campaign)
        .filter((c): c is { id: string; title: string } => !!c)
      setCampaigns(summaries)
      setLoading(false)
    }
    run()
    return () => {
      active = false
    }
  }, [])

  return { campaigns, loading }
}
