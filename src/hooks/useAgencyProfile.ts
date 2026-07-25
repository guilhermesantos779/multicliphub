'use client'
import { useEffect, useState } from 'react'
import { MOCK_AGENCY_PROFILE } from '@/lib/mocks/campaigns.mock'
import type { AgencyProfile } from '@/types/campaigns.types'

interface UseAgencyProfileReturn {
  agencyProfile: AgencyProfile | null
  loading: boolean
}

export function useAgencyProfile(): UseAgencyProfileReturn {
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: substituir por chamada real:
    // const { data: { user } } = await supabase.auth.getUser()
    // const { data } = await supabase.from('agency_profiles').select('*').eq('user_id', user.id).maybeSingle()
    // quando a migration do Agente 1 (schema-backend) for mergeada.
    const timer = setTimeout(() => {
      setAgencyProfile(MOCK_AGENCY_PROFILE)
      setLoading(false)
    }, 250)
    return () => clearTimeout(timer)
  }, [])

  return { agencyProfile, loading }
}
