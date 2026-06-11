const puppeteer = require('puppeteer')
const { GIFEncoder, quantize, applyPalette } = require('gifenc')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const ALL_BANNERS = [
  'ranking', 'conquistas', 'anuncios', 'geral',
  'boas-vindas', 'sala-clipper', 'sala-pro', 'lounge-king',
]

const WIDTH = 1200
const HEIGHT = 300
const FPS = Number(process.env.FPS || 20)
const DURATION = 4
const COLORS = Number(process.env.COLORS || 256)
const TOTAL_FRAMES = FPS * DURATION
const FRAME_DELAY = 1000 / FPS

// Optional: pass banner names as CLI args to generate only those.
const argNames = process.argv.slice(2)
const BANNERS = argNames.length ? argNames : ALL_BANNERS

async function captureBanner(browser, name) {
  const page = await browser.newPage()
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 })

  const htmlPath = path.join(__dirname, 'banner-html', name + '.html')
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle0' })

  // Let animations stabilize and particles populate.
  await new Promise((r) => setTimeout(r, 1500))

  const gif = GIFEncoder()
  console.log(`Capturing ${name} (FPS=${FPS}, colors=${COLORS})...`)

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const buffer = await page.screenshot({ type: 'png' })
    const { data } = await sharp(buffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const palette = quantize(data, COLORS, { format: 'rgba4444' })
    const index = applyPalette(data, palette, 'rgba4444')

    gif.writeFrame(index, WIDTH, HEIGHT, { palette, delay: FRAME_DELAY, dispose: 2 })

    await new Promise((r) => setTimeout(r, FRAME_DELAY))
    process.stdout.write(`  frame ${i + 1}/${TOTAL_FRAMES}\r`)
  }

  gif.finish()
  const outPath = path.join(__dirname, '../public/discord', 'banner-' + name + '.gif')
  fs.writeFileSync(outPath, Buffer.from(gif.bytes()))

  const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(2)
  console.log(`\n  Saved banner-${name}.gif (${sizeMB} MB)`)
  await page.close()
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  for (const name of BANNERS) {
    await captureBanner(browser, name)
  }

  await browser.close()
  console.log('\nAll GIFs generated!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
