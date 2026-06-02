import { chromium } from 'playwright'

const URL = 'http://localhost:3000/landing'
const out = 'C:/Users/guisa/Desktop/MulticlipHub/multicliphub/.shots'
import { mkdirSync } from 'node:fs'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()

// --- desktop ---
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.goto(URL, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500) // let shader animate + fade-ins settle

await page.screenshot({ path: `${out}/desktop-hero.png` })           // above the fold
await page.screenshot({ path: `${out}/desktop-full.png`, fullPage: true })

// pricing section
const pricing = page.locator('#precos')
await pricing.scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await pricing.screenshot({ path: `${out}/desktop-pricing-monthly.png` })

// toggle annual and re-shoot pricing
const annualBtn = pricing.getByRole('button', { name: 'Anual' })
await annualBtn.click()
await page.waitForTimeout(600)
await pricing.screenshot({ path: `${out}/desktop-pricing-annual.png` })

// --- shader probe: is there a <canvas> behind, and is it painting? ---
const shader = await page.evaluate(() => {
  const c = document.querySelector('canvas')
  if (!c) return { canvas: false }
  const r = c.getBoundingClientRect()
  const gl = c.getContext('webgl') || c.getContext('webgl2')
  return {
    canvas: true,
    webgl: !!gl,
    w: Math.round(r.width),
    h: Math.round(r.height),
    z: getComputedStyle(c).zIndex,
    pos: getComputedStyle(c).position,
  }
})
console.log('SHADER_PROBE', JSON.stringify(shader))

await ctx.close()

// --- mobile 375 ---
const mctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true })
const mp = await mctx.newPage()
await mp.goto(URL, { waitUntil: 'networkidle' })
await mp.waitForTimeout(2500)
await mp.screenshot({ path: `${out}/mobile-hero.png` })
await mp.screenshot({ path: `${out}/mobile-full.png`, fullPage: true })
const mpricing = mp.locator('#precos')
await mpricing.scrollIntoViewIfNeeded()
await mp.waitForTimeout(600)
await mpricing.screenshot({ path: `${out}/mobile-pricing.png` })
await mctx.close()

await browser.close()
console.log('DONE')
