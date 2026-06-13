import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const out = 'C:/Users/guisa/Desktop/MulticlipHub/multicliphub/.shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1100, height: 1400 } })
const page = await ctx.newPage()
await page.goto('http://localhost:3000/privacidade', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/privacidade.png` })
// quick contrast probe: is the body text actually visible (non-transparent)?
const sample = await page.locator('section >> p').first().evaluate((el) => getComputedStyle(el).color)
console.log('first paragraph color:', sample)
await browser.close()
console.log('DONE')
