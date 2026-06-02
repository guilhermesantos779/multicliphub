import { chromium } from 'playwright'
const BASE = 'http://localhost:3000'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1200 } })
const page = await ctx.newPage()

await page.goto(`${BASE}/landing`, { waitUntil: 'networkidle' })
// Jump to the pricing section
await page.evaluate(() => document.getElementById('precos')?.scrollIntoView())
await page.waitForTimeout(800)
await page.screenshot({ path: '.shots/pricing_monthly.png' })
console.log('saved .shots/pricing_monthly.png')

// Toggle to annual
await page.getByRole('button', { name: /Anual/ }).click()
await page.waitForTimeout(600)
await page.screenshot({ path: '.shots/pricing_annual.png' })
console.log('saved .shots/pricing_annual.png')

await browser.close()
