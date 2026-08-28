import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Honor a same-site ?next= so login can return the user to where they were
  const nextParam = searchParams.get('next')
  const next =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/inicio'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    // Google OAuth signups can't carry terms_version_id via signUp()'s
    // options.data like email/password does — the register page stashes it
    // in a short-lived cookie before the redirect instead. Fold it into
    // user_metadata here (now that a real session exists) so /api/terms/status
    // can auto-record the acceptance the same way it does for email/password.
    const pendingTermsVersionId = cookieStore.get('mch_pending_terms')?.value
    if (!error && pendingTermsVersionId) {
      await supabase.auth.updateUser({
        data: { terms_version_id: pendingTermsVersionId, terms_accepted_at: new Date().toISOString() },
      })
      cookieStore.delete('mch_pending_terms')
    }

    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
