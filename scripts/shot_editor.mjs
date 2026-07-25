import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load .env.local manually (no dotenv dep here)
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
  // 1. Create a confirmed temp user; trigger sets the username from metadata.
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Clipador Demo', username: USERNAME },
  })
  if (error) throw error
  userId = data.user.id
  console.log('temp user', userId, USERNAME)

  // Give the trigger a moment, then verify the profile username
  await new Promise((r) => setTimeout(r, 800))
  const { data: prof } = await admin.from('profiles').select('username').eq('id', userId).single()
  console.log('profile username =', prof?.username)

  const browser = await chromium.launch()

  async function login(ctx) {
    const page = await ctx.newPage()
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', EMAIL)
    await page.fill('input[type="password"]', PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {})
    return page
  }

  // Desktop editor
  const ctx1 = await browser.newContext({ viewport: { width: 1280, height: 1100 } })
  const page1 = await login(ctx1)
  await page1.goto(`${BASE}/perfil/editar`, { waitUntil: 'networkidle' })
  await page1.waitForTimeout(1200)
  await page1.screenshot({ path: '.shots/editor_desktop.png', fullPage: true })
  console.log('saved .shots/editor_desktop.png')

  // Setup-mode banner
  await page1.goto(`${BASE}/perfil/editar?setup=1`, { waitUntil: 'networkidle' })
  await page1.waitForTimeout(1000)
  await page1.screenshot({ path: '.shots/editor_setup.png', fullPage: true })
  console.log('saved .shots/editor_setup.png')

  // Type a taken username to show the blocked state in the editor
  const field = page1.locator('input[placeholder="seu_nickname"]')
  await field.fill('')
  await field.type('rochaqi', { delay: 30 })
  await page1.waitForTimeout(1200)
  await page1.screenshot({ path: '.shots/editor_taken.png', fullPage: true })
  console.log('saved .shots/editor_taken.png')
  await ctx1.close()

  // Mobile editor
  const ctx2 = await browser.newContext({ viewport: { width: 375, height: 950 } })
  const page2 = await login(ctx2)
  await page2.goto(`${BASE}/perfil/editar`, { waitUntil: 'networkidle' })
  await page2.waitForTimeout(1200)
  await page2.screenshot({ path: '.shots/editor_mobile.png', fullPage: true })
  console.log('saved .shots/editor_mobile.png')
  await ctx2.close()

  await browser.close()
} finally {
  // Always clean up the temp user (cascade removes the profile row).
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    console.log('deleted temp user:', error ? error.message : 'OK')
  }
}
