'use client'
import { useEffect, useState } from 'react'
import type { AgencyProfile } from '@/types/campaigns.types'

interface UseAgencyProfileReturn {
  agencyProfile: AgencyProfile | null
  loading: boolean
}

interface AgencyProfileRow {
  id: string
  user_id: string
  type: AgencyProfile['type']
  kind: AgencyProfile['kind']
  display_name: string
  logo_url: string | null
  bio: string | null
  website_url: string | null
  social_links: AgencyProfile['socialLinks']
}

function mapRow(row: AgencyProfileRow): AgencyProfile {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    kind: row.kind,
    name: row.display_name,
    logoUrl: row.logo_url,
    bio: row.bio ?? '',
    website: row.website_url,
    socialLinks: row.social_links ?? [],
  }
}

export function useAgencyProfile(): UseAgencyProfileReturn {
  const [agencyProfile, setAgencyProfile] = useState<AgencyProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const res = await fetch('/api/agency/profile')
        const json = await res.json()
        if (!cancelled) {
          setAgencyProfile(json.agencyProfile ? mapRow(json.agencyProfile) : null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return { agencyProfile, loading }
}
