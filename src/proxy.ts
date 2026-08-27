import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getAgencyProfileIdsForUser } from '@/lib/campaigns/auth'
import { VIEW_AS_COOKIE, type ViewAsMode } from '@/lib/admin/view-as'

// '/api/discord' is public at the middleware layer: the route handler does its
// own auth + token handling and must run even for logged-out users (otherwise
// the middleware would redirect to /login?redirect=...token=... — a URL that
// Google Safe Browsing flags as phishing).
// '/api/webhooks' is public: external platforms (Meta/Instagram) hit it with no
// session cookie, so the middleware must not redirect them to /login — the
// route handler verifies the request itself (verify token / X-Hub-Signature).
const PUBLIC_ROUTES = ['/', '/landing', '/terms', '/privacy', '/termos', '/privacidade', '/login', '/register', '/esqueci-senha', '/redefinir-senha', '/auth/callback', '/api/auth', '/api/username', '/api/discord', '/api/webhooks', '/api/data-deletion', '/demo']
const AUTH_ROUTES = ['/login', '/register', '/esqueci-senha']
const ADMIN_ROUTES = ['/admin']
const AGENCY_TEAM_ROUTES = ['/agencia/dashboard/time']
// Content-creation tooling: agencies (either kind) manage campaigns, they
// don't post clips, so none of this applies to them. '/campanhas' is
// deliberately NOT here — agencies get read-only access to the public
// marketplace listing (see the join-route guard for the actual enforcement).
const CLIPPER_ONLY_ROUTES = ['/dashboard', '/upload', '/canais', '/analytics', '/ranking', '/historico', '/perfil/pagamentos']
const AGENCY_ONLY_ROUTES = ['/agencia/dashboard']

export async function proxy(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[proxy] Missing Supabase env vars', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
      return NextResponse.next({ request })
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    const pathname = request.nextUrl.pathname
    const isPublicRoute = PUBLIC_ROUTES.some(route =>
      route === '/' ? pathname === '/' : pathname === route || pathname.startsWith(route + '/')
    )
    const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route))
    const isAgencyTeamRoute = AGENCY_TEAM_ROUTES.some(route => pathname.startsWith(route))
    const isClipperOnlyRoute = CLIPPER_ONLY_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))
    const isAgencyOnlyRoute = AGENCY_ONLY_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))

    if (!user && !isPublicRoute) {
      // Preserve where the user was heading so we can return them after login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search)
      return NextResponse.redirect(loginUrl)
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/inicio', request.url))
    }

    // "View as" — lets an admin preview the app as a clipper or an agency
    // from their own real account, via a short-lived cookie (see
    // /api/admin/view-as). Only ever honored after re-confirming role='admin'
    // here — the cookie itself carries no authority.
    const viewAsCookie = request.cookies.get(VIEW_AS_COOKIE)?.value as ViewAsMode | undefined
    const needsRoleCheck = isAdminRoute || !!viewAsCookie
    let isAdmin = false

    if (needsRoleCheck && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = profile?.role === 'admin'
    }

    if (isAdminRoute && user && !isAdmin) {
      return NextResponse.redirect(new URL('/inicio', request.url))
    }

    // These three checks all hinge on the same "does this user have an
    // agency profile, and which kind" fact — resolve it once.
    if (user && (isAgencyTeamRoute || isClipperOnlyRoute || isAgencyOnlyRoute)) {
      const [agencyProfileId] = await getAgencyProfileIdsForUser(supabase, user.id)
      const { data: agencyProfile } = agencyProfileId
        ? await supabase.from('agency_profiles').select('kind').eq('id', agencyProfileId).single()
        : { data: null }

      let isAgency = !!agencyProfile
      let effectiveKind = agencyProfile?.kind
      if (isAdmin && viewAsCookie === 'clipper') {
        isAgency = false
        effectiveKind = undefined
      } else if (isAdmin && viewAsCookie === 'agency' && agencyProfile) {
        isAgency = true
        effectiveKind = agencyProfile.kind
      }

      // Broadest mismatch first, so a plain clipper hitting /agencia/dashboard/time
      // lands on /inicio in one hop instead of bouncing through /agencia/dashboard.
      if (isAgencyOnlyRoute && !isAgency) {
        return NextResponse.redirect(new URL('/inicio', request.url))
      }
      if (isAgencyTeamRoute && effectiveKind !== 'clipadores') {
        return NextResponse.redirect(new URL('/agencia/dashboard', request.url))
      }
      if (isClipperOnlyRoute && isAgency) {
        return NextResponse.redirect(new URL('/inicio', request.url))
      }
    }

    return supabaseResponse
  } catch (err) {
    console.error('[proxy] Unexpected error:', err)
    return NextResponse.next({ request })
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
