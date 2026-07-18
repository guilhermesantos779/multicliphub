import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type Client = SupabaseClient<Database>

export async function isAgencyStaff(
  supabase: Client,
  userId: string,
  agencyProfileId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_agency_staff', {
    uid: userId,
    target_agency_id: agencyProfileId,
  })
  if (error) return false
  return data === true
}

export async function isCampaignAgencyStaff(
  supabase: Client,
  userId: string,
  campaignId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_campaign_agency_staff', {
    uid: userId,
    target_campaign_id: campaignId,
  })
  if (error) return false
  return data === true
}

export async function getAgencyProfileIdsForUser(
  supabase: Client,
  userId: string
): Promise<string[]> {
  const [ownedResult, memberResult] = await Promise.all([
    supabase.from('agency_profiles').select('id').eq('user_id', userId),
    supabase
      .from('agency_team_members')
      .select('agency_profile_id')
      .eq('user_id', userId)
      .in('role', ['owner', 'admin']),
  ])

  const ownedIds = (ownedResult.data ?? []).map((row) => row.id)
  const memberIds = (memberResult.data ?? []).map((row) => row.agency_profile_id)

  return Array.from(new Set([...ownedIds, ...memberIds]))
}
