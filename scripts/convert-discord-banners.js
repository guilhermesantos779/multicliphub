const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const files = [
  'banner-ranking',
  'banner-conquistas',
  'banner-anuncios',
  'banner-geral',
]

async function convert() {
  for (const file of files) {
    const svgPath = path.join(__dirname, '../public/discord', file + '.svg')
    const pngPath = path.join(__dirname, '../public/discord', file + '.png')

    if (!fs.existsSync(svgPath)) {
      console.log(`SVG not found: ${svgPath}`)
      continue
    }

    await sharp(svgPath).resize(1200, 300).png().toFile(pngPath)

    console.log(`Converted: ${file}.png`)
  }
}

convert().catch(console.error)
