import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const BASE = 'http://localhost:3000'
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

const EMAIL = `tmp_shot_${Date.now()}@exemplo-temp.com`
const PASSWORD = 'Temp#Shot12345'
const USERNAME = `viewer_${Date.now().toString().slice(-6)}`

let userId
try {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { full_name: 'Viewer Demo', username: USERNAME },
  })
  if (error) throw error
  userId = data.user.id
  await new Promise((r) => setTimeout(r, 900))

  // Skip the first-login onboarding overlays (wizard/tour/checklist) so they
  // don't cover the screenshots.
  await admin.from('profiles').update({
    onboarding_completed: true,
    tour_completed: true,
    checklist_completed: true,
    onboarding_step: 99,
  }).eq('id', userId)

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

  // ---- Desktop (1280) ----
  const d = await browser.newContext({ viewport: { width: 1280, height: 1000 } })
  const dp = await login(d)
  await dp.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' }); await dp.waitForTimeout(1200)
  await dp.screenshot({ path: '.shots/r_dashboard_desktop.png' })
  await dp.goto(`${BASE}/ranking`, { waitUntil: 'networkidle' }); await dp.waitForTimeout(1600)
  await dp.screenshot({ path: '.shots/r_ranking_desktop.png', fullPage: true })
  // Como funciona tab (carousel)
  await dp.getByRole('button', { name: /Como funciona/ }).click(); await dp.waitForTimeout(1200)
  await dp.screenshot({ path: '.shots/r_carousel_desktop.png', fullPage: true })
  await d.close()

  // ---- Mobile (390) ----
  const m = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const mp = await login(m)
  await mp.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' }); await mp.waitForTimeout(1200)
  await mp.screenshot({ path: '.shots/r_dashboard_mobile.png' })
  // open drawer
  await mp.getByLabel('abrir menu').click(); await mp.waitForTimeout(700)
  await mp.screenshot({ path: '.shots/r_drawer_mobile.png' })
  await mp.keyboard.press('Escape').catch(() => {})
  await mp.goto(`${BASE}/ranking`, { waitUntil: 'networkidle' }); await mp.waitForTimeout(1600)
  await mp.screenshot({ path: '.shots/r_ranking_mobile.png', fullPage: true })
  await mp.getByRole('button', { name: /Como funciona/ }).click(); await mp.waitForTimeout(1200)
  await mp.screenshot({ path: '.shots/r_carousel_mobile.png', fullPage: true })
  await m.close()

  // ---- Landing mobile (375) — public ----
  const l = await browser.newContext({ viewport: { width: 375, height: 900 } })
  const lp = await l.newPage()
  await lp.goto(`${BASE}/landing`, { waitUntil: 'networkidle' }); await lp.waitForTimeout(1800)
  await lp.screenshot({ path: '.shots/r_landing_hero_mobile.png' })
  await lp.evaluate(() => document.querySelector('#precos')?.scrollIntoView())
  await lp.waitForTimeout(1200)
  await lp.screenshot({ path: '.shots/r_landing_pricing_mobile.png', fullPage: false })
  await l.close()

  await browser.close()
  console.log('screenshots saved')
} finally {
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    console.log('deleted temp user:', error ? error.message : 'OK')
  }
}
