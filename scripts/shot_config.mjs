import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const BASE = 'http://localhost:3000'
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const EMAIL = `tmp_cfg_${Date.now()}@exemplo-temp.com`
const PASSWORD = 'Temp#Cfg12345'

let userId
try {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { full_name: 'Config Demo', username: 'config_demo' },
  })
  if (error) throw error
  userId = data.user.id
  console.log('temp user', userId)
  await new Promise((r) => setTimeout(r, 700))

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 1100 } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {})

  await page.goto(`${BASE}/configuracoes`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await page.screenshot({ path: '.shots/config_monthly.png', fullPage: true })
  console.log('saved .shots/config_monthly.png')

  // Toggle annual if present
  const annualBtn = page.getByRole('button', { name: /Anual/ })
  if (await annualBtn.count()) {
    await annualBtn.first().click()
    await page.waitForTimeout(600)
    await page.screenshot({ path: '.shots/config_annual.png', fullPage: true })
    console.log('saved .shots/config_annual.png')
  }
  await browser.close()
} finally {
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    console.log('deleted temp user:', error ? error.message : 'OK')
  }
}
