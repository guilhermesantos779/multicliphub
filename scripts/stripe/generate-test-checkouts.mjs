// Create test-mode Checkout Sessions for all 6 price points and print their URLs.
// Open each URL to confirm the amount shown on the Stripe-hosted checkout page.
// Mirrors the app: subscription mode + 7-day trial. No charge happens by opening.
//
// Usage (from multicliphub/):  node scripts/stripe/generate-test-checkouts.mjs

import Stripe from 'stripe'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const env = {}
for (const raw of readFileSync(resolve(__dirname, '../../.env.local'), 'utf8').split('\n')) {
  const line = raw.trim()
  if (!line || line.startsWith('#')) continue
  const eq = line.indexOf('=')
  if (eq !== -1) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
}

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
if (!env.STRIPE_SECRET_KEY.startsWith('sk_test')) {
  console.error('Refusing to run: STRIPE_SECRET_KEY is not a test key.')
  process.exit(1)
}

const ROWS = [
  ['Clipper mensal (R$57)',     env.STRIPE_PRICE_CLIPPER_MONTHLY],
  ['Clipper anual  (R$478,80)', env.STRIPE_PRICE_CLIPPER_ANNUAL],
  ['Pro mensal     (R$97)',     env.STRIPE_PRICE_PRO_MONTHLY],
  ['Pro anual      (R$814,80)', env.STRIPE_PRICE_PRO_ANNUAL],
  ['King mensal    (R$197)',    env.STRIPE_PRICE_KING_MONTHLY],
  ['King anual     (R$1.654,80)', env.STRIPE_PRICE_KING_ANNUAL],
]

const base = env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
for (const [label, price] of ROWS) {
  const s = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price, quantity: 1 }],
    subscription_data: { trial_period_days: 7 },
    success_url: `${base}/dashboard?upgrade=success`,
    cancel_url: `${base}/configuracoes`,
  })
  console.log(`${label}\n  ${s.url}\n`)
}
