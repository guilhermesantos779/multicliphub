import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS. Use ONLY on the server for operations
// where the caller's identity has already been verified via getUser().
// Never expose this client or the service_role key to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
