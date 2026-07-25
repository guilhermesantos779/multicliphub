// Archive (active:false) old Stripe prices so they can't be used in new checkouts.
// Run ONLY after the new prices are verified and wired into env vars.
//
// Usage (from multicliphub/):
//   node scripts/stripe/archive-old-prices.mjs price_aaa price_bbb ...
//   node scripts/stripe/archive-old-prices.mjs --test price_aaa ...

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

const TEST = process.argv.includes('--test')
const ids = process.argv.slice(2).filter((a) => a.startsWith('price_'))
if (!ids.length) {
  console.error('Pass one or more price IDs to archive. Example:\n  node scripts/stripe/archive-old-prices.mjs price_xxx price_yyy')
  process.exit(1)
}

const key = TEST ? env.STRIPE_SECRET_KEY_TEST : env.STRIPE_SECRET_KEY
const stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })

const main = async () => {
  for (const id of ids) {
    try {
      await stripe.prices.update(id, { active: false })
      console.log(`archived ${id}`)
    } catch (e) {
      console.error(`failed ${id}: ${e.message}`)
    }
  }
}
main()
