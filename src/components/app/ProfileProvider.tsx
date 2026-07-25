'use client'

import {
  createContext, useContext, useEffect, useState, useCallback,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileContextValue {
  profile: Profile | null
  loading: boolean
  refresh: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

// Fetches the logged-in user's profile ONCE for the whole dashboard shell.
// useUser() reads from here, so header, sidebar and pages share a single fetch.
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile((data as Profile | null) ?? null)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProfile()
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile()
    })
    return () => subscription.unsubscribe()
  }, [fetchProfile])

  return (
    <ProfileContext.Provider value={{ profile, loading, refresh: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext(): ProfileContextValue | null {
  return useContext(ProfileContext)
}
