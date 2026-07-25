// One-off: create the NEW plan prices in Stripe.
//
// Stripe Prices are IMMUTABLE — amounts can't be edited. This creates fresh
// Price objects (reusing the Product per plan when found by metadata.plan_key)
// and prints the 6 new Price IDs to paste into env vars.
//
// Usage (from multicliphub/):
//   node scripts/stripe/create-new-prices.mjs            -> LIVE  (uses STRIPE_SECRET_KEY)
//   node scripts/stripe/create-new-prices.mjs --test     -> TEST  (uses STRIPE_SECRET_KEY_TEST)
//
// Amounts are in CENTAVOS (BRL * 100). Annual = full yearly total, interval: year.
// "R$40/mês" etc. is only how the SITE displays it — Stripe charges R$480 once/year.

import Stripe from 'stripe'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// --- load .env.local manually (no dotenv dependency) ---
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '../../.env.local')
const env = {}
try {
  for (const raw of readFileSync(envPath, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eq = line.indexOf('=')
    if (eq === -1) continue
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim()
  }
} catch {
  console.error(`Could not read ${envPath}`)
  process.exit(1)
}

const TEST = process.argv.includes('--test')
const key = TEST ? env.STRIPE_SECRET_KEY_TEST : env.STRIPE_SECRET_KEY
if (!key) {
  console.error(
    TEST
      ? 'Missing STRIPE_SECRET_KEY_TEST in .env.local (add a sk_test_... key for test mode).'
      : 'Missing STRIPE_SECRET_KEY in .env.local'
  )
  process.exit(1)
}
if (TEST && key.startsWith('sk_live')) {
  console.error('--test was passed but STRIPE_SECRET_KEY_TEST is a live key. Aborting.')
  process.exit(1)
}

const stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })

// CENTAVOS — keep in sync with src/config/plans.ts
const PLANS = [
  { key: 'CLIPPER', name: 'MultiClip Hub — Clipper', monthly: 5700,  annual: 47880  },
  { key: 'PRO',     name: 'MultiClip Hub — Pro',     monthly: 9700,  annual: 81480  },
  { key: 'KING',    name: 'MultiClip Hub — King',    monthly: 19700, annual: 165480 },
]

async function findOrCreateProduct(plan) {
  // Reuse an existing product tagged with this plan_key, if any.
  const existing = await stripe.products.search({
    query: `metadata['plan_key']:'${plan.key}' AND active:'true'`,
  })
  if (existing.data[0]) return existing.data[0]
  return stripe.products.create({ name: plan.name, metadata: { plan_key: plan.key } })
}

async function main() {
  console.log(`\nMode: ${TEST ? 'TEST' : 'LIVE'}\n`)
  const out = {}
  for (const plan of PLANS) {
    const product = await findOrCreateProduct(plan)

    const monthly = await stripe.prices.create({
      product: product.id,
      currency: 'brl',
      unit_amount: plan.monthly,
      recurring: { interval: 'month' },
      nickname: `${plan.key} Monthly`,
      metadata: { plan_key: plan.key, cycle: 'monthly' },
    })
    const annual = await stripe.prices.create({
      product: product.id,
      currency: 'brl',
      unit_amount: plan.annual,
      recurring: { interval: 'year' },
      nickname: `${plan.key} Annual`,
      metadata: { plan_key: plan.key, cycle: 'annual' },
    })

    out[`STRIPE_PRICE_${plan.key}_MONTHLY`] = monthly.id
    out[`STRIPE_PRICE_${plan.key}_ANNUAL`] = annual.id

    console.log(`${plan.key}:`)
    console.log(`  MONTHLY (R$${(plan.monthly / 100).toFixed(2)}/mês): ${monthly.id}`)
    console.log(`  ANNUAL  (R$${(plan.annual / 100).toFixed(2)}/ano): ${annual.id}`)
  }

  console.log('\n--- paste into .env.local AND Vercel ---')
  for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
