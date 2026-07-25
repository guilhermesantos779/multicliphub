import { chromium } from 'playwright'

const BASE = 'http://localhost:3000'

const browser = await chromium.launch()

async function shot({ width, height, file, username }) {
  const ctx = await browser.newContext({ viewport: { width, height } })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' })

  // Fill the form to show a realistic state
  await page.fill('input[placeholder="Seu nome"]', 'Guilherme Clips')
  await page.fill('input[type="email"]', 'guilherme@exemplo.com')
  // Username field (custom component) — placeholder "seu_nickname"
  await page.fill('input[placeholder="seu_nickname"]', username)
  // Wait for the debounced availability check to resolve
  await page.waitForTimeout(1200)

  await page.screenshot({ path: file, fullPage: true })
  console.log('saved', file)
  await ctx.close()
}

// Desktop — available nickname (green check)
await shot({ width: 1280, height: 1000, file: '.shots/register_available.png', username: 'guilherme_clips' })
// Desktop — taken nickname (red x) using a real existing username
await shot({ width: 1280, height: 1000, file: '.shots/register_taken.png', username: 'rochaqi' })
// Desktop — reserved nickname
await shot({ width: 1280, height: 1000, file: '.shots/register_reserved.png', username: 'admin' })
// Mobile 375px — available
await shot({ width: 375, height: 900, file: '.shots/register_mobile.png', username: 'guilherme_clips' })

await browser.close()
