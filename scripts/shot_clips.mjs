import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const BASE = 'http://localhost:3000'
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const EMAIL = `tmp_shot_${Date.now()}@exemplo-temp.com`
const PASSWORD = 'Temp#Shot12345'
const USERNAME = 'clipador_demo'

let userId
try {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Clipador Demo', username: USERNAME },
  })
  if (error) throw error
  userId = data.user.id
  await new Promise((r) => setTimeout(r, 800))

  const browser = await chromium.launch()

  async function login(ctx) {
    const page = await ctx.newPage()
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 20000 }).catch(() => {})
    return page
  }

  // Desktop — populated grid (viewing @rochaqi, seeded)
  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 1200 } })
  const page1 = await login(ctx1)
  await page1.goto(`${BASE}/perfil/rochaqi`, { waitUntil: 'networkidle' })
  await page1.waitForTimeout(1500)
  await page1.screenshot({ path: '.shots/clips_populated.png', fullPage: true })
  console.log('saved .shots/clips_populated.png')

  // Desktop — empty state (own profile of the temp user, no clips)
  await page1.goto(`${BASE}/perfil/${USERNAME}`, { waitUntil: 'networkidle' })
  await page1.waitForTimeout(1200)
  await page1.screenshot({ path: '.shots/clips_empty_own.png', fullPage: true })
  console.log('saved .shots/clips_empty_own.png')
  await ctx1.close()

  // Mobile 375px — populated grid stays 3 columns
  const ctx2 = await browser.newContext({ viewport: { width: 375, height: 950 } })
  const page2 = await login(ctx2)
  await page2.goto(`${BASE}/perfil/rochaqi`, { waitUntil: 'networkidle' })
  await page2.waitForTimeout(1500)
  await page2.screenshot({ path: '.shots/clips_mobile.png', fullPage: true })
  console.log('saved .shots/clips_mobile.png')
  await ctx2.close()

  await browser.close()
} finally {
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    console.log('deleted temp user:', error ? error.message : 'OK')
  }
}
