// Verify handle_new_user + generate_username behavior, then clean up.
// Creates temp auth users via the Admin API (service role) and checks the
// resulting profiles.username. Deletes everything at the end.

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const raw of readFileSync(resolve(__dirname, '../.env.local'), 'utf8').split('\n')) {
  const line = raw.trim()
  if (!line || line.startsWith('#')) continue
  const eq = line.indexOf('=')
  if (eq !== -1) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const stamp = Date.now()
const cases = [
  { label: 'chosen valid',     meta: { full_name: 'Teste Um',  username: 'clipador_test99' }, expect: 'clipador_test99' },
  { label: 'reserved -> auto', meta: { full_name: 'Teste Dois', username: 'admin' },           expectNot: 'admin' },
  { label: 'taken -> auto',    meta: { full_name: 'Teste Tres', username: 'rochaqi' },          expectNot: 'rochaqi' },
  { label: 'short name -> auto', meta: { full_name: 'Jo' },                                     minLen: 3 },
]

const created = []
let pass = 0, fail = 0
for (const c of cases) {
  const email = `qa+${stamp}_${created.length}@example.com`
  const { data, error } = await admin.auth.admin.createUser({
    email, password: 'Test12345!', email_confirm: true, user_metadata: c.meta,
  })
  if (error) { console.log(`XX ${c.label}: createUser error ${error.message}`); fail++; continue }
  created.push(data.user.id)
  const { data: prof } = await admin.from('profiles').select('username').eq('id', data.user.id).single()
  const u = prof?.username
  let ok = true
  if (c.expect && u !== c.expect) ok = false
  if (c.expectNot && u === c.expectNot) ok = false
  if (c.minLen && (!u || u.length < c.minLen)) ok = false
  if (!u || !/^[a-z0-9_-]{3,20}$/.test(u)) ok = false
  console.log(`${ok ? 'OK ' : 'XX '} ${c.label}: username='${u}'`)
  ok ? pass++ : fail++
}

// cleanup
for (const id of created) await admin.auth.admin.deleteUser(id)
const { count } = await admin.from('profiles').select('id', { count: 'exact', head: true })
console.log(`\ncleanup done. profiles now: ${count}`)
console.log(`RESULT pass=${pass} fail=${fail}`)
