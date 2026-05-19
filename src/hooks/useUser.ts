'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface UseUserReturn {
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  canPost: boolean
}

export function useUser(): UseUserReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    fetchProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile()
    })

    return () => subscription.unsubscribe()
  }, [])

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
