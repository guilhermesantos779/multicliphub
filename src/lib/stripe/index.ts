import Stripe from 'stripe'

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia' as const,
    typescript: true,
  })
}

// Amounts in centavos (BRL * 100). monthly = monthly billing; annual = FULL
// yearly total charged once (interval: year). Mirrors src/config/plans.ts.
export const PLANS = {
  clipper: {
    name: 'Clipper',
    monthly: process.env.STRIPE_PRICE_CLIPPER_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_CLIPPER_ANNUAL!,
    price_monthly: 5700,
    price_annual:  47880,
  },
  pro: {
    name: 'Pro',
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL!,
    price_monthly: 9700,
    price_annual:  81480,
  },
  king: {
    name: 'King',
    monthly: process.env.STRIPE_PRICE_KING_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_KING_ANNUAL!,
    price_monthly: 19700,
    price_annual:  165480,
  },
} as const

export type PlanKey = keyof typeof PLANS
