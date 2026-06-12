// DEV ONLY — seeds mock rows into `publications` so the profile clips grid can
// be tested before OAuth sync is live. DELETE the seeded rows before launch.
//
// Usage:
//   node scripts/seed-test-clips.mjs <username>          # seed 9 clips
//   node scripts/seed-test-clips.mjs <username> --clear  # remove seeded clips
//
// Seeded rows are tagged with a "[seed]" title prefix so --clear only deletes
// what this script created.

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

const username = process.argv[2]
const clear = process.argv.includes('--clear')
if (!username) {
  console.error('Uso: node scripts/seed-test-clips.mjs <username> [--clear]')
  process.exit(1)
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data: prof, error: profErr } = await admin
  .from('profiles')
  .select('id, username')
  .eq('username', username)
  .single()

if (profErr || !prof) {
  console.error(`Usuário '@${username}' não encontrado.`, profErr?.message ?? '')
  process.exit(1)
}

const SEED_PREFIX = '[seed] '

if (clear) {
  const { error } = await admin
    .from('publications')
    .delete()
    .eq('user_id', prof.id)
    .like('title', `${SEED_PREFIX}%`)
  if (error) {
    console.error('Erro ao limpar:', error.message)
    process.exit(1)
  }
  console.log(`Clipes de teste removidos de @${prof.username}.`)
  process.exit(0)
}

const rand = (max) => Math.floor(Math.random() * max)

const mockClips = Array.from({ length: 9 }, (_, i) => {
  const tiktok_views = rand(500_000)
  const instagram_views = rand(300_000)
  const youtube_views = i % 3 === 0 ? rand(200_000) : 0
  return {
    user_id: prof.id,
    title: `${SEED_PREFIX}Clipe de teste ${i + 1}`,
    thumbnail_url: null, // shows placeholder
    tiktok_url: `https://tiktok.com/@test/video/${i}`,
    tiktok_views,
    instagram_url: `https://instagram.com/reel/${i}`,
    instagram_views,
    youtube_url: youtube_views > 0 ? `https://youtube.com/shorts/${i}` : null,
    youtube_views,
    total_views: tiktok_views + instagram_views + youtube_views,
    status: 'published',
    published_at: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
})

const { error } = await admin.from('publications').insert(mockClips)
if (error) {
  console.error('Erro ao inserir:', error.message)
  process.exit(1)
}
console.log(`9 clipes de teste criados para @${prof.username}.`)
console.log(`Para remover: node scripts/seed-test-clips.mjs ${username} --clear`)
