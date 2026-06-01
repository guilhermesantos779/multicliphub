'use client'
import { useProfileContext } from '@/components/app/ProfileProvider'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UseUserReturn {
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  canPost: boolean
}

// Reads the shared profile from ProfileProvider (single fetch for the whole
// dashboard) and derives convenience flags. Public API unchanged.
export function useUser(): UseUserReturn {
  const ctx = useProfileContext()
  const profile = ctx?.profile ?? null
  const loading = ctx?.loading ?? true

  const isAdmin = profile?.role === 'admin'

  const canPost = (() => {
    if (!profile) return false
    if (profile.role === 'blocked') return false
    if (profile.role === 'admin') return true
    if (profile.plan === 'pro' || profile.plan === 'king') return true
    if (profile.plan === 'clipper') return profile.posts_this_month < 200
    if (profile.plan === 'trial') return profile.posts_this_month < 10
    return false
  })()

  return { profile, loading, isAdmin, canPost }
}
