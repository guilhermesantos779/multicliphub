import Stripe from 'stripe'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const raw of readFileSync(resolve(__dirname, '../.env.local'), 'utf8').split('\n')) {
  const line = raw.trim()
  if (!line || line.startsWith('#')) continue
  const eq = line.indexOf('=')
  if (eq !== -1) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
}
const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
const out = resolve(__dirname, '../.shots'); mkdirSync(out, { recursive: true })

const targets = [
  ['checkout-clipper-monthly', env.STRIPE_PRICE_CLIPPER_MONTHLY],
  ['checkout-king-annual', env.STRIPE_PRICE_KING_ANNUAL],
]
const browser = await chromium.launch()
for (const [name, price] of targets) {
  const s = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: 'http://localhost:3000/dashboard',
    cancel_url: 'http://localhost:3000/configuracoes',
  })
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } })
  await page.goto(s.url, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log(`${name}: shot saved`)
  await page.close()
}
await browser.close()
console.log('DONE')
