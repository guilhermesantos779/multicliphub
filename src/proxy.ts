import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/landing', '/terms', '/privacy', '/login', '/register', '/auth/callback', '/api/auth', '/demo']
const AUTH_ROUTES = ['/login', '/register']
const ADMIN_ROUTES = ['/admin']

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

    if (!user && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isAdminRoute && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
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
