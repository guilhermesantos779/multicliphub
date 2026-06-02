import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setViewportSize({ width: 1400, height: 900 })
await page.goto('http://localhost:3333', { timeout: 20000 })
await page.waitForTimeout(3000)

// Select the 16x9 composition
await page.click('text=MultiClipPresentation-16x9')
await page.waitForTimeout(3000)

// Scene frames to capture: 200, 700, 1300, 1900, 2700, 3300, 4100, 4800
const frames = [
  { frame: 200,  name: 'scene0_intro' },
  { frame: 700,  name: 'scene1_problem' },
  { frame: 1300, name: 'scene2_solution' },
  { frame: 1900, name: 'scene3_metrics' },
  { frame: 2700, name: 'scene4_ranking' },
  { frame: 3300, name: 'scene5_comparison' },
  { frame: 4100, name: 'scene6_social' },
  { frame: 4900, name: 'scene7_cta' },
]

for (const { frame, name } of frames) {
  // Click on timeline at approximate position
  // Try using keyboard: Home first, then hold Right
  // Better: use the frame scrubber input if available
  const timeInput = page.locator('input[type="number"]').first()
  const count = await timeInput.count()
  if (count > 0) {
    await timeInput.click({ clickCount: 3 })
    await timeInput.fill(String(frame))
    await timeInput.press('Enter')
    await page.waitForTimeout(1500)
  }
  await page.screenshot({ path: `${name}.png`, clip: { x: 312, y: 40, width: 1032, height: 580 } })
  console.log(`${name} ok`)
}

await browser.close()
