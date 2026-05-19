import Stripe from 'stripe'

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia' as const,
    typescript: true,
  })
}

export const PLANS = {
  clipper: {
    name: 'Clipper',
    monthly: process.env.STRIPE_PRICE_CLIPPER_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_CLIPPER_ANNUAL!,
    price_monthly: 2700,
    price_annual:  1900,
  },
  pro: {
    name: 'Pro',
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL!,
    price_monthly: 5700,
    price_annual:  4000,
  },
  king: {
    name: 'King',
    monthly: process.env.STRIPE_PRICE_KING_MONTHLY!,
    annual:  process.env.STRIPE_PRICE_KING_ANNUAL!,
    price_monthly: 9700,
    price_annual:  6800,
  },
} as const

export type PlanKey = keyof typeof PLANS
