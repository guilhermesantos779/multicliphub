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

const VARS = [
  'STRIPE_PRICE_CLIPPER_MONTHLY', 'STRIPE_PRICE_CLIPPER_ANNUAL',
  'STRIPE_PRICE_PRO_MONTHLY', 'STRIPE_PRICE_PRO_ANNUAL',
  'STRIPE_PRICE_KING_MONTHLY', 'STRIPE_PRICE_KING_ANNUAL',
]

// expected: [unit_amount centavos, interval]
const EXPECT = {
  STRIPE_PRICE_CLIPPER_MONTHLY: [5700, 'month'],
  STRIPE_PRICE_CLIPPER_ANNUAL:  [47880, 'year'],
  STRIPE_PRICE_PRO_MONTHLY:     [9700, 'month'],
  STRIPE_PRICE_PRO_ANNUAL:      [81480, 'year'],
  STRIPE_PRICE_KING_MONTHLY:    [19700, 'month'],
  STRIPE_PRICE_KING_ANNUAL:     [165480, 'year'],
}

console.log(`Mode: ${mode}\n`)
let allOk = true
for (const v of VARS) {
  const id = env[v]
  if (!id) { console.log(`${v}: (missing in env)`); allOk = false; continue }
  try {
    const p = await stripe.prices.retrieve(id)
    const [ea, ei] = EXPECT[v]
    const ok = p.unit_amount === ea && p.recurring?.interval === ei && p.currency === 'brl' && p.active
    if (!ok) allOk = false
    console.log(
      `${ok ? 'OK ' : 'XX '} ${v}\n     id=${id}  ${p.currency?.toUpperCase()} ${(p.unit_amount/100).toFixed(2)} / ${p.recurring?.interval}  active=${p.active}` +
      (ok ? '' : `   <-- expected ${(ea/100).toFixed(2)} / ${ei}`)
    )
  } catch (e) {
    allOk = false
    console.log(`XX ${v}\n     id=${id}  ERROR: ${e.message}`)
  }
}
console.log(`\n${allOk ? 'ALL_MATCH' : 'MISMATCH'}`)
