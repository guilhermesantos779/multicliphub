import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const tag = process.argv[2] ?? 'state'
const URL = 'http://localhost:3000/landing'
const out = 'C:/Users/guisa/Desktop/MulticlipHub/multicliphub/.shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch()

async function run(label, viewport, isMobile = false) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: isMobile ? 2 : 1, isMobile })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const statsLoc = page.locator('text=Comunidade MultiClip Hub')
  const present = (await statsLoc.count()) > 0
  console.log(`[${tag}/${label}] stats section present: ${present}`)

  if (present) {
    await statsLoc.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2500) // let the count-up animation finish
    // Read the rendered stat numbers for evidence
    const nums = await page
      .locator('section:has-text("Comunidade MultiClip Hub") .font-black')
      .allInnerTexts()
    console.log(`[${tag}/${label}] rendered numbers:`, JSON.stringify(nums))
    const section = page.locator('section:has-text("Comunidade MultiClip Hub")')
    await section.screenshot({ path: `${out}/stats_${tag}_${label}.png` })
  } else {
    // Capture above-the-fold to prove there's no empty box / hole
    await page.screenshot({ path: `${out}/stats_${tag}_${label}.png` })
  }
  await ctx.close()
}

await run('desktop', { width: 1280, height: 1000 })
await run('mobile', { width: 375, height: 812 }, true)

await browser.close()
console.log('DONE')
