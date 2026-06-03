import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import type { ChecklistKey } from './items'

type Client = SupabaseClient<Database>

/**
 * Marks a single checklist item complete (idempotent upsert) and returns
 * whether ALL items are now complete — so the caller can flip
 * profiles.checklist_completed and celebrate.
 */
export async function markChecklistItem(
  supabase: Client,
  userId: string,
  itemKey: ChecklistKey,
): Promise<{ allCompleted: boolean }> {
  await supabase.from('onboarding_checklist').upsert(
    {
      user_id: userId,
      item_key: itemKey,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,item_key' },
  )

  const { count } = await supabase
    .from('onboarding_checklist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', false)

  const allCompleted = (count ?? 0) === 0

  if (allCompleted) {
    await supabase
      .from('profiles')
      .update({ checklist_completed: true })
      .eq('id', userId)
  }

  return { allCompleted }
}
