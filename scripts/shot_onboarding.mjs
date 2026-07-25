import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) process.env[m[1]] = m[2].trim()
}

const BASE = 'http://localhost:3000'
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const EMAIL = `tmp_onb_${Date.now()}@exemplo-temp.com`
const PASSWORD = 'Temp#Onb12345'
const USERNAME = 'onbtester'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

let userId
try {
  const { data, error } = await admin.auth.admin.createUser({
    email: EMAIL, password: PASSWORD, email_confirm: true,
    user_metadata: { full_name: 'Onboarding Tester', username: USERNAME },
  })
  if (error) throw error
  userId = data.user.id
  console.log('temp user', userId)
  await wait(800)

  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page = await ctx.newPage()

  // Login
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {})
  await wait(1500)

  // WIZARD step 1 — welcome
  await page.screenshot({ path: '.shots/onb_wizard_1_welcome.png' })
  console.log('w1')
  await page.getByRole('button', { name: /Vamos lá/ }).click()
  await wait(700)

  // step 2 — nickname
  await page.screenshot({ path: '.shots/onb_wizard_2_nickname.png' })
  console.log('w2')
  await page.getByRole('button', { name: /Continuar/ }).click()
  await wait(900)

  // step 3 — photo
  await page.screenshot({ path: '.shots/onb_wizard_3_photo.png' })
  console.log('w3')
  await page.getByRole('button', { name: /Pular por agora/ }).click()
  await wait(700)

  // step 4 — channels
  await page.screenshot({ path: '.shots/onb_wizard_4_channels.png' })
  console.log('w4')
  await page.getByRole('button', { name: /Pular por agora/ }).click()
  await wait(700)

  // step 5 — done + confetti
  await page.screenshot({ path: '.shots/onb_wizard_5_done.png' })
  console.log('w5')
  await page.getByRole('button', { name: /Iniciar tour/ }).click()
  await wait(1200)

  // TOUR — capture a few steps
  await page.screenshot({ path: '.shots/onb_tour_1.png' })
  console.log('t1')
  await page.getByRole('button', { name: /Próximo/ }).click(); await wait(900)
  await page.screenshot({ path: '.shots/onb_tour_2.png' })
  await page.getByRole('button', { name: /Próximo/ }).click(); await wait(900)
  await page.getByRole('button', { name: /Próximo/ }).click(); await wait(900)
  await page.screenshot({ path: '.shots/onb_tour_4_profile.png' })
  console.log('t4')
  await page.getByRole('button', { name: /Próximo/ }).click(); await wait(900)
  await page.screenshot({ path: '.shots/onb_tour_5_suporte.png' })
  await page.getByRole('button', { name: /Finalizar tour/ }).click(); await wait(1200)

  // CHECKLIST — collapsed
  await page.screenshot({ path: '.shots/onb_checklist_collapsed.png' })
  console.log('cl-collapsed')

  // expand it (click the FAB bottom-right)
  const fab = page.locator('button:has(svg circle)').last()
  await fab.click({ force: true }).catch(() => {})
  await wait(900)
  await page.screenshot({ path: '.shots/onb_checklist_expanded.png' })
  console.log('cl-expanded')

  await ctx.close()

  // SECOND LOGIN — wizard must NOT appear
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const page2 = await ctx2.newPage()
  await page2.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page2.fill('input[type="email"]', EMAIL)
  await page2.fill('input[type="password"]', PASSWORD)
  await page2.click('button[type="submit"]')
  await page2.waitForURL(/\/dashboard/, { timeout: 15000 }).catch(() => {})
  await wait(1800)
  const wizardVisible = await page2.getByText('Bem-vindo ao MultiClip Hub').isVisible().catch(() => false)
  console.log('SECOND LOGIN wizard visible?', wizardVisible)
  await page2.screenshot({ path: '.shots/onb_second_login.png' })
  await ctx2.close()

  await browser.close()
} finally {
  if (userId) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    console.log('deleted temp user:', error ? error.message : 'OK')
  }
}
