import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

// Returns auth-only fields (last sign-in, auth created_at) for admins.
// These live in auth.users and require the service role to read.
export async function GET() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 })
  if (error) {
    console.error('[admin-users] listUsers failed:', error)
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }

  const users = data.users.map((u) => ({
    id: u.id,
    last_sign_in_at: u.last_sign_in_at ?? null,
    auth_created_at: u.created_at,
  }))

  return NextResponse.json({ users })
}
