// Recreate the 3 ANNUAL prices at the correct "30% off monthly" amounts.
// Reuses each plan's existing Product (read from the current MONTHLY price in env).
// Archives the old (wrong) annual price. Prints new annual Price IDs.
//
// Usage (from multicliphub/):  node scripts/stripe/recreate-annual-prices.mjs

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
const mode = env.STRIPE_SECRET_KEY.startsWith('sk_test') ? 'TEST' : 'LIVE'

// annual totals in CENTAVOS — 30% off monthly, billed once/year
const PLANS = [
  { key: 'CLIPPER', monthlyVar: 'STRIPE_PRICE_CLIPPER_MONTHLY', annualVar: 'STRIPE_PRICE_CLIPPER_ANNUAL', annual: 47880 },
  { key: 'PRO',     monthlyVar: 'STRIPE_PRICE_PRO_MONTHLY',     annualVar: 'STRIPE_PRICE_PRO_ANNUAL',     annual: 81480 },
  { key: 'KING',    monthlyVar: 'STRIPE_PRICE_KING_MONTHLY',    annualVar: 'STRIPE_PRICE_KING_ANNUAL',    annual: 165480 },
]

console.log(`Mode: ${mode}\n`)
const out = {}
for (const plan of PLANS) {
  const monthlyId = env[plan.monthlyVar]
  const monthly = await stripe.prices.retrieve(monthlyId)
  const productId = typeof monthly.product === 'string' ? monthly.product : monthly.product.id

  const price = await stripe.prices.create({
    product: productId,
    currency: 'brl',
    unit_amount: plan.annual,
    recurring: { interval: 'year' },
    nickname: `${plan.key} Annual`,
    metadata: { plan_key: plan.key, cycle: 'annual' },
  })

  // archive the old annual price if present and different
  const oldAnnual = env[plan.annualVar]
  if (oldAnnual && oldAnnual !== price.id) {
    try { await stripe.prices.update(oldAnnual, { active: false }); console.log(`  archived old ${oldAnnual}`) } catch {}
  }

  out[plan.annualVar] = price.id
  console.log(`${plan.key} ANNUAL (R$${(plan.annual/100).toFixed(2)}/ano) -> ${price.id}`)
}

console.log('\n--- new annual env values ---')
for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`)
